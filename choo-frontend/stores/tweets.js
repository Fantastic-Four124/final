const {getTimelineURL, getFeedURL, getPostTweetURL, getRecentTweetsURL} = require('../util')

module.exports = function feedStore (state, emitter) {
  state.tweets = null
  state.appLoaded = false

  emitter.on('pushState', () => {
    state.tweets = null
    state.databaseError = false
  })

  emitter.on('popState', () => {
    state.tweets = null
    state.databaseError = false
  })

  state.loadAllTweets = () => {
    if (!state.appLoaded) {
      emitter.on('DOMContentLoaded', () => {
        state.appLoaded = true
        state.fetchAllTweets()
      })
    } else {
      state.fetchAllTweets()
    }
  }

  state.fetchAllTweets = () => {
    const recentTweetsURL = getRecentTweetsURL()
    fetch(recentTweetsURL, { method: 'GET'})
    .then(res => {
      res.json()
    .then(tweets => {
      let stateTweets = []
      console.log('tweets',tweets)
      tweets.forEach(t => {
        if (isJSON(t)) {
          stateTweets.push(JSON.parse(t))
        }
      })
      state.tweets = stateTweets
      console.log('statetweets',stateTweets)
      emitter.emit('render')
    })}).catch(err => {
      state.databaseError = true
      emitter.emit('render')
    })
  }

  state.loadTweets = () => {
    let tweetURL = state.getTweetURL()
    fetch(tweetURL, { method: 'GET'})
    .then(res => {
      res.json()
    .then(tweets => {
      let stateTweets = []
      tweets.forEach(t => {
        if (isJSON(t)) {
          stateTweets.push(JSON.parse(t))
        }
      })
      state.tweets = stateTweets
      emitter.emit('render')
    })}).catch(err => {
      state.databaseError = true
      emitter.emit('render')
    })
  }

  function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  state.tweet = (body) => {
    const postTweetURL = getPostTweetURL(state.token)
    fetch(postTweetURL, {method: 'POST', body, headers: {Accept: 'application/json'}})
    .then(res => {
      res.json()
    .then(resJSON => {
      emitter.emit('pushState', '/users/' + state.mainUser.id)
    })}).catch(err => {
      state.databaseError = true
      emitter.emit('render')
    })
  }

  state.getTweetURL = () => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (state.href === '') {
      return getTimelineURL(state.mainUser.id, token)
    } else if (state.href.indexOf('timeline') !== -1) { 
      return getTimelineURL(state.currUser.id, token)
    } else {
      return getFeedURL(state.currUser.id, token)
    }
  }
}
