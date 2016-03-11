'use strict'
const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const tinder = require('tinderjs')
const client = new tinder.TinderClient()

//things to do outside of production
if (!process.env.PORT) app.use(require('morgan')('dev'))

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './app')))
app.listen(process.env.PORT || 3000, () => console.log(`listening on port ${port}`))

// middleware
let authorize = (req, res, next) => {
  console.time('full analysis')
  console.log('middleware: authorize and store user info')
  let fb_id = req.body.fb_id // 658697848
  let fb_ut = req.body.fb_ut
    // res.send(req.body)
  console.log(fb_id, fb_ut)
  client.authorize(fb_ut, fb_id, (err, body) => {
    if (err) console.log(err);
    if (!err) {
      req.userProfile = body
      next()
    }
  })
}

let grabMatches = (req, res, next) => {
  console.log('middleware: get Matches and store info')
  client.getHistory((error, data) => {
    if (error) res.sendStatus(400)
    if (data) {
      console.log('successfully retrieved match history')
      let arrayOfMatchObjs = []
      data.matches.forEach(function(match) {
          if (match.person) {
            arrayOfMatchObjs.push(match)
          }
        }) //end of: forEach match function
      req.userMatches = arrayOfMatchObjs
      console.log(arrayOfMatchObjs.length, ' total matches')
      next()
    }
  })
}

let returnData = (req, res) => {
  console.log('middleware: send back the data to client')
  res.send(JSON.stringify(
    {
      userProfile: req.userProfile,
      userMatches: req.userMatches
    }
  ))
  console.timeEnd('full analysis')
}

// main route
app.get('/', (req, res) => res.sendFile('/app/index.html'))

// user authentication route
app.post('/auth', authorize, grabMatches, returnData)
