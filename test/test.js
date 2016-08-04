var assert = require('chai').assert;
// es necesario haber instalado chai en package.json desarrollo
//var main = require('./../scripts/web-server');
var usersModule = require('./../scripts/modules/users');
var mongodb = require('mongodb');
var uri = 'mongodb://localhost:27017/movies';

connect = function(callback) {
    mongodb.MongoClient.connect(uri, callback);
    console.log('connection done');
};

describe('prueba', function() {
    after(function(done) {
        done();
    });
    it('suma', function () {
        assert.equal(3, 3);
    });
});

describe('create user Model', function() {
    it('create a user model', function (done) {
        usersModule.createUserModel();
        assert.ifError(error);
    });
});

describe('user interface', function() {
    before(function(done) {
        connect(function (error, conn) {
            if (error) {
                return done(error);
            }
        });
    });

    beforeEach(function(done) {
        usersModule.createUserModel();
    });

    it('log in', function (done) {
        var user = { name: 'Paco', password: '1234' };
        dbInterface.insert(db, doc, function (error) {
            assert.ifError(error);
            db.collection('movies').count({ title: 'Rogue One' }, function (error, c) {
                assert.ifError(error);
                assert.equal(c, 1);
                done();
            });
        });
    });
});
