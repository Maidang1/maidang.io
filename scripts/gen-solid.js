const markdown = require('markdown-it');
const md = new markdown();
const parse = require('yargs-parser');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const { camelCase } = require('lodash');

const createComponent = (children, name) => {
  return `
  import { Component } from 'solid-js';
  import { Header } from '../components/Header';
  const ${name}: Component = () => {
    return (
      <div class='w-full h-full bg-white dark:bg-dark text-black dark:text-white'>
        <main class='px-6 py-[8vh] max-w-[76ch] mx-auto xl:text-lg dark:prose-invert relative dark:text-white'>
        <div class="mb-15">
          <div class='text-[2rem] text-zinc-800 font-bold leading-snug mb-4 md:mb-6 md:text-[2.6rem]'>${name}</div>
          <div class="text-black/40 mb-6">文章最开始的样子</div>
          <div class="text-black/80">2022/10/16</div>
        </div>
        ${children}
        </main>
      </div>
    );
  };
export default ${name};`;
};

const genSolid = () => {
  const argv = process.argv;
  const res = parse(argv);
  const { name, title } = res;

  const targetFile = path.join(__dirname, `../md-file/${name}.md`);
  if (!fs.existsSync(targetFile)) {
    console.log(`${targetFile} not exits`);
    process.exit(-1);
  }
  const data = fs.readFileSync(targetFile, 'utf-8');

  md.parse(data, null);

  md.renderer.rules.heading_open = (token, index, options) => {
    let tag = token[index].tag;
    tag = tag.replace('h', 'header');
    return `<Header className="${tag}">`;
  };
  md.renderer.rules.heading_close = () => {
    return `</Header>`;
  };

  md.renderer.rules.paragraph_open = () => {
    return `<p class="gh-content mt-5 prose">`;
  };
  md.renderer.rules.paragraph_close = () => {
    return `</p>`;
  };

  const html = md.render(data);
  const component = createComponent(html, camelCase(name));
  const prettierHtml = prettier.format(component);
  fs.writeFileSync(
    path.join(__dirname, `../src/posts/${name}.tsx`),
    prettierHtml
  );
};

genSolid();
