pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'compose.yml'
    DOCKER_BUILDKIT = '0'    // ไม่ใช้ BuildKit (เพื่อลด error 403)
    TARGET_SERVICES = 'frontend user-service doctor-service appointment-service api-gateway'
  }


  stages {
    stage('======= Checkout Code =======') {
      steps {
        echo '======= Checking out code... ======='
        dir('Clinic-Booking') {
            checkout scm
        }
      }
    }

    stage('======= Clean up existing containers =======') {
      steps {
        echo '======= Stopping old containers... ======='
        dir('Clinic-Booking') {
          sh "docker compose -f $COMPOSE_FILE down -v $TARGET_SERVICES"
        }
        echo '======= Pruning unused Docker data... ======='
        sh "docker system prune -a -f"
      }
    }

    stage('======= Build and Run containers' =======) {
      steps {
        echo '======= Starting containers... ======='
        dir('Clinic-Booking') {
            sh "docker compose -f $COMPOSE_FILE up -d $TARGET_SERVICES"
        }
      }
    }

    stage('======= Debug Status' =======) {
      steps {
        sh 'docker ps -a'
        sh 'docker logs frontend || true'
        sh 'docker logs user-service || true'
        sh 'docker inspect frontend || true'
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
    // always {
    //   echo '🧹 Post-cleaning Docker environment...'
    //   sh 'docker image prune -f --filter "dangling=true"'
    // }
  }
}
