import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/router.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import socketGateway from "./socket/socketGateway.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: true } });

socketGateway.init(io);

httpServer.listen(PORT, () => console.log(`server started on ${PORT}`));