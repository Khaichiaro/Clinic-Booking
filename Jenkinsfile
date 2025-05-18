pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Checkout Code') {
      steps {
        echo '🔄 Checking out code...'
        checkout scm
      }
    }

    stage('Clean up existing containers') {
      steps {
        echo '🧹 Stopping old containers...'
        sh "docker-compose -f $COMPOSE_FILE down"
      }
    }

    stage('Build containers') {
      steps {
        echo '🏗️ Building containers...'
        sh "docker-compose -f $COMPOSE_FILE build"
      }
    }

    stage('Run containers') {
      steps {
        echo '🚀 Starting containers...'
        sh "docker-compose -f $COMPOSE_FILE up -d"
      }
    }
  }

  post {
    success {
      echo '✅ Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed!'
    }
  }
}
