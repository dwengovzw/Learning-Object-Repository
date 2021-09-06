#!/bin/bash
git pull origin main # Get the latest version of the code

# Write the correct server environment settings to the .env file
echo "NODE_ENV = production" > .env 
echo "HTTP_PORT = 8085" >> .env
echo "HTTPS_PORT = 44300" >> .env
echo "KEY_FILE = './certs/key.pem'" >> .env
echo "CERT_FILE = './certs/cert.pem'" >> .env
echo "CA_FILE = ''" >> .env
echo 'LEARNING_OBJECT_STORAGE_LOCATION = "storage"' >> .env
echo 'DATABASE_URL=mongodb://localhost:27017/learning_object_database' >> .env
echo 'ERASE_DATABASE_ON_SYNC=true' >> .env
echo 'LEARNING_OBJECTS_GIT_REPOSITORY=https://github.com/dwengovzw/learning_content' >> .env
echo 'DOMAIN_URL=http://83.217.67.53/backend' >> .env
#echo "LEARNING_OBJECT_LOADING_SCHEDULE = '0 0 * * *'" >> .env
echo "LEARNING_OBJECT_LOADING_SCHEDULE = '*/10 * * * * *'" >> .env
echo "LEARNING_OBJECT_REPOSITORY_LOCATION = '/home/ubuntu/dwengo-deploy/learning_object_backend/repos'" >> .env

#restart application (was started with: pm2 start 'npm run start-production' --name learning-object-repository)

pm2 restart learning-object-repository
