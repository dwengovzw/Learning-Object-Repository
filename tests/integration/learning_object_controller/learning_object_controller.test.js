//learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})

import { expect, test, beforeEach, afterEach, jest } from "@jest/globals"
import learningObjectController from "../../../app/controllers/interface/learning_object_controller";
import { getSubDirFiles } from "../../../app/utils/git"
import fs from "fs"
import path from "path"
import { connect, closeDatabase, clearDatabase } from "../../utils/db"

beforeAll(async () => await connect());
afterAll(async () => await closeDatabase());

const originalEnv = process.env; // Backup environment variables

// Change environment variables before each test to create test environment
beforeEach(async () => {
    await clearDatabase()
    jest.resetModules();
    process.env.LEARNING_OBJECT_STORAGE_LOCATION = "test_storage"
});

// Reset environment variables
afterEach(() => {
    process.env = originalEnv;
});

test("E2E test markdown processing", async () => {
    let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/md_sample")
    let files = getSubDirFiles(dir)
    try {
        await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
    } catch (e) {
        console.log("error")
    }
   
})