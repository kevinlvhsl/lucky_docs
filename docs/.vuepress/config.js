let nav = require("./links/nav");
module.exports = {
    title: "高先生的博客",
    description: "旨在分享对技术的了解",
    head: [
        ['link', {
            rel: 'icon',
            href: `/images/oview/logo.png`
        }]
    ],
    themeConfig: {
        lastUpdated: 'Last Updated',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 默认为 false，设置为 true 来启用
        editLinks: true,
        // 自定义编辑链接的文本。默认是 "Edit this page"
        editLinkText: '帮助我们改进页面内容！',
        nav: nav,
        sidebar: 'auto',
        sidebarDepth: 2,
        serviceWorker:{
            updatePopup:true
        }
    },
    plugins: ['@vuepress/back-to-top', '@vuepress/medium-zoom','@vuepress/nprogress']
}