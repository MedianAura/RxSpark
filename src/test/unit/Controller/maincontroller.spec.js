let assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('#MainController', function () {
    let MainController;
    let oMainCtrl;

    before(() => {
        require("../../helper/runner")();
        window.$("body").html(window.$("<div/>", {"id": "MainContainer"}));
        MainController = require("../../../app/Controller/MainController");
    });

    beforeEach(() => {
        oMainCtrl = new MainController();
    });

    it('Something', function () {
        assert.equal(3, '3');
    })
});