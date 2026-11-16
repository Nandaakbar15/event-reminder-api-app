require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const router = require("./routes/route");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static("public"));

app.use(router);

app.listen(port, () => {
  console.log(`Server is running at : http://localhost:${port}`);
});
