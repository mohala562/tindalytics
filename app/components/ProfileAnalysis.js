'use strict'
const React = require('react')

let ProfileAnalysis = React.createClass({
  renderMatches: function() {
    // let rows = []
    // for (var r = 0; r < this.props.userMatches.length; r+3) {
    //   rows[rows.length] = <div key={r} className="row">
    //   <div key={r}  className="four columns">
    //       <img src={userMatches[r].photosArray[0]} key={r} className="u-max-full-width" />
    //   </div>
    //   <div key={r+1}  className="four columns">
    //       <img src={userMatches[r+1].photosArray[0]} key={r+1} className="u-max-full-width" />
    //   </div>
    //   <div key={r+2}  className="four columns">
    //       <img src={userMatches[r+2].photosArray[0]} key={r+2} className="u-max-full-width" />
    //   </div>
    //   </div>
    //   return rows
    // }
    //return JSON.stringify(userMatches.length, userMatches)
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
        <h2 style={{'textAlign':'center'}}>Welcome, {userProfile.name}</h2>
        <p style={{'textAlign':'center'}}>tinder ID: {userProfile._id}</p>
        <p style={{'textAlign':'center'}}><i>{userProfile.bio}</i></p>
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
        {this.renderMatches()}

    </div>)

  }
})


module.exports = ProfileAnalysis
