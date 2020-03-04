const { Client } = require('pg')

// setup database connection
const client = new Client({
    user: "postgres",
    password: "admin",
    host: "192.168.1.12",
    port: 5432,
    database: "sampledb"
})

// connect
client.connect()
.then(() => console.log("Connected to db successfully."))
.then(() => client.query("select * from person"))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end()) //ends the connection