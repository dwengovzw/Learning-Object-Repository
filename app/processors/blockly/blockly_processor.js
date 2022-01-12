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
        if (!args.language || args.language.trim() == "") {
            args.language = "nl";
        }
        if (!args.id || args.id.trim() == "") {
            throw new InvalidArgumentError("The unique object id must be passed to the blockly processor.");
        }
        let languages = ["aa", "ab", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "ba", "bm", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "zh", "cu", "cv", "kw", "co", "cr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "ka", "de", "gd", "ga", "gl", "gv", "el", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hr", "hu", "ig", "is", "io", "ii", "iu", "ie", "ia", "id", "ik", "it", "jv", "ja", "kl", "kn", "ks", "kr", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lb", "lu", "lg", "mk", "mh", "ml", "mi", "mr", "ms", "mg", "mt", "mn", "na", "nv", "nr", "nd", "ng", "ne", "nn", "nb", "no", "ny", "oc", "oj", "or", "om", "os", "pa", "fa", "pi", "pl", "pt", "ps", "qu", "rm", "ro", "rn", "ru", "sg", "sa", "si", "sk", "sl", "se", "sm", "sn", "sd", "so", "st", "es", "sc", "sr", "ss", "su", "sw", "sv", "ty", "ta", "tt", "te", "tg", "tl", "th", "bo", "ti", "to", "tn", "ts", "tk", "tr", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "cy", "wa", "wo", "xh", "yi", "yo", "za", "zu"];
        if (!languages.includes(args.language)) {
            throw new InvalidArgumentError("The language must be valid. " + args.language + " is not a supported language.")
        }
        if (typeof blocklyXml == 'undefined') {
            throw new InvalidArgumentError("The blockly XML is undefined. Please provide correct XML code.")
        }

        let html = `
        <div id="blocklyDiv_${args.id}" class="blocklyDiv" style="height: 480px; "></div>

        <script>

            function loadDynamicScript${args.id}() {

                for(let i = 0; i < 14; i++) {
                    let scr = document.getElementById("blockly_script" + i);
                    // If one of the required scripts is not loaded yet, check again after 500ms
                    if(scr == null || !scr.dataset.loaded) {
                        setTimeout(() => {  loadDynamicScript${args.id}(); }, 500);
                        return;
                    }
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

            function loadScript${args.id}(index) {
                let scripts = ["blockly_compressed.js", "msg/${args.language}.js", "msg2/${args.language}.js", "language_select.js", "blocks_compressed.js",
                "blocks/arduino.js", "blocks/comments.js", "blocks/conveyor.js", "blocks/drawingrobot.js", "blocks/dwenguino_new.js",
                "blocks/lists.js", "blocks/procedures.js", "blocks/socialrobot.js", "blocks/variables_dynamic.js", "blocks/variables.js"]
                
                if(index < scripts.length){
                    if(!document.getElementById("blockly_script" + index)){
                        let script = document.createElement("script");
                        script.id = "blockly_script" + index;
                        script.className = "blockly_script"
                        script.dataset.loaded = false
                        script.type = "text/javascript";
                        script.src = "@@URL_REPLACE@@/static/js/" + scripts[index]
                        document.getElementsByTagName("head")[0].appendChild(script);

                        script.onload = function () {
                            console.log("loaded blockly_script" + index);
                            script.dataset.loaded = true
                            loadScript${args.id}(index + 1);
                        }
                    } else{
                        loadDynamicScript${args.id}();
                        return;
                    }
                } else {
                    loadDynamicScript${args.id}();
                    return
                }
            }
            loadScript${args.id}(0)
        </script>
        `
        return html; //TODO is not sanitized using DOMPurify.sanitize (problems with script tags)
    }

    processFiles(files, metadata){
        let args = {}
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".xml") {
                inputString = f.buffer.toString('utf8');
                args.language = metadata.language;
                args.id = metadata._id;
                return true;
            }else{
                return false;
            }
        });
        return [this.render(inputString, args), files]
    }
}

export default BlocklyProcessor;
