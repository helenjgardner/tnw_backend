const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tr_bees"
});



app.get("/favourite", function (request, response) {
  connection.query("SELECT * FROM favourite", function (err, data) {
    if (err) {
      console.log("Error fetching favourites", err);
      response.status(500).json({
        error: err
      });
    } else {
      response.status(200).send({
        tasks: data
      });
    }
  });
});

// note user name is hardcoded to The Pretender
app.post("/favourite", function (request, response) {
  const recipeURL = request.body.recipeURL;
  const query = "INSERT INTO favourite (recipeURL, username) VALUES (?, ?)";
  connection.query(query, [recipeURL, "The_Pretender"], function (err, results, fields) {
    if (err) {
      console.log("Error fetching task", err);
      response.status(500).json({
        error: err
      });
    } else {
      // respond with task id
      response.status(201).json({
        recipeURL
      });
    }
  });
});