import React, { Component } from 'react';
import queryString from 'query-string';
import fetch from 'node-fetch';
import loading from './loading.svg';
import './App.css';

const queryParams = queryString.parse(location.search);

const APPLICATION_ID = queryParams.application_id;
const SCOPE = queryParams.scope || 'public_profile';
const ACCOUNT_LINKING_TOKEN = queryParams.account_linking_token;
const AUTHORIZATION_CODE_URI = queryParams.authorization_code_uri;
const REDIRECT_URI = queryParams.redirect_uri;

class App extends Component {

  constructor() {
    super(...arguments);

    this._loginFailure = this._loginFailure.bind(this);
    this._loginSuccess = this._loginSuccess.bind(this);
  }

  _loginFailure() {
    window.location = `${REDIRECT_URI}?account_linking_token=${ACCOUNT_LINKING_TOKEN}`;
  }

  _loginSuccess(authorizationCode) {
    window.location = `${REDIRECT_URI}?account_linking_token=${ACCOUNT_LINKING_TOKEN}&authorization_code=${authorizationCode}`;
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      let FB = window.FB;

      FB.init({
        appId      : APPLICATION_ID,
        cookie     : true,
        version    : 'v2.5'
      });

      FB.login((response) => {
        if (response.authResponse) {
          fetch(AUTHORIZATION_CODE_URI, {
            method: 'POST',
            body: JSON.stringify({
              accountLinkingToken: ACCOUNT_LINKING_TOKEN,
              authResponse
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
        <img
          className="App-loading"
          alt="Loading"
          src={loading}
        />
      </div>
    );
  }
}

export default App;
