/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

Date.prototype.getDayOfYear = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
}

Date.prototype.getWeekOfYear = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var offset = onejan.getDay() -1;
    var weeks = Math.floor((this.getDayOfYear() + offset) / 7);
    return (onejan.getDay() == 0) ? weeks +1 : weeks;
}

const Alexa = require('alexa-sdk');

const APP_ID = '';

const SKILL_NAME = '今日のゴミ';

const gomiRules = {
    'A': [ '' , '可燃ごみ、プラスチック' , 'びん、有害ごみ' , 'ダンボール・雑誌・紙パック、新聞' , '可燃ごみ'           , 'ペットボトル' , '' ] ,
    'B': [ '' , '可燃ごみ、プラスチック' , 'びん、有害ごみ' , 'ダンボール・雑誌・紙パック'       , '可燃ごみ'           , 'ペットボトル' , '' ] ,
    'C': [ '' , '可燃ごみ、プラスチック' , '古着、缶'       , ''                                 , '可燃ごみ、不燃ごみ' , ''             , '' ] ,
    'D': [ '' , '可燃ごみ、プラスチック' , '古着、缶'       , '新聞'                             , '可燃ごみ、不燃ごみ' , ''             , '' ] ,
    'E': [ '' , '可燃ごみ、プラスチック' , '古着、缶'       , '新聞'                             , '可燃ごみ、不燃ごみ' , 'ペットボトル' , '' ] ,
    'F': [ '' , '可燃ごみ、プラスチック' , '古着、缶'       , ''                                 , '可燃ごみ、不燃ごみ' , 'ペットボトル' , '' ]
};

const gomiMonthlyRules = {
    '1'  : [ 'A' , 'C' ] ,
    '2'  : [ 'A' , 'C' ] ,
    '3'  : [ 'A' , 'C' ] ,
    '4'  : [ 'A' , 'C' ] ,
    '5'  : [ 'A' , 'C' ] ,
    '6'  : [ 'B' , 'D' ] ,
    '7'  : [ 'B' , 'E' ] ,
    '8'  : [ 'B' , 'E' ] ,
    '9'  : [ 'A' , 'F' ] ,
    '10' : [ 'A' , 'C' ] ,
    '11' : [ 'A' , 'D' ] ,
    '12' : [ 'A' , 'D' ]
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('TodaysGomi');
    },
    'TodaysGomi': function() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const weekNumber = date.getWeekOfYear();
        const rule = gomiMonthlyRules[month][weekNumber % 2];
        let gomi = gomiRules[rule][date.getDay()];
        if (gomi == '') {
            gomi = 'ない';
        }
        this.response.speak('今日のゴミは、' + gomi + 'です。');
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
