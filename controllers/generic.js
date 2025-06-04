/* File             : generic.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023
   Description      :
   Notes            :

*/
const {logger,applicationName}          = require( '../services/generic' );
const EC                                = require( '../services/errorCatalog' );
const eudcc                             = require( '../services/eudcc' );


async function unknownHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:unknownHandler():Started' );
        res.render( 'unknown' );
        logger.error( applicationName + ':generic:unknownHandler():Unknown Path:[' + req.originalUrl + '].' ); 
        logger.trace( applicationName + ':generic:unknownHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:unknownHandler():An exception occurred :[' + ex + '].' );
    }
}



async function aboutHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:aboutHandler():Started' );
        
        res.render( 'about' );
        logger.trace( applicationName + ':generic:aboutHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:aboutHandler():An exception occurred :[' + ex + '].' );
    }
} 



async function loginHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:loginHandler():Started' );
        console.log(req.body)
        res.render( 'login' );
        logger.trace( applicationName + ':generic:loginHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:loginHandler():An exception occurred :[' + ex + '].' );
    }
}


async function homeHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:homeHandler():Started' );        
        res.render( 'main' );
        logger.trace( applicationName + ':generic:homeHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:homeHandler():An exception occurred :[' + ex + '].' );
    }
}



async function actionsHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:actionsHandler():Started' );

        if ( typeof req.route.methods.post !== 'undefined' )
        {   console.log( 'POST action:[' + req.body.actie + '].' );
            switch(req.body.actie)
            {   case 'createData'   :   console.log( 'Create action' );
                                        eudcc.JSON2QR();
                                        break; 	
                case 'verifyData'   :   console.log( 'Create action' );
                                        break;
                default             : console.log( 'Unknown action' );
                                        break;
            }
        }
        res.render( 'actions' );
        logger.trace( applicationName + ':generic:actionsHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:actionsHandler():An exception occurred :[' + ex + '].' );
    }
}



async function QRCodeScannner ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:QRCodeScannner():Started' );

        if ( typeof req.body.decodedQRCode  !== 'undefined' ) 
        {   logger.debug( applicationName + ':generic:QRCodeScannner():Decoded QR Code:[' + req.body.decodedQRCode + '].' );
            console.log(eudcc.QR2JSON ( req.body.decodedQRCode ));
            const PDA1PN = await eudcc.QR2JSON( req.body.decodedQRCode );
            console.log('PDA1PN: ', PDA1PN);
            res.render( 'scanQRCode', {PDA1PN: PDA1PN } );  ;
            return
        } 
        
        res.render( 'scanQRCode', {PDA1PN: ''} );  ;
        logger.trace( applicationName + ':generic:QRCodeScannner():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:QRCodeScannner():An exception occurred :[' + ex + '].' );
    }
}

async function JSON2QRHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:JSON2QRHandler():Started' );
        let inputJSON = {};
        res.render( 'JSON2QRCode',{inputJSON:inputJSON});
      
        logger.trace( applicationName + ':generic:JSON2QRHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:JSON2QRHandler():An exception occurred :[' + ex + '].' );
    }
}

async function String2QRCode ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:String2QRCode():Started' );
          
        const pageMethod = req.route.methods;
        if (pageMethod.post !== 'undefined')
        {   const inputString = req.body.inputString;
            eudcc.String2QR(inputString);
        
        }
        res.render( 'String2QRCode' ); 
      
        logger.trace( applicationName + ':generic:String2QRCode():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:String2QRCode():An exception occurred :[' + ex + '].' );
    }
}


async function manageJSON2QR ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:JSON2QRHandler():Started' );        
        const inputJSON   =req.body.inputJSON;  
        console.log('vraaag',inputJSON); 
        eudcc.JSON2QR2(inputJSON);
        res.render( 'JSON2QRCode',{inputJSON:inputJSON });
        logger.trace( applicationName + ':generic:JSON2QRHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:JSON2QRHandler():An exception occurred :[' + ex + '].' );
    }
}


async function generateTemplateHandler ( req,res )
{   try
    {   logger.trace( applicationName + ':generic:generateTemplateHandler():Started' );
        const retVal = await eudcc.JSON2QR();
        res.render( 'generateTemplate' );
        logger.trace( applicationName + ':generic:generateTemplateHandler():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:generateTemplateHandler():An exception occurred :[' + ex + '].' );
    }
}



async function main ( req, res )
{   try
    {   logger.trace( applicationName + ':generic:main():Started' ); 
        switch ( req.originalUrl )
        {  case '/'                    : homeHandler( req,res );
                                         break;
           case '/JSON2QRCode'         : JSON2QRHandler( req,res );                 
                                         break; 
           case '/create'              : actionsHandler( req,res );
                                         break;
           case '/about'               : aboutHandler( req,res );
                                         break;
           case '/manageActions'       : actionsHandler( req,res );
                                         break; 
           case '/scanQRCode'          : QRCodeScannner( req,res );
                                         break;
           case '/manageQRCodeScan'    : QRCodeScannner( req,res );
                                         break;
           case '/manageJSON2QR'        : manageJSON2QR( req,res );
                                         break;
           case '/QRCodeFromString'    : String2QRCode( req,res );
                                         break;   
           case '/login'               : loginHandler( req,res );
                                         break;
           case '/generateTemplate'    : generateTemplateHandler( req,res );
                                         break;
           default            :          unknownHandler( req,res );
                                         break;
        }
        logger.trace( applicationName + ':generic:main():Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':generic:main():An exception occurred: [' + ex + '].' );
    }
}

module.exports.main                     =   main;
