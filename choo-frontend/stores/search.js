const {getSearchUsersURL, getSearchTweetsURL} = require('../util')

module.exports = function search (state, emitter) {

  state.searchUsers = () => {
    const searchURL = getSearchUsersURL(state.params.name)
    fetch(searchURL, {method: 'GET', headers: {Accept: 'application/json'}})
    .then(res => {
      res.json()
    .then(userList => {
      console.log('userList', userList)
      state.userList = userList
      emitter.emit('render')
    })}).catch(err => console.log('oh no!'))
  }

  state.searchTweets = (term) => {
    const searchURL = getSearchTweetsURL(state.params.term)
    console.log('url', searchURL)
    fetch(searchURL, {method: 'GET', headers: {Accept: 'application/json'}})
    .then(res => {
      res.json()
    .then(tweets => {
      console.log('tweets', tweets)
      state.tweets = tweets
      emitter.emit('render')
    })}).catch(err => console.log('oh no!'))
  }

  state.searchHashtags = (term) => {
    const searchURL = getSearchHashtagsURL(state.params.term)
    console.log('url', searchURL)
    fetch(searchURL, {method: 'GET', headers: {Accept: 'application/json'}})
    .then(res => {
      res.json()
    .then(tweets => {
      console.log('tweets', tweets)
      state.tweets = tweets
      emitter.emit('render')
    })}).catch(err => console.log('oh no!'))
  }
}
