import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue3 Schema Table',
  description: '一个高性能、Schema 驱动的动态表格组件库，专为 Vue 3 设计',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Vue3 Schema Table',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'TableSchema', link: '/api/table-schema' },
            { text: 'ColumnSchema', link: '/api/column-schema' },
            { text: 'Props', link: '/api/props' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '使用示例',
          items: [
            { text: '基础用法', link: '/examples/basic' },
            { text: '排序和筛选', link: '/examples/sort-filter' },
            { text: '固定列', link: '/examples/fixed-columns' },
            { text: '行选择', link: '/examples/row-selection' },
            { text: '虚拟滚动', link: '/examples/virtual-scroll' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    footer: {
      message: '基于 Vue 3 构建的高性能表格组件库',
      copyright: 'Copyright © 2024 Vue3 Schema Table',
    },
  },
})

