import "dotenv/config";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/router.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on ${PORT}`));
