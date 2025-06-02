/* File             : errorCatalog.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Description      : 
   Notes            : 
  
*/

/* ------------------     External Application Libraries      ----------------*/
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
/* ------------------ End Internal Application Libraries      ----------------*/

/* ---------------------------------  Application constants    ----------------*/
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Controllers -------------------------*/
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
/* -------------------------------- End Services -----------------------------*/

/* --------------- Internal Variables Initialization -------------------------*/
const BAD_REQUEST                       = 0xff   
const BAD_RESULT                        = 0xfe
const EXCEPTION                         = 0x0f
const NO_ERROR                          = 0x00

var badRequest                          = { returnCode: BAD_REQUEST,  
                                            returnMsg: 'Bad Request: Can\'t understand request: request contains either contains parameters that cannot be handled', 
                                            body : {}
                                          } 
                          
var badResult                           = { returnCode: BAD_RESULT,  
                                            returnMsg: 'Bad Result: API returned an error', 
                                            body : {}
                                          } 
                 
var exception                           = { returnCode: EXCEPTION,  
                                            returnMsg: 'Exception: An Exception Occurred', 
                                            body : {}
                                          }
                                          
var noError                             = {   returnCode: NO_ERROR,  
                                              returnMsg: 'NO_ERROR: No Errors Encountered While processing request', 
                                              body : {}
                                          }     
/* ----------- End Internal Variables Initialization -------------------------*/


/* ------------------------------------- Functions   -------------------------*/
/* --------------------------------- End Functions   -------------------------*/
/* ----------------------------------External functions ----------------------*/
module.exports.badRequest                      = badRequest
module.exports.badResult                       = badResult
module.exports.exception                       = exception
module.exports.noError                         = noError
module.exports.NO_ERROR                        = NO_ERROR
module.exports.EXCEPTION                       = EXCEPTION
module.exports.BAD_RESULT                      = BAD_RESULT
module.exports.BAD_REQUEST                     = BAD_REQUEST

/* ----------------------------------End External functions ------------------*/


/* LOG:

*/
