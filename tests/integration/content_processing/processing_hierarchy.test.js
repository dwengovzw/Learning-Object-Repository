import { expect, test } from "@jest/globals"
import DOMPurify from 'isomorphic-dompurify';
import ProcessingProxy from "../../../app/processors/processing_proxy.js"
import { ProcessorContentType } from "../../../app/processors/content_type.js"

test("Test processing of text/plain", () => {
    let proxy = new ProcessingProxy();
    let input = "Just plain text."
    let output = DOMPurify.sanitize(input);
    expect(proxy.render(ProcessorContentType.TEXT_PLAIN, input)).toBe(output);

});

test("Test processing of text/markdown", () => {
    let proxy = new ProcessingProxy();
    let input = "[Duck Duck Go](https://duckduckgo.com)"
    let output = DOMPurify.sanitize('<p><a href="https://duckduckgo.com">Duck Duck Go</a></p>');
    expect(proxy.render(ProcessorContentType.TEXT_MARKDOWN, input).trim()).toBe(output.trim());
});

test("Test processing of image/image", () => {
    let proxy = new ProcessingProxy();
    let input = "https://dwengo.org/wp-content/uploads/2017/06/dwengo2.png";
    let output = DOMPurify.sanitize(`<img src="${input}" alt="">`);
    expect(proxy.render(ProcessorContentType.IMAGE_INLINE, input)).toBe(output);
});

test("Test processing of audio/mpeg", () => {
    let proxy = new ProcessingProxy();
    let input = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let output = DOMPurify.sanitize(`<audio controls>
                <source src="${input}" type="audio/mpeg">
                Your browser does not support the audio element.
                </audio>`);
    expect(proxy.render(ProcessorContentType.AUDIO_MPEG, input)).toBe(output);
});

test("Test processing of application/pdf", () => {
    let proxy = new ProcessingProxy();
    let input = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    let output = DOMPurify.sanitize(`<embed src="${input}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })
    expect(proxy.render(ProcessorContentType.APPLICATION_PDF, input)).toBe(output);
});

test("Test processing of blockly", () => {
    let proxy = new ProcessingProxy();
    let input = '<xml xmlns="https://developers.google.com/blockly/xml" class=" FB_FW_ext eidReader"></xml>';
    let inputArgs = { language: "nl", id: "testid" }
    //TODO should be sanitized
    let output = `
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
                let code = 'function injectBlockly${inputArgs.id}() {let workspace = Blockly.inject("blocklyDiv_${inputArgs.id}", { readOnly: true, scrollbars: true, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true } }); var xml = Blockly.Xml.textToDom(\\'${input}\\'); Blockly.Xml.domToWorkspace(xml, workspace); } injectBlockly${inputArgs.id}()'
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
    expect(proxy.render(ProcessorContentType.BLOCKLY, input, inputArgs)).toBe(output);
});
//TODO: Test processing of complex content = md/html/lia with references to other learning objects