# GitLab CI

## 基础配置

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '20'

lint:
  stage: lint
  image: node:20
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run lint

test:
  stage: test
  image: node:20
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run test
  coverage: '/Coverage: \d+%/'

build:
  stage: build
  image: node:20
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_staging:
  stage: deploy
  image: node:20
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop
  script:
    - npm ci
    - npm run build
    - rsync -avz dist/ user@staging-server:/var/www/app/

deploy_production:
  stage: deploy
  image: node:20
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
  script:
    - npm ci
    - npm run build
    - rsync -avz dist/ user@prod-server:/var/www/app/
```

## 常用配置

### 缓存配置

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .pnpm-store/
```

### 环境变量

```yaml
variables:
  NODE_ENV: production
  API_URL: https://api.example.com

# 或在 GitLab UI 中配置
# Settings → CI/CD → Variables
```

### Docker 镜像

```yaml
build:
  image: node:20-alpine
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test
    POSTGRES_PASSWORD: secret
  script:
    - npm ci
    - npm run test
```

### 触发条件

```yaml
# 只在特定分支触发
only:
  - main
  - develop

# 排除特定分支
except:
  - /^feature\/.*$/

# 手动触发
when: manual

# 规则触发
rules:
  - if: $CI_COMMIT_BRANCH == "main"
    when: always
  - when: never
```
