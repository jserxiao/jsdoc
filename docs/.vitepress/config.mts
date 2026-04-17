import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取 md 目录的绝对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mdDir = path.resolve(__dirname, '../md')

// 从文件夹名称提取标题（移除序号前缀）
function extractTitle(folderName: string): string {
  // 匹配 "01-xxx" 或 "01_xxx" 格式，提取 xxx 部分
  const match = folderName.match(/^\d+[-_](.+)$/)
  return match ? match[1] : folderName
}

// 获取目录下的所有子文件夹
function getSubFolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(name => {
      const stat = fs.statSync(path.join(dir, name))
      return stat.isDirectory() && !name.startsWith('.')
    })
    .sort()
}

// 获取目录下的所有 md 文件
function getMdFiles(dir: string): { text: string; link: string }[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(name => name.endsWith('.md') && name !== 'index.md')
    .sort()
    .map(name => ({
      text: name.replace('.md', '').replace(/^\d+-/, ''),
      link: name.replace('.md', '')
    }))
}

// 为某个技术栈生成侧边栏配置
function generateSidebar(techDir: string): { text: string; collapsed: boolean; items: { text: string; link: string }[] }[] {
  const subFolders = getSubFolders(techDir)
  
  return subFolders.map(folder => {
    const folderPath = path.join(techDir, folder)
    const title = extractTitle(folder)
    const mdFiles = getMdFiles(folderPath)
    
    // 构建链接路径（相对于 md 目录）
    const techName = path.basename(techDir)
    
    const items = [
      { text: '概述', link: `/md/${techName}/${folder}/` },
      ...mdFiles.map(file => ({
        text: file.text,
        link: `/md/${techName}/${folder}/${file.link}`
      }))
    ]
    
    return {
      text: title,
      collapsed: true,
      items
    }
  })
}

// 主配置
export default defineConfig({
  title: '前端学习指南',
  description: '全面系统的前端学习文档 - JavaScript、HTML、CSS、TypeScript',
  
  // 启用简洁 URL
  cleanUrls: true,
  
  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'JavaScript', link: '/md/javascript/' },
      { text: 'TypeScript', link: '/md/typescript/' },
      { text: 'HTML', link: '/md/html/' },
      { text: 'CSS', link: '/md/css/' }
    ],
    
    // 侧边栏配置
    sidebar: {
      // JavaScript 侧边栏
      '/md/javascript/': [
        {
          text: 'JavaScript 学习指南',
          items: [{ text: '概述', link: '/md/javascript/' }]
        },
        ...generateSidebar(path.join(mdDir, 'javascript'))
      ],
      
      // TypeScript 侧边栏
      '/md/typescript/': [
        {
          text: 'TypeScript 学习指南',
          items: [{ text: '概述', link: '/md/typescript/' }]
        },
        ...generateSidebar(path.join(mdDir, 'typescript'))
      ],
      
      // HTML 侧边栏
      '/md/html/': [
        {
          text: 'HTML 学习指南',
          items: [{ text: '概述', link: '/md/html/' }]
        },
        ...generateSidebar(path.join(mdDir, 'html'))
      ],
      
      // CSS 侧边栏
      '/md/css/': [
        {
          text: 'CSS 学习指南',
          items: [{ text: '概述', link: '/md/css/' }]
        },
        ...generateSidebar(path.join(mdDir, 'css'))
      ]
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    
    // 搜索配置
    search: {
      provider: 'local'
    },
    
    // 页脚
    footer: {
      message: '前端学习指南',
      copyright: 'Copyright © 2026-present'
    },
    
    // 大纲配置
    outline: {
      level: [2, 3],
      label: '目录'
    },
    
    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    // 最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-repo/edit/main/docs/:path',
      text: '编辑此页'
    }
  },
  
  // Markdown 配置
  markdown: {
    lineNumbers: true
  },
  
  // Vite 配置
  vite: {
    server: {
      port: 5174
    }
  },
  
  // 多语言配置（可选）
  lang: 'zh-CN'
})
