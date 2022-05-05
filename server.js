

// Load Node modules
const sqlite3 = require('sqlite3').verbose();
const nodeCron = require('node-cron')
const { check, validationResult } = require('express-validator');

// init DB
let db = new sqlite3.Database('./db/links.db');

// Schedule deletion of stale links
nodeCron.schedule("* * * * *", function jobInit() {

    var currentDateTime = new Date();

    let expirationQuery = `DELETE FROM links WHERE ${currentDateTime.getTime()} >= ttl`

    db.all(expirationQuery, (err) => {
        if (err) return console.log(err.message);
    });
});

// Define annoying paths
var indexhtml = __dirname + '/statichtml/index.html'
var showhtml = __dirname + '/statichtml/show.html'
var html404 = __dirname + '/statichtml/404.html'

// Initialise Express
var express = require('express');
var app = express();

// Render static files
app.use(express.static('public'));

// Prepare Express to accept POSTs in JSON
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.set('trust proxy', 'loopback', true)

// Landing page to generate message and link
app.get('/', function (req, res) {
    res.sendFile(indexhtml)
    });

// Validate query parameters, return data to corresponding initVector, delete row
app.get('/api/linkget',
    [check('i').isLength({ min: 16, max: 16 }).trim().escape(),
        check('i').notEmpty(),
        check('i').matches('^[a-zA-Z0-9]*$')
    ],
    function (req, res) {
        var vres = validationResult(req).array();
        if (vres[0]) {
            console.log(vres[0].msg)
            res.sendFile(html404);
            return;
        }

        var iv = req.query.i

        let getQuery = `SELECT data FROM links WHERE iv = "(?)");`;

        let killQuery = `DELETE FROM links WHERE iv = "(?)";`;

    db.all(getQuery, iv, (err, rows) => {
        if (err) return console.log(err.message);
        if (rows.length > 0) {
            rows.forEach(row => {
                res.send({ 'result': row.data })
            })
        }
        if (rows.length == 0) {
            res.status(404).sendFile(html404);
            return;
        }
    });
    db.run(killQuery, iv)
    });

app.get('/show/',
    [check('i').isLength({ min: 16, max: 16 }).trim().escape(),
    check('i').notEmpty(),
    check('i').matches('^[a-zA-Z0-9]*$')
    ],
    function (req, res) {
        var vres = validationResult(req).array();
        if (vres[0]) {
            console.log(vres[0].msg)
            res.status(404).sendFile(html404);
            return;
        }
        res.sendFile(showhtml);
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
