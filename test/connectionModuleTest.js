var assert = require('chai').assert;
// es necesario haber instalado chai en package.json desarrollo
var connectionModule = require('./../scripts/connection');
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

describe('connect server', function() {
    var express = require('express');
    var app = express();
    var http = require('http');
    var server = http.createServer(app);

    after(function(done) {
        done();
        server.close();
    });
    
    it('set connection', function (done, error) {
        connectionModule.executeServerConnection(server);
        assert.ifError(error);
        done();
    });
});

describe('connect mongo', function() {


    after(function(done) {
        done();
    });
    
    it('set connection with mongoDB', function (done) {
        assert.equal(connectionModule.getDDBB(), undefined);
        connectionModule.executeDDBBConnection();
        assert.equal(connectionModule.getDDBB(), !undefined);
    });
});
