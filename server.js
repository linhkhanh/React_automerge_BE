const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

let app = express();
var options = {
  inflate: true,
  limit: "100kb",
  type: "application/octet-stream",
};
app.use(bodyParser.raw(options));

try {
  fs.mkdirSync(path.join(__dirname, "data"));
} catch (err) {
  if (err.code !== "EEXIST") {
    console.error(err);
  }
}

let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"]
};

app.options('/:id', cors(corsOptions));
app.get("/:id", cors(corsOptions), (req, res) => {
  let id = req.params.id;
  let filename = path.join(__dirname, "data", id);
  fs.stat(filename, (err, stats) => {
    if (err) {
      console.error(err);
      res.status(404).send("Not found");
    } else {
      res.sendFile(filename);
      console.log("sending");
    }
  });
});

app.post("/:id", cors(corsOptions), (req, res) => {
  let id = req.params.id;
  fs.writeFileSync(path.join(__dirname, "data", id), req.body);
  res.status(200).send("ok");
});

const port = 5000;

app.listen(5000, () => {
  console.log("listening on http://localhost:" + port);
});
