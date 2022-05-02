

// Load Node modules
const sqlite3 = require('sqlite3').verbose();
const nodeCron = require('node-cron')
let db = new sqlite3.Database('./db/links.db');
var express = require('express');


nodeCron.schedule("* * * * *", function jobInit() {

    var currentDateTime = new Date();

    let expirationQuery = `DELETE FROM links WHERE ${currentDateTime.getTime()} >= ttl`

    db.all(expirationQuery, (err) => {
        if (err) return console.log(err.message);
    });
});


// Initialise Express
var app = express();

// Render static files
app.use(express.static('public'));

// Prepare Express to accept POSTs in JSON
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// input content and generate link

app.get('/api/linkget', function (req, res) {

    let getQuery = `SELECT data FROM links WHERE iv = "${req.query.i}";`;

    let killQuery = `DELETE FROM links WHERE iv = "${req.query.i}";`;

    db.all(getQuery, (err, rows) => {
        if (err) return console.log(err.message);

        rows.forEach(row => {
            console.log(row.data)
            res.send( { 'result': row.data } )
        })
    });

    db.run(killQuery)
});

app.post('/api/linkgen', function (req, res) {
    const iv = req.body.iv;
    const data = req.body.data;
    const ttl = req.body.ttl;

    let insertQuery = `INSERT INTO links(iv,data,ttl) VALUES (?, ?, ?)`;


    db.run(insertQuery, [iv,data,ttl], (err) => {
        if (err) return console.log(err.message);
    });

    res.send({
        'iv': iv,
        'data': data,
    });
});

// Port website will run on
app.listen(8080);