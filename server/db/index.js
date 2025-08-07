// TODO
const mongoose = require('mongoose');

// establish a connection to the ArisGameArchiver database
mongoose.connect('mongodb://localhost:27017/ArisGameArchiver')
.then(() => {
  console.log("connected to database");
})
.catch((err) => {
  console.log('database connection failed: ' + err);
});

const gameListSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  rating: Number,
  release: String,
  favorite: Boolean,
  img_url: String
});

const Game = mongoose.model('Game', gameListSchema);

const getGames = async (sortField) => {
  // return all game records sorted by the inputted sorting field
  const result = await Game.find().sort(sortField).exec();
  return result;
}

const addGame = async (gameToAdd) => { // adds a new game record to the db
  try {
    const foundGame = await Game.find({_id: gameToAdd.id}).exec(); // check if the game already exists in the db
    if (foundGame.length === 0) { // if no matches were found
      const result = await Game.create({ // make a new record for the game
        _id: gameToAdd.id,
        name: gameToAdd.name,
        rating: gameToAdd.rating_top,
        release: gameToAdd.released,
        favorite: false,
        img_url: gameToAdd.background_image
      });
      return result; // return the newly-save game record
    } else {
      return null; // return null if included
    }
  } catch (err) { // error handling
    return null; // return null if error
  }
}

const favoriteGame = async (gameTofavorite) => { // toggle the "favorite" property of the given game
  const result = await Game.findOneAndUpdate({ _id: gameTofavorite._id }, { favorite: !gameTofavorite.favorite }); // modify the inputted game to reverse their favorited status in the database
  return result;
}

const removeGame = async (gameToRemove) => { // removes the given game from the db
  //console.log(gameToRemove)
  const result = await Game.findOneAndDelete({ _id: gameToRemove._id }); // delete the inputted game from the database
  return result; // return the object returned from this method
}

module.exports = {
  getGames,
  addGame,
  favoriteGame,
  removeGame
}