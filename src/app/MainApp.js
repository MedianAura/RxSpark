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

    events: {
    },

    initialize: function () {
        this.oArgs = remote.getGlobal('args');
        this.oMainController = new MainController();

        document.addEventListener('dragstart', function (event) {
            event.preventDefault();
            event.dataTransfer.effectAllowed = "none";
            return false;
        });
        document.addEventListener('dragenter', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "none";
            return false;
        });
        document.addEventListener('dragover', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "none";
            return false;
        });
        document.addEventListener('drop', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "none";
            return false;
        });
    },

    // PUBLIC

    // PRIVATE

    // EVENTS
});

module.exports = MainApp;
