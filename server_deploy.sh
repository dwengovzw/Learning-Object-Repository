#!/bin/bash
#git pull origin main # Get the latest version of the code

# remove the deploy directory content
sudo rm -rf /home/ubuntu/dwengo-build/application/*

# copy new repo code to deploy directory
cp -r /home/ubuntu/dwengo-repo/Learning-Object-Repository/* /home/ubuntu/dwengo-build/application/

# go to deploy directory
cd /home/ubuntu/dwengo-build/application/

# Write the correct server environment settings to the .env file
echo "NODE_ENV = production" > .env 
echo "HTTP_PORT = 8085" >> .env
echo "HTTPS_PORT = 44300" >> .env
echo "KEY_FILE = './certs/key.pem'" >> .env
echo "CERT_FILE = './certs/cert.pem'" >> .env
echo "CA_FILE = ''" >> .env
echo "CORS_ORIGIN = 'https://dwengo.org'" >> .env
echo 'LEARNING_OBJECT_STORAGE_LOCATION = "/home/ubuntu/dwengo-build/storage"' >> .env
echo 'LEARNING_OBJECT_STORAGE_NAME = "storage"' >> .env
echo 'DATABASE_URL=mongodb://localhost:27017/learning_object_database' >> .env
echo 'ERASE_DATABASE_ON_SYNC=false' >> .env
echo 'LEARNING_OBJECTS_GIT_REPOSITORY=https://github.com/dwengovzw/learning_content' >> .env
echo 'LEARNING_OBJECTS_GIT_REPOSITORY_BRANCH="main"' >> .env
echo 'DOMAIN_URL=https://www.dwengo.org/backend' >> .env
echo "LEARNING_OBJECT_LOADING_SCHEDULE = '0 0 * * *'" >> .env # Each day at midnight
echo "LEARNING_OBJECT_REPOSITORY_LOCATION = '/home/ubuntu/dwengo-build/repository'" >> .env
echo "SIMULATOR_BASE_PATH=https://blockly.dwengo.org"  >> .env
echo "SIMULATOR_READONLY_BASE_PATH=https://blockly.dwengo.org/readonly" >> .env
echo 'STATIC_BASE_PATH="/static"'  >> .env


# TODO update this for use with i-learn
echo "I_LEARN_AUTHENTICATION_ENDPOINT = 'https://auth-test.i-learn.be/authorize'" >> .env
echo "I_LEARN_KEY_LOCATION = 'https://auth-test.i-learn.be/.well-known/jwks.json'" >> .env
echo "I_LEARN_DWENGO_CLIENT_ID = 'yK0RF6IkVshhZjMIr1eTv3DfEWENH2NC'" >> .env
echo "I_LEARN_ISSUER_ID = 'https://auth-test.i-learn.be/'" >> .env
echo "I_LEARN_TOOL_LAUNCH_URI = 'https://www.dwengo.org'" >> .env
echo "I_LEARN_REDIRECT_URI = 'https://www.dwengo.org/backend/api/learningObject/getWrapped'" >> .env
echo "ADMIN_USER_USERNAME=dwengo" >> .env
echo "ADMIN_USER_PASSWORD='$1'" >> .env  # Admin password is supplied at deploy time
echo "CACHE_TIME_SECONDS=86400" >> .env # cache time set to one day


# Install dependancies
npm install

#restart application (was started with: pm2 start 'npm run start-production' --name learning-object-repository)

pm2 restart learning-object-repository || pm2 start 'npm run start-production' --name learning-object-repository
