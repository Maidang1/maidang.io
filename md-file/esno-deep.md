# 简介

esno 自己的介绍是 `Node.js runtime enhanced with esbuild for loading TypeScript & ESM`。意思就是一个用 esbuild 加强过的 node 的运行时。可以用来和直接执行 ts 的代码。现在的 esno 是一个 tsx 的别名，他的文件直接引用了 `import('tsx/cli')`。 内部的逻辑都存在于 tsx 这个文件中，本文就是介绍一个 tsx 是如何直接执行 ts 代码的。

# 前置知识

首先来介绍一个 `node --loader`参数，这个参数允许我们自定义加载 ESM 模块的规则。 执行 `node --loader ./my-loader.mjs index.mjs`。在加载 index.mjs 的时候，就会先去执行 my-loader.mjs 里面的内容。如果书写 my-loader.js 呢。node 内置了两个 hooks，分别是 `resolve` 和 `load` 可以在 import 的时候被执行（注：这两个 hooks 仅仅对 ESM 的模块生效，对 CJS 无效）。
下面来介绍两个 hooks 的用法:

### resolve

> The `resolve` hook chain is responsible for resolving file URL for a given module specifier and parent URL, and optionally its format (such as `'module'`) as a hint to the `load` hook. If a format is specified, the `load` hook is ultimately responsible for providing the final `format` value (and it is free to ignore the hint provided by `resolve`); if `resolve` provides a `format`, a custom `load` hook is required even if only to pass the value to the Node.js default `load` hook。

我的理解就是 resolve 函数可以让我们拿到文件名和文件 format 的信息。我们可以改变传入的模块的信息，然后返回回去，返回的信息会交给 `load` 这个 hooks 来执行。

```
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Some condition.
    // For some or all specifiers, do some custom logic for resolving.
    // Always return an object of the form {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Another condition.
    // When calling `defaultResolve`, the arguments can be modified. In this
    // case it's adding another value for matching conditional exports.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Defer to the next hook in the chain, which would be the
  // Node.js default resolve if this is the last user-specified loader.
  return nextResolve(specifier);
}
```

执行 `node --loader ./loader.mjs index.mjs` 调试的参数结果如图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae3a5aacf31346e5a53507dac453b70a~tplv-k3u1fbpfcp-watermark.image?)
specifier 就是待执行文件的路径，context 记录了 parentURL 和 可以[导入](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#conditional-exports)的 conditions 的规则。nextResolve 就是写一个 resolve 的 函数。如果没有的话就是默认的。返回的结构

```json
{
    format: 'commonjs' | 'module' | 'wasm',
    shortCircuit: boolean, // default false 是否结束 resolve hooks
    url: string; // 文件的 URL 我们可以在里面处理文件原来的 URL 。
}
```

### load

> The `load` hook provides a way to define a custom method of determining how a URL should be interpreted, retrieved, and parsed. It is also in charge of validating the import assertion

这个 hook 决定了一个文件的 url 如何被检索和解析。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26574a93cd02475bbb4e9a8d9421a257~tplv-k3u1fbpfcp-watermark.image?)

我们观察 index.mjs 和 loader.mjs。看到的现象是我们可以在返回的 source 中添加上自己内容，然后 node 在执行代码的时候，也会把我们添加上的内容带进去。如果我们在这里用一些工具将 ts 的代码变成 js 的代码，是不是就可以执行了呢！！ tsx 就是这么做的。后面的文章会说明。

### cjs 的 loader

上面介绍了一些 ESM 的 hooks。下面再介绍一下如何在 CJS 里面实现上面 load 的功能。

下面的内容来源于阮一峰的博客

```javascript
// 模块的加载
Module.prototype.load = function(filename) {
  var extension = path.extname(filename) || '.js';
  if (!Module._extensions[extension]) extension = '.js';
  Module._extensions[extension](this, filename);
  this.loaded = true;
};

// 调用不同后缀名的解析方法
Module._extensions['.js'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  module._compile(stripBOM(content), filename);
};

Module._extensions['.json'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

// 最后调用 _compile 方法来编译我们的模块。
Module.prototype._compile = function(content, filename) {
  var self = this;
  var args = [self.exports, require, self, filename, dirname];
  return compiledWrapper.apply(self.exports, args);
};
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5616400c90a14ba8bb4923de6b217350~tplv-k3u1fbpfcp-watermark.image?)
观察上面的例子，我们实现了和上面 ESM 一样的 `注入我们多余代码的逻辑`

除了 load Module也有类似于 resolve 的功能。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63de1bd5417a4c1d85705f6e117fa0c0~tplv-k3u1fbpfcp-watermark.image?)

我们也可以拓展 `___resolveFilename` 来实现类似于 上面的 `resolve` 的功能。

# tsx && esno

其实写到这里一般的读者应该猜到了。tsx && esno 就是拦截了 `"load"` 函数，然后里面用 `esbuild` 将代码 transform 一下。变成了 js 然后给 node 执行，就可以执行了。下面来分析一个 tsx 的实现过程。

分析 src 下面的 cli.ts 和 watchCommand 里面的文件。大致的意思就是接受命令行里面的参数，将参数收集起来，然后交给 run 函数去执行。run 函数的内容就是

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83ee7c17428747ca8b67f519f47fd4f7~tplv-k3u1fbpfcp-watermark.image?)
run 函数之后也是去执行 node 的命令，然后只用 --loadr 的命令来导入我们自定义的 loader。

loader.js

```javascript
require('@esbuild-kit/cjs-loader');               
export * from '@esbuild-kit/esm-loader';
```

里面引入了 cjs-loader 和 esm-loader 来处理不同的模块。下面我们来看看分别是实现了啥东西。

### esbuild-kit/cjs-loader

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6054d13a0afa49debad69e493fd598d5~tplv-k3u1fbpfcp-watermark.image?)
这里面给 `.js .ts, .tsx, .jsx` 解析的时候自定义了 `transformer` 方法。`</br>`
**transformer**

```typescript
function transformer(module: Module, filePath: string) {
  /**
   * For tracking dependencies in watch mode
   */
  if (process.send) {
    process.send({
      type: 'dependency',
      path: filePath,
    });
  }

  let code = fs.readFileSync(filePath, 'utf8');

  if (filePath.endsWith('.cjs') && nodeSupportsImport) {
    const transformed = transformDynamicImport(code);
    if (transformed) {
      code = applySourceMap(transformed, filePath, sourcemaps);
    }
  } else {
    const transformed = transformSync(code, filePath, {
      tsconfigRaw: tsconfigRaw as TransformOptions['tsconfigRaw'],
    });

    code = applySourceMap(transformed, filePath, sourcemaps);
  }

  module._compile(code, filePath);
}
```

这里面就是读取文件里面的内容，然后调用 transform 的方法来将文件转化一下。返回 code 用 compile 方法执行。transform 底层用的是 esbuild 提供的 API。这里也是拦截了 `"load"` 方法，将编译好的文件传入 compile里面。

### esbuild-kit/esm-loader

```javascript
export const load: load = async function (url, context, defaultLoad) {
  if (process.send) {
    process.send({
      type: 'dependency',
      path: url,
    });
  }

  if (url.endsWith('.json')) {
    if (!context.importAssertions) {
      context.importAssertions = {};
    }
    context.importAssertions.type = 'json';
  }

  const loaded = await defaultLoad(url, context, defaultLoad);

  if (!loaded.source) {
    return loaded;
  }

  const code = loaded.source.toString();

  if (loaded.format === 'json' || tsExtensionsPattern.test(url)) {
    const transformed = await transform(code, url, {
      tsconfigRaw,
    });

    return {
      format: 'module',
      source: applySourceMap(transformed, url, sourcemaps),
    };
  }

  const dynamicImportTransformed = transformDynamicImport(code);
  if (dynamicImportTransformed) {
    loaded.source = applySourceMap(dynamicImportTransformed, url, sourcemaps);
  }

  return loaded;
};
```

这里面的实现思路类似，针对于 ts 类的的文件进行编译，然后在 return 回去。供给 node 来执行。

> 注：真正的源码里面有很多分支判断，本文没有提到，可以自己去调试。

### 来个图理梳理一下流程。

<p align=center><image src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e150e928305d45bf8a25d3f690d782f3~tplv-k3u1fbpfcp-watermark.image?"></image></p>

# 总结

以上就是对 esno && tsx 流程的分析。如果有纰漏，请指正。

# 参考文档

[tsx](https://github.com/esbuild-kit/tsx) `</br>`
[cjs-loader](https://github.com/esbuild-kit/cjs-loader) `</br>`
[esm-loader](https://github.com/esbuild-kit/esm-loader) `</br>`
[esno](https://github.com/esbuild-kit/esno) `</br>`
[node module loaders](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#loaders) `</br>`
[require 源码解读](https://www.ruanyifeng.com/blog/2015/05/require.html)Ï
