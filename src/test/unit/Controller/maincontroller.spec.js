let assert = require('chai').assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const oTestIntrantText = '{"bob": "test"}';
const oTestIntrant = JSON.parse(oTestIntrantText);

let clipboardMock = {
    "data": null,
    "electron": {
        "remote": {
            "clipboard": {
                writeText: function (text) {
                    this.data = text;
                },
                readText: function () {
                    return this.data;
                },
            }
        }
    }
};

describe('#MainController', function () {
    let MainController;
    let oMainCtrl;

    before(() => {
        require("../../helper/runner")();
        window.$("body").html(window.$("<div/>", {"id": "MainContainer"}));
        MainController = proxyquire("../../../app/Controller/MainController", clipboardMock);
    });

    beforeEach(() => {
        oMainCtrl = new MainController();
    });

    describe('#__updateJSONValue', function () {
        it('When I send data to the function __updateJSONValue should update the Intrant with the JSON', function () {
            oMainCtrl.__updateJSONValue(oMainCtrl.oIntrant, oTestIntrant);
            assert.equal(oMainCtrl.oIntrant.getValue(), JSON.stringify(oTestIntrant, null, '    '));
        });
    });

    describe('#__ConvertTextToJSON', function () {
        it('When I send valid JSON to the function should not be null', function () {
            let result = oMainCtrl.__ConvertTextToJSON(oTestIntrantText);
            assert.isNotNull(result, oTestIntrant);
        });

        it('When I send valid JSON to the function it return a JSON', function () {
            let result = oMainCtrl.__ConvertTextToJSON(oTestIntrantText);
            assert.deepEqual(result, oTestIntrant);
        });

        it('When I send invalid JSON to the function it should be null', function () {
            let result = oMainCtrl.__ConvertTextToJSON('{"bob": 1,}');
            assert.isNull(result);
        });
    });

    describe('#eventPasteIntrant', function () {
        let mock = {
            clipboardData: {
                getData: function () {
                    return '{"bob": 1,}';
                }
            },
            preventDefault: function () {

            }
        };

        it('When I send valid JSON to the function should not be null', function () {
            mock.clipboardData.getData = function () {
                return oTestIntrantText;
            };
            oMainCtrl.eventPasteIntrant(oMainCtrl.oIntrant, mock);
            assert.isNotNull(oMainCtrl.oIntrant.getValue());
        });

        it('When I send invalid JSON to the function and the intrant is empty it should stay empty.', function () {
            mock.clipboardData.getData = function () {
                return '{"bob": 1,}';
            };
            oMainCtrl.eventPasteIntrant(oMainCtrl.oIntrant, mock);
            assert.isEmpty(oMainCtrl.oIntrant.getValue());
        });

        it('When I send invalid JSON to the function and the intrant is empty it data shouldn\'t change', function () {
            mock.clipboardData.getData = function () {
                return '{"bob": 1,}';
            };
            oMainCtrl.oIntrant.setValue(oTestIntrantText);
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventPasteIntrant(oMainCtrl.oIntrant, mock);
            assert.equal(oMainCtrl.oIntrant.getValue(), beforeChange);
        });
    });

    describe('#eventDropIntrant', function () {
        let mock = {
            dataTransfer: {
                files: []
            },
            stopPropagation: function () {

            },
            preventDefault: function () {

            }
        };

        it("When I drop no file it shouldn't change anything", function () {
            mock.dataTransfer.files = [];
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventDropIntrant(oMainCtrl.oIntrant, mock);
            assert.equal(oMainCtrl.oIntrant.getValue(), beforeChange);
        });

        it("When I drop a file that doesn't existe it shouldn't change anything", function () {
            mock.dataTransfer.files = [{"path": "c:\\bob.json"}];
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventDropIntrant(oMainCtrl.oIntrant, mock);
            assert.equal(oMainCtrl.oIntrant.getValue(), beforeChange);
        });

        it("When I drop a file with invalid json it shouldn't change anything", function () {
            mock.dataTransfer.files = [{"path": "C:\\Users\\Aura\\Desktop\\invalid.json"}];
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventDropIntrant(oMainCtrl.oIntrant, mock);
            assert.equal(oMainCtrl.oIntrant.getValue(), beforeChange);
        });

        it("When I drop a file with valid json it should update", function () {
            mock.dataTransfer.files = [{"path": "C:\\Users\\Aura\\Desktop\\test.json"}];
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventDropIntrant(oMainCtrl.oIntrant, mock);
            assert.notEqual(oMainCtrl.oIntrant.getValue(), beforeChange);
        });
    });

    describe('#eventDragDisable', function () {
        let mock = {
            preventDefault: function () {
            }
        };
        it("Nothing to test really.", function () {
            let beforeChange = oMainCtrl.oIntrant.getValue();
            oMainCtrl.eventDragDisable(oMainCtrl.oIntrant, mock);
            assert.equal(oMainCtrl.oIntrant.getValue(), beforeChange);
        });
    });

    describe('#eventClickCopyBtnIntrant', function () {
        it("Should contain intrrant data", function () {
            oMainCtrl.oIntrant.setValue(oTestIntrantText);
            oMainCtrl.eventClickCopyBtnIntrant();
            assert.equal(oMainCtrl.oIntrant.getValue(), clipboardMock.electron.remote.clipboard.readText());
        });

        it("When Intrant is empty clipboard data shouldn't be change", function () {
            let beforeChange = clipboardMock.electron.remote.clipboard.readText();
            oMainCtrl.eventClickCopyBtnIntrant();
            assert.equal(clipboardMock.electron.remote.clipboard.readText(), beforeChange);
        });

        it("When Intrant is empty clipboard data shouldn't be change if not empty", function () {
            clipboardMock.electron.remote.clipboard.writeText("Bob");
            let beforeChange = clipboardMock.electron.remote.clipboard.readText();
            oMainCtrl.eventClickCopyBtnIntrant();
            assert.equal(clipboardMock.electron.remote.clipboard.readText(), beforeChange);
        });
    });

    describe('#eventClickPasteBtnIntrant', function () {
        it("Clipboard data should replace Intrant value", function () {
            clipboardMock.electron.remote.clipboard.writeText(oTestIntrantText);
            oMainCtrl.eventClickPasteBtnIntrant();
            assert.equal(oMainCtrl.oIntrant.getValue(), JSON.stringify(oTestIntrant, null, "    "));
        });

        it("Clipboard data shouldn't replace Intrant value", function () {
            const TestData = '{"TEST": "Test"}';
            clipboardMock.electron.remote.clipboard.writeText(TestData);
            oMainCtrl.oIntrant.setValue(oTestIntrantText);
            oMainCtrl.eventClickPasteBtnIntrant();
            assert.notEqual(oMainCtrl.oIntrant.getValue(), TestData);
        });
    });

    describe('#eventClickClearBtnIntrant', function () {
        it("Content should still be there.", function () {
            oMainCtrl.oIntrant.setValue(oTestIntrantText);
            assert.isNotEmpty(oMainCtrl.oIntrant.getValue());
        });

        it("Should clear the content of the Intrant.", function () {
            oMainCtrl.oIntrant.setValue(oTestIntrantText);
            oMainCtrl.eventClickClearBtnIntrant(oMainCtrl.oIntrant);
            assert.isEmpty(oMainCtrl.oIntrant.getValue());
        });
    });
});