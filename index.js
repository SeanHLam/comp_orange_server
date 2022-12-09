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
db.run('CREATE TABLE IF NOT EXISTS relationship(id INTEGER PRIMARY KEY AUTOINCREMENT, following varchar(15), followed varchar(15))')
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

    res.end()
   
})

app.get('/delete-post',(req,res)=>{
    
    const postid = req.query.id
    // console.log(postid)

    db.run(`DELETE FROM posts WHERE id = ${postid}`)
    
    db.each("SELECT * from posts", (err,row) => {
        console.log(row)
    });

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
        // db.run(`INSERT INTO reports (report, post_id) values (?, ?)` , [sentReport, id] )
    
        //logs all of the existing reports
        db.all("SELECT * FROM reports", [], (err,rows) => {
            console.log(rows)
         });
   
    res.end()
})

//follow & unfollow button will insert & delete data
app.get('/relationship', (req, res)=>{
    const following = req.query.following_name
    const followed = req.query.followed_name
    const state = req.query.state

    if (state == 'false') {
        db.run(`INSERT INTO relationship (following, followed) values (?, ?)`, [following, followed])
        db.all("SELECT * FROM relationship", [], (err,rows) => {
        console.log(rows)
    });
    } 

    if (state == 'true') { 
        console.log("it works")
        db.each(`DELETE FROM relationship WHERE following = '${following}' AND followed = '${followed}'`);
    }

    res.end()
})

// following number calculation
    app.get('/following', (req, res)=>{
        
        const following = req.query.following

        db.all(`SELECT id from relationship WHERE following = '${following}'`,[], (err,rows) => {
         return res.json({data:rows});
         });

    })

app.listen(3001)