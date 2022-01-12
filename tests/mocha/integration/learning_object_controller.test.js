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

        let folder_proc_integration_test = async function(hruid, input_folder_path, message, expected_filenames, expected_nr_files){
            console.log(colors.blue(message));
            let dir = path.resolve(input_folder_path)
            let files = getSubDirFiles(dir)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {});
            // Find the uuid of the newly created learning object
            let lo = await LearningObject.findOne({hruid: hruid, version: 1, language: "nl"}).exec();
            let resultDir = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, lo.id);
            let c = 1;

            console.log(colors.blue(`CASE ${c}: folder with uuid exists?`));
            let directoryForLO = fs.existsSync(resultDir);
            assert(directoryForLO, "Folder with uuid does not exist.")
            c+=1;

            console.log(colors.blue(`CASE ${c}: contains index.html?`));
            let indexFile = fs.existsSync(path.resolve(resultDir, "index.html"));
            assert(indexFile, "index.html does not exist")
            c+=1;

            if (expected_nr_files > 0){
                console.log(colors.blue(`CASE ${c}: contains only ${expected_nr_files} files?`));
                let filecount = fs.readdirSync(resultDir).length;
                assert(filecount == expected_nr_files, "There are more files than there shoud be.")
                c+=1;
            }

            expected_filenames.forEach(filename => {
                console.log(colors.blue(`CASE ${c}: contains ${filename}?`));
                let originalFile = fs.existsSync(path.resolve(resultDir, filename));
                assert(originalFile, `${filename} does not exist`)
                c+=1;
            })
            
        }
        /*
        hruid: e2e_test_processing_markdown_sample
        version: 1
        language: nl
        */
        it(colors.blue("Process sample markdown learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("e2e_test_processing_markdown_sample"
                    , "tests/integration/learning_object_controller/learning_object_samples/md_sample"
                    , "TEST: Creating markdown learning object"
                    , [ "index.md" ], 2);                        
        });


        /*
        hruid: e2e_test_processing_markdown_sample_with_files
        version: 1
        language: nl
        */
        it(colors.blue("Process sample markdown learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("e2e_test_processing_markdown_sample_with_files"
                    , "tests/integration/learning_object_controller/learning_object_samples/md_sample_with_files"
                    , "TEST: Creating markdown learning object with extra files."
                    , [ "index.md", "test.txt" ], 3);                        
        });

        /*
        hruid: test-audio
        version: 1
        language: nl
        */
        it(colors.blue("Process sample audio learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("test-audio"
                    , "tests/integration/learning_object_controller/learning_object_samples/audio_sample"
                    , "TEST: Creating audio learning object."
                    , [ "momo.mp3" ], 2);                           
        });


        /*
        hruid: test-blockly
        version: 1
        language: nl
        */
        it(colors.blue("Process sample blockly learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("test-blockly"
                    , "tests/integration/learning_object_controller/learning_object_samples/blockly_sample"
                    , "TEST: Creating blockly learning object."
                    , [ "blocks.xml" ], 2);                         
        });


        /*
        hruid: image-test
        version: 1
        language: nl
        */
        it(colors.blue("Process sample image learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("image-test"
                    , "tests/integration/learning_object_controller/learning_object_samples/image_sample"
                    , "TEST: Creating image learning object."
                    , [ "image1.png" ], 2);                           
        });


        /*
        hruid: test-pdf-as-lo
        version: 1
        language: nl
        */
        it(colors.blue("Process sample pdf learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("test-pdf-as-lo"
                    , "tests/integration/learning_object_controller/learning_object_samples/pdf_sample"
                    , "TEST: Creating pdf learning object."
                    , [ "vergadering.pdf" ], 2);                             
        });


        /*
        hruid: extern_test
        version: 1
        language: nl
        */
        it(colors.blue("Process sample extern learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("extern_test"
                    , "tests/integration/learning_object_controller/learning_object_samples/extern_sample"
                    , "TEST: Creating extern learning object."
                    , [ ], 1);                         
        });



        /*
        hruid: test-plain-text
        version: 1
        language: nl
        */
        it(colors.blue("Process sample pain text learning object correctly and create the right files"), async function(){
            folder_proc_integration_test("test-plain-text"
                    , "tests/integration/learning_object_controller/learning_object_samples/text_sample"
                    , "TEST: Creating text learning object."
                    , [ "test.txt" ], 2);                           
        });
    }); 
})