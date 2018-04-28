const html = require('choo/html')

module.exports = function renderSearchBar (state, emit) {
  state.searchTerm = ''
  return html`
    <div id="search-bar">
      <textarea rows="1" style="box-sizing: border-box;" maxlength="160" columns="80" type="text" oninput=${updateSearchTerm}>${state.searchTerm}</textarea>
      <button style="margin-left:15px; position: absolute;" onclick=${onSubmit}>Search</button>
    </div>
  `

  function updateSearchTerm(e) {
    state.searchTerm = e.target.value
  }

  function onSubmit(e) {
    console.log('term', state.searchTerm)
    const term = state.searchTerm
    if (term.match(/\B@[a-z0-9_-]+/gi)) {
      emit('pushState', '/user-search/' + term.substr(1))
    } else {
      emit('pushState', '/tweet-search/' + term)
    }
  }
}
