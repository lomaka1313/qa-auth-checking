/**
 * Created by lomaka on 27.07.2017.
 */
const request = require('request-promise'),
    jwt = require('jsonwebtoken');
const checkingService = class {
    constructor(params) {
        if (!!params == false) {
            params = {
                authServer: {
                    protocol: "http",
                    host: "robinzon-online.com",
                    port: "3080"
                },
                decodeJWTKey: undefined,
            }
        }

        if(typeof params.decodeJWTKey != 'string' || (params.decodeJWTKey && params.decodeJWTKey.trim()=='')){
            throw new Error({
                message:"Decode Key empty"
            })
        }
        this.params = params;
    }

    checkApplicationToken(token) {
        return new Promise((resolve,reject)=>{
            if(!token){
                reject({
                    message:"token empty"
                })
            }
            request({
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': token
                },
                json: true,
                method: "GET",
                uri: `${this.params.authServer.protocol}://${this.params.authServer.host}:${this.params.authServer.port}/application`
            }).then((response)=>{
                resolve()
            }).catch((error)=>{
                reject(error)
            })
        })
    }

    decodeUserJWT(JWTtoken) {
        return new Promise((resolve,reject)=>{
            if(!JWTtoken){
                reject({
                    message:"token empty"
                })
            }
            try{
                jwt.verify(JWTtoken,this.params.decodeJWTKey,{ algorithm: 'RS256' });
            }catch (err){
                throw err
            }
            return jwt.decode(JWTtoken, {complete: true})
        })
    }
}

module.exports = checkingService;