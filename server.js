var express = require('express')
var app = express()

app.use(express.static(__dirname + '/www'));

var port = process.env.PORT || 3000;

app.listen(port, function(error) {
    if (error) {
        console.log("something went wrong ", error)
    } else {
        console.log("listening on ", port)
    }
});