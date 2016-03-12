'use strict'
const React = require('react')

let ProfileAnalysis = React.createClass({
  renderMatches: function(userMatches) {
    let rows = userMatches.map((match, i) => {
      return <div className="row" key={i} style={{
          "border": "solid 2px #FF6B6B",
          "borderRadius": "10px",
          "margin": "20",
          "padding": "7"
        }}>
        <div className="four columns">
          <img style={{"borderRadius": "10px"}}
            className="u-max-full-width" src={match.photosArray[0]} />
          </div>
        <div className="four columns">
            <p>{match.name}</p>
            <p>{match.age} years old</p>
            <p>BD: {new Date(match.birthDay).toLocaleString().slice(0, 10)}</p>
            <p>{match.astrologicalSign}</p>
            <p>{match.numberOfTotalMessages} messages</p>
            <p>Sentiment: {match.sentimentPercent}%</p>
        </div>
        <div className="four columns">
          <p>super-like: {(match.SuperLike) ? 'true' : 'false'}</p>
          <p>match date: {new Date(match.acctCreatedOn).toLocaleString().slice(0, 10)}</p>
          <p>last interaction: {new Date(match.lastActive).toLocaleString().slice(0, 10)}</p>
          <p>Msgs from you: {match.messagesSentFromYou}</p>
          <p>Msgs from them: {match.messagesSentFromThem}</p>
        </div>
      </div>


    })
    return rows
  },
  render: function() {
    let userProfile = this.props.userProfile
    let matchSummary= this.props.matchSummary
    let userMatches= this.props.userMatches
    let photoDivs = userProfile.photos.map((img, i) => {
      return <div key={i}  className="two columns">
          <img src={img} key={i} className="u-max-full-width" />
      </div>
    })

    return (
    <div>
        <h2 style={{'textAlign':'center'}}>{userProfile.name}</h2>
          <p style={{'textAlign':'center'}}><i>{userProfile.bio}</i></p>
        <p style={{'textAlign':'center'}}>tinder ID: {userProfile._id}</p>
        <p style={{'textAlign':'center'}}>account created: {new Date(userProfile.acct_created).toLocaleString()} </p>
        <div style={{'textAlign':'center'}} className="row">{photoDivs}</div>


        <div className="row" style={{'textAlign':'center', 'marginTop': '40px'}} >
          <div className="three columns"><h4>{(matchSummary.total_matches / userProfile.connection_count).toFixed(2) * 100}%</h4><p>match retention</p></div>
          <div className="three columns"><h4>{matchSummary.total_matches}</h4><p>total matches</p></div>
          <div className="three columns"><h4>{matchSummary.average_age}</h4><p>average age</p></div>
          <div className="three columns"><h4>{matchSummary.average_messages_per_match}</h4><p>average # messages per match </p></div>
        </div>
        <div className="row" style={{'textAlign':'center'}} >
          <div className="three columns"><h4>{matchSummary.gender_ratio.female}%: {matchSummary.gender_ratio.male}%</h4><p>Female:Male %</p></div>
          <div className="three columns"><h4>{matchSummary.total_super_likes}</h4><p>super likes</p></div>
          <div className="three columns"><h4>{matchSummary.sent_messages}</h4><p>sent messages</p></div>
          <div className="three columns"><h4>{matchSummary.received_messages}</h4><p>received messages</p></div>
        </div>
        <h3 style={{'textAlign':'center'}}>Your Matches</h3>
        {this.renderMatches(userMatches)}

    </div>)

  }
})


module.exports = ProfileAnalysis
