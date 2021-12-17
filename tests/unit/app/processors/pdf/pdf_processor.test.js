import { expect, test } from "@jest/globals"
import PdfProcessor from "../../../../../app/processors/pdf/pdf_processor.js"
import InvalidArgumentError from "../../../../../app/utils/invalid_argument_error.js";
import DOMPurify from 'isomorphic-dompurify';



test("Test if pdf with correct input is rendered correctly.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    let inputArgs = { files: [], metadata: { _id: "test" } }
    let expectedOutput = DOMPurify.sanitize(`<embed src="${inputUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

/* test("Test if pdf render with no metadata and local url throws an error.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "dummy.pdf";
    let inputArgs = { files: [], metadata: {} }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
}); */

/* test("Test if pdf render without arguments and local url throws an error.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "dummy.pdf";
    expect(() => {
        proc.render(inputUrl)
    }).toThrow(InvalidArgumentError)
}); */

test("Test if pdf without metadata and external url is rendered correctly.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    let inputArgs = { files: [], metadata: {} }
    let expectedOutput = DOMPurify.sanitize(`<embed src="${inputUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

test("Test if pdf without arguments and external url is rendered correctly.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    let expectedOutput = DOMPurify.sanitize(`<embed src="${inputUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })
    expect(proc.render(inputUrl)).toBe(expectedOutput);
});

/* test("Test if pdf with an invalid url argument throws an error.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "https/www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    let inputArgs = { files: [], metadata: { _id: "test" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
}); */

/* test("Test if pdf with an empty url argument throws an error.", () => {
    let proc = new PdfProcessor();
    let inputUrl = "";
    let inputArgs = { files: [], metadata: { _id: "test" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
}); */
/* 
test("Test if pdf with an undefined url argument throws an error.", () => {
    let proc = new PdfProcessor();
    let inputUrl = undefined;
    let inputArgs = { files: [], metadata: { _id: "test" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
}); */

test("Test if dirty input is sanitized", () => {
    let proc = new PdfProcessor();
    let inputUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"onerror=alert(1)';
    let inputArgs = { files: [], metadata: { _id: "test" } }
    let expectedOutput = DOMPurify.sanitize(`<embed src="${inputUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })

    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});
