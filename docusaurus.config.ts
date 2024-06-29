import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Seungwon Yang',
  tagline: 'M.S. Student | POSTECH',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ysw.kr/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'YangSeungWon', // Usually your GitHub org/user name.
  projectName: 'ysw.kr', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/seungwon.jpg',
    navbar: {
      title: 'Seungwon Yang',
      logo: {
        alt: 'photo',
        src: 'img/seungwon.jpg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        {to: '/about', label: 'About', position: 'left'},
        {to: '/misc', label: 'Misc', position: 'left'},
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/YangSeungWon/ysw.kr',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Work',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/YangSeungWon',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/seungwon-yang',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/people/Seungwon-Yang/pfbid026Aa4y6SUpBA1Sm7Q3Uda44AZYEpXrtPjC9d16jQiuYtDS4d5YaruL8m5w8Sep9mvl/',
            },
            {
              label: 'ORCID',
              href: 'https://orcid.org/0009-0009-0755-2450',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/whysw_p',
            }
          ],
        },
        {
          title: 'Hack',
          items: [
            {
              label: 'CTFTime',
              href: 'https://ctftime.org/user/64930',
            },
            {
              label: 'HackMD',
              href: 'https://hackmd.io/@whysw',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Mail',
              href: 'mailto:sw.yang43@gmail.com',
            },
            {
              label: 'WebSite',
              href: 'https://ysw.kr/',
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
  } satisfies Preset.ThemeConfig,
};

export default config;
