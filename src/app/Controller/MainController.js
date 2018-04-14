const Backbone = require("backbone");
const nunjucks = require("nunjucks");
const lodash = require("lodash");
const jetpack = require('fs-jetpack');
const $ = require("jquery");
let CodeMirror = require("codemirror");
require("../../../node_modules/codemirror/mode/javascript/javascript");

module.exports = Backbone.View.extend({
    "el": "#MainContainer",
    "template": "MainApp.twig",

    // DATA
    oIntrant: null,
    oExtrant: null,

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
        this.__buildIntrantCodeMirror();
        this.__buildExtrantCodeMirror();
    },

    // PUBLIC

    // PRIVATE
    __updateJSONValue: function (CodeMirror, oJson) {
        CodeMirror.setValue(JSON.stringify(oJson, null, "    "));
    },
    __buildIntrantCodeMirror: function () {
        this.oIntrant = CodeMirror.fromTextArea($("#form-json-intrant")[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true,
        });

        if (!lodash.isUndefined(this.oIntrant)) {
            this.oIntrant.on("paste", this.eventPasteIntrant.bind(this));
            this.oIntrant.on("drop", this.eventDropIntrant.bind(this));
        }
    },
    __buildExtrantCodeMirror: function () {
        this.oExtrant = CodeMirror.fromTextArea($("#form-json-extrant")[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true,
        });

        if (!lodash.isUndefined(this.oExtrant)) {
            this.oExtrant.on("paste", this.eventPasteIntrant.bind(this));
            this.oExtrant.on("drop", this.eventDragDiable.bind(this));
            this.oExtrant.on("dragstart", this.eventDragDiable.bind(this));
            this.oExtrant.on("dragenter", this.eventDragDiable.bind(this));
            this.oExtrant.on("dragover", this.eventDragDiable.bind(this));
            this.oExtrant.on("dragleave", this.eventDragDiable.bind(this));
        }
    },

    // EVENTS
    eventPasteIntrant: function (CodeMirror, event) {
        try {
            let oJSON = JSON.parse(event.originalEvent.clipboardData.getData('text'));
            this.__updateJSONValue(CodeMirror, oJSON);
        } catch (e) {
            console.error(e);
        }
    },
    eventDropIntrant: function (CodeMirror, event) {
        event.stopPropagation();
        event.preventDefault();
        let aFiles = event.dataTransfer.files;
        if (aFiles.length !== 1) return;

        let sContent = jetpack.read(aFiles[0].path);
        if (lodash.isUndefined(sContent)) return;

        try {
            let oJSON = JSON.parse(sContent);
            this.__updateJSONValue(CodeMirror, oJSON);
        } catch (e) {
            console.error(e);
        }

        return false;
    },
    eventDragDiable: function (CodeMirror, event) {
        event.preventDefault();
        return false;
    },
});