## 2dollars

Create reactive documents easily thanks to `$$`, example:

```html
<div>
  <button $on-click="$.count++">Increment</button>
  <strong $text="$.count"></strong>
  <button $on-click="$.count--">Decrement</button>
  <script type="module">
    import $$ from "https://unpkg.com/2dollars";
    const state = $$({ count: 0 });
  </script>
</div>
```

## directives

### $on-\<event\>

add a handler to the node

```html
<button $on-click="console.log('click!')">Click!</button>
```

### $text

Print the state in text format inside the node

```html
Static text <span $text="$.message"></span>
```

### $html

Print the state in html format inside the node

```html
Static html <span $html="$.message"></span>
```

### $show

define display if the state is false

```html
<button $show="$.show">Show?</button>
```

### $toggle-\<type\>[-\<optional\>]

define or remove property according to state

```html
<button $toggle-class-hidden="$.show">Show?</button>
```

### $set-\<type\>

define the property according to the state

```html
<button $set-class="$.show?'hidden':null">Show?</button>
```
