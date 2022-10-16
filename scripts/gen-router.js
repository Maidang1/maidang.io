const fs = require('fs');
const path = require('path');
const { camelCase, uniq } = require('lodash');
const prettier = require('prettier');
const getFileName = (filename) => {
  return path.parse(filename).name;
};
let posts = fs.readdirSync(path.join(__dirname, '../src/posts'), 'utf-8');
posts = uniq(posts.map((p) => getFileName(p)));

const importStament = posts.reduce((pre, post) => {
  return pre + `import ${camelCase(post)} from './posts/${post}'\n`;
}, '');

const routerStament = posts.reduce((pre, post) => {
  return pre + `<Route path='/${post}' component={${camelCase(post)}} />\n`;
}, '');

console.log(importStament, routerStament);
let html = `
  import { Routes, Route } from '@solidjs/router';
  import App from './App';
  ${importStament}

  const Page = () => {
    return (
      <>
        <Routes>
          <Route path='/' component={App} />
          ${routerStament}
          <Route path='*' element={<div>not found</div>} />
        </Routes>
      </>
    );
  };
  export default Page;
`;

html = prettier.format(html);

fs.writeFileSync(path.join(__dirname, '../src/router.tsx'), html);
