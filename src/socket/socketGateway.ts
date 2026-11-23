import type { Server } from "socket.io";
import Service from "../service/Service.js";

class SocketGateway {
    init(io: Server) {
        io.on("connection", async (socket) => {
            console.log('socket connected: ', socket.id);

            try {
                const data = await Service.getAlive();
                socket.emit("proxy:alive", data);
            } catch (error) {
                console.error(error);
            }

            socket.on("disconnect", () => {
                console.log('socket disconnected: ', socket.id);
            });
        });

        setInterval(async () => {
            try {
                const data = await Service.getAlive();
                io.emit("proxy:alive", data);
            } catch (error) {
                console.error(error);
            }
        }, 5000);
    }
}

export default new SocketGateway();