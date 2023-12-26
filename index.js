const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  const client = mqtt.connect("mqtt://broker.hivemq.com");
  client.on("connect", function () {
    console.log("Client subscribed ");
    client.subscribe("ChongTrom/#");
    client.on("message", function (topic, message) {
      if (topic === "ChongTrom/HeThong") {
        console.log("topic ", topic);
        socket.emit("receive_system", message.toString());
      }
      if (topic === "ChongTrom/chuongCanhBao") {
        console.log("topic ", topic);
        socket.emit("receive_bellWarning", message.toString());
      }

      if (topic === "ChongTrom/CanhBao") {
        console.log("topic ", topic);
        socket.emit("receive_warning", message.toString());
      }
      // gio bat
      if (topic === "ChongTrom/TTBat") {
        console.log("topic ", topic);
        socket.emit("receive_timerOn", message.toString());
      }
      if (topic === "ChongTrom/ngayBat") {
        console.log("topic ", topic);
        socket.emit("receive_dateStart", message.toString());
      }
      if (topic === "ChongTrom/gioBat") {
        console.log("topic ", topic);
        socket.emit("receive_timeStart", message.toString());
      }
      // gio tat
      if (topic === "ChongTrom/TTTat") {
        console.log("topic ", topic);
        socket.emit("receive_timerOff", message.toString());
      }
      if (topic === "ChongTrom/ngayTat") {
        console.log("topic ", topic);
        socket.emit("receive_dateEnd", message.toString());
      }
      if (topic === "ChongTrom/gioTat") {
        console.log("topic ", topic);
        socket.emit("receive_timeEnd", message.toString());
      }
    });
    socket.on("send_system", (data) => {
      console.log("send_system", data);
      client.publish("ChongTrom/HeThong", data);
    });
    socket.on("send_bellWarning", (data) => {
      console.log("send_bellWarning", data);
      client.publish("ChongTrom/chuongCanhBao", data);
    });
    // gio bat
    socket.on("send_dateStart", (data) => {
      console.log("send_dateStart", data);
      client.publish("ChongTrom/ngayBat", data);
    });
    socket.on("send_timeStart", (data) => {
      console.log("send_timeStart", data);
      client.publish("ChongTrom/gioBat", data);
    });
    socket.on("send_timerOn", (data) => {
      console.log("send_timerOn", data);
      client.publish("ChongTrom/TTBat", data);
    });
    // gio tat
    socket.on("send_dateEnd", (data) => {
      console.log("send_dateEnd", data);
      client.publish("ChongTrom/ngayTat", data);
    });
    socket.on("send_timeEnd", (data) => {
      console.log("send_timeEnd", data);
      client.publish("ChongTrom/gioTat", data);
    });
    socket.on("send_timerOff", (data) => {
      console.log("send_timerOff", data);
      client.publish("ChongTrom/TTTat", data);
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
