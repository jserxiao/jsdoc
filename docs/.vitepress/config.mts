import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取 md 目录的绝对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mdDir = path.resolve(__dirname, '../md')

// 从文件夹名称或文件名提取标题（移除序号前缀）
function extractTitle(name: string): string {
  // 移除 .md 后缀
  let title = name.replace('.md', '')
  // 匹配 "01-xxx" 或 "01_xxx" 格式，提取 xxx 部分
  const match = title.match(/^\d+[-_](.+)$/)
  return match ? match[1] : title
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
      text: extractTitle(name),
      link: name.replace('.md', '')
    }))
}

// 递归生成侧边栏配置项
interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

function generateSidebarRecursive(
  dir: string, 
  basePath: string,
  depth: number = 0
): SidebarItem[] {
  const items: SidebarItem[] = []
  
  // 获取当前目录下的子文件夹
  const subFolders = getSubFolders(dir)
  
  // 获取当前目录下的 md 文件
  const mdFiles = getMdFiles(dir)
  
  // 先添加 index.md（如果存在）
  const indexPath = path.join(dir, 'index.md')
  if (fs.existsSync(indexPath)) {
    items.push({
      text: '概述',
      link: basePath + '/'
    })
  }
  
  // 添加当前目录下的其他 md 文件
  mdFiles.forEach(file => {
    items.push({
      text: file.text,
      link: basePath + '/' + file.link
    })
  })
  
  // 递归处理子文件夹
  subFolders.forEach(folder => {
    const folderPath = path.join(dir, folder)
    const title = extractTitle(folder)
    const newBasePath = basePath + '/' + folder
    
    // 检查子文件夹是否有内容
    const subItems = generateSidebarRecursive(folderPath, newBasePath, depth + 1)
    
    if (subItems.length > 0) {
      items.push({
        text: title,
        collapsed: depth < 2, // 前两层默认折叠
        items: subItems
      })
    }
  })
  
  return items
}

// 为某个技术栈生成侧边栏配置
function generateSidebar(techDir: string, techName: string): SidebarItem[] {
  return generateSidebarRecursive(techDir, `/md/${techName}`)
}

// 生成导航栏下拉项（从子文件夹读取）
function generateNavItems(techDir: string, techName: string): { text: string; link: string }[] {
  const subFolders = getSubFolders(techDir)
  
  return subFolders.map(folder => {
    const title = extractTitle(folder)
    return {
      text: title,
      link: `/md/${techName}/${folder}/`
    }
  })
}

// 动态获取 md 目录下的所有技术栈（一级目录）
function getTechStacks(): string[] {
  return getSubFolders(mdDir)
}

// 动态生成所有技术栈的导航和侧边栏配置
function generateConfig() {
  const techStacks = getTechStacks()
  const nav: any[] = []
  const sidebar: Record<string, any[]> = {}
  
  techStacks.forEach(tech => {
    const techDir = path.join(mdDir, tech)
    
    // 生成导航下拉项
    nav.push({
      text: tech,
      items: [
        { text: '概述', link: `/md/${tech}/` },
        ...generateNavItems(techDir, tech)
      ]
    })
    
    // 生成侧边栏（递归生成所有层级）
    sidebar[`/md/${tech}/`] = generateSidebar(techDir, tech)
  })
  
  return { nav, sidebar }
}

const { nav, sidebar } = generateConfig()

// 主配置
export default defineConfig({
  title: '前端学习指南',
  description: '全面系统的前端学习文档 - JavaScript、HTML、CSS、TypeScript、前端生态',
  
  // 启用简洁 URL
  cleanUrls: true,
  
  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    
    // 导航栏（动态生成折叠下拉）
    nav: [
      { text: '首页', link: '/' },
      ...nav
    ],
    
    // 侧边栏配置（动态生成）
    sidebar,
    
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
