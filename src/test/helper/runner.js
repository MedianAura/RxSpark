module.exports = function () {
    require('jsdom-global')();
    window.$ = window.jQuery = require('jquery');

    document.body.createTextRange = function() {
        return {
            setEnd: function(){},
            setStart: function(){},
            getBoundingClientRect: function(){
                return {right: 0};
            },
            getClientRects: function(){
                return {
                    length: 0,
                    left: 0,
                    right: 0
                }
            }
        }
    };

    const nunjucks = require('nunjucks');
    const path = require('path');
    nunjucks.configure(`${path.resolve(__dirname, '../../app/./View/').replace(/\\/gmi, '/')}/`);
};