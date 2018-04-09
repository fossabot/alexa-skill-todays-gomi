/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = '';

const SKILL_NAME = '今日のゴミ';

const gomiRules = [
    // 偶数週
    [
        '',                       // 日
        '可燃ごみ、プラスチック', // 月
        'ビン、有害ゴミ',         // 火
        'ダンボール、古紙',       // 水
        '可燃ごみ',               // 木
        'ペットボトル',           // 金
        ''                        // 土
    ],
    // 奇数週
    [
        '',                       // 日
        '可燃ごみ、プラスチック', // 月
        '古着、缶',               // 火
        '',                       // 水
        '可燃ごみ、不燃ごみ',     // 木
        '',                       // 金
        ''                        // 土
    ]
];

const handlers = {
    'LaunchRequest': function () {
        this.emit('TodaysGomi');
    },
    'TodaysGomi': function() {
        const date = new Date();
        const weekNumber = Math.floor((date.getDate() + 6 ) / 7);
        let gomi = gomiRules[weekNumber % 2][date.getDay()];
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
