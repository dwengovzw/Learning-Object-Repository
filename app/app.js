import express from 'express'
import path from 'path'
import Logger from './logger.js'
import appRouter from './routes/app_router.js'
import ltijs from "ltijs"
import schedule from 'node-schedule'
import { pullAndProcessRepository } from './utils/git.js'
import cors from "cors";
import { urlReplaceInStaticFiles } from './utils/utils.js'
import passport from "passport"
import passportLocal from "passport-local"
import cookieParser from "cookie-parser"
import session from "cookie-session"
import bodyParser from "body-parser"
import User from "./models/user.js"



const logger = Logger.getLogger();

logger.info(`Running from directory: ${path.resolve(process.cwd())}`)
logger.info(`Running in ${process.env.NODE_ENV} environment`)

const app = express();
app.use(cors())

// setup authentication middleware
app.use(cookieParser());
app.use(session({ secret: "dwengo" }));
app.use(bodyParser.urlencoded({ extended: false }));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new passportLocal.Strategy((username, password, done) => {
    User.findOne({ username: username }, (err, foundUser) => {
        if (err){
            return done(err)
        }
        if (!foundUser){
            return done(null, false)
        }
        if (!foundUser.validPassword(password) || !foundUser.approved){
            return done(null, false)
        }
        return done(null, foundUser)
    })
}))

app.use(passport.initialize());
app.use(passport.session());

// end setup authentication middleware

// setup cashing header
let setCache = function (req, res, next) {
    const period = process.env.CACHE_TIME_SECONDS // period in seconds
    // you only want to cache for GET requests
    if (req.method == 'GET' && !(req.originalUrl.includes("/lti/") || req.originalUrl.includes("/api/manage/"))) {
      res.set('Cache-control', `public, max-age=${period}`)
      console.log("Setting caching for request")
    } else {
      // for the other requests set strict no caching parameters
      res.set('Cache-control', `no-store`)
      console.log("No caching for request")
    }
    next()
  }
  app.use(setCache)



// setup json parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', appRouter);
app.use('/storage', express.static(path.join(path.resolve(), "storage")))
app.use('/css', express.static(path.join(path.resolve(), 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(path.resolve(), 'app/static/css')));
app.use('/css', express.static(path.join(path.resolve(), 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/js', express.static(path.join(path.resolve(), 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(path.resolve(), 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(path.resolve(), 'node_modules/@fortawesome/fontawesome-free/js')));
app.use('/js', express.static(path.join(path.resolve(), 'app/static/js')));
app.use('/static', express.static(path.join(path.resolve(), 'app/static')));
app.set('views', path.join(path.resolve(), 'app', 'views'));
app.set('view engine', 'ejs');





// a cronjob (every day at midnight) to pull the repository and process the learning-objects/learning-paths
// every 10 seconds for debugging purposes: */10 * * * * *
// every day at 0h00 in production: 0 0 * * *
schedule.scheduleJob(process.env.LEARNING_OBJECT_LOADING_SCHEDULE, function () {
    pullAndProcessRepository(path.resolve(process.env.LEARNING_OBJECT_REPOSITORY_LOCATION));
});

urlReplaceInStaticFiles();


export default app