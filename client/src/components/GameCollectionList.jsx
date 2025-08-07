import React from 'react';

class GameCollectionList extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <div>
        {
        this.props.listItems.map((game, index) => 
          { let selectColor = "white"
            if (game.favorite) {
              selectColor = "yellow"
            }
            return (
            <li key={`${index}-${game}`}>
                {game.name}
                <button onClick={() => this.props.removeGameCaller(this.props.listItems[index])} type='button'>
                  Remove
                </button>
                <button onClick={() => this.props.favoriteGameCaller(this.props.listItems[index])} type='button' style={{background: selectColor}}>
                  Favorite
                </button>
            </li>
          )
        })
      }
      </div>
    );
  }

}

export default GameCollectionList;