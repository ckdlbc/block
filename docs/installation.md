# 安装

### NPM

```bash
npm install block --save
```

### Yarn

```bash
yarn add block
```

在一个模块化的打包系统中，您必须显式地通过 `new Block.Store()` 来安装 Block：

```js
import Block from 'block';
// 引入自定义的Block Module
import user from 'user';

new Block.Store({
    modules: {
        user
    }
});
```

### Promise

Block 依赖 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)。如果你支持的浏览器并没有实现 Promise (比如 IE)，那么你可以使用一个 polyfill 的库，例如 [es6-promise](https://github.com/stefanpenner/es6-promise)。

你可以通过 CDN 将其引入：

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

然后 `window.Promise` 会自动可用。

如果你喜欢使用诸如 npm 或 Yarn 等包管理器，可以按照下列方式执行安装：

```bash
npm install es6-promise --save # npm
yarn add es6-promise # Yarn
```

或者更进一步，将下列代码添加到你使用 Block 之前的一个地方：

```js
import 'es6-promise/auto';
```
