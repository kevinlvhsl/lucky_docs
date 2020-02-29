let nav = require("./links/nav");
module.exports = {
  title: "高先生的博客",
  description: "旨在分享对技术的了解",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: `/images/oview/logo.png`
      }
    ],
    ["script", { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js" }],
    ["script", { src: "https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js" }],
    [
      "link",
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css"
      }
    ],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["link", { rel: "apple-touch-icon", href: "/icons/apple-touch-icon-152x152.png" }],
    ["link", { rel: "mask-icon", href: "/icons/safari-pinned-tab.svg", color: "#3eaf7c" }],
    ["meta", { name: "msapplication-TileImage", content: "/icons/msapplication-icon-144x144.png" }],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }]
  ],
  themeConfig: {
    lastUpdated: "Last Updated",
    // 如果你的文档不在仓库的根目录下：
    docsDir: "docs",
    // 默认为 false，设置为 true 来启用
    editLinks: true,
    // 自定义编辑链接的文本。默认是 "Edit this page"
    editLinkText: "帮助我们改进页面内容！",
    nav: nav,
    sidebar: "auto",
    sidebarDepth: 2,
    serviceWorker: {
      updatePopup: true
    }
  },
  plugins: [
    "@vuepress/back-to-top",
    "@vuepress/medium-zoom",
    "@vuepress/nprogress",
    "@vuepress/pwa",
    {
      serviceWorker: true,
      updatePopup: true
    }
  ]
};
