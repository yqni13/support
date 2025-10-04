import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { secrets } from "./utils/secrets.utils";
import { DBConnection } from "./configs/db";

const port = secrets.PORT;
const db = DBConnection.getInstance();
db.init();

app.listen(port, () => {
    const divider = '=================';
    console.log(`${divider} YQNI13_SUPPORT SERVER ${divider}\n${divider} RUNNING ON PORT: ${port} ${divider}`);
});

process.on('SIGINT', async () => {
    await db.shutdown();
    process.exit(0);
})