'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passportOauth = require('passport-oauth');

var _openid = require('./profile/openid');

var _openid2 = _interopRequireDefault(_openid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * `Strategy` constructor.
 * The Google Plus authentication strategy authenticates requests by delegating to Google Plus using OAuth2 access tokens.
 * Applications must supply a `verify` callback which accepts a accessToken, refreshToken, profile and callback.
 * Callback supplying a `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occurs, `error` should be set.
 *
 * Options:
 * - clientID          Identifies client to Google App
 * - clientSecret      Secret used to establish ownership of the consumer key
 * - passReqToCallback If need, pass req to verify callback
 *
 * @param {Object} _options
 * @param {Function} _verify
 * @constructor
 * @example
 * passport.use(new GoogleTokenStrategy({
 *   clientID: '123456789',
 *   clientSecret: 'shhh-its-a-secret'
 * }), function(req, accessToken, refreshToken, profile, next) {
 *   User.findOrCreate({googleId: profile.id}, function(error, user) {
 *     next(error, user);
 *   });
 * });
 */
var GoogleTokenStrategy = function (_OAuth2Strategy) {
  _inherits(GoogleTokenStrategy, _OAuth2Strategy);

  function GoogleTokenStrategy(_options, _verify) {
    _classCallCheck(this, GoogleTokenStrategy);

    var options = _options || {};
    var verify = _verify;

    options.authorizationURL = options.authorizationURL || 'https://accounts.google.com/o/oauth2/v2/auth';
    options.tokenURL = options.tokenURL || 'https://www.googleapis.com/oauth2/v4/token';

    var _this = _possibleConstructorReturn(this, (GoogleTokenStrategy.__proto__ || Object.getPrototypeOf(GoogleTokenStrategy)).call(this, options, verify));

    _this.name = 'google-plus-token';
    _this._accessTokenField = options.accessTokenField || 'access_token';
    _this._refreshTokenField = options.refreshTokenField || 'refresh_token';
    _this._profileURL = options.profileURL || 'https://www.googleapis.com/oauth2/v3/userinfo';
    _this._passReqToCallback = options.passReqToCallback;

    _this._oauth2.useAuthorizationHeaderforGET(true);
    return _this;
  }

  /**
   * Authenticate method
   * @param {Object} req
   * @param {Object} options
   * @returns {*}
   */


  _createClass(GoogleTokenStrategy, [{
    key: 'authenticate',
    value: function authenticate(req, options) {
      var _this2 = this;

      var accessToken = req.body && req.body[this._accessTokenField] || req.query && req.query[this._accessTokenField];
      var refreshToken = req.body && req.body[this._refreshTokenField] || req.query && req.query[this._refreshTokenField];

      if (!accessToken) return this.fail({ message: 'You should provide ' + this._accessTokenField });

      this._loadUserProfile(accessToken, function (error, profile) {
        if (error) return _this2.error(error);

        var verified = function verified(error, user, info) {
          if (error) return _this2.error(error);
          if (!user) return _this2.fail(info);

          return _this2.success(user, info);
        };

        if (_this2._passReqToCallback) {
          _this2._verify(req, accessToken, refreshToken, profile, verified);
        } else {
          _this2._verify(accessToken, refreshToken, profile, verified);
        }
      });
    }

    /**
     * Parse user profile
     * @param {String} accessToken Google OAuth2 access token
     * @param {Function} done
     */

  }, {
    key: 'userProfile',
    value: function userProfile(accessToken, done) {
      this._oauth2.get(this._profileURL, accessToken, function (error, body, res) {
        if (error) {
          try {
            var errorJSON = JSON.parse(error.data);
            return done(new _passportOauth.InternalOAuthError(errorJSON.error.message, errorJSON.error.code));
          } catch (_) {
            return done(new _passportOauth.InternalOAuthError('Failed to fetch user profile', error));
          }
        }
        var json = void 0;
        try {
          json = JSON.parse(body);
        } catch (ex) {
          return done(new Error('Failed to parse user profile'));
        }

        try {
          var profile = (0, _openid2.default)(json);
          profile._raw = body;
          profile._json = json;

          return done(null, profile);
        } catch (e) {
          return done(e);
        }
      });
    }
  }]);

  return GoogleTokenStrategy;
}(_passportOauth.OAuth2Strategy);

exports.default = GoogleTokenStrategy;
module.exports = exports['default'];