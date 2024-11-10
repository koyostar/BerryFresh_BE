const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/product", productRoute);
app.use("/order", orderRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
