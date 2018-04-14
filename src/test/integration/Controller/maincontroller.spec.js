const Application = require('spectron').Application;
const path = require('path');
const electronPath = require('electron-prebuilt');
const assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const baseDir = path.join(__dirname, "..", "..", "..");

const sleep = time => new Promise(r => setTimeout(r, time));

let app = new Application({
    path: electronPath,
    args: [baseDir]
});

describe('MainController', function () {
    this.timeout(30000);

    before(() => {
        require("../../helper/runner")();
    });

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

    it('Intrant area should be empty.', async function () {
        await this.app.client.waitUntilWindowLoaded();

        let CodeMirror = await this.app.client.element('//*[@id="CodeMirror-Intrant"]');

        let result = await this.app.client.execute(function(DomElement, value) {
            return DomElement.CodeMirror.getValue();
        }, CodeMirror.value, "BOB");

        assert.isEmpty(result.value);
    });

    it('Intrant area should be contain an intrant.', async function () {
        await this.app.client.waitUntilWindowLoaded();

        let CodeMirror = await this.app.client.element('//*[@id="CodeMirror-Intrant"]');

        let result = await this.app.client.execute(function(DomElement, value) {
            DomElement.CodeMirror.setValue(value);
            return DomElement.CodeMirror.getValue();
        }, CodeMirror.value, '{"bob": 1}');

        assert.equal(result.value, '{"bob": 1}');
    });
});