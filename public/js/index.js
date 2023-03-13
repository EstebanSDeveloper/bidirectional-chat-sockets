const socket = io();

let username;

Swal.fire({
	title: "Identificate",
	input: "text",
	text: "Ingresa tu nombre de usuario",
	inputValidator: (value) => {
		return !value && "Es obligatorio introducir un nombre de usuario";
	},
	allowOutsideClick: false,
}).then((result) => {
	username = result.value;

	// 1.1 emitir los mensajes antiguos a todos los usuarios conectados nuevos
	socket.emit("new-user", username);
});

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (ev) => {
	if (ev.key === "Enter") {
		const inputMessage = chatInput.value;

		if (inputMessage.trim().length > 0) {
			socket.emit("chat-message", { username, message: inputMessage });

			chatInput.value = "";
		}
	}
});

const messagesPanel = document.getElementById("messages-panel");
socket.on("messages", (data) => {
	let messages = "";

	data.forEach((m) => {
		messages += `<b>${m.username}:</b> ${m.message}<br>`;
	});
	messagesPanel.innerHTML = messages;
});

// 2.2 enviar sweet alert a todos los usuarios de que un neuvo usuario se acaba de conectar
socket.on("new-user", (username) => {
	swal.fire({
		title: `${username} se ha unido al chat`,
		toast: true,
		position: "top-end",
	});
});
