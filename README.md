# passport-google-plus-token

[Passport](http://passportjs.org/) strategies for authenticating with Google Plus OAuth2 access tokens.

This module lets you authenticate using Google Plus in your Node.js applications by access tokens.
By plugging into Passport, Google Plus authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Installation

```shell
npm install passport-google-plus-token
```

## Usage

### Configure Strategy

The Google Plus authentication strategy authenticates users using a Google Plus account and OAuth2 access tokens.
The strategy requires a `verify` callback, which accepts accessToken, refreshToken, profile and calls `done` providing a user, as well as `options` specifying a clientID and clientSecret.

```javascript
passport.use(new GooglePlusTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next) {
    User.findOrCreate({'google.id': profile.id}, function(error, user) {
        return next(error, user);
    });
}));
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `google-plus-token` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.get('/auth/google', passport.authenticate('google-plus-token'));
```

Or if you are using Sails framework:

```javascript
// AuthController.js
module.exports = {
    google: function(req, res) {
        passport.authenticate('google-plus-token', function(error, user, info) {
            if (error) return res.serverError(error);
            if (info) return res.unauthorized(info);
            return res.ok(user);
        })(req, res);
    }
};
```

### Parameters in request

Based on examples above, you should have route `auth/google`.
This route accepts 2 parameters: `access_token` and `refresh_token`.

`access_token` is REQUIRED.

## Issues

If you receive a `401 Unauthorized` error, it is most likely because you have wrong access token or not yet specified any application "Permissions".
Once you refresh access token with new permissions, try to send this access token again.

## License

The MIT License (MIT)

Copyright (c) 2015 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
