var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var http = require('http');
var proxy = require('express-http-proxy');
var middleProxy = require('http-proxy-middleware');
var fs = require('fs');

app.use(express.static(__dirname + '/',{ maxAge: 1000 }));

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
    extended: true
}));
//var cors = require('cors')

//app.use(cors())

var nodeIdsProxy = proxy('public.ndexbio.org/network/networkid/aspect/nodes', {
    forwardPath: function (req, res) {
        console.log(req.originalUrl);
        return require('url').parse(req.originalUrl).path;
    },
    decorateRequest: function(proxyReq, originalReq) {
        console.log("proxy aspects");
        proxyReq.headers['Content-Type'] = 'application/json';
        return proxyReq;
    }
});

var plansProxy = proxy('localhost:8183/plans', {
    forwardPath: function (req, res) {
        return require('url').parse(req.originalUrl).path;
    },
    decorateRequest: function(proxyReq, originalReq) {
        proxyReq.headers['Content-Type'] = 'application/json';
        return proxyReq;
    }
});

var templatesProxy = proxy('localhost:8183/templates', {
    forwardPath: function (req, res) {
        return require('url').parse(req.originalUrl).path;
    },
    decorateRequest: function(proxyReq, originalReq) {
        proxyReq.headers['Content-Type'] = 'application/json';
        return proxyReq;
    }
});

app.get('/getMessage/:myMessage', function(req, res) {
    //=======================================
    // USED FOR MONITORING SERVICE (UP TIME)
    //=======================================
    var myMessage = req.params.myMessage;
    res.send(myMessage);
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/upload', middleProxy({target: 'http://localhost:8183', changeOrigin: false, ws: true}));

app.use("/plans", plansProxy);

app.use("/templates", templatesProxy);

app.use("/v2/network/*", nodeIdsProxy);

console.log("Ready...");

app.listen(3000)
