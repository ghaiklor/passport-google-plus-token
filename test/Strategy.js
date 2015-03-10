var assert = require('assert'),
    sinon = require('sinon'),
    GooglePlusTokenStrategy = require('../'),
    fakeProfile = require('./data/profile.json');

describe('GooglePlusTokenStrategy', function () {
    it('Should properly export Strategy constructor', function () {
        assert.equal(typeof GooglePlusTokenStrategy, 'function');
        assert.equal(typeof GooglePlusTokenStrategy.Strategy, 'function');
        assert.equal(GooglePlusTokenStrategy, GooglePlusTokenStrategy.Strategy);
    });

    it('Should properly initialize', function () {
        var strategy = new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function () {
        });

        assert.equal(strategy.name, 'google-plus-token');
        assert(strategy._oauth2._useAuthorizationHeaderForGET);
    });

    it('Should properly fetch profile', function (done) {
        var strategy = new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function (accessToken, refreshToken, profile, next) {
            next(null, profile, null);
        });

        strategy._oauth2.get = function (url, accessToken, done) {
            done(null, fakeProfile, null);
        };

        strategy.userProfile('accessToken', function (error, profile) {
            if (error) return done(error);

            assert.equal(profile.provider, 'google-plus');
            assert.equal(profile.id, '103819813774047251222');
            assert.equal(profile.displayName, 'Andrew Orel');
            assert.equal(profile.name.familyName, 'Orel');
            assert.equal(profile.name.givenName, 'Andrew');
            assert.equal(profile.photos[0].value, 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50');

            done();
        });
    });

    it('Should properly throw exceptions', function (done) {
        var strategy = new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function () {
        });

        strategy._oauth2.get = function (url, accessToken, done) {
            done(null, 'not a JSON', null);
        };

        strategy.userProfile('accessToken', function (error, profile) {
            assert(error instanceof SyntaxError);
            assert.equal(typeof profile, 'undefined');
            done();
        });
    });
});
