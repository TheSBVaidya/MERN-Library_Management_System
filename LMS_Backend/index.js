const express = require("express");
const app = express();
const cors = require("cors");
const ownerRouter = require("./routes/ownerRouter");
const membersRouter = require("./routes/membersRouter");
const librarianRouter = require("./routes/librarianRouter");

app.use(express.json());
app.use(cors());

app.use("/owner", ownerRouter);
app.use("/members", membersRouter);
app.use("/librarian", librarianRouter);

const port = 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Server ready at port: ", port);
});
