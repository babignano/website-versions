// shell: phantomjs --webdriver=9134
// Investigate how to auto run and close the above?

var port = 9134,
    pdiff = './bin/pdiff/perceptualdiff',
    wd = require('wd'), // npm install wd
    assert = require('assert'), // npm install -g mocha
    spawn = require('child_process').spawn,
    browser = wd.promiseRemote('localhost', port),
    phantom;

var runTests = function () {

    browser.init({
        browserName:'phantomjs', 
        tags : ["examples"], 
        name: "This is an example test"

    }).then(function () {
        return browser.get("http://www.dailytelegraph.com.au?sopsads=false");

    }).then(function (o) {
        console.log(o);
        return browser.title();

    }).then(function (title) {
        console.log(title);
        return browser.eval("window.location.href");

    }).fin(function (o) {
        console.log(o);
        browser.quit();
        console.log("Killing phantom ghost driver");
        phantom.kill();

    }).done();
};

// Spin up phantomjs
phantom = spawn('phantomjs', ['--webdriver=9134']);

phantom.on('close', function (code) {
    // console.log('child process exited with code ' + code);
});

phantom.stdout.on('data', function (data) {

    console.log(data.toString());

    // Spy for "Ghost Driver running on port <port>"
    if (data.toString().indexOf(port) !== -1) {
        runTests();
    }
});

phantom.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});
