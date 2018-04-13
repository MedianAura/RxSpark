const Backbone = require('backbone');
const nunjucks = require('nunjucks');
const lodash = require('lodash');
const path = require('path');
const {remote} = require('electron');

const MainController = require("./Controller/MainController");

nunjucks.configure(`${path.resolve(__dirname, './View/').replace(/\\/gmi, '/')}/`);

const MainApp = Backbone.View.extend({
    el: 'body',

    // DATA
    oArgs: null,
    oMainController: null,

    events: {},

    initialize: function () {
        this.oArgs = remote.getGlobal('args');
        this.oMainController = new MainController();
    },
    render: function () {
    },

    // PUBLIC


    // PRIVATE


    // EVENTS

});

module.exports = MainApp;
