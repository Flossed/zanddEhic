/* File             : generic.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023
   Description      :
   Notes            :

*/
/* ------------------     External Application Libraries      -----------------*/
/* ------------------ End External Application Libraries      -----------------*/

/* --------------- External Application Libraries Initialization --------------*/
/* ----------- End External Application Libraries Initialization --------------*/

/* ------------------------------------- Controllers --------------------------*/
/* -------------------------------- End Controllers ---------------------------*/

/* ------------------------------------- Services -----------------------------*/
const config                            = require( '../services/configuration' );
const Logger                          = require( '../services/loggerClass' );


/* -------------------------------- End Services ------------------------------*/

/* ------------------------------------- Models -------------------------------*/
/* -------------------------------- End Models --------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get( 'application:logFileName' );
const applicationName                   = config.get( 'application:applicationName' );
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization --------------*/
const logger                            = new Logger( logFileName );
/* ----------- End Internal Application Libraries Initialization --------------*/

/* ----------------------------- Private Functions   ------------------------*/
/* ------------------------ End Private Functions   -------------------------*/
/* --------------------------- Public Functions   ---------------------------*/
/* ----------------------------- End Public Functions   ---------------------*/
/* ----------------------------------External functions ---------------------*/
module.exports.logger                  = logger;
module.exports.logger                  = applicationName;
/* ----------------------------------End External functions -----------------*/
/* LOG:
*/
