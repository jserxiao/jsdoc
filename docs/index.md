---
layout: home

hero:
  name: 前端学习指南
  text: 全面系统的前端学习文档
  tagline: JavaScript、HTML、CSS 从入门到精通
  image:
    src: /hero-image.svg
    alt: 前端学习指南
  actions:
    - theme: brand
      text: 开始学习
      link: /md/javascript/
    - theme: alt
      text: HTML 基础
      link: /md/html/
    - theme: alt
      text: CSS 样式
      link: /md/css/

features:
  - icon: 📜
    title: JavaScript 全面覆盖
    details: 从基础语法到高级特性，涵盖 ES6+、异步编程、设计模式、性能优化等 20 个核心模块
  - icon: 🌐
    title: HTML 语义化
    details: 掌握 HTML5 语义化标签、表单、多媒体、可访问性等现代 Web 开发必备知识
  - icon: 🎨
    title: CSS 现代布局
    details: Flexbox、Grid、响应式设计、动画效果，构建美观且适配各设备的用户界面
  - icon: 🔍
    title: 全文搜索
    details: 内置本地搜索功能，快速定位所需知识点，提升学习效率
  - icon: 🌙
    title: 深色模式
    details: 自动适配系统主题，支持亮色/深色模式切换，保护眼睛舒适阅读
  - icon: 📱
    title: 响应式设计
    details: 完美适配桌面端和移动端，随时随地学习前端知识
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 页面加载动画
  document.querySelectorAll('.VPFeature').forEach((el, i) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    setTimeout(() => {
      el.style.transition = 'all 0.5s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 100 + i * 100)
  })
})
</script>
