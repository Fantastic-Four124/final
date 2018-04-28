const html = require('choo/html')
const {getViewUserURL, niceDate, pluralize} = require('../util')

module.exports = function renderTweet (state, emit, tweet) {
  console.log('tweet', tweet)
  return html`
    <div class="tweet">
      <div class="tweet-content">
        <div class="post-container">
          <div class="metadata">
            <img src="http://www.gravatar.com/avatar/747fb50017944a3ca067fc2d51ba3b" />
            <a href=${getViewUserURL(state, tweet.user)} class="name"><span>@${tweet.user.username}</span></a>
            <span class="date"> - ${niceDate(tweet.date_posted)}</span>
          </div>
          <p class="content">${linkify(tweet.contents, tweet.mentions)}</p>
        </div>
      </div>
    </div>
  `


  function linkify(str, mentions){
    let isHashtag = false
    let isMention = false

    //    str = str.replace(/#/gi. '*#')
    //    str = str.replace(/@/gi. '*@')
    let arr = str.split(" ").map(w => {
      if (w.match(/#([a-zA-Z]+)/)) {
        isHashtag = true
        const link = w.substring(1)
        return html`
          <a href="/hashtag/${link}">${w + ' '}</a>
        `
      }
      if (w.match(/@([a-zA-Z]+)/) && mentions.length > 0) {
        console.log('mentions', mentions)
        mentions.filter(m => {
          console.log('yo')
          return m === m
        })

        for (let i = 0; i < mentions.length; i++) {
          let id = mentions[0].split('-')[0]
          let username = '@' + mentions[0].split('-')[1]
          console.log('username', username)
          if (username === w) {
            console.log('found it', w)
            return html`
              <a href="/users/${id}">${w + ' '}</a>
            `
          }
        }
      }
      return w + " "
    })
    return arr
  }
}
