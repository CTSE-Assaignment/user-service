require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

const mongoDB = "mongodb+srv://root:root@cluster0.spmcifx.mongodb.net/ctse";

// Connect to MongoDB
mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// User routes
app.use("/users", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});

module.exports = app;
