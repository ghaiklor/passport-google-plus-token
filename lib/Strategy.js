var util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

util.inherits(GooglePlusTokenStrategy, OAuth2Strategy);

function GooglePlusTokenStrategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://accounts.google.com/o/oauth2/auth';
    options.tokenURL = options.tokenURL || 'https://accounts.google.com/o/oauth2/token';

    OAuth2Strategy.call(this, options, verify);

    this.name = 'google-plus-token';
    this._passReqToCallback = options.passReqToCallback;
    this._oauth2._useAuthorizationHeaderForGET = true;
}

GooglePlusTokenStrategy.prototype.authenticate = function (req, options) {
    var self = this,
        accessToken = (req.body && req.body.access_token) || req.query.access_token || req.headers.access_token,
        refreshToken = (req.body && req.body.refresh_token) || req.query.refresh_token || req.headers.refresh_token;

    if (!accessToken) {
        return self.fail({message: 'You should provide access_token'});
    }

    self._loadUserProfile(accessToken, function (error, profile) {
        if (error) return self.error(error);

        function verified(error, user, info) {
            if (error) return self.error(error);
            if (!user) return self.fail(info);

            return self.success(user, info);
        }

        if (self._passReqToCallback) {
            self._verify(req, accessToken, refreshToken, profile, verified);
        } else {
            self._verify(accessToken, refreshToken, profile, verified);
        }
    });
};

GooglePlusTokenStrategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get('https://www.googleapis.com/plus/v1/people/me', accessToken, function (error, body, res) {
        if (error) return done(new InternalOAuthError('Failed to fetch user profile', error));

        try {
            var json = JSON.parse(body),
                profile = {
                    provider: 'google-plus',
                    id: json.id,
                    displayName: json.displayName,
                    name: {
                        familyName: json.name.familyName,
                        givenName: json.name.givenName
                    },
                    gender: json.gender,
                    photos: [{
                        value: json.image.url
                    }]
                };

            done(null, profile);
        } catch (e) {
            done(e);
        }
    });
};

module.exports = GooglePlusTokenStrategy;
