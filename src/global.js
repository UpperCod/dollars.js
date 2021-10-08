window.$$ =
  window.$$ ||
  ((state, host = document?.currentScript?.parentElement) =>
    import("./host.js").then(({ default: $$ }) => $$(host, state)));
