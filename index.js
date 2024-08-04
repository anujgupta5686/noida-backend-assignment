const express = require("express");
const connection = require("./config/database");
const userRoute = require("./routes/createUserRoute");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api/v1", userRoute);

connection();
app.listen(PORT, () => {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                                                           ║");
  console.log(
    `║      🚀 Server is running on http://localhost:${PORT}        ║`
  );
  console.log("║                                                           ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
});
