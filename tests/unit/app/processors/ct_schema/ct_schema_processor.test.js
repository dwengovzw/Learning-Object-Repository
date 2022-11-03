import { expect, test } from "@jest/globals";
import { CTSchemaProcessor } from "../../../../../app/processors/ct_schema/ct_schema_processor.js";

let staticPath = `${process.env.DOMAIN_URL}${process.env.STATIC_BASE_PATH}/img/ct_schema/`;

let given = (input, hasMissing=false, hasExtra=false) => {
    let inputText = "";
    if (!hasMissing){
        inputText += `<context>${input.context}</context><decomposition>${input.decomp}</decomposition>`
    }
    inputText += `<patternRecognition>${input.pattern}</patternRecognition>
                <abstraction>${input.abstr}</abstraction>
                <algorithms>${input.algo}</algorithms>
                <implementation>${input.impl}</implementation>
                `
    if (hasExtra){
        inputText += `<context>${input.context}</context><decomposition>${input.decomp}</decomposition>`
    }
    return inputText
}

let expected = (output) => `
<div class="ct_schema_container">
<div class="ct_context_container">${output.context}</div>
<div class="ct_row1_container">
    <div class="ct_decomposition_container">${output.decomp}<div class="ct_logo"><img src="${staticPath + "decompositie.png"}"/></div></div>
    <div class="ct_pattern_recognition_container">${output.pattern}<div class="ct_logo"><img src="${staticPath + "patroonherkenning.png"}"/></div></div>
</div>
<div class="ct_row2_container">
    <div class="ct_abstraction_container">${output.abstr}<div class="ct_logo"><img src="${staticPath + "abstractie.png"}"/></div></div>
    <div class="ct_algorithm_container">${output.algo}<div class="ct_logo"><img src="${staticPath + "algoritme.png"}"/></div></div>
</div>
<div class="ct_implementation_container">${output.impl}<div class="ct_logo"><img src="${staticPath + "decompositie.png"}"/></div></div>
</div>`

let removeWhiteSpaceBetweenTags = (str) => {
    // Remove \n, remove whitespace between tags, reduce multiple spaces to one space, trim the ends
    return str.replaceAll("\n", "").split(/>\s*</g).join("><").split(/\s+/g).join(" ").trim();
}

test("Test if CT Schema learning objects are split into the individual parts correctly and the containing markdown is rendered.", () => {

    let input = {
        context: '# Context',
        decomp: 'decomp',
        pattern: '## pattern',
        abstr: 'abstr',
        algo: 'algo',
        impl: 'impl'
    }

    let output = {
        context: '<h1 id="context">Context</h1>',
        decomp: '<p>decomp</p>',
        pattern: '<h2 id="pattern">pattern</h2>',
        abstr: '<p>abstr</p>',
        algo: '<p>algo</p>',
        impl: '<p>impl</p>'
    }

    
    let renderer = new CTSchemaProcessor();
    let html = renderer.render(given(input));
    expect(removeWhiteSpaceBetweenTags(html)).toEqual(removeWhiteSpaceBetweenTags(expected(output)));
});


test("Test if CT Schema learning objects are split into the individual parts correctly when there are empty tags.", () => {

    let input = {
        context: '',
        decomp: 'decomp',
        pattern: '## pattern',
        abstr: '',
        algo: 'algo',
        impl: 'impl'
    }

    let output = {
        context: '',
        decomp: '<p>decomp</p>',
        pattern: '<h2 id="pattern">pattern</h2>',
        abstr: '',
        algo: '<p>algo</p>',
        impl: '<p>impl</p>'
    }

    
    let renderer = new CTSchemaProcessor();
    let html = renderer.render(given(input));
    // Remove newlines and replace multiple spaces by one space
    expect(removeWhiteSpaceBetweenTags(html)).toEqual(removeWhiteSpaceBetweenTags(expected(output)));
});


test("Test if CT Schema learning objects are split into the individual parts correctly when tags are missing.", () => {

    let input = {
        context: 'msqdkf',
        decomp: 'decomp',
        pattern: '## pattern',
        abstr: 'abstr',
        algo: 'algo',
        impl: 'impl'
    }

    let output = {
        context: '',
        decomp: '',
        pattern: '<h2 id="pattern">pattern</h2>',
        abstr: '<p>abstr</p>',
        algo: '<p>algo</p>',
        impl: '<p>impl</p>'
    }

    
    let renderer = new CTSchemaProcessor();
    let html = renderer.render(given(input, true));
    // Remove newlines and replace multiple spaces by one space
    expect(removeWhiteSpaceBetweenTags(html)).toEqual(removeWhiteSpaceBetweenTags(expected(output)));
});

test("Test if CT Schema learning objects are split into the individual parts correctly when extra tags are present", () => {

    let input = {
        context: '# Context',
        decomp: 'decomp',
        pattern: '## pattern',
        abstr: 'abstr',
        algo: 'algo',
        impl: 'impl'
    }

    let output = {
        context: '<h1 id="context">Context</h1>',
        decomp: '<p>decomp</p>',
        pattern: '<h2 id="pattern">pattern</h2>',
        abstr: '<p>abstr</p>',
        algo: '<p>algo</p>',
        impl: '<p>impl</p>'
    }

    
    let renderer = new CTSchemaProcessor();
    let html = renderer.render(given(input, false, true));
    // Remove newlines and replace multiple spaces by one space
    expect(removeWhiteSpaceBetweenTags(html)).toEqual(removeWhiteSpaceBetweenTags(expected(output)));
});