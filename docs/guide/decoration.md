# Decoration

为了清晰直观地展示 API 的调用方式与模块结构，Block 使用装饰器优化写法。

### API 方法装饰器

提供以下 4 种 API 方法装饰器：

- **@get** -> GET 方法
- **@post** -> POST 方法
- **@put** -> PUT 方法
- **@del** -> DELETE 方法

使用方式：

```js
import { get, post, put, del } from 'block'

class User {
    @get('/api/getUserInfo')
    public getUserInfo() {}

    @post('/api/addUser')
    public addUser() {}

    @put('/api/updateUser')
    public updateUser() {}

    @del('/api/delUser')
    public delUser() {}
}
```

### 基础调用路径

Block 提供模块级的基础调用路径装饰器，使得模块能够承载不同域名路径的 API。

```js
import { get } from 'block'

@base('http://www.domain.com')
class User {
    // url -> http://www.domain.com/api/getUserInfo
    @get('/api/getUserInfo')
    public getUserInfo() {}
}
```

### 拦截器

对于发出请求与接收数据时的拦截，Block 提供了 2 种装饰器。

- **@req** -> 请求发送前的拦截器，拦截 request。
- **@res** -> 请求接收时的拦截器，拦截 response。

装饰器的第一个参数为状态，`success`与`error`分别代表**拦截处理**与**错误处理**。

```js
import { base, get, post, res, req } from 'block'

@base('http://www.groad.top:3000/mock/13')
class User {
    @get('/vc/api/monthreport')
    public getUser() {}

    // 在请求发送之前做一些事
    @req('success')
    public reqSuccess(config) {
        return config;
    }

    // 在请求发送之前做一些事
    @req('error')
    public reqError(error) {
        return Promise.reject(error);
    }

    // 对返回的数据进行一些处理
    @res('success')
    public resSuccess(response) {
        return response
    }

    // 对返回的错误进行一些处理
    @res('error')
    public resError(error) {
        return Promise.reject(error);
    }
}

export default User
```
