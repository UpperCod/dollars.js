export const States = new WeakMap();

/**
 * template
 */

/**
 * create a controller for the state to which dollar will react
 */
export class State {
  constructor(state) {
    this.binding = [];
    this.$ = this.init(state);
  }
  /**
   *
   * @param {Object<string,any>} state create the proxy to reflect the state
   * @returns
   */
  init(state) {
    return new Proxy(state, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.update();
      },
    });
  }
  update() {
    this.binding.forEach((fn) => fn());
  }
}

export class Host {
  /**
   * prefix to capture attributes
   */
  prefix = "$";
  /**
   *
   * @param {Element} host
   * @param {*} state
   */
  constructor(host, state) {
    if (!States.has(state)) {
      States.set(state, state instanceof State ? state : new State(state));
    }
    Object.assign(this, States.get(state));
    this.template(host);
  }
  /**
   *
   * @param {Element} host
   * @param {{prefix:string,binding:((loop:any)=>void)[],loop:any}} ctx
   */
  template(host, ctx = this) {
    const Tree = document.createTreeWalker(host, 1);
    const { binding, prefix } = ctx;
    let { currentNode: target } = Tree;

    while (target) {
      const { attributes } = target;
      if (attributes) {
        const { length } = attributes;
        for (let i = 0; i < length; i++) {
          const { name, value } = attributes[i];
          if (!name.startsWith(prefix)) continue;
          const directive = name.replace(prefix, "");
          const [prop, ...args] = directive.split("-");
          const bind = this["$" + prop](target, ...args.concat(value));
          if (bind) binding.push(bind);
        }
      }
      target = Tree.nextNode();
    }

    binding.forEach((fn) => fn(ctx.loop));
  }
  fn(content) {
    const fn = Function("$", "loop", content);
    return (loop) => fn(this.$, loop);
  }
  $on(target, type, value) {
    const fn = this.fn(value);
    target.addEventListener(type, () => fn());
  }
  $text(target, value) {
    const fn = this.fn(`return ${value}`);
    return (loop) => (target.textContent = fn(loop));
  }
  $html(target, value) {
    const fn = this.fn(`return ${value}`);
    return (loop) => (target.html = fn(loop));
  }
  $show(target, value) {
    const fn = this.fn(`return ${value}`);
    return (loop) => {
      if (fn(loop)) {
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
        return (loop) => target.classList.toggle(param1, fn(loop));
      }
      default: {
        const fn = this.fn(`return ${param1}`);
        return (loop) => (target[type] = !!fn(loop));
      }
    }
  }
  $set(target, type, content) {
    const fn = this.fn(`return ${content}`);
    return (loop) => {
      const value = fn(loop);
      if (type in target) {
        target[fn] = value;
      } else {
        target[value ? "setAttribute" : "removeAttribute"](type, value);
      }
    };
  }
  /**
   *
   * @param {HTMLTemplateElement} target
   * @param {*} type
   * @param {*} content
   */
  $each(target, selector) {
    const { parentElement, content } = target;
    const fn = this.fn(`return ${selector}`);
    const items = [];
    return (loop) => {
      const data = fn(loop);
      data?.forEach((item, index) => {
        if (!items[index]) {
          const binding = [];
          const host = content.cloneNode(true);
          this.template(host, {
            prefix: this.prefix,
            binding,
            loop: item,
          });
          items.push({
            childNodes: [...host.childNodes],
            binding,
          });

          parentElement.insertBefore(host, target);
        } else {
          items[index].binding.forEach((fn) => fn(item));
        }
      });
      items
        .splice(data?.length)
        .forEach(({ childNodes }) =>
          childNodes.forEach((item) => item.remove())
        );
    };
  }
}

export default (host, state) => new Host(host, state).$;
