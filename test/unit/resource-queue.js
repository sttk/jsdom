"use strict";

const ResourceQueue = require("../../lib/jsdom/browser/resource-queue");
const expect = require("chai").expect;

describe("ResourceQueue", () => {
  it("Resume empty queue with no pause.", () => {
    const logs = [];
    const queue = new ResourceQueue();
    logs.push("before");
    queue.resume(() => {
      logs.push("end")
    });
    logs.push("after");
    expect(logs).to.deep.equal(["before", "end", "after"]);
  });
  it("Resume empty queue with pause", () => {
    const logs = [];
    const queue = new ResourceQueue(true);
    logs.push("before");
    queue.resume(() => {
      logs.push("end")
    });
    logs.push("after");
    expect(logs).to.deep.equal(["before", "end", "after"]);
  });
  it("Queue async/defer items without pause", () => {
    const logs = [];
    const queue = new ResourceQueue();
    const async1 = queue.async(() => { logs.push("async1") });
    const defer1 = queue.defer(() => { logs.push("defer1") });
    const async2 = queue.async(() => { logs.push("async2") });
    const defer2 = queue.defer(() => { logs.push("defer2") });
    const async3 = queue.async(() => { logs.push("async3") });
    const defer3 = queue.defer(() => { logs.push("defer3") });
    const async4 = queue.async(() => { logs.push("async4") });
    const defer4 = queue.defer(() => { logs.push("defer4") });

    async1();
    defer1();
    async2();
    defer2();

    logs.push("before");

    queue.resume(() => {
      logs.push("end");
      expect(logs).to.deep.equal([
        "async1",
        "defer1",
        "async2",
        "defer2",
        "before",
        "after",
        "async3",
        "defer3",
        "async4",
        "defer4",
        "end",
      ]);
    });

    logs.push("after");
    async3();
    defer3();
    async4();
    defer4();

    expect(logs).to.deep.equal([
      "async1",
      "defer1",
      "async2",
      "defer2",
      "before",
      "after",
      "async3",
      "defer3",
      "async4",
      "defer4",
      "end",
    ]);
  });
  it("Queue async/defer items with pause", () => {
    const logs = [];
    const queue = new ResourceQueue(true);
    const async1 = queue.async(() => { logs.push("async1") });
    const defer1 = queue.defer(() => { logs.push("defer1") });
    const async2 = queue.async(() => { logs.push("async2") });
    const defer2 = queue.defer(() => { logs.push("defer2") });
    const async3 = queue.async(() => { logs.push("async3") });
    const defer3 = queue.defer(() => { logs.push("defer3") });
    const async4 = queue.async(() => { logs.push("async4") });
    const defer4 = queue.defer(() => { logs.push("defer4") });

    async1();
    defer1();
    async2();
    defer2();

    logs.push("before");

    queue.resume(() => {
      logs.push("end");
      expect(logs).to.deep.equal([
        "async1",
        "async2",
        "before",
        "defer1",
        "defer2",
        "after",
        "async3",
        "defer3",
        "async4",
        "defer4",
        "end",
      ]);
    });

    logs.push("after");
    async3();
    defer3();
    async4();
    defer4();

    expect(logs).to.deep.equal([
      "async1",
      "async2",
      "before",
      "defer1",
      "defer2",
      "after",
      "async3",
      "defer3",
      "async4",
      "defer4",
      "end",
    ]);
  });
  it("Queue asynchronous async/defer items without pause", done => {
    const logs = [];
    const queue = new ResourceQueue();
    const async1 = queue.async(() => { logs.push("async1") });
    const defer1 = queue.defer(() => { logs.push("defer1") });
    const async2 = queue.async(() => { logs.push("async2") });
    const defer2 = queue.defer(() => { logs.push("defer2") });
    const async3 = queue.async(() => { logs.push("async3") });
    const defer3 = queue.defer(() => { logs.push("defer3") });
    const async4 = queue.async(() => { logs.push("async4") });
    const defer4 = queue.defer(() => { logs.push("defer4") });

    setImmediate(async1);
    setImmediate(defer1);
    setImmediate(async2);
    setImmediate(defer2);

    logs.push("before");

    setImmediate(() => {
      queue.resume(() => {
        logs.push("end");
        expect(logs).to.deep.equal([
          "before",
          "after",
          "async1",
          "defer1",
          "async2",
          "defer2",
          "async3",
          "defer3",
          "async4",
          "defer4",
          "end",
        ]);
        done();
      });
    });

    logs.push("after");
    setImmediate(async3);
    setImmediate(defer3);
    setImmediate(async4);
    setImmediate(defer4);

    expect(logs).to.deep.equal([
      "before",
      "after",
    ]);
  });
  it("Queue asynchronous async/defer items with pause", done => {
    const logs = [];
    const queue = new ResourceQueue(true);
    const async1 = queue.async(() => { logs.push("async1") });
    const defer1 = queue.defer(() => { logs.push("defer1") });
    const async2 = queue.async(() => { logs.push("async2") });
    const defer2 = queue.defer(() => { logs.push("defer2") });
    const async3 = queue.async(() => { logs.push("async3") });
    const defer3 = queue.defer(() => { logs.push("defer3") });
    const async4 = queue.async(() => { logs.push("async4") });
    const defer4 = queue.defer(() => { logs.push("defer4") });

    setImmediate(async1);
    setImmediate(defer1);
    setImmediate(async2);
    setImmediate(defer2);

    logs.push("before");

    setImmediate(() => {
      queue.resume(() => {
        logs.push("end");
        expect(logs).to.deep.equal([
          "before",
          "after",
          "async1",
          "async2",
          "defer1",
          "defer2",
          "async3",
          "defer3",
          "async4",
          "defer4",
          "end",
        ]);
        done();
      });
    });

    logs.push("after");
    setImmediate(async3);
    setImmediate(defer3);
    setImmediate(async4);
    setImmediate(defer4);

    expect(logs).to.deep.equal([
      "before",
      "after",
    ]);
  });
});
