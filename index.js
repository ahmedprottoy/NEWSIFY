const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const generateAccessToken = require("./genAccessToken");
const validToken = require("./validToken");

require("dotenv").config();

app.use(cors());
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
app.post("/signup", async (req, res) => {
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

    connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("---Search Results---");
      console.log(result.length);

      if (result.length != 0) {
        connection.release();
        console.log("---User Already Exists---");
        res.send("User Already Exists With This Name");
      } else {
        connection.query(insert_query, (err, result) => {
          if (err) throw err;
          console.log("---New User Created---");
          console.log(result.insertId);
          res.send("A New User Has Been Created");
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
      // connection.release();
      if (err) throw err;
      if (result.length == 0) {
        console.log("---User does not exist---");
        res.send("User Does Not Exist With This Name");
      } else {
        const hashPassword = result[0].password;
        const userID = result[0].userID;

        if (await bcrypt.compare(password, hashPassword)) {
          console.log("---Log In Successful---");
          console.log("---Generating Access Token---");

          const token = generateAccessToken(userID);
          // console.log(token);
          // res.send(`accessToken:${token}  ${userName} logged in successfully`);
          res.send(`Welcome ${userName} To NEWSIFY`);
        } else {
          console.log("---Password Incorrect----");
          res.send("Incorrect Password");
        }
      }
    });
  });
});

// creating APIs

//show all users
app.get("/show-users", validToken, async (req, res) => {
  // const showUsers = "SELECT * FROM userInfo";

  await db.query("SELECT * FROM userInfo", (err, rows) => {
    if (err) {
      return res.status(404).send(err);
    }
    return res.status(200).send(rows);
  });
});
//
//
//
//
// show specific showUsers
app.get("/show-user", validToken, async (req, res) => {
  const { userName } = req.body;

  const showUser = mysql.format("SELECT * FROM userInfo WHERE userName=?", [
    userName,
  ]);
  await db.query(showUser, (err, result) => {
    if (err) {
      return res.status(404).send(err);
    }
    return res.status(200).send(result);
  });
});
//
//
//
//
//create post
app.post("/create-post", validToken, async (req, res) => {
  const { blogHeader, blogDescription } = req.body;
  const userID = req.user;
  // console.log(userID);

  const insert_query = mysql.format("INSERT INTO blogPosts VALUES(0,?,?,?)", [
    userID,
    blogHeader,
    blogDescription,
  ]);
  db.query(insert_query, async (err, result) => {
    if (err) throw err;
    const userName = mysql.format(
      "SELECT userName FROM userInfo WHERE userID = ?",
      [userID]
    );
    await db.query(userName, async (err, result) => {
      if (err) throw err;
      const userN = result[0].userName;
      console.log("Post is created successfully");
      res.send(`${userN} has created a post successfully`);
    });
  });
});

//
//
//
//
//get all posts

app.get("/show-posts", validToken, async (req, res) => {
  const showPosts = "SELECT * FROM blogPosts";

  await db.query(showPosts, (err, posts) => {
    if (err) {
      return res.status(404).send(err);
    }
    console.log("Posts being showed");
    res.status(200).send(posts);
  });
});

//
//
//
//
// get specific posts
app.get("/show-specific-post", async (req, res) => {
  const { blogHeader, userName } = req.body;

  if (blogHeader != undefined) {
    await db.query(
      "SELECT * FROM blogPosts WHERE blogHeader=?",
      [blogHeader],
      (err, post) => {
        if (err) {
          return res.send("Post Not Found");
        }
        if (post[0] != null) {
          console.log("Post is being showed");
          res.status(200).send(post);
        } else {
          return res.send("Post Not Found");
        }
      }
    );
  }

  if (userName != undefined) {
    db.query(
      "SELECT userID FROM userInfo WHERE userName = ?",
      [userName],
      (err, userID) => {
        if (err) throw err;
        const user = userID[0].userID;

        db.query(
          "SELECT * FROM blogPosts where userID = ?",
          [user],
          (err, posts) => {
            if (err) throw err;
            console.log("Posts are being showed");
            res.send(posts);
          }
        );
      }
    );
  }
});

//
//
//
//
// delete post

app.delete("/delete-post", validToken, async (req, res) => {
  const userID = req.user;
  const { postNo } = req.body;
  // console.log(userID);

  const deletePost = "DELETE FROM blogPosts WHERE userID =? AND postNo = ? ";
  db.query(deletePost, [userID, postNo], (err, posts) => {
    if (err) throw err;
    res.send("post deleted");
  });
});
//
//
//
//
// post update
app.put("/update-post", validToken, async (req, res) => {
  const { blogHeader, blogDescription } = req.body;
  const userID = req.user;

  if (blogHeader != undefined) {
    db.query(
      "UPDATE blogPosts SET blogHeader=? WHERE userID=?",
      [blogHeader, userID],
      (err, post) => {
        if (err) throw err;
        res.send("Title is  updated");
      }
    );
  }
  if (blogDescription != undefined) {
    db.query(
      "UPDATE blogPosts SET blogDescription=? WHERE userID=?",
      [blogDescription, userID],
      (err, post) => {
        if (err) throw err;
        res.send("blog is updated");
      }
    );
  }
});

//
//
//
//

//
//
//
//
// untouchable
app.use("", async (req, res) => {
  res.status(404).send("url not found");
});

app.listen(port, () => {
  console.log(`Server Started On Port ${port}`);
});
