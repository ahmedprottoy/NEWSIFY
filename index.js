const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");

require("dotenv").config();

// middleware setup
app.use(express.json());

// getting info from env
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_database = process.env.DB_DATABASE;
const db_port = process.env.DB_PORT;
const port = process.env.PORT;

const db = mysql.createPool({
  connectionLimit: 100,
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_database,
  port: db_port,
});

db.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log("DataBase connection successful: " + connection.threadId);
});

// hashing passwords,signUp users
app.post("/signUp", async (req, res) => {
  const { userName, firstName, lastName, password, email } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  db.getConnection(async (err, connection) => {
    if (err) {
      throw err;
    }
    const sqlSearch = "SELECT * FROM userInfo WHERE userName = ?";
    const search_query = mysql.format(sqlSearch, [userName]);
    const sqlInsert = "INSERT INTO userInfo VALUES (0,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      userName,
      firstName,
      lastName,
      hashPassword,
      email,
    ]);

    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("---Search Results---");
      console.log(result.length);

      if (result.length != 0) {
        connection.release();
        console.log("---User Already Exists---");
        res.send("User Already Exists");
      } else {
        await connection.query(insert_query, (err, result) => {
          if (err) throw err;
          console.log("---New User Created---");
          console.log(result.insertId);
          res.send("New User Created");
        });
      }
    });
  });
});

// log in users

app.post("/login", (req, res) => {
  const { userName, password } = req.body;

  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM userInfo WHERE userName=?";
    const serach_query = mysql.format(sqlSearch, [userName]);

    connection.query(serach_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      if (result.length == 0) {
        console.log("---User does not exist---");
        res.send("User does not exist");
      } else {
        const hashPassword = result[0].password;
        if (await bcrypt.compare(password, hashPassword)) {
          console.log("---Log In Successfull");
          res.send(`${userName} logged in successfully`);
        } else {
          console.log("---Password Incorrect----");
          res.send("Password Incorrect");
        }
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server Started On Port ${port}`);
});
