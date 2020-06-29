'use strict'

class LoteriaController {


    static jugadores = {}




  static goPlay(socket,io){
    var cartas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,51,52,53,54];
    var pausado = false;
    var intervalo ;
    var salasJugando = [];


    console.log('Alguien entro al Socket');


    socket.on('join_room', ({room, players})=>{
      socket.join(room)
      //guardar en jugadores
      if (this.jugadores[room]){
        this.jugadores[room].push(players[0])
      } else {
        this.jugadores[room] = players;
      }
      console.log(this.jugadores);
      io.sockets.to(room).emit('new-player',  this.jugadores[room]);
      console.log(players);

      console.log('Alguien entro a la sala');
    });

    socket.on('leave_room', (room)=>{
      socket.leave(room)
      console.log('Alguien salio de la sala');
    });



    socket.on('loteria', ({room,player})=>{
      io.sockets.to(room).emit('loteria',  player);
    });

    socket.on('centro', ({room,player})=>{
      io.sockets.to(room).emit('centro',  player);
    });

    socket.on('llena', ({room,player})=>{
      io.sockets.to(room).emit('llena',  player);
    });

    socket.on('play', (room)=>{
      var i = 0;
      console.log(room);
      console.log(salasJugando);


        intervalo = setInterval(
          async function() {

            var rnd = Math.floor(Math.random() * cartas.length) ;
            console.log(pausado);

            io.sockets.to(room).emit('play',  {data:cartas[rnd]});
            console.log(cartas);
            console.log(cartas[rnd]);
            await cartas.splice(rnd, 1);
            console.log(i=i+1);

            if (cartas.length == 0) {
              var id = salasJugando.indexOf(room);
              salasJugando.splice(id, 1);
              io.sockets.to(room).emit('play',  {data:cartas[0]});
              console.log(cartas[0]);
              clearInterval(intervalo);
              console.log('Termino el juego');
              cartas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,51,52,53,54];
            }

          },600);


    });



    socket.on('stop', (room)=>{
      socket.emit('play', (room) );
    });



    socket.on('restart', (room)=>{
      io.sockets.to(room).emit('restart',  data);
      console.log(room, data);
    });






  }
}

module.exports = LoteriaController
