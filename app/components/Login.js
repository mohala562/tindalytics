const React = require('react')
const $ = require('jquery')
const analyze = require('./tinderAnalyze.js')

let Login = React.createClass({
  authenticateUser: function(event) {
    let that = this
    event.preventDefault();
    var FBut = $('#fb_ut').val()
    var FBid = $('#fb_id').val()
    var user_info = {
      "fb_ut": FBut,
      "fb_id": FBid
    }
    console.log(user_info);
    //AJAX REQUEST
    $.get({
      type: "POST",
      url: "./auth",
      data: user_info,
      dataType: 'JSON',
      success: function(response) {
        console.log(response);
        console.log(analyze(response));
        that.props.newState(analyze(response))
      },
      error: function(error) {
        alert('Something went wrong., please try again... Error: ', error)
        console.log(error);
      }
    })
    // TODO: add fn to append a loading animation
  },
  render: function () {
    return (
      <div id='App'>
        <div style={{'textAlign' : 'center'}}>
          <h4>Tindalytics</h4>
          <h6>analyze your tinder account</h6>
          <br/><br/>
        </div>
        <div className="row">
          <div className="one-half column">
            <p>You can get your Facebook ID <a href="http://findmyfbid.com/">here</a></p>
            <p>You can get your Facebook User Token by clicking <a href="https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token">
              here</a> and quickly copying the URL to your clipboard for extraction. It will be after <i><b>#access_token=</b></i>, but before <i><b>&expires_in=</b>.</i> Be Warned, it dissapears quickly though and is recommended you use Google Chrome.</p>
          </div>
          <div className="one-half column">
            <div className="row">
              <div className="12 columns">
                <label htmlFor="fb_id">Facebook ID</label>
                <input className="u-full-width" type="number" placeholder="roughly 8 digits" id="fb_id"/>
              </div>
            </div>
              <div className="row">
                <div className="12 columns">
                  <label htmlFor="fb_ut">Facebook Token</label>
                  <input className="u-full-width" type="text" placeholder="64+ alpha-numeric digits" id="fb_ut"/>
                </div>
              </div>
              <input className="button-primary" id="submit_button" onClick={this.authenticateUser} type="submit" value="Analyze"/>
            </div>
        </div>
        <p style={{'textAlign' : 'center', 'marginTop': "30px"}}>
            Tindalytics does not store any user data.
            <br/>
            The source code is available on <a href="https://www.github.com/gcwelborn/tindalytics">Github.</a>
        </p>
      </div>
    )
  }
});

module.exports = Login;
