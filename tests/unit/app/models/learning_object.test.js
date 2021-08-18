import { afterEach, beforeAll, afterAll, expect, test } from '@jest/globals'
import { connect, closeDatabase, clearDatabase } from "../../../utils/db.js"
import LearningObject from "../../../../app/models/learning_object.js"

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());


describe("Tests for the creation of learning objects", () => {
    test("Test if new learning object is created correctly", async () => {
        const loSpec = {
            hruid: "testobject1",
            language: "EN",
            version: 3,
            title: "Test object 1 title",
            description: "This is a description of test object 1",
            keywords: ["a", "b", ",", "1"],
            copyright: "cc by",
            licence: "none",
            content_type: "text/plain",
            available: true,
            target_ages: [12, 13, 17],
            difficulty: 9,
            return_value: {
                callback_url: "",
                callback_schema: ""
            },
            content_location: "http://www.dwengo.org",
            estimated_time: 20,
            skos_concepts: [
                'http://ilearn.ilabt.imec.be/vocab/curr1/c-andere-talen',
                'http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-aso'
            ],
            teacher_exclusive: true
        };
        const lo = new LearningObject(loSpec);
        const loId = await lo.save();
        const fetchedLo = await LearningObject.findById(loId["_id"]).lean(); // Lean converts query result to pojo

        // Check if all the properties are correct
        expect(fetchedLo.hruid).toEqual(loSpec.hruid);
        expect(fetchedLo.language).toEqual(loSpec.language.toLowerCase().trim());
        expect(fetchedLo.version).toEqual(loSpec.version);
        expect(fetchedLo.title).toEqual(loSpec.title.trim());
        expect(fetchedLo.description).toEqual(loSpec.description.trim());
        expect(fetchedLo.keywords).toEqual(loSpec.keywords);
        expect(fetchedLo.copyright).toEqual(loSpec.copyright);
        expect(fetchedLo.licence).toEqual(loSpec.licence);
        expect(fetchedLo.content_type).toEqual(loSpec.content_type);
        expect(fetchedLo.available).toEqual(loSpec.available);
        expect(fetchedLo.target_ages).toEqual(loSpec.target_ages);
        expect(fetchedLo.difficulty).toEqual(loSpec.difficulty);
        expect(fetchedLo.return_value.callback_url).toEqual(loSpec.return_value.callback_url);
        expect(fetchedLo.return_value.callback_schema).toEqual(loSpec.return_value.callback_schema);
        expect(fetchedLo.content_location).toEqual(loSpec.content_location);
        expect(fetchedLo.estimated_time).toEqual(loSpec.estimated_time);
        expect(fetchedLo.skos_concepts).toEqual(loSpec.skos_concepts);
        expect(fetchedLo.teacher_exclusive).toEqual(loSpec.teacher_exclusive);
    });

    test("Test rounding of difficulty and target age", async () => {
        let loSpec = {
            hruid: "testobject1",
            language: "EN",
            version: 3,
            title: "Test object 1 title",
            description: "This is a description of test object 1",
            keywords: ["a", "b", ",", "1"],
            copyright: "cc by",
            licence: "none",
            content_type: "text/plain",
            available: true,
            target_ages: [12.2, 13.8, 17],
            difficulty: 9.6,
            return_value: {
                callback_url: "",
                callback_schema: ""
            },
            content_location: "http://www.dwengo.org",
            estimated_time: 20,
            skos_concepts: [
                'http://ilearn.ilabt.imec.be/vocab/curr1/c-andere-talen',
                'http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-aso'
            ],
            teacher_exclusive: true
        };
        const lo = new LearningObject(loSpec);
        let loId = await lo.save();
        const fetchedLo = await LearningObject.findById(loId["_id"]).lean(); // Lean converts query result to pojo

        // Check if all the properties are correct
        expect(fetchedLo.target_ages).toEqual([12, 14, 17]);
        expect(fetchedLo.difficulty).toBe(10);
    });

    test("Test invalid language", async () => {
        let loSpec = {
            hruid: "testobject1",
            language: "NOLANG",
            version: 3,
            title: "Test object 1 title",
            description: "This is a description of test object 1",
            keywords: ["a", "b", ",", "1"],
            copyright: "cc by",
            licence: "none",
            content_type: "text/plain",
            available: true,
            target_ages: [12.2, 13.8, 17],
            difficulty: 9.6,
            return_value: {
                callback_url: "",
                callback_schema: ""
            },
            content_location: "http://www.dwengo.org",
            estimated_time: 20,
            skos_concepts: [
                'http://ilearn.ilabt.imec.be/vocab/curr1/c-andere-talen',
                'http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-aso'
            ],
            teacher_exclusive: true
        };
        const lo = new LearningObject(loSpec);
        console.log("created new learning object");
        expect.assertions(1);
        try {
            await lo.save();
        } catch (e) {
            expect(e.message).toMatch("LearningObject validation failed");
        }
    });

    test("Test invalid data type", async () => {
        let loSpec = {
            hruid: "testobject1",
            language: "NOLANG",
            version: 3,
            title: "Test object 1 title",
            description: "This is a description of test object 1",
            keywords: ["a", "b", ",", "1"],
            copyright: "cc by",
            licence: "none",
            content_type: "abcdefghijklmopqrstuvwxyz",
            available: true,
            target_ages: [12.2, 13.8, 17],
            difficulty: 9.6,
            return_value: {
                callback_url: "",
                callback_schema: ""
            },
            content_location: "http://www.dwengo.org",
            estimated_time: 20,
            skos_concepts: [
                'http://ilearn.ilabt.imec.be/vocab/curr1/c-andere-talen',
                'http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-aso'
            ],
            teacher_exclusive: true
        };
        const lo = new LearningObject(loSpec);
        console.log("created new learning object");
        expect.assertions(1);
        try {
            await lo.save();
        } catch (e) {
            expect(e.message).toMatch("LearningObject validation failed");
        }
    });


    // TODO: extensively extend the number of test cases for the LearningObject model.
})