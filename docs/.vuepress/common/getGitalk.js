export default ({pages})=> {
    const path = window.location.pathname
    // 获取当前页面信息
    const dist = pages.filter(item => {
      return item.path === path
    })[0]
  
    //只有在isNoPage是false的时候才会显示评论
    if (!dist.frontmatter || !dist.frontmatter.isNoPage) {
      const page =document.querySelector('.page')
  
      const linkGitalk = document.createElement('link');
      linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
      linkGitalk.rel = 'stylesheet';
      document.body.appendChild(linkGitalk);
  
      const scriptGitalk = document.createElement('script');
      scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
      document.body.appendChild(scriptGitalk);
  
      scriptGitalk.onload= () => {
        let gitalk = document.createElement('div')
        gitalk.id = 'gitalk-container'
        page.appendChild(gitalk)
        var _gitalk = new Gitalk({
          clientID: '5dac32c1f40a1a16d249',
          clientSecret: '2094e99d4eff7fee2c1e07e98b8eea32b397970a',
          repo: 'lucky_docs', // 存储评论的仓库名字
          owner: 'mrgaogang',
          admin: ['mrgaogang'],  //仓库的管理员，可以有多个
          id: decodeURI(path),      // 每个页面根据url生成对应的issue，保证页面之间的评论都是独立的
        })
        _gitalk.render('gitalk-container')
      }
    }
  }
  