const Backbone = require("backbone");
const nunjucks = require("nunjucks");
const lodash = require("lodash");
const jetpack = require('fs-jetpack');
const $ = require("jquery");
const {clipboard} = require('electron').remote;

let CodeMirror = require("codemirror");
require("../../../node_modules/codemirror/mode/javascript/javascript");

module.exports = Backbone.View.extend({
    "el": "#MainContainer",
    "template": "MainApp.twig",

    // DATA
    oIntrant: null,
    oExtrant: null,

    events: {
        "click .btn-copy": "eventClickCopyBtnIntrant",
        "click .btn-paste": "eventClickPasteBtnIntrant",
        "click .btn-empty": "eventClickClearBtnIntrant",
    },

    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(nunjucks.render(this.template));
        this.__buildIntrantCodeMirror();
        this.__buildExtrantCodeMirror();
    },

    // PUBLIC

    // PRIVATE
    __readJSONFile: function (sFilePath) {
        let sContent = jetpack.read(sFilePath);
        if (lodash.isUndefined(sContent)) return null;
        return sContent;
    },
    __updateJSONValue: function (CodeMirror, oJson) {
        if (lodash.isNull(oJson)) return;
        CodeMirror.setValue(JSON.stringify(oJson, null, "    "));
    },
    __ConvertTextToJSON: function (sText) {
        if (lodash.isNull(sText)) return null;
        try {
            return JSON.parse(sText);
        } catch (e) {
            return null;
        }
    },
    __buildIntrantCodeMirror: function () {
        let $el = $("#form-json-intrant");
        this.oIntrant = CodeMirror.fromTextArea($el[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true,
        });

        $el.next(".CodeMirror").prop("id", "CodeMirror-Intrant");
        this.oIntrant.on("paste", this.eventPasteIntrant.bind(this));
        this.oIntrant.on("drop", this.eventDropIntrant.bind(this));
    },
    __buildExtrantCodeMirror: function () {
        let $el = $("#form-json-extrant");
        this.oExtrant = CodeMirror.fromTextArea($el[0], {
            lineNumbers: true,
            mode: "javascript",
            smartIndent: true,
            tabSize: 4,
            foldGutter: true,
        });

        this.oExtrant.on("paste", this.eventPasteIntrant.bind(this));
        this.oExtrant.on("drop", this.eventDragDisable.bind(this));
        this.oExtrant.on("dragstart", this.eventDragDisable.bind(this));
        this.oExtrant.on("dragenter", this.eventDragDisable.bind(this));
        this.oExtrant.on("dragover", this.eventDragDisable.bind(this));
        this.oExtrant.on("dragleave", this.eventDragDisable.bind(this));
    },

    // EVENTS
    eventPasteIntrant: function (CodeMirror, event) {
        event.preventDefault();
        this.__updateJSONValue(CodeMirror, this.__ConvertTextToJSON(event.clipboardData.getData('text')));
        return false;
    },
    eventDropIntrant: function (CodeMirror, event) {
        event.stopPropagation();
        event.preventDefault();
        let aFiles = event.dataTransfer.files;
        if (aFiles.length !== 1) return;

        let sContent = this.__readJSONFile(aFiles[0].path);

        this.__updateJSONValue(CodeMirror, this.__ConvertTextToJSON(sContent));

        return false;
    },
    eventDragDisable: function (CodeMirror, event) {
        event.preventDefault();
        return false;
    },
    eventClickCopyBtnIntrant: function () {
        let sText = this.oIntrant.getValue();
        if (lodash.isEmpty(sText.trim())) return false;
        clipboard.writeText(sText, "text");
    },
    eventClickPasteBtnIntrant: function () {
        let sText = this.oIntrant.getValue();
        if (!lodash.isEmpty(sText.trim())) return false;
        this.__updateJSONValue(this.oIntrant, this.__ConvertTextToJSON(clipboard.readText("text")));
    },
    eventClickClearBtnIntrant: function () {
        this.oIntrant.setValue("");
    },
});