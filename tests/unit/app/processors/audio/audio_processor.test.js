import { expect, test } from "@jest/globals"
import AudioProcessor from "../../../../../app/processors/audio/audio_processor.js"
import InvalidArgumentError from "../../../../../app/utils/invalid_argument_error.js";
import DOMPurify from 'isomorphic-dompurify';

test("Test if audio with correct input is rendered correctly.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    let expectedOutput = DOMPurify.sanitize(`<audio controls>
                <source src="${inputUrl}" type=${inputArgs.metadata.content_type}>
                Your browser does not support the audio element.
                </audio>`);
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

test("Test if audio without type argument is rendered correctly", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: {} }
    let expectedOutput = DOMPurify.sanitize(`<audio controls>
                <source src="${inputUrl}" type=audio/mpeg>
                Your browser does not support the audio element.
                </audio>`);
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

test("Test if audio render with an invalid type argument throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: { content_type: "image/image" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if audio with an empty type argument is rendered correctly.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: { content_type: "" } }
    let expectedOutput = DOMPurify.sanitize(`<audio controls>
                <source src="${inputUrl}" type=audio/mpeg>
                Your browser does not support the audio element.
                </audio>`);
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

test("Test if audio with an undefined type argument is rendered correctly.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: { content_type: undefined } }
    let expectedOutput = DOMPurify.sanitize(`<audio controls>
                <source src="${inputUrl}" type=audio/mpeg>
                Your browser does not support the audio element.
                </audio>`);
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});

test("Test if audio render without args and with local url throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "song.mp3";
    expect(() => {
        proc.render(inputUrl)
    }).toThrow(InvalidArgumentError)
});

test("Test if audio render without metadata and with local url throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "song.mp3";
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if audio render without an url throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "";
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if audio render with an invalid url throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = "https/www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if audio render with an undefined url throws an error.", () => {
    let proc = new AudioProcessor();
    let inputUrl = undefined;
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    expect(() => {
        proc.render(inputUrl, inputArgs)
    }).toThrow(InvalidArgumentError)
});

test("Test if dirty input is sanitized", () => {
    let proc = new AudioProcessor();
    let inputUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"onerror=alert(1)';
    let inputArgs = { metadata: { content_type: "audio/mpeg" } }
    let expectedOutput = DOMPurify.sanitize(`<audio controls>
                <source src="${inputUrl}" type=${inputArgs.metadata.content_type}>
                Your browser does not support the audio element.
                </audio>`);
    expect(proc.render(inputUrl, inputArgs)).toBe(expectedOutput);
});