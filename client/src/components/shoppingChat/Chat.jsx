import React, { useEffect, useState, useRef } from "react";
import { initiateSocket, disconnectSocket, subscribeToChat, handleTyping, sendMessage } from "../../utils/socket/socket";
import "./listStyle.css";
import { useAuth0 } from '@auth0/auth0-react';


function Chat() {
    const { user } = useAuth0();
    const rooms = ['1', '2'];
    const [myList, setList] = useState([]);
    const messageRef = useRef(null);
    //const [userName, setUserName] = useState(user.nickname);
    const store = "Store"
    const storeMessage = user.name + " is going to " + store;
    const [room, setRoom] = useState(rooms[0]);
    const [typing, setTyping] = useState("")
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    //keeps inputing for every letter
    // const clearInput = (input) =>
    // {
    //     //input = "";
    //     console.log("input cleared")
    // }
    // const handleSendMessage = () => {
    //     sendMessage(room, user + ": " + messageRef.current.value)
    //     messageRef.current.value = "";
    // }
    //const handleTyping = () => { socket.emit("typing", user + ": is typing") }
    //clears input
    const handleSubmit = (e) => {
        e.preventDefault();
        setList([...myList, messageRef.current.value]);
        // you can manually set the value of your input by the node ref
        messageRef.current.value = "";
        // Or you can reset your form element to its default values
        // e.currentTarget.reset();
      }
    useEffect(() => {
        if (room) initiateSocket(room);
        subscribeToChat((err, data) => {
            if (err) return;
            setChat(oldChats => [...oldChats, data])
            setTyping("")
        });
        return () => {
            disconnectSocket();
        }
    }, [room]);
    return (
        <div>
            <h1>Group: {room}</h1>
            { rooms.map((r, i) =>
                <button onClick={() => setRoom(r)} key={i}>{r}</button>)}
            <h1>{storeMessage}</h1>
            <div id="list-chat">
                <div id="chat-window">
                    <div id="output" >
                        {chat.map((m, i) => <p key={i}>{m}</p>)}
                    </div>
                    <div id="feedback" >{typing}</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <input id="message" autoComplete="off" type="text"
                        defaultValue=""
                        placeholder="message"
                        //value={message}
                        onChange={() => setMessage(messageRef.current.value)} ref={messageRef}
                    //onChange={() => handleTyping(room, user + ": is typing.")}
                    />
                    <button id="send"
                        onClick={() => sendMessage(room, user.name + ": " + messageRef.current.value)}
                    //onClick={() => console.log("test")}
                    //onClick={() => sendMessage(room, user + ": " + messageRef.current.value)} 
                    //onchange={e => messageRef.current.value = ""}
                    //onClick={handleSendMessage()}
                    //onChange={() => handleTyping(room, user + ": is typing." )}
                    //only clears current room
                    //have to comment out on startup
                    //onChange={console.log("test")}
                    //onSubmit={messageRef.current.value = ""}
                    >Send</button>
                </form>
            </div>
        </div>
    )
}

export default Chat;