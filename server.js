// Dependencies
var express = require(`express`);
var path = require(`path`);
var fs = require(`fs`);

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;


// Sets up the Express App to handle data parsing
app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Initializes `noteData` array that will collect all notes the user submits
var notesData = [];

// Routes
// =================================================================================================================

// Deletes a given note
app.delete(`/api/notes/:id`, function (request, response) {
    notesData = fs.readFileSync(`./db/db.json`, `utf8`);
    notesData = JSON.parse(notesData);
    notesData = notesData.filter(function (note) {
        return note.id != request.params.id;
    });
    notesData = JSON.stringify(notesData);
    fs.writeFile(`./db/db.json`, notesData, `utf8`, function (checkError) {
        if (checkError) throw checkError;
    });
    response.send(JSON.parse(notesData));
});

// Displays all notes
app.get(`/api/notes`, function (checkError, response) {
    notesData = fs.readFileSync(`db/db.json`, `utf8`);
    notesData = JSON.parse(notesData);
    response.json(notesData);
    console.log(notesData);
});

// Creates new notes - takes in JSON input
app.post(`/api/notes`, function (request, response) {
        notesData = fs.readFileSync(`./db/db.json`, `utf8`);
        notesData = JSON.parse(notesData);
        request.body.id = notesData.length;
        notesData.push(request.body);
        notesData = JSON.stringify(notesData);
        fs.writeFile(`./db/db.json`, notesData, `utf8`, function (checkError) {
            if (checkError) throw checkError;
        });
        response.json(JSON.parse(notesData));
});


// Route that sends the user to the AJAX page
app.get(`/notes`, function (req, res) {
    res.sendFile(path.join(__dirname, `public/notes.html`));
});

app.get(`*`, function (req, res) {
    res.sendFile(path.join(__dirname, `public/index.html`));
});

app.get(`/api/notes`, function (req, res) {
    return res.sendFile(path.json(__dirname, `db/db.json`));
});

// Triggers the server to start listening
app.listen(PORT, function () {
    console.log(`App is listening on PORT ` + PORT);
});