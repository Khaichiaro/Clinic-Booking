pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clone & Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean up old containers') {
            steps {
                sh "docker compose -f $COMPOSE_FILE down"
            }
        }

        stage('Build containers') {
            steps {
                sh "docker compose -f $COMPOSE_FILE build"
            }
        }

        stage('Deploy containers') {
            steps {
                sh "docker compose -f $COMPOSE_FILE up -d"
            }
        }
    }

    post {
        success {
            echo '✅ Deployment complete!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
