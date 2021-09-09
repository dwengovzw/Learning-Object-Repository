import express from 'express'
import path from 'path'
import Logger from './logger.js'
import appRouter from './routes/app_router.js'
import ltijs from "ltijs"
import schedule from 'node-schedule'
import { pullAndProcessRepository } from './utils/git.js'
import cors from "cors";
import { urlReplaceInStaticFiles } from './utils/utils.js'


const logger = Logger.getLogger();

logger.info(`Running from directory: ${path.resolve(process.cwd())}`)
logger.info(`Running in ${process.env.NODE_ENV} environment`)

const app = express();
app.use(cors())

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