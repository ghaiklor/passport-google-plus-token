var chai = require('chai'),
    assert = chai.assert,
    GooglePlusTokenStrategy = require('../'),
    fakeProfile = JSON.stringify(require('./fixtures/profile.json'));

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

    describe('GooglePlusTokenStrategy:authenticate', function () {
        var strategy,
            user,
            info;

        before(function (done) {
            strategy = new GooglePlusTokenStrategy({
                clientID: '123',
                clientSecret: '123'
            }, function (accessToken, refreshToken, profile, next) {
                if (accessToken == 'access_token' && refreshToken == 'refresh_token') {
                    return next(null, profile, {info: 'foo'});
                }

                return next(null, false, null);
            });

            strategy._oauth2.get = function (url, accessToken, done) {
                done(null, fakeProfile, null);
            };

            chai.passport.use(strategy)
                .success(function (u, i) {
                    user = u;
                    info = i;
                    done();
                })
                .req(function (req) {
                    req.headers = {
                        access_token: 'access_token',
                        refresh_token: 'refresh_token'
                    }
                })
                .authenticate({});
        });

        it('Should properly respond with profile', function () {
            assert.typeOf(user, 'object');
            assert.typeOf(info, 'object');
            assert.deepEqual(info, {info: 'foo'});
        });
    });

    it('Should properly fetch profile', function (done) {
        var strategy = new GooglePlusTokenStrategy({
            clientID: '123',
            clientSecret: '123'
        }, function (accessToken, refreshToken, profile, next) {
            next(null, profile, null);
        });

        strategy._oauth2.get = function (url, accessToken, next) {
            next(null, fakeProfile, null);
        };

        strategy.userProfile('accessToken', function (error, profile) {
            if (error) return done(error);

            assert.equal(profile.provider, 'google-plus');
            assert.equal(profile.id, '103819813774047251222');
            assert.equal(profile.displayName, 'Andrew Orel');
            assert.equal(profile.name.familyName, 'Orel');
            assert.equal(profile.name.givenName, 'Andrew');
            assert.deepEqual(profile.emails, []);
            assert.equal(profile.photos[0].value, 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50');
            assert.equal(typeof profile._raw, 'string');
            assert.equal(typeof profile._json, 'object');

            done();
        });
    });

    it('Should properly handle exception on fetching profile', function (done) {
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
