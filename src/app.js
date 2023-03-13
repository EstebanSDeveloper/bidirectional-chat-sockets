import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const messages = [];

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/../public"));

app.use("/", viewsRouter);

// Aqui el httpServer para utilizar el Server de la libreria socket.io
const httpServer = app.listen(8080, () => {
	console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
	socket.on("chat-message", (data) => {
		messages.push(data);

		io.emit("messages", messages);
	});

	socket.on("new-user", (username) => {
		// 1.1 linea de abajo para emitir los mensajes a todos los nuevos usuarios que entren
		socket.emit("messages", messages);

		// 2.2 enviar menssaje a todos los usuarios de que un neuvo usuario se acaba de conectar
		socket.broadcast.emit("new-user", username);
	});
});
