import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js";
import path from "path"

let logger = Logger.getLogger()
class BlocklyProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     * 
     * @param {string} blocklyXml
     * @param {object} args Optional arguments specific to the render function of the BlocklyProcessor
     * @returns 
     */
    render(blocklyXml, args = { language: "nl", id: "" }) {
        if (!args.language || args.language == "") {
            args.language = "nl";
        }
        let html = `
        <div id="blocklyDiv_${args.id}" style="height: 480px; width: 600px;"></div>

        <script>

            function loadScripts${args.id}() {
                let dynamicScripts = [];
                document.querySelectorAll('.dynamic_blockly_script').forEach((scr) => {
                    dynamicScripts.push(scr.cloneNode(true))
                    scr.remove();
                })
                loadScript${args.id}(0, dynamicScripts)
            }

            function loadDynamicScript${args.id}(dynamicScripts) {
                try{        
                    // Hacky!
                    while(!varDone){
                        setTimeout(() => {  }, 500);
                        return;
                    }
                } catch(e){
                    setTimeout(() => {  loadDynamicScript${args.id}(dynamicScripts); }, 500);
                    return;
                }

                if(dynamicScripts){
                    dynamicScripts.forEach((scr) => {
                        document.getElementsByTagName("head")[0].appendChild(scr);
                        console.log("loaded script " + scr.id);
                    })
                }
                let code = 'function injectBlockly${args.id}() {let workspace = Blockly.inject("blocklyDiv_${args.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${blocklyXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${args.id}()'
                let script = document.createElement("script");
                script.className = "blockly_script dynamic_blockly_script";
                script.id = "blockly_script${args.id}"
                script.type = "text/javascript";
                script.innerHTML = code;
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log("loaded blockly_script${args.id}");
            }

            function loadScript${args.id}(index, dynamicScripts) {
                let scripts = ["blockly_compressed.js", "msg/${args.language}.js", "msg2/${args.language}.js", "blocks_compressed.js",
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
                            loadScript${args.id}(index + 1, dynamicScripts);
                        }
                    } else{
                        loadDynamicScript${args.id}(dynamicScripts);
                    }
                } else {
                    loadDynamicScript${args.id}(dynamicScripts);
                }
            }
            loadScripts${args.id}();
        </script>
        `
        return html; //TODO is not sanitized using DOMPurify.sanitize (problems with script tags)
    }
}

export default BlocklyProcessor;
