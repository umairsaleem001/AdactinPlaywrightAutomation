
pipeline {
    agent any

    options 
    {
        disableConcurrentBuilds()
    }

    environment 
    {
        IMAGE_NAME = 'playwright-tests:jenkins-pipeline'
    }

    stages 
    {
        stage('Checkout') 
        {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') 
        {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Playwright Tests') 
        {
            steps 
            {
                withCredentials
                ([
                    usernamePassword
                    (
                        credentialsId: 'adactin-login',
                        usernameVariable: 'TEST_USERNAME',
                        passwordVariable: 'TEST_PASSWORD'
                    )
                ]) 

                {
                    script 
                    {
                        def containerName = "playwright-pipeline-${env.BUILD_NUMBER}"

                        try 
                        {
                            bat """
                                docker create --name ${containerName} -e BASE_URL=https://adactinhotelapp.com/ -e TEST_USERNAME -e TEST_PASSWORD -e CI=true %IMAGE_NAME%
                            """

                            def testStatus = bat(
                            returnStatus: true,
                            script: "docker start -a ${containerName}"
                            )

                            bat "docker cp ${containerName}:/app/playwright-report ./playwright-report"

                            bat "docker cp ${containerName}:/app/allure-results ./allure-results"

                            if (testStatus != 0) 
                            {
                                error('Playwright tests failed')
                            }
                        } 

                        finally 
                        {
                            bat "docker rm -f ${containerName} >nul 2>&1"
                        }
                    }
                }
            }
        }
    }

    post 
    {
        always 
        {
            allure
            ([
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])

            publishHTML(target: 
            [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Adactin Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}
