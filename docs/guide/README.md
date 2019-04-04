# 开始

每一个 Block 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的**API**。

### 最简单的 Store

[安装](../installation.md) Block 之后，让我们来创建一个 store。创建过程直截了当——仅需要提供一个模块类：

```js
// 如果在模块化构建系统中，请确保在开头调用了此文件
import Block from "block";

const api = {
  getUserInfo: ["get", "/api/getUserInfo"]
};

const config = {
  baseURL: "http://api.domain.org"
};

const apiStore = new Block.Store({
  modules: {
    user: {
      api,
      config
    }
  }
});
```

现在，你可以通过 `apiStore.dispatch` 来调用单个 API，以及通过 `apiStore.all` 方法同时调用多个 API：

```js
const action = async () => {
  // 方式一
  const data1 = await apiStore.dispatch("user/getUserInfo");
  console.log(data1); // -> {name:'张三'}

  // 方式二
  const data2 = await apiStore.all([
    { type: "user/getUserInfo" }
    // ...
  ]);
  console.log(data2); // -> [{name:'张三'}]
};
```
