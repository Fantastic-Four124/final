const html = require('choo/html')
const renderLogoutButton = require('./logout-btn')
const renderSearchBar = require('./search-bar')

module.exports = function renderNavbar (state, emit) {

  return html`
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a class="navbar-brand" href="/">nanoTwitter</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      ${state.loggedIn ? html`
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${state.mainUser.username}
              </a>
            </li>
            <li>
               ${renderSearchBar(state, emit)}
            </li>
          </ul>
          ${renderLogoutButton(state, emit)}
        </div>
      ` : ''}
    </nav>
  `
}

