
# 麦当的新博客

最近看到 [ddui](https://ddiu.io/) 的博客，发现博客很好看，很简约，给人一种焕然一新的感觉，于是打算仿照这个博客的样式，自己写一个博客

## 技术栈

- vite
- solid.js
- unocss
- markdown-it
- typescript

### 实现思路

由于不打算再去写一个 server，所以在本地写 md 文件，然后用 markdown-it 去parse 写好的 markdown 文件。然后修改 markdown-it 的 render 方法，在 render 的时候，将其替换成我们写好的 solid.js 的组件，然后我们再去实现这些组件
