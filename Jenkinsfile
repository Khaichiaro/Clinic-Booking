pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'compose.yml'
    DOCKER_BUILDKIT = '0'    // ✅ บังคับไม่ใช้ BuildKit (เพื่อลด error 403)
    TARGET_SERVICES = 'frontend db user-service doctor-service appointment-service'
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
            sh "docker compose -f $COMPOSE_FILE down -v $TARGET_SERVICES"
        }
        echo '🧽 Pruning unused Docker data...'
        sh "docker system prune -f"
      }
    }

    stage('Build containers') {
      steps {
        echo '🏗️ Building containers...'
        dir('Clinic-Booking') {
            sh "docker compose -f $COMPOSE_FILE build $TARGET_SERVICES"
        }
      }
    }

    stage('Run containers') {
      steps {
        echo '🚀 Starting containers...'
        dir('Clinic-Booking') {
            sh "docker compose -f $COMPOSE_FILE up --build $TARGET_SERVICES"
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
