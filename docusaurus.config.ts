import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";

const config: Config = {
  title: "Seungwon Yang",
  tagline: "POSTECH",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://ysw.kr/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "YangSeungWon", // Usually your GitHub org/user name.
  projectName: "ysw.kr", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/seungwon.jpg",
    navbar: {
      title: "Seungwon Yang",
      logo: {
        alt: "photo",
        src: "img/seungwon.jpg",
      },
      items: [
        { to: "/about", label: "About", position: "left" },
        { to: "/publications", label: "Publications", position: "left" },
        { to: "/misc", label: "Misc", position: "left" },
        { to: "/tools", label: "Tools", position: "left" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Work",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/YangSeungWon",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/seungwon-yang",
            },
            {
              label: "Facebook",
              href: "https://www.facebook.com/people/Seungwon-Yang/pfbid026Aa4y6SUpBA1Sm7Q3Uda44AZYEpXrtPjC9d16jQiuYtDS4d5YaruL8m5w8Sep9mvl/",
            },
            {
              label: "ORCID",
              href: "https://orcid.org/0009-0009-0755-2450",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/whysw_p",
            },
          ],
        },
        {
          title: "Hack",
          items: [
            {
              label: "CTFTime",
              href: "https://ctftime.org/user/64930",
            },
            {
              label: "HackMD",
              href: "https://hackmd.io/@whysw",
            },
          ],
        },
        {
          title: "Contact",
          items: [
            {
              label: "Mail",
              href: "mailto:sw.yang43@gmail.com",
            },
            {
              label: "WebSite",
              href: "https://ysw.kr/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Seungwon Yang. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,

  // Add webpack configuration for path alias
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve("swc-loader"),
      options: {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2017",
        },
        module: {
          type: isServer ? "commonjs" : "es6",
        },
      },
    }),
  },

  plugins: [
    function (context, options) {
      return {
        name: "webpack-config-plugin",
        configureWebpack(config, isServer, utils) {
          return {
            resolve: {
              alias: {
                "@": path.resolve(__dirname, "./src"),
              },
            },
          };
        },
      };
    },
  ],
};

export default config;
