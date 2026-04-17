# Jenkins

## Jenkinsfile 配置

```groovy
// Jenkinsfile
pipeline {
  agent any

  environment {
    NODE_VERSION = '20'
  }

  stages {
    stage('Install') {
      steps {
        sh 'pnpm install'
      }
    }

    stage('Lint') {
      steps {
        sh 'pnpm lint'
      }
    }

    stage('Test') {
      steps {
        sh 'pnpm test'
      }
      post {
        always {
          junit '**/test-results/*.xml'
          cobertura coberturaReportFile: '**/coverage/*.xml'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'pnpm build'
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
      }
    }

    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          ssh user@server "cd /var/www/app && git pull && pnpm install && pnpm build && pm2 restart app"
        '''
      }
    }
  }

  post {
    success {
      slackSend(color: 'good', message: "构建成功: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
    }
    failure {
      slackSend(color: 'danger', message: "构建失败: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
    }
  }
}
```

## 常用配置

### 多分支构建

```groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      when {
        anyOf {
          branch 'main'
          branch 'develop'
        }
      }
      steps {
        sh 'pnpm build'
      }
    }
  }
}
```

### 参数化构建

```groovy
pipeline {
  agent any
  parameters {
    choice(name: 'ENV', choices: ['staging', 'production'], description: '部署环境')
    booleanParam(name: 'SKIP_TEST', defaultValue: false, description: '跳过测试')
  }
  stages {
    stage('Test') {
      when {
        expression { !params.SKIP_TEST }
      }
      steps {
        sh 'pnpm test'
      }
    }
    stage('Deploy') {
      steps {
        echo "Deploying to ${params.ENV}"
      }
    }
  }
}
```

### 并行执行

```groovy
pipeline {
  agent any
  stages {
    stage('Parallel') {
      parallel {
        stage('Lint') {
          steps { sh 'pnpm lint' }
        }
        stage('Test') {
          steps { sh 'pnpm test' }
        }
      }
    }
  }
}
```
