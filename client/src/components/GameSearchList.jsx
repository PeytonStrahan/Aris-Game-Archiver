import React from 'react';

class GameSearchList extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <div>
        {
        this.props.listItems.map((game, index) => (
          <li key={`${index}-${game}`}>
              {game.name}
              <button onClick={() => this.props.addGameCaller(this.props.listItems[index])} type='button'>
                Add
              </button>
          </li>
        ))
      }
      </div>
    );
  }

}

export default GameSearchList;