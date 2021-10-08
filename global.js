((self) => {
  const { src } = document.currentScript;

  let href = src.replace(/\/global.js/, "/host.js");
  href = href === src ? src + "/host.js" : href;
  self.$$ =
    self.$$ ||
    ((state, host = document.currentScript?.parentElement) =>
      import(href).then(({ default: $$ }) => $$(host, state)));
})(window);
