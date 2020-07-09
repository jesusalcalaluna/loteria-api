'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
const Hash = use("Hash");
const Database = use("Database");

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
      this.updateUserScore(player, "lottery_wins")
    });

    socket.on('centro', ({room,player})=>{
      io.sockets.to(room).emit('centro',  player);
      this.updateUserScore(player, "center_wins")
    });

    socket.on('llena', ({room,player})=>{
      io.sockets.to(room).emit('llena',  player);
      this.updateUserScore(player, "full_wins")
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
            await cartas.splice(rnd, 5);
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



  async login({ request, auth, response }) {
    const { user, password } = request.all();


    const validation = await validate(request.all(), {
      user: "required",
      password: "required",
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages() });
    }

    const userFound = await User.findBy("user", user);
    if (!userFound) {
      return response.status(400).send({ message: "No existe este usuario" });
    }


    const isSame = Hash.verify(password, userFound.password);
    if (!isSame) {
      return response.status(400).send("Contraseña incorrecta");
    }

        try {
            const token = await auth.attempt(user, password);
            const users = await User.all();
            return response.status(200).send({ 'message': "ok", data: {token, user, users} });
        } catch (error) {
            return response.status(400).send({ status:'error', 'message': error });
        }
  }

  async signup({ request, response }) {
    const { user, password} = request.all();
    console.log(user, password);
    const validation = await validate(request.all(), {
        user: 'required',
        password: 'required|min:5'
    });

    if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() })
    }

    const userFound = await User.findBy("user", user);
    if (userFound) {
        return response.send({
            status:'error' , message: 'Ya existe un usuario creado con ese usuario.'
        });
    }

    const userBD = await User.create({
        user,
        password
    });

    return this.login(...arguments);

    //return response.status(200).send({message:'Has creado tu usuario con exito.'})
  }

  static async updateUserScore(name, property){
    const userFinded = await User
    .query()
    .where('user', name)
    .first();
    //console.log(name,property,userFinded.lottery_wins)
    if(property == "lottery_wins"){
      const user = await User
      .query()
      .where('user', name)
      .update({
        lottery_wins : userFinded.lottery_wins + 1,
        total : userFinded.total + 1,
      })

    }
    if(property == "center_wins"){
      const user = await User
      .query()
      .where('user', name)
      .update({
        center_wins : userFinded.center_wins + 1,
        total : userFinded.total + 1,
      })

    }
    if(property == "full_wins"){
      const user = await User
      .query()
      .where('user', name)
      .update({
        full_wins : userFinded.full_wins + 1,
        total : userFinded.total + 1,
      })

    }

  }

  async getUserScore({request, response}){
    try {
        const users = await User.query()
        .select(['user', 'lottery_wins', 'center_wins', 'full_wins', 'total'])
        .orderBy('total','DESC')
        .fetch()
        return response.status(200).send({ 'message': "ok", data: {users} });
    } catch (error) {
        return response.status(400).send({ status:'error', 'message': error });
    }
  }

  async logout(){

  }
}

module.exports = LoteriaController
