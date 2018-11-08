pipeline {
  agent {
    kubernetes {
      label 'node-carbon'
    }
  }
  stages {
    stage('Prepare') {
      steps {
        script {
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
        container('vault') {
          script {
            env.TUNNEL_IDENTIFIER = sh(script: 'echo ${GIT_COMMIT}-${BUILD_NUMBER}', returnStdout: true)
            env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
            env.CODECOV_TOKEN = sh(script: 'vault read -field=value secret/ops/token/codecov', returnStdout: true)
            env.SAUCE_CRED_USR = sh(script: 'vault read -field=username secret/ops/token/saucelabs', returnStdout: true)
            env.SAUCE_CRED_PSW = sh(script: 'vault read -field=value secret/ops/token/saucelabs', returnStdout: true)
            env.REGISTRY_CRED_USR = sh(script: 'vault read -field=username secret/ops/account/nexus', returnStdout: true)
            env.REGISTRY_CRED_PSW = sh(script: 'vault read -field=password secret/ops/account/nexus', returnStdout: true)
          }
        }
        container('node') {
          sh "daemon --name=sauceconnect -- /usr/local/bin/sc -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
        }
      }
    }
    stage('Build: [ pull request ]') {
      when {
        changeRequest()
      }
      steps {
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e --env ci_chrome,ci_safari,ci_firefox"
          // add ci_ie11, when https://github.com/molgenis/molgenis-app-biobank-plots/issues/2 is fixed
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Build: [ master ]') {
      when {
        branch 'master'
      }
      steps {
        milestone 1
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e --env ci_chrome,ci_safari,ci_firefox"
          // add ci_ie11, when https://github.com/molgenis/molgenis-app-biobank-plots/issues/2 is fixed
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Release: [ master ]') {
      when {
        branch 'master'
      }
      environment {
        REPOSITORY = 'molgenis/molgenis-app-biobank-plots'
      }
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          script {
            env.RELEASE_SCOPE = input(
              message: 'Do you want to release?',
              ok: 'Release',
              parameters: [
                choice(choices: 'patch\nminor\nmajor', description: '', name: 'RELEASE_SCOPE')
              ]
            )
          }
        }
        milestone 2
        container('node') {
          sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPOSITORY}.git"

          sh "git checkout -f ${BRANCH_NAME}"

          sh "npm config set unsafe-perm true"
          sh "npm version ${RELEASE_SCOPE} -m '[ci skip] [npm-version] %s'"

          sh "git push --tags origin ${BRANCH_NAME}"
        }
      }
    }
  }
  post {
    always {
      container('node') {
        sh "daemon --name=sauceconnect --stop"
      }
      success {
        notifySuccess()
      }
      failure {
        notifyFailed()
      }
    }
  }
}

def notifySuccess() {
  hubotSend(message: 'Build success', status: 'INFO', site: 'slack-pr-app-team')
}

def notifyFailed() {
  hubotSend(message: 'Build failed', status: 'ERROR', site: 'slack-pr-app-team')
}
