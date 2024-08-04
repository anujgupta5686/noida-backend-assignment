const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connection = async () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(
        "╔═══════════════════════════════════════════════════════════╗"
      );
      console.log(
        "║                                                           ║"
      );
      console.log(
        "║     ✅ Database connection successfully established!      ║"
      );
      console.log(
        "║                                                           ║"
      );
      console.log(
        "╚═══════════════════════════════════════════════════════════╝"
      );
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
      process.exit(1);
    });
};

module.exports = connection;
