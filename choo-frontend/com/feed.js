const html = require('choo/html')
const renderTweet = require('./tweet')
const renderTweetbar = require('./tweetbar')
const renderProfile = require('./profile')

module.exports = function renderFeed (state, emit) {
  if (!state.tweets) {
     return html`
      <p class="card">
        <i class="fa fa-spinner"></i> Loading tweets...
      </p>
    `
  }

  let tweets = state.tweets

  return html`
    <div class="tweets-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-lg-9">
            ${renderTitle()}
            ${state.loggedIn ? renderTweetbar(state, emit) : ''}
            <ul class="feed">${tweets.map(t => renderTweet(state, emit, t))}</ul>
          </div>
          <div class="col-lg-3">
            ${renderProfile(state, emit)}
          </div>
        </div>
      </div>
    </div>
  `

  function renderTitle() {
    console.log('rendering title')
    console.log('state href', state.href)
    if (state.href === '' && !state.loggedIn) {
      return html`<h2>Welcome to nanoTwitter!</h2>`
    } else if (state.href === '') {
      return html`<h2>Your Timeline</h2>`
    } else if (state.href.indexOf("timeline") !== -1) {
      return html`<h2>${state.currUser.id === state.mainUser.id ? 'Your' : state.currUser.username + "'s"} Timeline</h2>`
    } else if (state.href === '/alltweets') {
      return html`<h2>All Recent Tweets</h2>`
    } else if (state.href.indexOf('tweet-search') !== -1) {
      return html`<h2>Search Results</h2>`
    } else if (state.href.indexOf('hashtag') !== -1) {
      return html`<h2>Hashtag Search</h2>`
    } else {
      return html`<h2>${state.currUser.id === state.mainUser.id ? 'Your' : state.currUser.username + "'s"} Feed</h2>`
    }
  }
}
