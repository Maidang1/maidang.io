import { Component } from "solid-js";
import { useDark } from "./hooks/useDark";

const App: Component = () => {
  const [isDark, toggleTheme] = useDark();

  return (
    <div class="w-full h-full bg-white dark:bg-dark text-black dark:text-white">
      <main class="px-6 py-[8vh] max-w-[76ch] mx-auto xl:text-lg dark:prose-invert relative dark:text-white">
        <div class="absolute right-4 top-0 text-2xl mt-4 cursor-pointer text-coolgray">
          <div
            class={
              isDark() ? "i-ri-sun-line text-white" : "i-ri-moon-line text-dark"
            }
            onClick={toggleTheme}
          ></div>
        </div>
        <header>
          <h1 class="flex dark:text-white text-4xl">
            <span>Hi I'm Maidang</span>
          </h1>
        </header>
        <div class="dark:text-white">
          <div class="py-1">Font end development, working at ByteDance</div>
          <div class="py-1">Football Lover</div>
          <div class="py-1">Love coding</div>
          <div class="py-1">Must go to Rainbow Sea 🌈</div>
        </div>
        <div class="flex mt-8 mb-10">
          <a
            href="https://github.com/Maidang1"
            class="icon-item dark:hover:bg-white"
          >
            <div class="text-xl">
              <div class="i-ri-github-fill"></div>
            </div>
            <div class="text-sm ml-1">Github</div>
          </a>
          <a
            href="https://www.felixwliu.cn/"
            class="icon-item hover:bg-gradient-to-r from-[#fd5949] to-[#d6249f]"
          >
            <div class="text-xl">
              <div class="i-ri-book2-fill"></div>
            </div>
            <div class="text-sm ml-1">Blog</div>
          </a>
          <a
            href="https://space.bilibili.com/427444426"
            class="icon-item hover:bg-pink"
          >
            <div class="text-xl">
              <div class="i-ri-bilibili-fill"></div>
            </div>
          </a>
          <a
            href="https://www.zhihu.com/people/maidang606"
            class="icon-item hover:bg-[#056de8]"
          >
            <div class="text-xl">
              <div class="i-ri-zhihu-fill"></div>
            </div>
          </a>
          <a
            href="https://discord.com/channels/965276975449133066/1028879010761035817"
            class="icon-item hover:bg-[#5865F2]"
          >
            <div class="text-xl">
              <div class="i-ri-discord-fill"></div>
            </div>
          </a>
          <a
            href="https://twitter.com/felixwliu"
            class="icon-item hover:bg-[#00ACEE]"
          >
            <div class="text-xl">
              <div class="i-ri-twitter-fill"></div>
            </div>
          </a>
        </div>
        <div>
          <h1>Projects</h1>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <a
              class="project-item"
              href="https://github.com/Maidang1/markdown-image-upload"
            >
              <div class="h-full flex-center">
                <div class="flex-1">
                  <div class="text-dark dark:text-white">
                    markdown-image-upload
                  </div>
                  <div class="op-50 font-normal text-sm text-dark dark:text-white">
                    A vscode extension
                  </div>
                </div>
                <div class="ml-4 text-4xl op-80">
                  <div class="i-twemoji-grinning-cat-with-smiling-eyes"></div>
                </div>
              </div>
            </a>
            <a class="project-item" href="#">
              <div class="h-full flex-center">
                <div class="flex-1">
                  <div class="text-dark dark:text-white">
                    native-video-player
                  </div>
                  <div class="op-50 font-normal text-sm text-dark dark:text-white">
                    WIP: use election to play videos
                  </div>
                </div>
                <div class="ml-4 text-4xl op-80">
                  <div class="i-twemoji-ghost"></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
