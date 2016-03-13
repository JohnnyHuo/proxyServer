"use strict";

let http = require('http')
let request = require('request')
let argv = require('yargs').argv
//url
let scheme = 'http://'
let localhost = '127.0.0.1'
let host = argv.host || localhost
let port = argv.port || (host === localhost ? 8000 : 80)
let destinationUrl = argv.url || scheme  + host + ':' + port
//log
let fs = require('fs')
let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout

//echo Server
let echoServer = http.createServer((req, res) => {
    logStream.write('Echo server working...\n')
    logStream.write('Request headers: ' + JSON.stringify(req.headers) + '\n')
    for(let header in req.headers){
        res.setHeader(header, req.headers[header])
    }
    req.pipe(res)
})
echoServer.listen(8000)

//Proxy Server
let proxyServer = http.createServer((req, res) => {
    logStream.write('Proxy server working...\n')
    logStream.write('Request headers: ' + JSON.stringify(req.headers) + '\n')

    let url = destinationUrl

    if(req.headers['x-destination-url']){
        url = 'http://' + req.headers['x-destination-url']
    }
    logStream.write('Proxy url is: ' + url + '\n')

    let options = {
        url: url + req.url
    }
    req.pipe(request(options)).pipe(res)
})
proxyServer.listen(9000)