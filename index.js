const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/',(req,res)=>{
    res.end()
})

app.get('/add-new-user',(req,res)=>{
    user = req.query.name
    password = req.query.password
    //update instead
    db.run(`INSERT INTO users (name, wins) values (?, ?)`, [user, wins])
    db.all("SELECT * from users ORDER BY wins DESC", (err, row)=>{
            console.log(row)
        })
    res.end()
})

app.listen(3001)