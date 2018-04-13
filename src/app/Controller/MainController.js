const Backbone = require("backbone");
const nunjucks = require("nunjucks");
const lodash = require("lodash");

module.exports = Backbone.View.extend({
    "el": "#MainContainer",
    "template": "MainApp.twig",

    // DATA


    events: {

    },

    initialize: function () {
        this.oCurrentCriteria = null;

        // // Ensure our methods keep the `this` reference to the view itself
        // lodash.bindAll(this, 'renderList');
        //
        // // Bind collection changes to re-rendering
        // this.oListCriteria.on('change', this.renderList);
        // this.oListCriteria.on('reset', this.renderList);
        // this.oListCriteria.on('add', this.renderList);
        // this.oListCriteria.on('remove', this.renderList);

        this.render();
    },
    render: function () {
        this.$el.html(nunjucks.render(this.template));
    },

    // PUBLIC

    // PRIVATE

    // EVENTS

});