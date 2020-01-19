import React , {useEffect,useState} from 'react';
import api from './services/api';
//import Header from './Header';
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import DevForm from './components/DevForm';
import Devitem from './components/DevItem';


function App() {
  const [devs,setDevs]=useState([])
  


useEffect(()=>{
  async function loadDevs(){
    const res = await api.get('/devs');
    setDevs(res.data);
  }
  loadDevs();
},[])

async function addDev(data){
  
  const res = await api.post('/devs',data);

  setDevs([...devs,res.data]);
}

return (
  <div id="app">
    <aside>
        <strong>Cadastrar Dev</strong>
        <DevForm onSubmit={addDev}/>

    </aside>
    <main>
        
        <ul>
       {devs.map(dev=>(
         <Devitem key={dev._id} dev={dev}/>
       ))} 
        </ul>


    </main>

  </div>
    );
}

export default App;
