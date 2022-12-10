const express = require('express')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./db');

app.use(cors());


/*

GETTING STARTED

SIGN UP AND SIGN IN
Create account and then sign in
if you dont want to create accounts you can use these two accounts
name: Sean password: pass
name: James password: pass

CREATE A TEXT POST 
under sprit something, type whatever you would like and press the post button
the tweet is saved in the backend and displayed on the timeline

EDIT A TWEET
Under one of your own tweets, press the edit button.
an edit text box will appear and you can change the text of your post
the edit will change the post saved in the backend

FOLLOW AND UNFOLLOW 
Under another user's tweet, press the follow button 
you will follow that user which is kept track in the backend

REPORT A TWEET
Under another user's tweet, press the flag icon to open up a report window.
type the nature of your report and press the button to submit
the report will be saved in the backend in the reports tabl

*/


var userName = "";
var userPassword = "";


db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(15) UNIQUE, password varchar(255))')
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, post varchar(255), name varchar(255), date varchar(255), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))')
db.run('CREATE TABLE IF NOT EXISTS relationship(id INTEGER PRIMARY KEY AUTOINCREMENT, following varchar(15), followed varchar(15))')
db.run('CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT, report varchar(255), post_id INTEGER NOT NULL, FOREIGN KEY (post_id) REFERENCES posts(id))')

app.get('/',(req,res)=>{
    res.end()
})

//check DB if user already exists
app.get('/check-user-login', (req, res)=>{
    userName = req.query.name
    userPassword = req.query.password

    db.all("SELECT * from users", (err,row) => {
      res.json({row})
        
    });
   
})

// add a new user to the DB

app.get('/add-new-user',(req,res)=>{
    
    userName = req.query.name
    userPassword = req.query.password

    //update instead
   
    db.run(`INSERT OR IGNORE INTO users (name,password) values (?, ?)` , [userName, userPassword] )

    res.end()

    // res.json({message:"New user created."})
})

//gets all post information from the feont end and inserts into the posts table
app.get('/add-post',(req,res)=>{
    const post = req.query.post
    const date = req.query.date
    const userName = req.query.user
    const userHandle = req.query.handle
    const userId = req.query.id
    db.run(`INSERT INTO posts (post, date, user_id, handle, name) values (?, ?, ?, ?, ?)`, [post, date, userId, userHandle, userName])
    res.end()
   
})


app.get('/edit-post',(req,res)=> {
    postId = req.query.id
    newText = req.query.text

    console.log(postId, newText)
    db.run(`UPDATE posts SET post = (?) WHERE id = ${postId}`, [newText])
    
    //db.run(`DELETE FROM posts WHERE id = ${postid}`)

})


//gets the postid from frontend and deleted the post located at the id 

app.get('/delete-post',(req,res)=>{
    
    const postid = req.query.id

    db.run(`DELETE FROM posts WHERE id = ${postid}`)

    res.end()
       
})
    

//returns a json of every post in the posts table
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