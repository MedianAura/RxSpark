const Backbone = require('backbone');
const nunjucks = require('nunjucks');
const lodash = require('lodash');
const path = require('path');
const YAML = require('js-yaml');
const jetpack = require('fs-jetpack');
const remote = require('electron').remote;
const {dialog} = require('electron').remote;

const MainController = require('./Controller/MainController');
const PreviewController = require('./Controller/PreviewController');
const RedmineController = require('./Controller/RedmineController');
const Criteria = require('./Model/Criteria');

nunjucks.configure(`${path.resolve(__dirname, './View/').replace(/\\/gmi, '/')}/`);

const MainApp = Backbone.View.extend({
    el: 'body',

    // DATA•
    oArgs: null,
    oMainCtrl: null,
    oPreviewCtrl: null,
    oRedmineCtrl: null,

    events: {
        'click .btnEditor': 'eventClickBtnEditor',
        'click .btnPreview': 'eventClickBtnPreview',
        'click .btnRedmine': 'eventClickBtnRedmine',
        'click .btnNew': 'eventClickBtnNew',
        'click .btnOpen': 'eventClickBtnOpen',
        'click .btnSave': 'eventClickBtnSave',
        'click .btnImport': 'eventClickBtnImport',
        'click #ImportModal .btn-primary': 'eventClickImportModal',
    },

    initialize() {
        this.oArgs = remote.getGlobal('args');
        this.oMainCtrl = new MainController();
        this.oPreviewCtrl = new PreviewController();
        this.oRedmineCtrl = new RedmineController();
        this.showEditor();
    },
    render() {
    },

    // PUBLIC
    showEditor() {
        this.$el.find('.app-container-panel').hide();
        this.oMainCtrl.$el.show();
    },
    showPreview() {
        this.$el.find('.app-container-panel').hide();

        this.oPreviewCtrl.setModel(this.oMainCtrl.oListCriteria);
        this.oPreviewCtrl.$el.show();
    },
    showRedmine() {
        this.$el.find('.app-container-panel').hide();

        this.oRedmineCtrl.setModel(this.oMainCtrl.oListCriteria);
        this.oRedmineCtrl.$el.show();
    },

    // PRIVATE
    __changeActiveLink($el) {
        this.$el.find('.rx-main-navbar').find('li').removeClass('active');
        $el.addClass('active');
    },
    __parseLoadedData(sData) {
        const aListCriteria = [];
        const oData = YAML.safeLoad(sData);
        lodash.each(oData, (item) => {
            const oCriteria = new Criteria();
            oCriteria.set('given', item.given);
            oCriteria.set('when', item.when);
            oCriteria.set('then', item.then);
            aListCriteria.push(oCriteria);
        });
        this.oMainCtrl.oListCriteria.reset(aListCriteria);
        this.oPreviewCtrl.setModel(this.oMainCtrl.oListCriteria);
    },

    // EVENTS
    eventClickBtnEditor(event) {
        $(event.target).blur();
        const $el = $(event.target).closest('li');
        this.showEditor();
        this.__changeActiveLink($el);
    },
    eventClickBtnPreview(event) {
        $(event.target).blur();
        const $el = $(event.target).closest('li');
        this.showPreview();
        this.__changeActiveLink($el);
    },
    eventClickBtnRedmine(event) {
        $(event.target).blur();
        const $el = $(event.target).closest('li');
        this.showRedmine();
        this.__changeActiveLink($el);
    },
    eventClickBtnNew(event) {
        $(event.target).blur();
        this.oMainCtrl.oListCriteria.reset();
        this.oMainCtrl.oEditorCtrl.setCriteria(null);
        this.oMainCtrl.addCriteria();
    },
    eventClickBtnOpen(event) {
        $(event.target).blur();
        const sFile = dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openFile', 'promptToCreate'],
            filters: [
                {name: 'Fichier YAML', extensions: ['yaml']},
            ],
        });

        if (sFile.length > 0) {
            const sData = jetpack.read(sFile[0]);
            this.__parseLoadedData(sData);
        }
    },
    eventClickBtnSave(event) {
        $(event.target).blur();
        const sFile = dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                {name: 'Fichier YAML', extensions: ['yaml']},
            ],
        });

        jetpack.write(sFile, YAML.safeDump(this.oMainCtrl.oListCriteria.toJSON()));
    },
    eventClickBtnImport(event) {
        $(event.target).blur();
        this.$el.find('#form-import-data').val('');
        $('#ImportModal').modal('show');
    },
    eventClickImportModal() {
        const sData = this.$el.find('#form-import-data').val();
        $('#ImportModal').modal('hide');
        this.$el.find('#form-import-data').val('');
        this.__parseLoadedData(sData);
    },
});

module.exports = MainApp;
