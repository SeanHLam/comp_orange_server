const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db');
const app = express()


app.use(cors())

//Setting up the tables for users, posts, following, and reports
//the last three tables use a foreign key to reference a different table to connect them
db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS follows(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, report varchar(255), tweet_id INTEGER NOT NULL, FOREIGN KEY(tweet_id) REFERENCES posts(id))')

app.get('/',(req,res)=>{
    console.log("server running");
    res.end()
    db.each("SELECT * from users", (err,row) => {
        console.log(row);
    });
})

//gets name and pass from query and adds it to the users table
app.get('/add-new-user',(req,res)=>{
    userName = req.query.name
    userPassword = req.query.password
    db.run(`INSERT INTO users (name, password) values (?, ?)`, [userName, userPassword])
    db.all("SELECT * from users", (err, row)=>{
            console.log(row)
        })
    res.end()
})

app.listen(3001)