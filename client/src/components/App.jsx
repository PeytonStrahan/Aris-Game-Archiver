// TODO
import React from 'react';
import Axios from 'axios';
import GameCollectionList from './GameCollectionList.jsx';
import GameSearchList from './GameSearchList.jsx';
import RAWG_API_KEY from '../config/apiKey.js'
class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      sort: "name", // sort game collection by name by default
      gameToSearch: 'Fallout 4', // holds the game name in the search bar (fallout 4 by default because I felt like it)
      gameSearchArray: [], // holds the game records resulting from sending a call to the RAWG api
      gameCollectionArray: [], // holds game records saved in the db to be displayed as a list of completed games
      gameWishArray: [] // might not use
    };

    // bind some methods to app component before they are passed down into child components
    this.addGameCaller = this.addGameCaller.bind(this);
    this.removeGameCaller = this.removeGameCaller.bind(this);
    this.favoriteGameCaller = this.favoriteGameCaller.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount () {
    //initialize the App's components
    this.updateColList();
  }

  onSearch () { // sends get request to RAWG api for list of top 25 games related to query
    const { gameToSearch } = this.state;

    Axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        search: gameToSearch
      }
    })
      .then(response => {
        console.log(response.data);
        this.setState({
          gameSearchArray: response.data.results
        }, () => {console.log(this.state)});
      })
      .catch(error => {
        console.log('Error requesting from RAWG:', error);
      });
  }

  searchChange (event) { // updates the state's gameToSearch variable to be in line with what is being typed into the search field
    this.setState({
      gameToSearch: event.target.value
    });
  }

  sortChange (event) { // updates the state's sort variable to be in line with what ever sorting option from the drop-down menu is currently selected
    this.setState({
      sort: event.target.value
    }, () => {this.updateColList();})
  }

  addGameCaller (game) { // sends a post request to server to add a new game record to the database
    console.log(game);

    Axios.post('/collection', {
      data: game
    })
      .then(response => {
        console.log(response.data);
        this.updateColList();
      })
      .catch(error => {
        console.log('Error saving game to list:', error);
      });
  }

  removeGameCaller (game) { // sends a delete request to server to remove new game record from the database (when the remove button is clicked)
    Axios.delete('/collection', {
      data: game
    })
      .then(response => {
        //console.log(response.data);
        this.updateColList();
      })
      .catch(error => {
        console.log('Error removing game from list:', error);
      });
  }

  favoriteGameCaller (game) { // sends a patch request to server to change/toggle the "favorite" column value of a game record in the database
    Axios.patch('/collection', {
      data: game
    })
      .then(response => {
        console.log(response.data);
        this.updateColList();
      })
      .catch(error => {
        console.log('Error favoriting game in list:', error);
      });
  }

  updateColList () { // is called whenever the database is changed or when a new sort option is chosen (this function updates the gamesCollectionArray in state with the results from a GET call to the server)
    const { sort } = this.state;
    Axios.get('/collection', {
      headers: {
        sort
      }
    })
      .then(response => {
        console.log(response.data);
        this.setState({
          gameCollectionArray: response.data
        }, () => {console.log(this.state)});
      })
      .catch(error => {
        console.log('Error creating collection list:', error);
      });
  }

  render () {
    const {
      gameSearchArray,
      gameCollectionArray,
      gameWishArray
    } = this.state;
    return (
      <div id="appComponent">
        <div className="searchDiv">
          <label>Search for a game!</label>
          <input onChange={event => this.searchChange(event)} placeholder='insert game name here'/>
          <button onClick={() => this.onSearch()} type='button'>
            Search
          </button>
          <label>
            <span>sort by:</span>
            <select className="sortBy" onChange={event => this.sortChange(event)}>
              <option value="name">name</option>
              <option value="rating">rating</option>
              <option value="release">release</option>
            </select>
          </label>
        </div>
        <div className="dividedLists">
          <GameSearchList className="dividedList" listItems={gameSearchArray} addGameCaller={this.addGameCaller}></GameSearchList>
        </div>
        <div className="dividedLists">
          <GameCollectionList className="dividedList" listItems={gameCollectionArray} removeGameCaller={this.removeGameCaller} favoriteGameCaller={this.favoriteGameCaller}></GameCollectionList>
        </div>
      </div>
    );
  }

}

export default App;