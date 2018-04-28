const html = require('choo/html')

module.exports = function tweetbar (state, emit) {
  return html`
    <div id="tweet-bar">
      <form id="tweet" onsubmit=${onsubmit}>
        <input id="tweet-input" name="tweet-input"
          type="text"
          required
          pattern=".{1,}"
          title="Tweet must be at least one character long."
          size="70"
         >
         <input type="submit" value="Tweet">
       </form>
     </div>
  `

  function onsubmit (e) {                                              // 2.
    e.preventDefault()                                                 // 3.
    var form = e.currentTarget                                         // 4.
    var body = new FormData(form)                                      // 5.
    console.log('body', body)
    let jsonObject = {};

    for (const [key, value]  of body.entries()) {
        jsonObject[key] = value;
    }
    const content = jsonObject["tweet-input"]
    const atPattern = /\B@[a-z0-9_-]+/gi
    const mentions = content.match(atPattern)
    if (mentions) {
      jsonObject["mentions"] = JSON.stringify(mentions.map(m => {
        console.log('mention', m.substr(1))
        return m.substr(1)
      }))
    } else {
      jsonObject["mentions"] = JSON.stringify([])
    }
    //
    console.log('json outgoing', jsonObject)
    var form_data = new FormData();
    //    
    for ( var key in jsonObject ) {
      console.log('key', key)
      console.log('value', jsonObject[key])
      form_data.append(key, jsonObject[key]);
    }


    state.tweet(form_data)
  }
}




