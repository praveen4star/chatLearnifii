import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";

import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import "./Chat.css";

let socket;
function Chat({ user }) {
  const State = useSelector((state) => state.user);

  const [seed, setSeed] = useState("");

  const { roomId } = useParams();

  const [room, setroom] = useState("");

  const ENDPOINT = "http://localhost:4000/";
  //https://chatlearnifiibypraveen.herokuapp.com/
  const [input, setinput] = useState("");

  const [Messages, setMessages] = useState([]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    console.log(State.messages);
    if (State.messages) {
      let findRoom = State.messages.find((message) => message._id === roomId);
      setroom(findRoom);
    }
  }, [roomId, user, room]);

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [user]);
  useEffect(() => {
    if (user && room)
      socket.emit("user-and-room", { user, room }, (error) =>
        console.log(error)
      );
  }, [room]);
  useEffect(() => {
    socket.on("message", (message) => setMessages([...Messages, message]));
    console.log(Messages);
  }, [Messages, room]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    input &&
      socket.emit("sendMessage", { message: input, room, user }, () =>
        setinput("")
      );
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://picsum.photos/200/${seed}`} />

        <div className="chat_headerInfo">
          <h3>
            {user.id === (room.sender && room.sender.id)
              ? room.reciver && room.reciver.name
              : room.sender && room.sender.name}
          </h3>
          <p>
            {user.id === (room.sender && room.sender.id)
              ? room.reciver && room.reciver.isOnline
                ? "Online"
                : "Offline"
              : room.sender && room.sender.isOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>

        <div className="chat_headerRight">Dance class</div>
      </div>

      <div className="chat_body">
        {room.messages &&
          room.messages.map(
            (message, i) => (
              //message.roomId === room._id && (
              <p
                key={i}
                className={`chat_massage ${
                  message.id === user.id && "chat_receiver"
                }`}
              >
                <span className="chat_name">
                  {message.name ? message.name : null}
                </span>
                {message.message ? message.message : null}
                <span className="chat_timeStamp">3:53pm</span>
              </p>
            )
            //)
          )}

        {Messages.map(
          (message, i) =>
            message.roomId === room._id && (
              <p
                key={i}
                className={`chat_massage ${
                  message.userId === user.id && "chat_receiver"
                }`}
              >
                <span className="chat_name">
                  {message.user ? message.user : null}
                </span>
                {message.text ? message.text : null}
                <span className="chat_timeStamp">3:53pm</span>
              </p>
            )
          //    <p className={`chat_massage ${message.user !== user.name.trim().toLowerCase() && "chat_receiver"}`}>
          //   <span className="chat_name">Praveeb</span>
          //   Left
          //   <span className="chat_timeStamp">3:53pm</span>
          // </p>
        )}
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(event) => setinput(event.target.value)}
            placeholder="Type a massage"
            type="text"
          />
          <button type="submit" onClick={handleSendMessage}>
            Send Massage
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
