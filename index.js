export const symbol$$ = Symbol("$$");

export class Host {
  prefix = "$";
  constructor(host, state) {
    host[symbol$$] = host[symbol$$] || {
      $: new Proxy(typeof state == "function" ? state : state, {
        set(target, prop, value) {
          target[prop] = value;
          host[symbol$$].binding.forEach((fn) => fn());
        },
      }),
      binding: [],
    };
    Object.assign(this, host[symbol$$]);
    this.template(host);
  }
  template(host) {
    const Tree = document.createTreeWalker(host, 1);
    const { binding, prefix } = this;
    let { currentNode: target } = Tree;

    while (target) {
      const { attributes } = target;
      const { length } = attributes;
      for (let i = 0; i < length; i++) {
        const { name, value } = attributes[i];
        if (!name.startsWith(prefix)) continue;
        const directive = name.replace(prefix, "");
        const [prop, ...args] = directive.split("-");
        const bind = this["$" + prop](target, ...args.concat(value));
        if (bind) binding.push(bind);
      }
      target = Tree.nextNode();
    }

    binding.forEach((fn) => fn());
  }
  fn(content) {
    const fn = Function("$", content);
    return () => fn(this.$);
  }
  $on(target, type, value) {
    const fn = this.fn(value);
    target.addEventListener(type, () => fn());
  }
  $text(target, value) {
    const fn = this.fn(`return ${value}`);
    return () => (target.textContent = fn());
  }
  $html(target, value) {
    const fn = this.fn(`return ${value}`);
    return () => (target.html = fn());
  }
  $show(target, value) {
    const fn = this.fn(`return ${value}`);
    return () => {
      if (fn()) {
        target.style.display = "none";
      } else {
        target.style.removeProperty("display");
      }
    };
  }
  $toggle(target, type, param1, param2) {
    switch (type) {
      case "class": {
        const fn = this.fn(`return ${param2}`);
        return () => target.classList.toggle(param1, fn());
      }
      default: {
        const fn = this.fn(`return ${param1}`);
        return () => (target[type] = !!fn());
      }
    }
  }
  $set(target, type, content) {
    const fn = this.fn(`return ${content}`);
    return () => {
      const value = fn();
      if (type in target) {
        target[fn] = value;
      } else {
        target[value ? "setAttribute" : "removeAttribute"](type, value);
      }
    };
  }
}

export default (host, state) => new Host(host, state).$;
