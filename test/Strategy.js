var assert = require('assert'),
    GooglePlusTokenStrategy = require('../').Strategy;

describe('GooglePlusTokenStrategy', function () {
    it('Should has properly name', function () {
        assert.equal(new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function () {
        }).name, 'google-plus-token');
    });

    it('Should properly get profile', function (done) {
        var strategy = new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function () {
        });

        strategy._oauth2.get = function (url, accessToken, done) {
            var body = '';
            done(null, body, null);
        };

        strategy.userProfile('accessToken', function (error, profile) {
            if (error) return done(error);

            assert.equal(profile, '');

            done();
        });
    });
});
