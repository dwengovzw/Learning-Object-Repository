import Logger from "../../logger.js"
import path from 'path'
import fs from 'fs'


let logger = Logger.getLogger()

let ltiController = {}

let ilearn_authentication_endpoint = "https://<i-learn-auth-provider-domain>/authorize"
let dwengo_client_id_for_ilearn = "8a6ff54b-d850-43f5-9214-785b5cb19b3c"
let dwengo_base_uri = "localhost:8085"

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
ltiController.initiate_login = (req, res) => {
    let params = req.data;
    console.log(params);
    res.sendStatus(200)
    let redirect_query = {
        scope: "openid",
        response_type: "id_token",
        client_id: dwengo_client_id_for_ilearn,
        redirect_uri: dwengo_base_uri + "/lti/authorize",
        login_hint: params.login_hint,
        state: {},
        response_mode: "form_post",
        nonce: ltiController.generate_nonce_for_user_id(params.login_hint),
        prompt: "none",
        lti_message_hint: params.lti_message_hint
    }
}

ltiController.generate_nonce_for_user_id = (user_id) => {

};

export default ltiController;