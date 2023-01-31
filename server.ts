import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.get("/", (_req, res) => {
    res.send("Alles ok");
});
interface Message {
    timestamp: number;
    msg: string;
    sender: string;
}

const messages: Message[] = [];

io.on("connection", (socket) => {
    console.log("A user connected to socket");

    io.emit("newMessages", messages);
    socket.on("sendMessage", (message: Message) => {
        console.log(message);
        messages.push(message);
        io.emit("newMessages", messages);
    });

    socket.on("ping", () => {
        socket.emit("pong", "hallo");
    });
});

server.listen(PORT, () => {
    console.log("Express listening on " + PORT);
});
