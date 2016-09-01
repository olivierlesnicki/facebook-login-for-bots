import 'whatwg-fetch';
import React, { Component } from 'react';
import queryString from 'query-string';
import loading from './loading.svg';
import './App.css';

const params = queryString.parse(location.search);

const ACCOUNT_LINKING_TOKEN = params.account_linking_token;
const APPLICATION_ID = params.application_id;
const AUTHORIZATION_CODE_URI = params.authorization_code_uri;
const REDIRECT_URI = params.redirect_uri;
const SCOPE = params.scope || 'public_profile';

class App extends Component {

  constructor() {
    super(...arguments);

    this._login = this._login.bind(this);
    this._loginFailure = this._loginFailure.bind(this);
    this._loginSuccess = this._loginSuccess.bind(this);
  }

  _loginFailure() {
    window.location = `${REDIRECT_URI}?account_linking_token=${ACCOUNT_LINKING_TOKEN}`;
  }

  _loginSuccess(authorizationCode) {
    window.location = `${REDIRECT_URI}?account_linking_token=${ACCOUNT_LINKING_TOKEN}&authorization_code=1`;
  }

  _login() {
    let FB = window.FB;

    FB.login((response) => {
      if (response.authResponse) {
        fetch(AUTHORIZATION_CODE_URI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountLinkingToken: ACCOUNT_LINKING_TOKEN,
            authResponse: response.authResponse
          })
        })
          .then(res => {
            if (res.status >= 200 && res.status < 300) {
              return res.json();
            } else {
              let error = new Error(res.statusText || res.status);
              error.response = res;
              throw error;
            }
          })
          .then(json => {
            this._loginSuccess(json.authorizationCode);
          }, this._loginFailure);
      } else {
        this._loginFailure();
      }
    }, {scope: SCOPE});
  }

  componentDidMount() {
    window.fbAsyncInit = () => {
      let FB = window.FB;

      FB.init({
        appId      : APPLICATION_ID,
        cookie     : true,
        version    : 'v2.5'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  render() {
    return (
      <div className="App">
        <button onClick={this._login}>
          Login with Facebook
        </button>
      </div>
    );
  }
}

export default App;
