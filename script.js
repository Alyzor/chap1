const express = require("express");
var path = require("path");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "logintest",
});

//abre porta para ligar a APP
var port = 3000;
app.listen(port, () => {
  console.log("Server running @ port " + port);
});

//Insere o HTML na App
app.get("/", (req, res) => {
  res.sendFile("C:/Users/Pedro/Downloads/REST/chap1/index.html");
});

app.post("/login", (req, res) => {
  con.connect(function (err) {
    console.log("OK");
    con.query("select * from login", function (err, result, fields) {
      if (err) throw err;
      var isCorrect = false;
      for (let i = 0; i < result.length; i++) {
        if (
          req.body.email == result[i].email &&
          req.body.password == result[i].password
        ) {
          isCorrect = true;
          res.sendFile("C:/Users/Pedro/Downloads/REST/chap1/landing.html");
          break;
        }
        isCorrect = false;
        console.log("field: " + i);
      }
      if (isCorrect == false) {
        res.sendFile("C:/Users/Pedro/Downloads/REST/chap1/index.html");
      }
    });
  });
});

app.post("/signup", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("OK");
    con.query("select * from login", function (err, result, fields) {
      if (err) throw err;
      var isUsed = false;
      for (let i = 0; i < result.length; i++) {
        if (req.body.email == result[i].email) {
          isUsed = true;
          break;
        }
        isUsed = false;
      }
      if (isUsed == true) {
        res.send(404)
        res.send(
          "<script>" + 
          "const main = document.getElementById('main'); main.classList.add('isUsed')"
          + "</script>"
        )
        return;
      } else {
        var sql =
          "insert into login (name, email, password, created_at, updated_at) values ('" +
          req.body.name +
          "','" +
          req.body.email +
          "','" +
          req.body.password +
          "','" +
          new Date().toISOString() +
          "','" +
          new Date().toISOString() +
          "')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("updated.");
        });
      }
    });
  });
});
//utiliza o CSS
app.use(express.static(path.join(__dirname, "/public")));
