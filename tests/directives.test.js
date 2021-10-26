import { expect } from "@esm-bundle/chai";
import $$ from "../host";

describe("directives", () => {
  it("on", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $on-click="count++"></div>`;

    const state = $$(host, { count: 0 });

    host.querySelector("div").click();

    expect(state.count).to.equal(1);

    host.querySelector("div").click();
    host.querySelector("div").click();
    host.querySelector("div").click();
    host.querySelector("div").click();

    expect(state.count).to.equal(5);
  });

  it("text", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $text="message"></div>`;

    const state = $$(host, { message: "$" });

    state.message += "$";

    expect(host.textContent).to.equal("$$");
  });

  it("html", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $html="inject"></div>`;

    const state = $$(host, { inject: "" });

    state.inject = `<b>Bold!</b>`;

    expect(host.querySelector("b")).to.not.null;
  });

  it("show", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $show="show"></div>`;

    const state = $$(host, { show: false });

    expect(host.querySelector("div").style.display).to.equal("none");

    state.show = true;

    expect(host.querySelector("div").style.display).to.equal("");
  });

  it("toggle", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $toggle-class-active="show"></div>`;

    const state = $$(host, { show: false });

    expect(host.querySelector(".active")).to.is.null;

    state.show = true;

    expect(host.querySelector(".active")).to.is.not.null;
  });

  it("set", () => {
    const host = document.createElement("div");

    host.innerHTML = `<div $set-class="show?'active':null"></div>`;

    const state = $$(host, { show: false });

    expect(host.querySelector(".active")).to.is.null;

    state.show = true;

    expect(host.querySelector(".active")).to.is.not.null;
  });

  it("each", () => {
    const host = document.createElement("div");

    host.innerHTML = `<template $each="users">
        <span $text="loop.name"></span>
    </template>`;

    const state = $$(host, { users: [{ name: "A" }] });

    const childrenSpan = [...host.querySelectorAll("span")];

    expect(childrenSpan.length).to.equal(1);

    expect(childrenSpan.at(0).textContent).to.equal("A");

    state.users = state.users.concat(
      {
        name: "B",
      },
      {
        name: "C",
      }
    );

    const childrenSpan2 = [...host.querySelectorAll("span")];

    expect(childrenSpan2.length).to.equal(3);
  });
});
