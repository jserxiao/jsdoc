import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 获取 docs 目录的绝对路径
const docsDir = path.resolve(__dirname, '..')

// 中文数字映射
const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', 
                        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']

/**
 * 扫描目录并生成侧边栏配置
 * @param categoryPath 分类路径，如 'javascript'、'html'、'css'
 */
function generateSidebar(categoryPath: string) {
  const categoryDir = path.join(docsDir, categoryPath)
  
  if (!fs.existsSync(categoryDir)) {
    return []
  }
  
  // 读取所有子目录，按名称排序
  const dirs = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort()
  
  const sidebarItems: any[] = [
    {
      text: `${categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1)} 学习指南`,
      items: [
        { text: '目录', link: `/${categoryPath}/README` }
      ]
    }
  ]
  
  dirs.forEach((dirName, index) => {
    const dirPath = path.join(categoryDir, dirName)
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .sort()
    
    // 提取模块名称（去掉序号前缀）
    const moduleName = dirName.replace(/^\d+-/, '')
    
    // 构建菜单项
    const items: any[] = []
    
    // 首先添加 README（模块概述）
    if (files.includes('README.md')) {
      items.push({
        text: '模块概述',
        link: `/${categoryPath}/${dirName}/README`
      })
    }
    
    // 然后添加其他文件
    files.forEach(file => {
      if (file === 'README.md') return
      
      const filePath = path.join(dirPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      
      // 从文件内容中提取第一个标题作为显示名称
      let displayName = ''
      const titleMatch = fileContent.match(/^#\s+(.+)$/m)
      
      if (titleMatch) {
        displayName = titleMatch[1].trim()
      } else {
        // 从文件名生成显示名称
        displayName = file.replace('.md', '').replace(/^\d+-/, '')
      }
      
      // 构建链接路径 - 不带 .md 后缀
      const linkPath = `/${categoryPath}/${dirName}/${file.replace('.md', '')}`
      
      items.push({
        text: displayName,
        link: linkPath
      })
    })
    
    sidebarItems.push({
      text: `${chineseNumbers[index]}、${moduleName}`,
      collapsed: index > 0, // 第一个默认展开，其他默认折叠
      items
    })
  })
  
  return sidebarItems
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端学习指南",
  description: "全面的 JavaScript、HTML、CSS 学习文档",
  lang: 'zh-CN',
  
  // 主题配置
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    
    // 站点名称
    siteTitle: '前端学习指南',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'JavaScript', link: '/javascript/README' },
      { text: 'HTML', link: '/html/README' },
      { text: 'CSS', link: '/css/README' }
    ],
    
    // 侧边栏 - 动态生成
    sidebar: {
      '/javascript/': generateSidebar('javascript'),
      '/html/': generateSidebar('html'),
      '/css/': generateSidebar('css')
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],
    
    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024 前端学习指南'
    },
    
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    
    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    
    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    // 大纲配置
    outline: {
      level: [2, 3],
      label: '目录'
    },
    
    // 返回顶部
    returnToTopLabel: '返回顶部',
    
    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',
    
    // 深色模式切换
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    
    // 搜索配置 - 本地搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  },
  
  // Markdown 配置
  markdown: {
    lineNumbers: true,
    math: true
  },
  
  // Head 配置
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }]
  ],
  
  // 启用干净的 URL（去掉 .html 后缀）
  cleanUrls: true
})
