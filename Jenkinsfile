pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'raghurk'
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        FRONTEND_IMAGE = "raghurk/frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "raghurk/backend:${BUILD_NUMBER}"
        GIT_URL = 'https://github.com/Raghu273/mern-app.git'
        GIT_BRANCH = 'main'
        EC2_USER = 'ubuntu'
        EC2_IP = '13.201.55.144'
        EC2_SSH_KEY_CREDENTIALS = 'my-ec2-ssh-key'
    }

    triggers {
        githubPush() // This ensures the pipeline triggers on a push
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_URL}"
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        sh "docker build -t ${FRONTEND_IMAGE} -f ./frontend/dockerfile-frontend ./frontend"
                        sh "docker push ${FRONTEND_IMAGE}"
                        sh "docker build -t ${BACKEND_IMAGE} -f ./backend/dockerfile-backend ./backend"
                        sh "docker push ${BACKEND_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy with Docker Compose on EC2') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: EC2_SSH_KEY_CREDENTIALS, keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${EC2_USER}@${EC2_IP} '
                            cd /home/${EC2_USER}
                            docker-compose down || true
                            docker pull ${FRONTEND_IMAGE}
                            docker pull ${BACKEND_IMAGE}
                            docker-compose up -d --pull always
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker images'
        }
        failure {
            echo 'Pipeline Failed!'
        }
        success {
            echo 'Deployment Successful!'
        }
    }
}
