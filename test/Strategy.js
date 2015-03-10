var assert = require('assert'),
    sinon = require('sinon'),
    GooglePlusTokenStrategy = require('../').Strategy;

describe('GooglePlusTokenStrategy', function () {
    var fakeProfile = '{ \
                "kind": "plus#person", \
                "displayName": "Andrew Orel", \
                "name": { \
                    "givenName": "Andrew", \
                    "familyName": "Orel" \
                }, \
                "language": "ru", \
                "isPlusUser": true, \
                "url": "https://plus.google.com/103819813774047251222", \
                "gender": "male", \
                "image": { \
                    "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50", \
                    "isDefault": true \
                }, \
                "cover": { \
                    "coverInfo": { \
                        "leftImageOffset": 0, \
                        "topImageOffset": 0 \
                    }, \
                    "layout": "banner", \
                    "coverPhoto": { \
                        "url": "https://lh6.googleusercontent.com/-pniN3r2yQLg/T9kKcZLL6OI/AAAAAAAAAGo/Y4f1aHE7_SU/s630-fcrop64=1,202a207edf61df80/Waiting%2Bfor%2Bthe%2Btrain.jpg", \
                        "width": 940, \
                        "height": 530 \
                    } \
                }, \
                "etag": "RqKWnRU4WW46-6W3rWhLR9iFZQM/11fX3H7BaFuN8d-tTOWDtRjjMw0", \
                "ageRange": { \
                    "min": 21 \
                }, \
                "verified": false, \
                "circledByCount": 4, \
                "id": "103819813774047251222", \
                "objectType": "person" \
            }';

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

    it('Should properly throw exceptions', function () {
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
        });
    });
});
