const Application = require('spectron').Application;
const path = require('path');
const electronPath = require('electron-prebuilt');
const assert = require('assert');

const baseDir = path.join(__dirname, "..", "..");

const sleep = time => new Promise(r => setTimeout(r, time));

let app = new Application({
    path: electronPath,
    args: [baseDir]
});

describe('Application launch', function () {
    this.timeout(30000);

    beforeEach(function () {
        this.app = new Application({
            path: electronPath,
            args: [baseDir]
        });

        return this.app.start()
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    });

    it('shows an initial window', function () {
        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1);
        })
    })
});