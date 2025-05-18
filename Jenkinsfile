pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'compose.yml'
  }


  stages {
    stage('Checkout Code') {
      steps {
        echo '🔄 Checking out code...'
        dir('Clinic-Booking') {
            checkout scm
        }
      }
    }

    stage('Clean up existing containers') {
      steps {
        echo '🧹 Stopping old containers...'
        dir('Clinic-Booking') {
            sh "docker compose -f $COMPOSE_FILE down -v"
        }
        echo '🧽 Pruning unused Docker data...'
        sh "docker system prune -f"
      }
    }

    // stage('Build containers') {
    //   steps {
    //     echo '🏗️ Building containers...'
    //     sh "docker compose -f $COMPOSE_FILE build"
    //   }
    // }

    stage('Run containers') {
      steps {
        echo '🚀 Starting containers...'
        dir('Clinic-Booking') {
            sh "docker compose -f $COMPOSE_FILE up --build"
        }
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
