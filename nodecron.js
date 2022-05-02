const sqlite3 = require('sqlite3').verbose();
const nodeCron = require('node-cron')
let db = new sqlite3.Database('./db/links.db');

var jobInit = nodeCron.schedule("* * * * *", function jobInit() {

    var currentDateTime = new Date();

    let expirationQuery = `SELECT iv FROM links WHERE ${currentDateTime.getTime()} >= ttl`

    db.all(expirationQuery, (err, rows) => {
        if (err) return console.log(err.message);

        var toDelete;

        rows.forEach(row => {
            toDelete = row.iv
            db.all(`DELETE FROM links WHERE iv = ${toDelete}`)
            console.log("Deleted data: " + toDelete)
        })
    });
});

module.exports(jobInit)