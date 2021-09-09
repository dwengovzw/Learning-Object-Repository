import Logger from "../../logger.js"
import path from 'path'
import fs from 'fs'
import NonceStore from "../../models/nonce_store.js"
import queryString from "querystring"
import jwt from "jsonwebtoken"


let logger = Logger.getLogger()

let ltiController = {}

let ilearn_authentication_endpoint = process.env.I_LEARN_AUTHENTICATION_ENDPOINT
let ilearn_key_location = process.env.I_LEARN_KEY_LOCATION
let dwengo_client_id_for_ilearn = process.env.I_LEARN_DWENGO_CLIENT_ID
let dwengo_base_uri = process.env.DOMAIN_URL

/**
 * De login flow wordt gestart door de i-Learn gebruiker die een oefening wil maken in een Tool. Het i-Learn Platform genereert hiervoor een link naar het ‘login initiation endpoint’ van de Tool. Volgens de IMS specificatie dient zowel GET als POST requests te ondersteunen. Vanuit i-Learn zullen enkel GET requests naar deze endpoint gestuurd worden.
 * Sample request from i-Learn: https://learning-tool.org/initiate_login?iss=https://auth-test.i-learn.be/&login_hint=25700ac2-a88a-4446-a5db-4ab24711bace&target_link_uri=https://learning-tool.org/launch&lti_message_hint=b8b7c7c1-23dc-49ec-a81f-2db269e30f4d
 * 
 * req.data contains:
 *  -> iss: (issuer) platform identifier ex.: https://auth-test.i-learn.be/
 *  -> login_hint: id of the user that will be loggin in ex.: 25700ac2-a88a-4446-a5db-4ab24711bace
 *  -> target_link_uri: uri of content that is requested ex.: http://localhost:8085/interface/learningObject/getRaw&=hruid=test7-id
 *  -> lti_message_hint: internal i-Learn id of the exercise ex.: b8b7c7c1-23dc-49ec-a81f-2db269e30f4d
 * 
 * This function should process the req.data parameters and redirect to the i-Learn authentication endpoint
 * @param {*} req 
 * @param {*} res 
 */
ltiController.initiate_login = async (req, res) => {
    let params = req.data;
    console.log(params);
    let nonce
    try{
        nonce = await ltiController.generate_nonce_for_user_id(params.login_hint)
    }catch(err){
        res.sendStatus(500) // internal server error
    }
    let redirect_query = {
        scope: "openid",
        response_type: "id_token",
        client_id: dwengo_client_id_for_ilearn,
        redirect_uri: dwengo_base_uri + "/lti/authorize",
        login_hint: params.login_hint,
        state: {target_link_uri: params.target_link_uri},
        response_mode: "form_post",
        nonce: nonce,
        prompt: "none",
        lti_message_hint: params.lti_message_hint
    }
    let query = queryString.stringify(redirect_query);
    // Redirect back to i-Learn
    res.redirect(302, ilearn_authentication_endpoint + "?" + query)
}

ltiController.authorize = async (req, res) => {
    let id_token = req.body.id_token
    try {
        // TODO: get ilear public key for verification
        let decoded = jwt.verify(id_token, "<i-learn-public-key>")
        // TODO: process decoded info and redirect to learning object page
    } catch (err) {
        res.sendStatus(500) // internal server error
    }


    /*let split_token = id_token.split('.')
    // map each element in the token to a javascript object
    split_token.forEach((element, index, original) => {
        original[index] = JSON.parse(Buffer.from(element, 'base64').toString())
    })
    let [header, payload, signature] = split_token*/


}

ltiController.validate_id_token = (header, payload, singature) => {

}

ltiController.generate_nonce_for_user_id = async (user_id) => {
    // Generate save the userid to the nonce store. This automatically generates the nonce and a timestamp
    let nonce = new NonceStore({user_id: user_id});
    let saved_nonce = await nonce.save();
    return saved_nonce.nonce
};

ltiController.validate_nonce_for_user_id = async (user_id, nonce) => {
    let nonce_store = await NonceStore.findOne({
        user_id: user_id,
        nonce: nonce
    }).exec()
    let valid = false
    // if combination user_id, nonce is found in the store it is valid
    if (nonce_store){
        valid = true
        ltiController.remove_nonce_for_user_id(user_id, nonce) // Nonce can only be validated once
    }
    return valid
}

ltiController.remove_nonce_for_user_id = async (user_id, nonce) => {
    await NonceStore.deleteOne({
        user_id: user_id,
        nonce: nonce
    })
}

export default ltiController;