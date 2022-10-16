import { Component } from "solid-js";
import { Header } from "../components/Header";
const test: Component = () => {
  return (
    <div class="w-full h-full bg-white dark:bg-dark text-black dark:text-white">
      <main class="px-6 py-[8vh] max-w-[76ch] mx-auto xl:text-lg dark:prose-invert relative dark:text-white">
        <div class="mb-15">
          <div class="text-[2rem] text-zinc-800 font-bold leading-snug mb-4 md:mb-6 md:text-[2.6rem]">
            test
          </div>
          <div class="text-black/40 mb-6">文章最开始的样子</div>
          <div class="text-black/80">2022/10/16</div>
        </div>
        <Header className="header1">麦当的新博客</Header>
        <p class="gh-content mt-5 prose">
          最近看到 <a href="https://ddiu.io/">ddui</a>{" "}
          的博客，发现博客很好看，很简约，给人一种焕然一新的感觉，于是打算仿照这个博客的样式，自己写一个博客
        </p>
        <Header className="header2">技术栈</Header>
        <ul>
          <li>
            <p class="gh-content mt-5 prose">vite</p>
          </li>
          <li>
            <p class="gh-content mt-5 prose">solid.js</p>
          </li>
          <li>
            <p class="gh-content mt-5 prose">unocss</p>
          </li>
          <li>
            <p class="gh-content mt-5 prose">markdown-it</p>
          </li>
          <li>
            <p class="gh-content mt-5 prose">typescript</p>
          </li>
        </ul>
        <Header className="header3">实现思路</Header>
        <p class="gh-content mt-5 prose">
          由于不打算再去写一个 server，所以在本地写 md 文件，然后用 markdown-it
          去parse 写好的 markdown 文件。然后修改 markdown-it 的 render 方法，在
          render 的时候，将其替换成我们写好的 solid.js
          的组件，然后我们再去实现这些组件
        </p>
      </main>
    </div>
  );
};
export default test;
