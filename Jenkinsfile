pipeline {
    agent any
    stages {
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Run Services') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
