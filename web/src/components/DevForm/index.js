import React , {useState,useEffect} from 'react'
import './style.css'

function DevForm({onSubmit})
{
  const [techs,setTechs]=useState('');
  const [github_username,setGithub_username]=useState('');
  const [longitude,setLongitude]=useState('');
  const [latitude,setLatitude]=useState('');
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
  (position)=>{
      const {latitude,longitude}= position.coords;
      setLatitude(latitude)
      setLongitude(longitude)
    },
    (err)=>{
      console.log(err)
    },
    {
      timeout:3000
    }
    )
  },[])

   async function addDev(e){
        e.preventDefault();
    await onSubmit({
            github_username,
            techs,
            latitude,
            longitude,
          });
          setGithub_username('');
          setTechs('');

    }

  return(
    <form onSubmit={addDev}>
    <div className="input-blok">
    <label htmlFor="username_github" >Usúario do Github</label>
    <input name="github_username" id="github_username" required 
    value={github_username} onChange={e=>setGithub_username(e.target.value)}
    />
    </div>

    <div className="input-blok">
    <label htmlFor="techs" >Tecnologias</label>
    <input name="techs" id="techs" required 
    value={techs} onChange={e=>setTechs(e.target.value)}
    />
    </div>

  <div className="input-group">
    
    <div className="input-blok">
    <label htmlFor="latitude" >latitude</label>
    <input type="number" name="latitude" id="latitude" 
    required value={latitude} onChange={e=>setLatitude(e.target.value)} />
    </div>

    <div className="input-blok">
    <label htmlFor="longitude" >longitude</label>
    <input type="number" name="longitude" id="longitude" 
    required  value={longitude} onChange={e=>setLongitude(e.target.value)}/>
    </div>


    </div>  
   <button type="submit">Salvar</button>
  </form>
  )
}
export default DevForm;