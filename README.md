## Learning object repository

**Install**
```bash
npm install
```

Create local .env file in project root with the correct configuration. These are the keys that are used right now:

- NODE_ENV = development
- HTTP_PORT = 8085
- HTTPS_PORT = 44300
- KEY_FILE = "./certs/key.pem"
- CERT_FILE = "./certs/cert.pem"
- CA_FILE = ""
- LEARNING_OBJECT_STORAGE_LOCATION = "storage"
- DATABASE_URL=mongodb://localhost:27017/learning_object_test_database
- ERASE_DATABASE_ON_SYNC=true
- #LEARNING_OBJECTS_GIT_REPOSITORY=https://github.com/dwengovzw/learning_content
- LEARNING_OBJECTS_GIT_REPOSITORY=https://github.com/tomneutens/test_learning_content
- DOMAIN_URL=http://localhost:8085
- LEARNING_OBJECT_LOADING_SCHEDULE = '0 0/5 0 ? * * *'
- LEARNING_OBJECT_REPOSITORY_LOCATION = 'repos'
- 
- I_LEARN_AUTHENTICATION_ENDPOINT = "https://saltire.lti.app/platform/auth"
- #"https://<i-learn-auth-provider-domain>/authorize"
- I_LEARN_KEY_LOCATION = "https://saltire.lti.app/platform/jwks"
- #"https://<i-learn-auth-provider-domein>/.well-known/jwks"
- I_LEARN_DWENGO_CLIENT_ID = "8a6ff54b-d850-43f5-9214-785b5cb19b3c"
- I_LEARN_ISSUER_ID = "https://saltire.lti.app/platform/token/s65d9e32638de5de994a21990e481b776"
- I_LEARN_TOOL_LAUNCH_URI = "http://localhost:8085"
- I_LEARN_REDIRECT_URI_INTERNAL = "https://83.217.67.53/backend/api/learningObject/getWrapped"
- I_LEARN_REDIRECT_URI_EXTERNAL = "https://83.217.67.53/backend/api/learningObject/getRaw"
- I_LEARN_REDIRECT_URI_SIMULATOR = "https://blockly-backend.dwengo.org/lti/inititate_login"
- COOKIE_SECRET="4178a34a-e39c-4199-b849-d1c5d7ce1412"
- ADMIN_USER_USERNAME=""
- ADMIN_USER_PASSWORD=""

**Test**
```bash
npm run test
```

**Run**
```bash
npm run start
```
