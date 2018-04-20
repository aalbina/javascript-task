'use strict';

const requestPromiseNative = require('request-promise-native');
module.exports.execute = execute;
module.exports.isStar = true;

const chalk = require('chalk');
const yellow = chalk.hex('#FF0');
const red = chalk.hex('#F00');
const green = chalk.hex('#0F0');

const conn_settings = {
    baseUrl: 'http://localhost:8080/messages',
    uri: '/',
    json: true

};

const functions = {
    'list': list,
    'send': send
};

function preProcessParams(params) {
    let result = {};
    let was_param_name = false;
    let param_name = '';
    params.forEach(function(param) {
        if (param.indexOf('=') !== -1) {
            let _arr = param.split('=');
            result[_arr[0].split('--')[1]] = _arr[1];
        } else {
            if (was_param_name === false){
                was_param_name = true;
                param_name = param.split('--')[1];
            } else {
                was_param_name = false;
                result[param_name] = param;
                param_name = '';
            }
        }
    });

    return result;
}

function preProcessMessage(elem) {
    let result = '';

    if (elem.hasOwnProperty('_from')) {
        result += `${red('FROM')}: ${elem._from} \n`;
    }
    if (elem.hasOwnProperty('_to')) {
        result += `${red('TO')}: ${elem._to} \n`;
    }
    result += `${green('TEXT')}: ${elem._text} \n\n`;

    return result;
}

function printResult(json) {
    let result = '';

    if (json.length > 0) {
        json.forEach(function(elem) {
            result += preProcessMessage(elem);
        });
    }

    return result;
}

function send(args) {
    let settings = conn_settings;

    args = preProcessParams(args);
    let qs = {};
    if (args['from'] !== undefined) {
        qs['from'] = args['from'];
    }
    if (args['to'] !== undefined) {
        qs['to'] = args['to'];
    }
    settings['qs'] = qs;
    settings['body'] = {'text': args['text']};

    return requestPromiseNative
        .defaults(settings)
        .post()
        .then(printResult);
}

function list(args) {
    let settings = conn_settings;

    args = preProcessParams(args);
    let qs = {};
    if (args['from'] !== undefined) {
        qs['from'] = args['from'];
    }
    if (args['to'] !== undefined) {
        qs['to'] = args['to'];
    }
    settings['qs'] = qs;

    return requestPromiseNative
        .defaults(settings)
        .get()
        .then(printResult);
}

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    const args = process.argv.slice(2);

    return functions[args[0]](args.slice(1));
}
