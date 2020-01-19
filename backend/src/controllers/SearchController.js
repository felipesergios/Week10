const Dev = require('../models/Dev');
const parseArray = require('../utils/parseStringAsArray')
module.exports = {
    async index(req, res){
        const { latitude , longitude , techs} = req.query
        //console.log(req.query)
        const techArray = parseArray(techs);
        //console.log(techArray)
        const devs = await Dev.find({
            techs:{
                $in:techArray,
            },
            location:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[latitude,longitude],
                    },
                    $maxDistance:100,
                    
                },
            },

        })
        return res.json({ devs })
    }
}