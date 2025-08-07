// TODO
const express = require('express');
const app = express();
const path = require('path');
const database = require('./db/index')


const clientSide = path.join(__dirname, '../client/dist');
app.use(express.json()); // Parses incoming requests
app.use(express.static(clientSide)); // link up the react app and other data in the dist file to the express server

app.get('/', (req, res) => { // serves up main page (html)
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/collection', (req, res) => { // handles requests to receive all games from the database
  database.getGames(req.headers.sort).then(result => {
    res.status(200).send(result);
  }).catch(err => { // error handling
    console.log("get error: " + err)
    res.sendStatus(500);
  })
});

app.post('/collection', (req, res) => { // handles requests to insert games into the database
  database.addGame(req.body.data).then(result => {
    res.status(201).send("saved");
  }).catch(err => { // error handling
    console.log("post error: " + err)
    res.sendStatus(500);
  })
});

app.patch('/collection', (req, res) => { // handles requests to modify games in the database (specifically requests to toggle a game's "favorite" column property)
  database.favoriteGame(req.body.data).then(result => {
    res.status(200).send("favorite state changed");
  }).catch(err => { // error handling
    console.log("patch error: " + err)
    res.sendStatus(500);
  })
});

app.delete('/collection', (req, res) => { // handles requests to remove games from the database
  database.removeGame(req.body).then(result => {
    res.status(200).send("game removed");
  }).catch(err => { // error handling
    console.log("delete error: " + err)
    res.sendStatus(500);
  })
});

app.listen(8080, () => { // set up port listener
  console.log('listening to port 8080 on localhost');
})