const Backbone = require("backbone");
const nunjucks = require("nunjucks");
const lodash = require("lodash");

module.exports = Backbone.View.extend({
    "el": "#MainContainer",
    "template": "MainApp.twig",

    // DATA


    events: {
        "paste .CodeMirror": "eventPasteCode"
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

        console.log(CodeMirror.modes);
        CodeMirror.fromTextArea($("#form-json-intrant")[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true
        });

        CodeMirror.fromTextArea($("#form-json-extrant")[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true
        });
    },

    // PUBLIC

    // PRIVATE

    // EVENTS
    eventPasteCode: function (event) {
        let $el = $(event.target).closest(".CodeMirror")[0].CodeMirror;
        let oJSON = JSON.parse(event.originalEvent.clipboardData.getData('text'));
        $el.setValue(JSON.stringify(oJSON, null, "    "));
    }
});