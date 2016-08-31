## Usage

### Application Settings (Basic)

For this to work you need to add `facebook-login-for-bots.herokuapp.com` in your App Domains.

### Account Linking Authentication callback URL

When setting up the [Account Linking call-to-action](https://developers.facebook.com/docs/messenger-platform/account-linking/link-account), use the following Authentication callback URL:

```
https://facebook-login-for-bots.herokuapp.com
  ?application_id=
  &authorization_code_uri=
  &scope=
```

| Parameter | Description |
| --- | --- |
| application_id | The app ID of the application you want your user to authenticate with. Most of the time this will be the application you've created for the bot. |
| authorization_code_uri | The Facebook authentication data (authResponse) will be sent via a `POST` request to this `URI`. A unique server made authorization code for this user must be returned in the body of the response. |
| scope | A comma separated list of Facebook permissions you want the user to grant to your application.
 |
