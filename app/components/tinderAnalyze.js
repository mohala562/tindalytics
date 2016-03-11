'use strict'
const horoscope = require('horoscope')
const sentiment = require('sentiment')
const _ = require('underscore')

const analyzeTinderUserandMatches = (userObj) => {
  let userProfile = userObjConstructor(userObj.userProfile)
  let userMatches = userObj.userMatches.map(match => {
      return matchObjConstructor(match)
  })
  let matchSummary = summarizeMatches(userMatches)
  return { userProfile, userMatches, matchSummary, analyzed: true}
}

module.exports = analyzeTinderUserandMatches

// helper functions

let userObjConstructor = (body) => {
  let user = body.user
  return {
    _id: user._id,
    name: user.full_name,
    acct_created: user.create_date,
    age_filter_max: user.age_filter_max,
    age_filter_min: user.age_filter_min,
    bio: user.bio,
    birth_date: user.birth_date,
    connection_count: user.connection_count,
    distance_filter: user.distance_filter,
    gender: (user.gender) ? 'F' : 'M',
    photos: user.photos.map((photo) => {
      return photo.url
    }),
  }
}


// constructor to create an object for each match the user has.
let matchObjConstructor = match => {
  let returnObj = {}
    //start of: match object parameters
  returnObj.id = match._id
  returnObj.name = match.person.name
  returnObj.age = getAge(match.person.birth_date.substring(0, 10))
  returnObj.gender = binaryToGender(match.person.gender)
  returnObj.bio = match.person.bio.trim()
  returnObj.birthDay = new Date(match.person.birth_date)
  let monthOfBirth = parseInt(match.person.birth_date.substring(5, 7))
  let dayOfBirth = parseInt(match.person.birth_date.substring(8, 10))
  returnObj.astrologicalSign = horoscope.getSign(monthOfBirth, dayOfBirth)
  returnObj.lastActive = new Date(match.person.ping_time)
  returnObj.total_days_on_Tinder = getDifferenceInDaysBetween(
    new Date(match.created_date),
    new Date(match.person.ping_time))
  returnObj.acctCreatedOn = new Date(match.created_date)
  returnObj.lastInteraction = new Date(match.last_activity_date)
  returnObj.total_interaction_time_in_days = getDifferenceInDaysBetween(
    new Date(match.created_date),
    new Date(match.last_activity_date))
  returnObj.SuperLike = match.is_super_like
  returnObj.numberOfPhotos = match.person.photos.length
  returnObj.photosArray = match.person.photos.map((photo) => {
      return photo.url
    })
    //start of sentimentPercent
  let sentimentWordArray = _.flatten(match.messages.map((mess) => {
      return mess.message.split(" ").map((word) => {
        return sentiment(word).score
      })
    })).filter((word) => {
      return word !== 0
    }) //creates an array of sentiment values for words that aren't neutral
  let sentimentValueTotal = sentimentWordArray.reduce((total, curr) => {
    return total + curr
  }, 0)
  let sentimentPercent = sentimentValueTotal / sentimentWordArray.length
  sentimentPercent += 5 //changes range from (-5, 5) to (0, 10)
  sentimentPercent *= 10 //changes range from (0, 10) to (0, 100)
  returnObj.sentimentPercent = sentimentPercent.toFixed(2)
    //end of sentimentPercent
  returnObj.numberOfTotalMessages = match.messages.length
  returnObj.messagesSentFromThem = match.messages.reduce((total, currMessage) => {
    // checks if the message is from your match
    if (currMessage.from === match.person._id) {
      total += 1
      return total
    } else {
      return total
    }
  }, 0)
  returnObj.messagesSentFromYou = match.messages.reduce((total, currMessage) => {
    // checks if the message is from your match
    if (currMessage.from === match.person._id) {
      return total
    } else {
      total += 1
      return total
    }
  }, 0)
  returnObj.messageObjects = match.messages.map((msg) => {
    return {
      sender: msg.from.split().map((sender) => {
        if (sender === match.person._id) {
          return match.person.name
        } else {
          return "You"
        }
      }).join(),
      sentDate: new Date(msg.sent_date),
      message: msg.message,
      msgSentiment_comparative: sentiment(msg.message).comparative
    }
  })
  return returnObj
}

let summarizeMatches = (arrayOfMatchObjs) => {
  let data = arrayOfMatchObjs
  let summaryObject = {}
  summaryObject.total_matches = data.length
  summaryObject.sent_messages = data.reduce(function(total, curr) {
    return total + curr.messagesSentFromYou
  }, 0)
  summaryObject.received_messages = data.reduce(function(total, curr) {
    return total + curr.messagesSentFromThem
  }, 0)
  summaryObject.total_super_likes = data.reduce(function(total, curr) {
    return (curr.SuperLike) ? total + 1 : total
  }, 0)
  summaryObject.average_age = (data.reduce(function(total, curr) {
    return total + curr.age
  }, 0) / data.length).toFixed(2)
  summaryObject.average_messages_per_match = (data.reduce(function(total, curr) {
    return total + curr.numberOfTotalMessages
  }, 0) / data.length).toFixed(2)
  summaryObject.gender_ratio = {
    male: ((data.reduce(function(total, curr) {
      if (curr.gender === "Male") total += 1
      return total
    }, 0) / data.length) * 100).toFixed(1),
    female: ((data.reduce(function(total, curr) {
      if (curr.gender === "Female") total += 1
      return total
    }, 0) / data.length * 100)).toFixed(1)
  }
  return summaryObject
}

//turns birthday into age
let getAge = (dateString) => {
  let today = new Date(),
    birthDate = new Date(dateString),
    age = today.getFullYear() - birthDate.getFullYear(),
    m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

// tinder assigns Male's zero and Female's zero.
let binaryToGender = (matchGenderNumber) => {
  return (matchGenderNumber) ? "Female" : "Male"
}

//gets difference in days between two dates
let getDifferenceInDaysBetween = (date1, date2) => {
  let timeDiff = Math.abs(date2.getTime() - date1.getTime())
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return diffDays
}
