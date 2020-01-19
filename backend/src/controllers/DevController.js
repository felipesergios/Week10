const axios = require('axios');
const Dev = require('../models/Dev');
const parseArray = require('../utils/parseStringAsArray')
const {findConnections,sendMessage}=require('../webSocket');
module.exports={
    async index(req,res)
    {
        const devs = await Dev.find();
        return res.json(devs);
    },


    async store(req,res){
        //console.log(req.body);
        const {github_username,techs,latitude,longitude}=req.body

        let dev = await Dev.findOne({github_username});

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        const {name = login , avatar_url , bio }=apiResponse.data;
        const techsArray = parseArray(techs)
        //console.log(name,avatar_url,bio,github_username );
        const location = {
            type:'Point',
            coordinates:[latitude,longitude]
        }
        const dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs:techsArray,
            location
        })

//Filtro 

const sendSocketMensageTo = findConnections(
    {latitude,longitude},
    techsArray,
    )
        console.log(sendSocketMensageTo);
        sendMessage(sendSocketMensageTo,'new-dev',dev);
        }
        return res.json(dev);
    },
    async destroy(req,res){
        const {github_username}=req.body
        let register = await Dev.findOne({github_username});
        if(!register){
            return res.json({mensage:"Não Existe Usuario com esse GitHub"})
        }
        deletado=register.deleteOne({github_username});
        return res.json({mensage:"Usuario Excluido"})
    },
    async update(req,res){
        const {github_username,nname}=req.body
        const register = await Dev.findOne({github_username});
      

        if (!register){
            return res.json({mensage:"Usuario não encontrado",error:"404"});
        }
        register.name = nname;
        await register.save();
        return res.json({mensage:"usuario Alterado "})

    }
};