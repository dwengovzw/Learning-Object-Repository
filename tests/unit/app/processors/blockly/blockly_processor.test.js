import { expect, test } from "@jest/globals"
import InvalidArgumentError from "../../../../../app/utils/invalid_argument_error.js";
import DOMPurify from 'isomorphic-dompurify';
import BlocklyProcessor from "../../../../../app/processors/blockly/blockly_processor.js";

test("Test if blockly with correct input is rendered correctly.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "nl", id: "testid" }
    let expectedOutput = `
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/${inputArgs.language}.js", "msg2/${inputArgs.language}.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});

test("Test if blockly with empty language is rendered correctly.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "", id: "testid" }
    let expectedOutput = `
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/nl.js", "msg2/nl.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});

test("Test if blockly with undefined language is rendered correctly.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: undefined, id: "testid" }
    let expectedOutput = `
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/nl.js", "msg2/nl.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});

test("Test if blockly without language is rendered correctly.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { id: "testid" }
    let expectedOutput = `
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/nl.js", "msg2/nl.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});

test("Test if blockly render with invalid language throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "NOLANG", id: "test" }
    expect(() => {
        proc.render(inputXml, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if blockly render with empty id throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "en", id: "" }
    expect(() => {
        proc.render(inputXml, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if blockly render without id throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "en" }
    expect(() => {
        proc.render(inputXml, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if blockly render with undifined id throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "en", id: undefined }
    expect(() => {
        proc.render(inputXml, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if blockly render without arguments throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    expect(() => {
        proc.render(inputXml)
    }).toThrow(InvalidArgumentError)
});

test("Test if blockly render with empty xml throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = "";
    let inputArgs = { language: "en", id: "test" }
    let expectedOutput = `
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/${inputArgs.language}.js", "msg2/${inputArgs.language}.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});

test("Test if blockly render with undifined xml throws an error.", () => {
    let proc = new BlocklyProcessor();
    let inputXml = undefined;
    let inputArgs = { language: "en", id: "test" }
    expect(() => {
        proc.render(inputXml, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if dirty input is sanitized", () => {
    let proc = new BlocklyProcessor();
    let inputXml = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: undefined, id: "testid" }
    let expectedOutput = DOMPurify.sanitize(`
        <div id="blocklyDiv_${inputArgs.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${inputArgs.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${inputArgs.id}(0, dynamicScripts)
            }

            function loadDynamicScript${inputArgs.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${inputArgs.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${inputXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${inputArgs.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${inputArgs.id}");
            }

            function loadScript${inputArgs.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/nl.js", "msg2/nl.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            loadScript${inputArgs.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${inputArgs.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${inputArgs.id}(dynamicScripts);
                }
            }
            loadScripts${inputArgs.id}();
        </script>
        `, { FORCE_BODY: true, ADD_TAGS: ["script"] });
    expect(proc.render(inputXml, inputArgs)).toBe(expectedOutput);
});