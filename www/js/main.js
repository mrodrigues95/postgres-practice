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
.catch(e => console.log)
.finally(() => client.end()) //ends the connection





function submitInformation() {
    var firstName = document.getElementById('first-name').value;
    var lastName = document.getElementById('last-name').value;
    var email = document.getElementById('email').value;

    console.log("First name: " + firstName + "n Last name: " + lastName + "n Email: " + email);
}