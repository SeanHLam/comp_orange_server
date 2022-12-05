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
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS follows(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
db.run('CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, report varchar(255), post_id INTEGER NOT NULL, FOREIGN KEY(post_id) REFERENCES posts(id))')

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
    db.each("SELECT name, password FROM users", (err,row) => {
        console.log(row);
    });
})

// add a new user to the DB
app.get('/add-new-user',(req,res)=>{
    userName = req.query.name
    userPassword = req.query.password
    //update instead
    db.run(`INSERT INTO users (name, password) values (?, ?)`, [userName, userPassword])
    //res.end()
    res.json({message:"New user created."})
})


//Adds tweet to report list
app.get('/send-report', (req, res)=>{
    sentReport = req.query.report
    
    db.each("SELECT report FROM reports", (err,row) => {
        console.log(row);
    });
    console.log(sentReport)
    res.end()
})


app.listen(3001)