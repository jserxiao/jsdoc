# CI 与 CD

## 概述

持续集成（Continuous Integration）和持续部署（Continuous Deployment/ Delivery）是现代软件开发的核心实践，通过自动化构建、测试和部署流程，提高开发效率，减少人为错误。

## 核心概念

| 概念 | 说明 |
|------|------|
| **CI（持续集成）** | 代码提交后自动构建、测试，确保代码质量 |
| **CD（持续交付）** | 自动将代码部署到测试/预发布环境，需手动发布到生产 |
| **CD（持续部署）** | 全自动部署到生产环境，无需人工干预 |

## CI/CD 平台对比

| 平台 | 定位 | 核心优势 | 适用场景 |
|------|------|----------|----------|
| **GitHub Actions** | GitHub 原生 CI/CD | 深度集成、配置简单 | GitHub 项目首选 |
| **GitLab CI** | GitLab 内置 CI/CD | 一体化 DevOps 平台 | GitLab 用户 |
| **Jenkins** | 开源自动化服务器 | 插件丰富、高度可定制 | 企业级复杂流程 |
| **CircleCI** | 云原生 CI/CD | 速度快、配置灵活 | 云原生项目 |
| **Vercel** | 前端部署平台 | 零配置部署、预览环境 | 前端项目 |

## 详细文档

| 文档 | 说明 |
|------|------|
| [GitHub Actions](./GitHub-Actions.md) | GitHub 原生 CI/CD |
| [GitLab CI](./GitLab-CI.md) | GitLab 内置 CI/CD |
| [Jenkins](./Jenkins.md) | 开源自动化服务器 |
| [Vercel 部署](./Vercel部署.md) | 前端快速部署平台 |
| [Docker 容器化](./Docker容器化.md) | Docker 部署方案 |
| [环境变量管理](./环境变量管理.md) | Secrets 与环境配置 |

## 技术选型建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| GitHub 项目 | GitHub Actions | 原生集成、配置简单 |
| GitLab 项目 | GitLab CI | 一体化体验 |
| 复杂企业流程 | Jenkins | 高度可定制 |
| 前端快速部署 | Vercel / Netlify | 零配置、自动预览 |
| 容器化部署 | Docker + GitHub Actions | 标准化部署 |
