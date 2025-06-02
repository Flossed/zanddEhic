/* File             : lLoggerClass.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021-2023
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require( 'winston' );
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
/* ------------------ End Internal Application Libraries      ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Controllers -------------------------*/
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
const config                            = require( '../services/configuration' );
/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logTracelevel                     = config.get( 'application:logTracelevel' );

const options = {};

const dateFormat = () => { return new Date( Date.now() ).toLocaleString( 'de-DE', options ); };

const loggingLevels                       = {   levels   :   {   exception   : 0,
                                                                 error       : 1,
                                                                 warn        : 2,
                                                                 info        : 3,
                                                                 http        : 4,
                                                                 trace       : 5,
                                                                 debug       : 6,
                                                            }
                                            };


/* --------------------------------- End Application constants ----------------*/


/* ------------------------------------- Functions   -------------------------*/
const logConfig                        = {   levels        : loggingLevels.levels ,
                                             level         : logTracelevel,
                                             transports    : [],
                                             format        : winston.format.printf( info =>logString( info ) )
                                         };

function logString ( info )
{ const LogString                      = `${info.level.toUpperCase()}`;
  const paddedLogString                = LogString.padStart( 9 );
  const message                        = `${dateFormat()} | ${paddedLogString} | ${info.message} | `;
  return message;
}



class LoggerService
{    constructor ( route )
     {   const consoleOutput           = config.get( 'application:consoleOutput' );
         const logPath                 = config.get( 'application:logPath' );

         const temp                    = dateFormat().split( ',' );
         const datestruct              = temp[0].split( '.' );
         const date                    = datestruct[2] + datestruct[0] + datestruct[1];
         const timeStr                 = temp[1].replace( ':', '' ).replace( ':', '' ).replace( ' ', '' );

         this.route                    = route + '-' + date + '-' + timeStr;
         logConfig.transports.push( new winston.transports.File( { filename: `${logPath}${this.route}.log`} ) );
         consoleOutput.includes( 'on' ) ? logConfig.transports.push( new winston.transports.Console() ) : null;
         this.logger                   =  new ( winston.Logger )( logConfig );
     }

     async genLog (  )
     {   const logType                 = arguments[0];

         if ( arguments.length == 2 )
         {   this.logger.log( logType, arguments[1] );
         }
         else
         {   const  obj                = arguments[2];
             this.logger.log( logType, arguments[1], { obj } ) ;
         }
     }

     async info (  )
     {   const logType                 = 'info';
         this.genLog( logType, ...arguments );
     }



     async trace (  )
     {   const logType                 = 'trace';
         this.genLog( logType, ...arguments );
     }



     async debug (  )
     {   const logType                 = 'debug';
        console.log( dateFormat() );
         this.genLog( logType, ...arguments );
     }



     async error (  )
     {   const logType                 = 'error';
         this.genLog( logType, ...arguments );
     }

     async exception (  )
     {   const logType                 = 'error';
         this.genLog( logType, ...arguments );
     }


     async warn (  )
     {   const logType                 = 'warn';
         this.genLog( logType, ...arguments );
     }


     async http (  )
     {   const logType                 = 'http';
         this.genLog( logType, ...arguments );
     }
}
/* --------------------------------- End Functions   -------------------------*/


/* ----------------------------------Module Initialization ------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports = LoggerService;
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/
