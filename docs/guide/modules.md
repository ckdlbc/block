# Module

由于使用单一模块，应用的所有 API 会集中到一个比较大的 JS 文件。当应用变得 API 增加时，JS 文件就有可能变得相当臃肿。

为了解决以上问题，Block 允许我们将 store 分割成**模块（module）**。每个模块拥有自己的 baseURL、interceptor。

### 类

对于模块，必须以一个类的方式导出，并至少包含一个 API 装饰器。

```js
import { get } from 'block'

class User {
    @get('/api/getUserInfo')
    public getUserInfo() {}
}

export default User
```

### 不使用全局配置

模块默认使用全局配置，若模块中包含@base、@req、@res 任意一项装饰器，模块将创建新的 block 实例，并使用自身的配置。

包含@base：

```js
import { get } from 'block'

@base('http://www.domain.com')
class User {
    @get('/api/getUserInfo')
    public getUserInfo() {}
}

export default User
```

包含拦截器：

```js
import { get } from 'block'

@base('http://www.domain.com')
class User {
    @get('/api/getUserInfo')
    public getUserInfo() {}

    @res('success')
    public resSuccess(res) {
        return res
    }
}

export default User
```

### 命名空间

默认情况下，每个 API 将拥有一个命名空间，且命名空间为类名称的小写。

```js
// module
import { get } from 'block'

// User 类中所有 API 的命名空间为 user。
@base('http://www.domain.com')
class User {
    @get('/api/getUserInfo')
    public getUserInfo() {}

    @get('/api/getEmail')
    public getEmail() {}
}

export default User

// api入口
import Block from 'block'
import user from './user'

export default new Block.Store({
    modules: {
        user
    }
})

// 调用
import apiStore from './api'

// 在此处使用命名空间
apiStore.dispatch('user/getUserInfo')
apiStore.all(
  [
    {type:'user/getUserInfo'},
    {type:'user/getEmail'}
  ]
)
```
