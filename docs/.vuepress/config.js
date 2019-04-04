module.exports = {
  base: "/deploy/block/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Block",
      description: "基于axios的装饰器解决方案"
    }
  },
  serviceWorker: true,
  themeConfig: {
    repo: "/",
    repoLabel: "GitLab",
    docsDir: "docs",
    locales: {
      "/": {
        label: "简体中文",
        selectText: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        nav: [
          {
            text: "指南",
            link: "/guide/"
          },
          {
            text: "API 参考",
            link: "/api/"
          }
        ],
        sidebar: [
          "/installation",
          "/",
          "/guide/",
          {
            title: "核心概念",
            collapsable: false,
            children: ["/guide/decoration", "/guide/modules"]
          }
        ]
      }
    }
  }
};
