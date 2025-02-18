pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'raghurk'  // Your Docker Hub username
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'  // Replace with Jenkins Credential ID
        FRONTEND_IMAGE = "raghurk/frontend:${BUILD_NUMBER}"  // Fixed tag format
        BACKEND_IMAGE = "raghurk/backend:${BUILD_NUMBER}"  // Fixed tag format
        GIT_URL = 'https://github.com/Raghu273/mern-app.git'
        GIT_BRANCH = 'main'
        EC2_USER = 'ubuntu'  // SSH username for EC2 instance
        EC2_IP = '13.201.55.144'  // Replace with your EC2 instance IP
        EC2_SSH_KEY_CREDENTIALS = 'my-ec2-ssh-key'  // Replace with your SSH key credential ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                sh 'ls -l'
                git branch: "${GIT_BRANCH}", url: "${GIT_URL}"
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        sh 'ls -l'
                        // Build and push frontend
                        sh "docker build -t ${FRONTEND_IMAGE} -f ./frontend/dockerfile-frontend ./frontend"
                        sh "docker push ${FRONTEND_IMAGE}"

                        // Build and push backend
                        sh "docker build -t ${BACKEND_IMAGE} -f ./backend/dockerfile-backend ./backend"
                        sh "docker push ${BACKEND_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy with Docker Compose on EC2') {
            steps {
                script {
                    // SSH key from Jenkins credentials
                    withCredentials([sshUserPrivateKey(credentialsId: EC2_SSH_KEY_CREDENTIALS, keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${EC2_USER}@${EC2_IP} '
                            # Navigate to the directory where docker-compose.yaml is located
                            cd /home/${EC2_USER}
                            
                            # Stop and remove existing containers (if any)
                            docker-compose down || true
                            docker ps -a | grep backend | awk "{print \$1}" | xargs -I {} docker rm {}

                            # Pull the latest Docker images
                            docker pull ${FRONTEND_IMAGE}
                            docker pull ${BACKEND_IMAGE}
                            
                            # Start the containers with Docker Compose
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
            sh 'docker images'  // List all Docker images
        }
        failure {
            echo 'Pipeline Failed!'
        }
        success {
            echo 'Deployment Successful!'
        }
    }
}
