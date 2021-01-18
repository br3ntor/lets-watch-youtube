const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const router = require("./router");

const app = express();
const port = 4000;

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.static("build"));

// Could replace with body-parser to extend functionality.
app.use(express.json());

app.use(router);

// Hmm I guess all 404's can just be handled on the client if I do this?
app.get("*", (req, res) => {
  res.sendFile("/build/index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
