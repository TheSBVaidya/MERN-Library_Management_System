const dotenv = require("dotenv");
const express = require("express");
const ownerRouter = require("./routes/adminRouter");
const membersRouter = require("./routes/membersRouter");
const librarianRouter = require("./routes/librarianRouter");

const app = express();
const cors = require("cors");
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/admin", ownerRouter);
app.use("/members", membersRouter);
app.use("/librarian", librarianRouter);

const port = process.env.PORT;
app.listen(port, "0.0.0.0", () => {
  console.log("Server ready at port: ", port);
});
