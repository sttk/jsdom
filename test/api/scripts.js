"use strict";

const { expect } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { VirtualConsole, JSDOM } = require("../..");
const { readTestFixture } = require("../util");

describe("scripts", () => {
  describe("Constructor", () => {
    it("Should create an instance of HTMLScriptElement", () => {
      const window = new JSDOM().window;
      const document = window.document;

      const script = document.createElement("script");
      expect(script.toString()).to.equal("[object HTMLScriptElement]");
    });
  });
  describe("Attributes", () => {
    describe("src", () => {
      it("Should get and set attribute when URL is specified", () => {
        const origin = "https://html.spec.whatwg.org/multipage/";
        const pageurl = origin + "scripting.html";
        const jsurl = origin + "html-dfn.js";

        const window = new JSDOM("", { url: pageurl }).window;
        const document = window.document;
        const script = document.createElement("script");
        expect(document.URL).to.equal(pageurl);

        expect(script.src).to.equal("");
        expect(script.getAttribute("src")).to.equal(null);

        script.src = "aaa";
        expect(script.src).to.equal(origin + "aaa");
        expect(script.getAttribute("src")).to.equal("aaa");

        script.src = jsurl;
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal(jsurl);

        script.setAttribute("src", "aaa");
        expect(script.src).to.equal(origin + "aaa");
        expect(script.getAttribute("src")).to.equal("aaa");

        script.setAttribute("src", jsurl);
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal(jsurl);
      });
      it("Should get and set attribute when URL is 'about:blank'", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");
        expect(document.URL).to.equal("about:blank");

        expect(script.src).to.equal("");
        expect(script.getAttribute("src")).to.equal(null);

        // This behaviour is same with behaviors on Firefox and Safari.
        // On Chrome and Vivaldi, the result of `script.src` is "".
        // On IE and Edge, the result of `script.src` is "about:aaa".
        script.src = "aaa";
        expect(script.src).to.equal("aaa");
        expect(script.getAttribute("src")).to.equal("aaa");

        const jsurl = "https://html.spec.whatwg.org/html-dfn.js";
        script.src = jsurl;
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal(jsurl);

        // This behaviour is same with behaviors on Firefox and Safari.
        // On Chrome and Vivaldi, the result of `script.src` is "".
        // On IE and Edge, the result of `script.src` is "about:aaa".
        script.setAttribute("src", "aaa");
        expect(script.src).to.equal("aaa");
        expect(script.getAttribute("src")).to.equal("aaa");

        script.setAttribute("src", jsurl);
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal(jsurl);
      });
      it("Should strip surrounding spaces when URL is specified", () => {
        const origin = "https://html.spec.whatwg.org/multipage/";
        const pageurl = origin + "scripting.html";
        const jsurl = origin + "html-dfn.js";

        const window = new JSDOM("", { url: pageurl }).window;
        const document = window.document;
        const script = document.createElement("script");
        expect(document.URL).to.equal(pageurl);

        script.src = "  aaa  ";
        expect(script.src).to.equal(origin + "aaa");
        expect(script.getAttribute("src")).to.equal("  aaa  ");

        script.src = "  " + jsurl + "  ";
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal("  " + jsurl + "  ");

        script.setAttribute("src", "  aaa  ");
        expect(script.src).to.equal(origin + "aaa");
        expect(script.getAttribute("src")).to.equal("  aaa  ");

        script.setAttribute("src", "  " + jsurl + "  ");
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal("  " + jsurl + "  ");
      });
      it("Should strip surrounding spaces when URL is 'about:blank'", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");
        expect(document.URL).to.equal("about:blank");

        // This behaviour is same with behaviors on Firefox and Safari.
        // On Chrome and Vivaldi, the result of `script.src` is "".
        // On IE and Edge, the result of `script.src` is "about:aaa".
        script.src = "  aaa  ";
        expect(script.src).to.equal("  aaa  ");
        expect(script.getAttribute("src")).to.equal("  aaa  ");

        const jsurl = "https://html.spec.whatwg.org/html-dfn.js";
        script.src = "  " + jsurl + "  ";
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal("  " + jsurl + "  ");

        // This behaviour is same with behaviors on Firefox and Safari.
        // On Chrome and Vivaldi, the result of `script.src` is "".
        // On IE and Edge, the result of `script.src` is "about:aaa".
        script.setAttribute("src", "  aaa  ");
        expect(script.src).to.equal("  aaa  ");
        expect(script.getAttribute("src")).to.equal("  aaa  ");

        script.setAttribute("src", "  " + jsurl + "  ");
        expect(script.src).to.equal(jsurl);
        expect(script.getAttribute("src")).to.equal("  " + jsurl + "  ");
      });
    });
    describe("type", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.type).to.equal("");
        expect(script.getAttribute("type")).to.equal(null);

        script.type = "text/javascript";
        expect(script.type).to.equal("text/javascript");
        expect(script.getAttribute("type")).to.equal("text/javascript");

        script.setAttribute("type", "aaa");
        expect(script.type).to.equal("aaa");
        expect(script.getAttribute("type")).to.equal("aaa");
      });
    });
    describe("charset", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.charset).to.equal("");
        expect(script.getAttribute("charset")).to.equal(null);

        script.charset = "iso-8859-15";
        expect(script.charset).to.equal("iso-8859-15");
        expect(script.getAttribute("charset")).to.equal("iso-8859-15");

        script.setAttribute("charset", "aaa");
        expect(script.charset).to.equal("aaa");
        expect(script.getAttribute("charset")).to.equal("aaa");
      });
    });
    describe("async", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.async).to.equal(true);
        expect(script.getAttribute("async")).to.equal(null);

        script.async = true;
        expect(script.async).to.equal(true);
        expect(script.getAttribute("async")).to.equal("");

        script.async = false;
        expect(script.async).to.equal(false);
        expect(script.getAttribute("async")).to.equal(null);

        script.async = "aaa";
        expect(script.async).to.equal(true);
        expect(script.getAttribute("async")).to.equal("");

        script.setAttribute("async", "bbb");
        expect(script.async).to.equal(true);
        expect(script.getAttribute("async")).to.equal("bbb");

        script.removeAttribute("async");
        expect(script.async).to.equal(false);
        expect(script.getAttribute("async")).to.equal(null);
      });
    });
    describe("defer", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.defer).to.equal(false);
        expect(script.getAttribute("defer")).to.equal(null);

        script.defer = true;
        expect(script.defer).to.equal(true);
        expect(script.getAttribute("defer")).to.equal("");

        script.defer = false;
        expect(script.defer).to.equal(false);
        expect(script.getAttribute("defer")).to.equal(null);

        script.setAttribute("defer", "aaa");
        expect(script.defer).to.equal(true);
        expect(script.getAttribute("defer")).to.equal("aaa");

        script.removeAttribute("defer");
        expect(script.defer).to.equal(false);
        expect(script.getAttribute("defer")).to.equal(null);
      });
    });
    describe("crossOrigin", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.crossOrigin).to.equal("");
        expect(script.getAttribute("crossOrigin")).to.equal(null);

        script.crossOrigin = "anonymous";
        expect(script.crossOrigin).to.equal("anonymous");
        expect(script.getAttribute("crossorigin")).to.equal("anonymous");

        script.setAttribute("crossorigin", "use-credentials");
        expect(script.crossOrigin).to.equal("use-credentials");
        expect(script.getAttribute("crossorigin")).to.equal("use-credentials");
      });
    });
    describe("nonce", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.nonce).to.equal("");
        expect(script.getAttribute("nonce")).to.equal(null);

        script.nonce = "aaa";
        expect(script.nonce).to.equal("aaa");
        expect(script.getAttribute("nonce")).to.equal("aaa");

        script.setAttribute("nonce", "bbb");
        expect(script.nonce).to.equal("bbb");
        expect(script.getAttribute("nonce")).to.equal("bbb");
      });
    });
    describe("text", () => {
      it("should get and set attribute", () => {
        const window = new JSDOM().window;
        const document = window.document;
        const script = document.createElement("script");

        expect(script.text).to.equal("");
        expect(script.getAttribute("charset")).to.equal(null);

        script.text = "const a = 1";
        expect(script.text).to.equal("const a = 1");
        expect(script.textContent).to.equal("const a = 1");
        // expect(script.innerText).to.equal("const a = 1"); // undefined
        // expect(script.outerText).to.equal("const a = 1"); // undefined
        expect(script.innerHTML).to.equal("const a = 1");
        expect(script.outerHTML).to.equal("<script>const a = 1</script>");

        script.textContent = "function b() {}";
        expect(script.text).to.equal("function b() {}");
        expect(script.textContent).to.equal("function b() {}");
        expect(script.innerHTML).to.equal("function b() {}");
        expect(script.outerHTML).to.equal("<script>function b() {}</script>");

        script.innerHTML = "let c = 'ABC';";
        expect(script.text).to.equal("let c = 'ABC';");
        expect(script.textContent).to.equal("let c = 'ABC';");
        expect(script.innerHTML).to.equal("let c = 'ABC';");
        expect(script.outerHTML).to.equal("<script>let c = 'ABC';</script>");

        const comment = document.createComment("console.log(c);");
        script.appendChild(comment);
        expect(script.text).to.equal("let c = 'ABC';");
        expect(script.textContent).to.equal("let c = 'ABC';");
        expect(script.innerHTML).to.equal(
          "let c = 'ABC';<!--console.log(c);-->");
        expect(script.outerHTML).to.equal(
          "<script>let c = 'ABC';<!--console.log(c);--></script>");

        const textNode = document.createTextNode("c += 'DEF';");
        script.appendChild(textNode);
        expect(script.text).to.equal("let c = 'ABC';c += 'DEF';");
        expect(script.textContent).to.equal("let c = 'ABC';c += 'DEF';");
        expect(script.innerHTML).to.equal(
          "let c = 'ABC';<!--console.log(c);-->c += 'DEF';");
        expect(script.outerHTML).to.equal(
          "<script>let c = 'ABC';<!--console.log(c);-->c += 'DEF';</script>");
      });
    });
  });
  it("Should loading event handlers and script contents in correct order",
  { async: true, skipIfBrowser: false }, context => {
    readTestFixture("api/fixtures/scripts/loading-order.html").then(html => {
      createWindow(context, html, logs => {
        expect(logs).deep.equal([
          "script-1",
          "script-2",
          "script-3",
          "body.onload",
          "script.load-1",
          "script.load-2",
          "script.load-3"
        ]);
      });
    });
  });
});

function createWindow(context, html, test) {
  const logs = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("log", text => {
    logs.push(text);
  });

  const opts = { runScripts: "dangerously", virtualConsole };
  const window = new JSDOM(html, opts).window;
  window.addEventListener("load", () => {
    try {
      test(logs);
      context.done();
    } catch (e) {
      context.done(e);
    }
  });
}
