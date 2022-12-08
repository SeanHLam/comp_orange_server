const express = require('express')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./db');

//needs to be enabled for foreign keys to work... not sure how to execute
// PRAGMA foreign_keys = ON;

//db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15), password varchar(15))')

app.use(cors());

var userName = "";
var userPassword = "";


db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), name varchar(255), date varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS follows(id INTEGER PRIMARY KEY AUTOINCREMENT, following_id INTEGER, followed_id INTEGER, FOREIGN KEY(following_id) REFERENCES users(id) FOREIGN KEY(followed_id) REFERENCES users(id));')
db.run('CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, report varchar(255), post_id INTEGER NOT NULL, FOREIGN KEY (post_id) REFERENCES posts(id))')

app.get('/',(req,res)=>{
    console.log("server running");
    res.end()
    db.each("SELECT * from users", (err,row) => {
        console.log(row);
    });
})

//check DB if user already exists
app.get('/check-user-login', (req, res)=>{
    userName = req.query.name
    userPassword = req.query.password

    // db.each("SELECT * from users", (err,row) => {
    //     // if (userName === row.name && userPassword === row.password){
    //     //     console.log(row.id)
    //     //     res.json({row})
    //     // }

    // });

    db.all("SELECT * from users", (err,row) => {
      res.json({row})
        
    });
   

    // db.each("SELECT name, password, id FROM users", (err,row) => {
    //     console.log(row);
    // })

    // db.each("SELECT * FROM posts", (err,row) => {
    //     console.log(row);
    // })
   
})

// add a new user to the DB

app.get('/add-new-user',(req,res)=>{
    
    userName = req.query.name
    userPassword = req.query.password

    //update instead
   
    db.run(`INSERT OR IGNORE INTO users (name,password) values (?, ?)` , [userName, userPassword] )
    // db.each("SELECT * from users", (err,row) => {
    //     console.log(row)
    // });
    console.log(userName, userPassword)
    res.end()

    // res.json({message:"New user created."})
})


// // add new post to the DB
// app.post('/add-post',(req, res)=>{
//     req.body.text
// })

app.get('/add-post',(req,res)=>{

// db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), date varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')

    console.log(req.query)
    const post = req.query.post
    const date = req.query.date
    const userName = req.query.user
    const userHandle = req.query.handle
    const userId = req.query.id
    db.run(`INSERT INTO posts (post, date, user_id, handle, name) values (?, ?, ?, ?, ?)`, [post, date, userId, userHandle, userName])
   
    db.each("SELECT * from posts", (err,row) => {
        console.log(row)
    });

    // db.all("SELECT * FROM posts", [], (err,rows) => {
    //     return res.json({data:rows});
    //  });
    
    res.end()
   
})

app.get('/posts', (req, res)=>{
    db.all("SELECT * FROM posts ORDER BY id DESC", [], (err,rows) => {
       return res.json({data:rows});
    });
})



//Adds tweet to report list
app.get('/send-report', (req, res)=>{
    sentReport = req.query.report
    id= req.query.postid
    //inserts the report info and the id from what post it came from
    db.run(`INSERT INTO reports (report, post_id) values (?, ?)` , [sentReport, id] )
   
    //logs all of the existing reports
    db.all("SELECT * FROM reports", [], (err,rows) => {
        console.log(rows)
     });
   
    res.end()
})

//follow 
app.get('/relationship', (req, res)=>{
    const follow = req.query.follow
    db.run(`INSERT INTO follows (following_id, followed_id) values (?, ?)`, [])
})


app.listen(3001)