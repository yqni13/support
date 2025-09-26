import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { secrets } from "./utils/secrets.utils";

const port = secrets.PORT;
app.listen(port, () => {
    const divider = '=================';
    console.log(`${divider} YQNI13_SUPPORT SERVER ${divider}\n${divider} RUNNING ON PORT: ${port} ${divider}`);
});