const express = require('express');
const dotenv = require('dotenv');
const { router } = require('./routes/index');
const { startBot } = require('./discordBot/discordBot');
const connectDB = require('./db/db');

const PORT = process.env.SERVER_PORT || 3011;

dotenv.config();

const app = express();

app.use(express.json());
app.use(router);

connectDB();
startBot();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
