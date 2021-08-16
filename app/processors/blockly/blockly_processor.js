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
    render(blocklyXml, args = { language: "nl" }) {
        if (!args.language || args.language == "") {
            args.language = "nl";
        }
        let html = `
        <div id="blocklyDiv" style="height: 480px; width: 600px;"></div>

        <script>

            function removePreviousScriptTags(){
                console.log("removing scripts")

                var scripts = document.getElementsByClassName('blockly_script');
                while(scripts[0]) {
                    scripts[0].parentNode.removeChild(scripts[0]);
                }
            }

            function loadScript(index) {
                let scripts = ["blockly_compressed.js", "msg/${args.language}.js", "msg2/${args.language}.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.type = "text/javascript";
                        script.onload = function () {
                            loadScript(index + 1);
                        }
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);
                    } else {
                        loadScript(index + 1);
                    }
                } else {
                    removePreviousScriptTags();
                    let code = 'function injectBlockly() {let workspace = Blockly.inject("blocklyDiv", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${blocklyXml}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly()'
                    let script = document.createElement("script");
                    script.className = "blockly_script";
                    script.type = "text/javascript";
                    script.innerHTML = code;
                    document.getElementsByTagName("head")[0].appendChild(script);

                }
            }
            loadScript(0);
        </script>
        `
        return html; //TODO is not sanitized using DOMPurify.sanitize (problems with script tags)
    }
}

export default BlocklyProcessor;
