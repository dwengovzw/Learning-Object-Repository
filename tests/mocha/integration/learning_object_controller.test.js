import {strict as assert} from "assert"
import learningObjectController from "../../../app/controllers/interface/learning_object_controller.js";
import { getSubDirFiles } from "../../../app/utils/git.js"
import fs_async from "fs/promises"
import fs from "fs"
import path from "path"
import { connect, closeDatabase, clearDatabase } from "../../utils/db.js"
import LearningObject from "../../../app/models/learning_object.js"
import colors from "colors"


describe("LearningObjectController", function(){
    const originalEnv = process.env; // Backup environment variables
    before(async () => {
        await connect();
        process.env.LEARNING_OBJECT_STORAGE_LOCATION = "test_storage"
    });
    after(async () => {
        await closeDatabase()
        process.env.LEARNING_OBJECT_STORAGE_LOCATION = originalEnv;
    });

    beforeEach(async function(){
        await clearDatabase()
    });

    afterEach(async function(){
        let location = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION);
        await fs_async.readdir(location).then(
            (f) => Promise.all(f.map(e => fs_async.rm(`${location}/${e}`, { recursive: true })))
        );
    });

    
    describe("#createLearningObject({ files: files, filelocation: dir }, {})", async function() {
        /*
        hruid: e2e_test_processing_markdown_sample
        version: 1
        language: nl
        */
        it(colors.blue("Process sample markdown learning object correctly and create the right files"), async function(){
            let hruid = "e2e_test_processing_markdown_sample";
            console.log(colors.blue("TEST: Creating markdown learning object"));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/md_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains index.md?"));
            let originalFile = fs.existsSync(path.resolve(resultDir, "index.md"));
            assert(originalFile, "index.md does not exist")
                        
        });


        /*
        hruid: e2e_test_processing_markdown_sample_with_files
        version: 1
        language: nl
        */
        it(colors.blue("Process sample markdown learning object correctly and create the right files"), async function(){
            let hruid = "e2e_test_processing_markdown_sample_with_files";
            console.log(colors.blue("TEST: Creating markdown learning object with extra files."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/md_sample_with_files")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains index.md?"));
            let originalFile = fs.existsSync(path.resolve(resultDir, "index.md"));
            assert(originalFile, "index.md does not exist")

            console.log(colors.blue("CASE 4: contains test.txt?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "test.txt"));
            assert(extraFile, "test.txt does not exist")

            console.log(colors.blue("CASE 5: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 3, "There are more files than there shoud be.")
                        
        });

        /*
        hruid: test-audio
        version: 1
        language: nl
        */
        it(colors.blue("Process sample audio learning object correctly and create the right files"), async function(){
            let hruid = "test-audio";
            console.log(colors.blue("TEST: Creating audio learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/audio_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains momo.mp3?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "momo.mp3"));
            assert(extraFile, "momo.mp3 does not exist")

            console.log(colors.blue("CASE 4: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 2, "There are more files than there shoud be.")
                        
        });


        /*
        hruid: test-blockly
        version: 1
        language: nl
        */
        it(colors.blue("Process sample blockly learning object correctly and create the right files"), async function(){
            let hruid = "test-blockly";
            console.log(colors.blue("TEST: Creating blockly learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/blockly_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains blocks.xml?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "blocks.xml"));
            assert(extraFile, "blocks.xml does not exist")

            console.log(colors.blue("CASE 4: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 2, "There are more files than there shoud be.")
                        
        });


        /*
        hruid: image-test
        version: 1
        language: nl
        */
        it(colors.blue("Process sample image learning object correctly and create the right files"), async function(){
            let hruid = "image-test";
            console.log(colors.blue("TEST: Creating image learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/image_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains image1.png?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "image1.png"));
            assert(extraFile, "image1.png does not exist")

            console.log(colors.blue("CASE 4: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 2, "There are more files than there shoud be.")
                        
        });


        /*
        hruid: test-pdf-as-lo
        version: 1
        language: nl
        */
        it(colors.blue("Process sample pdf learning object correctly and create the right files"), async function(){
            let hruid = "test-pdf-as-lo";
            console.log(colors.blue("TEST: Creating pdf learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/pdf_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains vergadering.pdf?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "vergadering.pdf"));
            assert(extraFile, "vergadering.pdf does not exist")

            console.log(colors.blue("CASE 4: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 2, "There are more files than there shoud be.")
                        
        });


        /*
        hruid: extern_test
        version: 1
        language: nl
        */
        it(colors.blue("Process sample extern learning object correctly and create the right files"), async function(){
            let hruid = "extern_test";
            console.log(colors.blue("TEST: Creating extern learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/extern_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains only one files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 1, "There are more files than there shoud be.")
                        
        });



        /*
        hruid: test-plain-text
        version: 1
        language: nl
        */
        it(colors.blue("Process sample pain text learning object correctly and create the right files"), async function(){
            let hruid = "test-plain-text";
            console.log(colors.blue("TEST: Creating extern learning object."));
            let dir = path.resolve("tests/integration/learning_object_controller/learning_object_samples/text_sample")
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);

            console.log(colors.blue("CASE 1: folder with uuid exists?"));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")

            console.log(colors.blue("CASE 2: contains index.html?"));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")

            console.log(colors.blue("CASE 3: contains test.txt?"));
            let extraFile = fs.existsSync(path.resolve(resultDir, "test.txt"));
            assert(extraFile, "test.txt does not exist")

            console.log(colors.blue("CASE 4: contains only two files?"));
            let filecount = fs.readdirSync(resultDir).length;
            assert(filecount == 2, "There are more files than there shoud be.")
                        
        });
    }); 
})