"use strict";

const _paused = Symbol();
const _ender = Symbol();
const _defered = Symbol();
const _asynced = Symbol();

class ResourceQueue {
  constructor(paused) {
    this[_paused] = paused;
    this[_defered] = [];
    this[_asynced] = {};
  }

  push(callback) {
    return this.async(callback);
  }

  resume(callback) {
    this[_ender] = callback;

    if (!this[_paused]) {
      finish(this);
      return;
    }
    this[_paused] = false;

    evaluateAllDefered(this);
  }

  defer(callback) {
    const q = this;

    const item = {
      evaluate() {
        if (!this.ready) {
          return;
        }
        callback(this.err, this.data, this.response);
      }
    };

    q[_defered].push(item);

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      evaluateAllDefered(q);
    };
  }

  async(callback) {
    const q = this;

    const key = Symbol();

    const item = {
      evaluate() {
        if (!this.ready) {
          return;
        }
        callback(this.err, this.data, this.response);
        delete q[_asynced][key];
        finish(q);
      }
    };

    q[_asynced][key] = item;

    return (err, data, response) => {
      item.ready = true;
      item.err = err;
      item.data = data;
      item.response = response;
      item.evaluate();
    };
  }
}

function evaluate(item) {
  if (!item.ready) {
    return true;
  }

  item.evaluate();
  return false;
}

function evaluateAllDefered(queue) {
  if (queue[_paused]) {
    return;
  }
  queue[_defered] = queue[_defered].filter(evaluate);

  finish(queue);
}

function finish(queue) {
  if (!queue[_defered].length &&
      !Object.getOwnPropertySymbols(queue[_asynced]).length &&
      typeof queue[_ender] === "function") {
    queue[_ender]();
  }
}

module.exports = ResourceQueue;
