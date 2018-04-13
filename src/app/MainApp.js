const Backbone = require('backbone');
const nunjucks = require('nunjucks');
const lodash = require('lodash');
const path = require('path');
const {remote} = require('electron');

nunjucks.configure(`${path.resolve(__dirname, './View/').replace(/\\/gmi, '/')}/`);

const MainApp = Backbone.View.extend({
    el: 'body',

    // DATA•
    oArgs: null,

    events: {},

    initialize: function () {
        this.oArgs = remote.getGlobal('args');
    },
    render: function () {
    },

    // PUBLIC


    // PRIVATE


    // EVENTS

});

module.exports = MainApp;
