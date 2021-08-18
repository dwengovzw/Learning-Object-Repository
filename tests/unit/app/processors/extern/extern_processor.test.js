import { expect, test } from "@jest/globals"
import ExternProcessor from "../../../../../app/processors/extern/extern_processor.js"
import InvalidArgumentError from "../../../../../app/utils/invalid_argument_error.js";
import DOMPurify from 'isomorphic-dompurify';

test("Test if extern content with correct input is rendered correctly.", () => {
    let proc = new ExternProcessor();
    let inputUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    let expectedOutput = DOMPurify.sanitize(`<iframe width="420px" height="315px" src="${inputUrl}"></iframe>`, { ADD_TAGS: ["iframe"] });
    expect(proc.render(inputUrl)).toBe(expectedOutput);
});


test("Test if extern content render with an invalid url argument throws an error.", () => {
    let proc = new ExternProcessor();
    let inputUrl = "https/www.youtube.com/embed/dQw4w9WgXcQ";
    expect(() => {
        proc.render(inputUrl)
    }).toThrow(InvalidArgumentError)
});

test("Test if extern content render with an empty url argument throws an error.", () => {
    let proc = new ExternProcessor();
    let inputUrl = ""
    expect(() => {
        proc.render(inputUrl)
    }).toThrow(InvalidArgumentError)
});

test("Test if extern content render with an undefined url argument throws an error.", () => {
    let proc = new ExternProcessor();
    let inputUrl = undefined;
    expect(() => {
        proc.render(inputUrl)
    }).toThrow(InvalidArgumentError)
});

test("Test if dirty input is sanitized", () => {
    let proc = new ExternProcessor();
    let inputUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ"onerror=alert(2)';
    let expectedOutput = DOMPurify.sanitize(`<iframe width="420px" height="315px" src="${inputUrl}"></iframe>`, { ADD_TAGS: ["iframe"] });
    expect(proc.render(inputUrl)).toBe(expectedOutput);
});
