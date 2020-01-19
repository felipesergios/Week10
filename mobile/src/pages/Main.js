import React ,{useState,useEffect} from 'react'
import {StyleSheet, Image,View,Text,TextInput,TouchableOpacity} from 'react-native'
import MapView ,{Marker,Callout} from 'react-native-maps'
import {requestPermissionsAsync,getCurrentPositionAsync} from 'expo-location'
import {MaterialIcons} from '@expo/vector-icons'

import api from '../services/api'
import {connect,disconnect,subscribeToNewDevs} from '../services/socket'



function Main({navigation}){
    const [devs,setDevs]=useState([])
    const [currentRegion,setCurrentRegion]=useState(null);
    const [techs,setTechs]=useState('');
    useEffect(()=>{
        subscribeToNewDevs(dev=>setDevs([...devs,dev]));

    },[devs])

    useEffect(()=>{
        async function loadIniPosition(){
           const {granted} = await requestPermissionsAsync();
           if (granted){
               const {coords} = await getCurrentPositionAsync({
                   enableHighAccuracy:true,
               });
               const {latitude,longitude}=coords;
               setCurrentRegion({
                   latitude,
                   longitude,
                   latitudeDelta:0.04,
                   longitudeDelta:0.04,
               })
           }
        }
        loadIniPosition();
       

    },[])

    function setupWebsocket(){
        disconnect();
        const {latitude,longitude}=currentRegion;

        connect(
            latitude,
            longitude,
            techs,
        );
    }


     async function loadDevs(){
         const {latitude, longitude} = currentRegion
        const res = await api.get('/search',{
            params:{
                latitude:-5.8995927,
                longitude:-35.263021,
                techs
            }
        })
        setDevs(res.data.devs)
        
        setupWebsocket();

     }
     async function ListDevs(){
         const response = await api.get('/devs');
         setDevs(response.data);
     }


     function RegionChange(region){
         console.log(region)
        setCurrentRegion(region)


     }



    if(!currentRegion){
        return null;
    }

    return (
    <>
    <MapView onRegionChangeComplete={RegionChange} initialRegion={currentRegion} style={styles.map}>
               {devs.map(dev=>(
                    <Marker key={dev._id} coordinate={{latitude:dev.location.coordinates[0],longitude:dev.location.coordinates[1]}}>
                    <Image style={styles.avatar } source={{uri:dev.avatar_url}}/>
                    <Callout onPress={()=>{
                        //Navegação
                        navigation.navigate('Profile',{github_username:dev.github_username})
                    }}>
                        <View style={styles.callout}>
                <Text style={styles.devname}>{dev.name}</Text>
                <Text style={styles.devBio}>TESTE</Text>
                <Text style={styles.devTechs}>{dev.techs.join(',')}</Text>
                        </View>
                    </Callout>
                    </Marker>    
               ))}
            </MapView>
            <View style={styles.buscaForm}>
                <TextInput
                style={styles.buscaInput}
                placeholder="Buscar Por Tecnoogia"
                placeholderTextColor='#999'
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={setTechs}
                 
                />
                <TouchableOpacity onPress={loadDevs} style={styles.buscaButton}>
                <MaterialIcons name="my-location" size={20}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={ListDevs} style={styles.buscaButton}>
                <MaterialIcons name="data-usage" size={20}/>
                </TouchableOpacity>

            </View>
      </>      
        )
}

const styles = StyleSheet.create({
    map:{
        flex:1
    },
    avatar:{
        width:54,
        height:54,
        borderRadius:4,
        borderWidth:4,
        borderColor:'#606060'
    },
    callout:{
        width:260,
    },
    devname:{
        fontWeight:'bold',
        fontSize:16,

    },
    devBio:{
        color:'#666',
        marginTop:5,    
    },
    devTechs:{
        marginTop:5,
    },

    buscaForm:{
        position:'absolute',
        top:20,
        left:20,
        right:20,
        zIndex:5,
        flexDirection:'row',
    },
    buscaInput:{
        flex:1,
        height:50,
        backgroundColor:'#fff',
        color:'#333',
        borderRadius:25,
        paddingHorizontal:20,
        fontSize:16,
        shadowColor:'#000',
        shadowOpacity:0.2,
        shadowOffset:{
            width:4,
            height:4,
        },
        elevation:6,
        },
    buscaButton:{
        width:50,
        height:50,
        backgroundColor:'#8E4DFF',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:15,

    },
})
export default Main