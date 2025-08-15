require('dotenv').config();
const { Config } = require('./src/configs/config');
const app = require('./src/app');

const port = Config.PORT;
app.listen(port, () => {
    const divider = '=================';
    console.log(`${divider} YQNI13_SUPPORT SERVER ${divider}\n${divider} RUNNING ON PORT: ${port} ${divider}`);
});