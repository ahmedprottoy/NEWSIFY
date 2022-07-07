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
          res.json({ msg: "A New User Has Been Created", nav: "ok" });
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
        res.json({ user: "User Does Not Exist With This Name" });
      } else {
        const hashPassword = result[0].password;
        const userID = result[0].userID;

        if (await bcrypt.compare(password, hashPassword)) {
          console.log("---Log In Successful---");
          console.log("---Generating Access Token---");

          const token = generateAccessToken(userID);
          // console.log(token);
          res.json({
            accessToken: token,
            user: `${userName} is logged in.`,
            nav: "ok",
          });
          // res.send(`Welcome ${userName} To NEWSIFY`);
        } else {
          console.log("---Password Incorrect----");
          res.json({ user: `Invalid Password` });
        }
      }
    });
  });
});

// creating APIs
//get all posts

app.get("/show-posts", async (req, res) => {
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
//
//
//show all users
// app.get("/show-users", validToken, async (req, res) => {
//   // const showUsers = "SELECT * FROM userInfo";

//   await db.query("SELECT * FROM userInfo", (err, rows) => {
//     if (err) {
//       return res.status(404).send(err);
//     }
//     return res.status(200).send(rows);
//   });
// });
//
//
//
//
// show specific showUsers
app.get("/show-user", validToken, async (req, res) => {
  // const { userName } = req.body;
  const userID = req.user;
  // console.log(userID);

  const showUser = mysql.format(
    "SELECT userName,firstName,lastName,email FROM userInfo WHERE userID=?",
    [userID]
  );
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
// user-post

app.get("/user-post", validToken, async (req, res) => {
  const userNO = req.user;
  // console.log(userNO);
  const userPost = mysql.format("SELECT * from blogPosts WHERE userID=?", [
    userNO,
  ]);
  await db.query(userPost, (err, result) => {
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
      res.json({
        status: "ok",
        msg: `${userN} has created a post successfully`,
      });
    });
  });
});

//
//
//
//

//
//
//
//
// get specific posts
app.post("/show-specific-post", validToken, async (req, res) => {
  const { blogHeader, userName } = req.body;

  // const { userName } = req.body;

  if (blogHeader !== "") {
    await db.query(
      "SELECT * FROM blogPosts WHERE blogHeader=?",
      [blogHeader],
      (err, post) => {
        if (err) {
          return res.send("Post Not Found");
        }
        if (post[0] != null) {
          console.log("Post is being showed");
          return res.status(200).send(post);
        } else {
          return res.json({
            status: "no",
            msg: "Sorry No Post Found According To Your Data...",
          });
        }
      }
    );
  }
  if (userName !== "") {
    db.query(
      "SELECT userID FROM userInfo WHERE userName = ?",
      [userName],
      (err, userID) => {
        if (err) throw err;

        if (userID.length === 0) {
          return res.json({
            status: "no",
            msg: "Sorry User Doesn't Exist...",
          });
        } else {
          const user = userID[0].userID;
          db.query(
            "SELECT * FROM blogPosts where userID = ?",
            [user],
            (err, posts) => {
              if (err) throw err;
              console.log("Posts are beingg showed");
              if (posts[0] != null) {
                console.log("Post is being showed");
                return res.status(200).send(posts);
              } else {
                return res.send("Post Not Found");
              }
            }
          );
        }
      }
    );
  }
});

//
//
//
//
// delete post

app.delete("/delete-post/:postNo", validToken, async (req, res) => {
  const userID = req.user;
  const postID = req.params.postNo;
  const deletePost = "DELETE FROM blogPosts WHERE userID =? AND postNo = ? ";
  db.query(deletePost, [userID, postID], (err, posts) => {
    if (err) throw err;
    res.send(posts);
  });
});
//
//
//
//
// post update
//1
app.get("/updatePost/:postNo", validToken, async (req, res) => {
  const postID = req.params.postNo;
  // console.log(userNO);
  const userPost = mysql.format("SELECT * from blogPosts WHERE postNo=?", [
    postID,
  ]);
  await db.query(userPost, (err, result) => {
    if (err) {
      return res.status(404).send(err);
    }
    return res.status(200).send(result);
  });
});

//2
app.put("/update-post", validToken, async (req, res) => {
  const { blogHeader, blogDescription } = req.body;
  const userID = req.user;

  if (blogHeader !== "") {
    db.query(
      "UPDATE blogPosts SET blogHeader=? WHERE userID=?",
      [blogHeader, userID],
      (err, post) => {
        if (err) throw err;
        res.send("Title is  updated");
      }
    );
  }

  if (blogDescription !== "") {
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
