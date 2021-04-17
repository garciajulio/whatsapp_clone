const express = require('express')
const app = express();
const io = require('socket.io');
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.set("view engine","ejs");
app.use(express.static("public"))


app.get('/', (req,res)=>{
	res.render('pages/index');
})

const server = app.listen(PORT,() => console.log(`Server running on port ${PORT}`))


const socketIO = io(server);
let usersOnline = [];


function isRepeat(usersOnline,username,id){
	
	if(usersOnline.length >= 1){
		usersOnline.map((e)=>{
			if(!e.username.includes(username)){
			
			return {username: username, socket: id};
			
			}else{
				
				console.log("Se repite")
				
				// falta corregir - entra acá pero no usa el return;
				
				return "Hola";
			}
		})
	
	}else{
		
	}

	return {username: username, socket: id};
}


socketIO.on('connection',(socket)=>{

	console.log("New connection active with id "+socket.id)

	socket.on('disconnect', () => {

	/*if(usersOnline.length > 1){

		console.log("Se desconectó un usuario");

		usersOnline.map((e) =>{
			
		let s = e.socket.indexOf(socket.id); 
		console.log(s)

		usersOnline = [];
	
		})
	}*/

   		console.log("User desconnected")

  	});

  	socketIO.to(socket.id).emit('chat:join',socket.id)

	socket.on('chat:join', (username) =>{

		let data = isRepeat(usersOnline,username,socket.id)

		usersOnline.push(data)

		socketIO.emit('chat:listUsers',usersOnline)
	})



	socket.on('chat:privateMessage', (data) =>{

		console.log(data)

		socketIO.to(data.id).emit('chat:privateMessage',data)
	})


})