const express = require('express')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db');

db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15), password varchar(15))')

app.use(cors());

var userName = "";
var userPassword = "";

db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS follows(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
app.get('/',(req,res)=>{
    console.log("server running");
    res.end()
    db.each("SELECT * from users", (err,row) => {
        console.log(row);
    });
})

app.get('/add-new-user',(req,res)=>{
    userName = req.query.name
    userPassword = req.query.password
    //update instead
    db.run(`INSERT INTO users (name, password) values (?, ?)`, [userName, userPassword])
    db.all("SELECT * from users ORDER BY wins DESC", (err, row)=>{
            console.log(row)
        })
    res.end()
})

app.listen(3001)