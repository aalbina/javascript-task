'use strict';

class Message {
    constructor(text) {
        this._text = text;
    }

    set_from(from) {
        this._from = from;
    }

    set_to(to) {
        this._to = to;
    }
}

module.exports = Message;
