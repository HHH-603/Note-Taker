// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;


// Sets up the Express App to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "develop/public")));

//  Initializes "noteData" array that will collect all notes the user submits
let notesData = [];

// Routes
// =================================================================================================================

// Displays all notes

app.get("/api/notes", function (err, res) {
    try {
        notesData = fs.readFileSync("develop/db/db.json", "utf8");

        notesData = JSON.parse(notesData);
    } catch (err) {
    }
    res.json(notesData);
});

// Creates new notes - takes in JSON input
app.post("/api/notes", function (req, res) {
    try {
        notesData = fs.readFileSync("./develop/db/db.json", "utf8");

        notesData = JSON.parse(notesData);
        
        req.body.id = notesData.length;
        
        notesData.push(req.body);
        
        notesData = JSON.stringify(notesData);
        
        fs.writeFile("./develop/db/db.json", notesData, "utf8", function (err) {
            if (err) throw err;
        });
        res.json(JSON.parse(notesData));
    } catch (err) {
        throw err;
    }
});

// Deletes a given note
app.delete("/api/notes/:id", function (req, res) {
    try {
        notesData = fs.readFileSync("./develop/db/db.json", "utf8");
        
        notesData = JSON.parse(notesData);
        
        notesData = notesData.filter(function (note) {
            return note.id != req.params.id;
        });
        notesData = JSON.stringify(notesData);
        
        fs.writeFile("./develop/db/db.json", notesData, "utf8", function (err) {
            if (err) throw err;
        });
        res.send(JSON.parse(notesData));
    } catch (err) {
        throw err;
    }
});

// Route that sends the user to the AJAX page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "develop/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "develop/public/index.html"));
});

app.get("/api/notes", function (req, res) {
    return res.sendFile(path.json(__dirname, "develop/db/db.json"));
});

// Triggers the server to start listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});