const express = require("express");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database is connected"))
  .catch((error) => console.log(error));

app.use(express.json());
