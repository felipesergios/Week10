const socketio = require('socket.io')
const parseString = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')
const connections = [];
let io
exports.setupWebsocket=(server)=>{
     io = socketio(server)

    io.on('connection',socket=>{
        console.log(socket.id)
        const{ latitude,longitude,techs}=socket.handshake.query
        connections.push({
            id:socket.id,
            coordinates:{
                latitude:Number(latitude),
                longitude:Number(longitude),
            },
            techs:parseString(techs),
        })
    });
};

exports.findConnections=(coordinates,techs)=>{
    return connections.filter(connection=>{
        return calculateDistance(coordinates,connection.coordinates)
        && connection.techs.some(item=>techs.includes(item))
    })
}

exports.sendMessage=(to,message,data)=>{
    to.forEach(connection=>{
        io.to(connection.id).emit(message,data);
    })
}