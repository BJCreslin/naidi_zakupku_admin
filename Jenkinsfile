pipeline {
    agent any

    environment {
        IMAGE_NAME = "bjcreslin/admin"
        CONTAINER_NAME = "react-app"
        PORT = "3000"
    }

    stages {
        stage('Clone repository') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh "npm install"
                sh "npm run build"
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME:latest .'
                }
            }
        }

        stage('Clean Up Previous Container') {
            steps {
                script {
                    sh '''
                        docker rm -f $CONTAINER_NAME || true
                    '''
                }
            }
        }

        stage('Run new container') {
            steps {
                script {
                    sh '''
                        docker run -d --name $CONTAINER_NAME -p $PORT:80 $IMAGE_NAME:latest
                    '''
                }
            }
        }
    }
}