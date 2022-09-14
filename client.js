// console.log("HHGHNRIRSIVIRNUI")
// let name=prompt("Enter Your Name / Username to Join");
// import { io } from "socket.io-client"
const socket = io('http://localhost:8000');

const form = document.getElementById('send-form');
const messageInp = document.getElementById('msgInp');
const msgcontainer = document.querySelector(".container")
const participants = document.querySelector('.participants')

var msg_tune = new Audio('notif.mp3');
var joined_tune=new Audio('joined.mp3');
var left_tune=new Audio('left.mp3');
const append = (msg, position,audio) => {
    // audio.play();
    audio.currentTime=0;
    const msgElement = document.createElement('div');
    msgElement.innerText = msg;
    msgElement.classList.add('message');
    msgElement.classList.add(position);
    msgcontainer.append(msgElement);
    if ((position == 'left' )||(position=='mid')) { audio.play(); console.log("played") }
}
const addPart = (name, key) => {
    console.log(`GOT: ${name}`);
    const NewUser = document.createElement('div');
    name=`💨 ${name}`;
    NewUser.innerText = name;
    NewUser.classList.add('names');
    NewUser.id = key;
    participants.append(NewUser);
}

const Name = prompt("Enter Your Name / Username to Join");

socket.emit('new-user-joined', Name)
append(`You Joined the chat!`, 'mid',joined_tune);


socket.on('user-joined', Name => {
    append(`${Name} Joined the chat!`, 'mid',joined_tune);
})
socket.on('send-data', names=> {
    participants.innerHTML='';
    for (var key in names) {
        addPart(names[key], key);
        console.log(names);
    }
    
})


// If server sends a message, receive it
    socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left',msg_tune)
})

// If a user leaves the chat, append the info to the container
socket.on('left', (name) => {
    append(`${name} left the chat`, 'mid',left_tune)

})

socket.on('remove', id => {
    var name = document.getElementById(id);
    name.remove();
})



// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    // audio.play();
    e.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`, 'right',msg_tune);
    socket.emit('send', message);
    messageInp.value = ""

})

messageInp.addEventListener('keydown', function (e) {
    // Get the code of pressed key
    const keyCode = e.which || e.keyCode;

    // 13 represents the Enter key
    if (keyCode === 13 && !e.shiftKey) {
        // Don't generate a new line
        e.preventDefault();

        document.getElementById('btn').click();
    }
});

