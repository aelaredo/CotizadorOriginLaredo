const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
const credentials = {
    host:'localhost',
    user:'root',
    password:'',
    database:'originsoft'
}

app.get('/', (req, res)=>{
    res.send('');
})

//Mock para no agotar la API
// app.get('/mockAPI', (req, res)=>{
//     var fs = require("fs");
//     var text = fs.readFileSync("./dataMOCK.txt", "utf-8");
//     res.status(200).send(text)
// })


app.post('/api/login', (req, res)=>{
    const {username, password} = req.body
    const values = [username, password]
    var connection = mysql.createConnection(credentials)
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?", values, (err, result)=>{
        if(err){
            res.status(500).send(err)
        }else{
            if(result.length>0){
                res.status(200).send(result[0])
            }else{
                res.status(400).send("usuario no encontrado")
            }
        }
    })
    connection.end();
})

app.listen(4000,()=>console.log("Servidor node corriendo en puerto 4000"));