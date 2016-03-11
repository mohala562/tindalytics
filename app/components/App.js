const React = require('react');
const ReactDOM = require('react-dom');
const Login = require('./Login')
const ProfileAnalysis = require('./ProfileAnalysis')

let App = React.createClass({
  getInitialState: function() {
    return {
      analyzed: false
    }
  },
  setNewState: function(newState) {
    this.setState(newState)
  },
  render: function () {
      if (!this.state.analyzed) {
        return (
          <div id='App'>
            <Login newState={this.setNewState} />
          </div>
        )
      } else {
        return (
          <div id='App'>
            <ProfileAnalysis
              userProfile={this.state.userProfile}
              matchSummary={this.state.matchSummary}
              matchSummary={this.state.matchSummary} />
          </div>
        )
      }
  }
});

module.exports = App;

ReactDOM.render(<App />, document.getElementById('main-container'));
