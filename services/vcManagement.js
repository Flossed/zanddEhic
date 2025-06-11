/* File             : eudcc.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023
   Description      : eudcc.js
   Notes            : links : https://www.qrcode.com/en/about/version.html
*/
const zlib                             = require( 'zlib' );
const fs                               = require( 'fs/promises' );
const base45                           =   require( 'base45' );
const cbor                             =   require( 'cbor' );
const cose                             =   require( 'cose-js' );
const QRCode                           =   require( 'qrcode' );
const {logger, applicationName}        =   require( '../services/generic' );
const EC                               =   require( '../services/errorCatalog' );
const schemaManagement                 =   require( '../services/schemaManagement' );
const {zlibbed}                        =   require( '../services/generic' );
const {base45File}                     =   require( '../services/generic' );
const {qrCodeFile}                     =   require( '../services/generic' );
const {JSONSchema}                     =   require( '../services/generic' );
const {dataSet}                        =   require( '../services/generic' );
const {outputJson}                     =   require( '../services/generic' );
const {outputCBOR}                     =   require( '../services/generic' );
const {outputCOSE}                     =   require( '../services/generic' );


const qrcodeVersion                    =   [   {version: 1 ,moduleSize:10,errorCorrection: 'H'},
                                               {version: 2 ,moduleSize:20,errorCorrection: 'H'},
                                               {version: 3 ,moduleSize:35,errorCorrection: 'H'},
                                               {version: 4 ,moduleSize:50,errorCorrection: 'H'},
                                               {version: 5 ,moduleSize:64,errorCorrection: 'H'},
                                               {version: 6 ,moduleSize:84,errorCorrection: 'H'},
                                               {version: 7 ,moduleSize:93,errorCorrection: 'H'},
                                               {version: 8 ,moduleSize:122,errorCorrection: 'H'},
                                               {version: 9 ,moduleSize:143,errorCorrection: 'H'},
                                               {version: 10,moduleSize:174,errorCorrection: 'H'},
                                               {version:11 ,moduleSize:200,errorCorrection: 'H'},
                                               {version:12 ,moduleSize:227,errorCorrection: 'H'},
                                               {version:13 ,moduleSize:259,errorCorrection: 'H'},
                                               {version:14 ,moduleSize:283,errorCorrection: 'H'},
                                               {version:15 ,moduleSize:321,errorCorrection: 'H'},
                                               {version:13 ,moduleSize:352,errorCorrection: 'Q'},
                                               {version:16 ,moduleSize:365,errorCorrection: 'H'},
                                               {version:14 ,moduleSize:376,errorCorrection: 'Q'},
                                               {version:17 ,moduleSize:408,errorCorrection: 'H'},
                                               {version:15 ,moduleSize:426,errorCorrection: 'Q'},
                                               {version:18 ,moduleSize:452,errorCorrection: 'H'},
                                               {version:19 ,moduleSize:493,errorCorrection: 'H'},
                                               {version:20 ,moduleSize:557,errorCorrection: 'H'},
                                               {version:21 ,moduleSize:587,errorCorrection: 'H'},
                                               {version:22 ,moduleSize:640,errorCorrection: 'H'},
                                               {version:23 ,moduleSize:672,errorCorrection: 'H'},
                                               {version:24 ,moduleSize:744,errorCorrection: 'H'},
                                               {version:25 ,moduleSize:779,errorCorrection: 'H'},
                                               {version:26 ,moduleSize:864,errorCorrection: 'H'},
                                               {version:27 ,moduleSize:910,errorCorrection: 'H'},
                                               {version:28 ,moduleSize:958,errorCorrection: 'H'},
                                               {version:29 ,moduleSize:1016,errorCorrection: 'H'},
                                               {version:30 ,moduleSize:1080,errorCorrection: 'H'},
                                               {version:31 ,moduleSize:1150,errorCorrection: 'H'},
                                               {version:32 ,moduleSize:1226,errorCorrection: 'H'},
                                               {version:33 ,moduleSize:1307,errorCorrection: 'H'},
                                               {version:34 ,moduleSize:1394,errorCorrection: 'H'},
                                               {version:35 ,moduleSize:1431,errorCorrection: 'H'},
                                               {version:36 ,moduleSize:1530,errorCorrection: 'H'},
                                               {version:37 ,moduleSize:1591,errorCorrection: 'H'},
                                               {version:38 ,moduleSize:1658,errorCorrection: 'H'},
                                               {version:39 ,moduleSize:1774,errorCorrection: 'H'},
                                               {version:40 ,moduleSize:1852,errorCorrection: 'H'},
                                               {version:40 ,moduleSize:2420,errorCorrection: 'Q'},
                                               {version:40 ,moduleSize:3391,errorCorrection: 'M'},
                                               {version:40 ,moduleSize:4296,errorCorrection: 'L'}
                                           ];


function _01_readJSONSchema ()
{   try
    {   logger.trace( applicationName + ':eudcc:_01_readJSONSchema:Starting' );
        logger.debug( applicationName + ':eudcc:_01_readJSONSchema:Schema file loaded: ' + JSONSchema );

        
        const schemaFile               =   require( JSONSchema ); //getJSONSchema( JSONSchema );
        
        if ( typeof JSONSchema === 'undefined' || JSONSchema === null )
        {   logger.error( applicationName + ':eudcc:_01_readJSONSchema:incorrect data' );
            const response             =   EC.badData;
            return response;
        }
        if ( typeof schemaFile === 'undefined' || schemaFile === null )
        {   logger.error( applicationName + ':eudcc:_01_readJSONSchema:incorrect Data' );
            const response             =   EC.badData;
            return response;
        }
        logger.trace( applicationName + ':eudcc:main:Ending' );
        const response                 =   { ...EC.noError };
        response.body                  =   schemaFile;
        return response;
    }
    catch ( ex )
    {  const response                 =   EC.exception;
       response.body                  =   ex;
       logger.exception( applicationName + ':eudcc:_01_readJSONSchema:Exception caught: ',ex );
       return response;
    }
}



async function _02_generateJSONDocument ( schema )
{   try
    {   logger.trace( applicationName + ':eudcc:_02_generateJSONDocument:Starting' );        
        const dataFile                 =   require( dataSet );
        if ( typeof dataSet === 'undefined' || dataSet === null )
        {   const response             =   EC.badData;
            logger.error( applicationName + ':eudcc:_02_generateJSONDocument:' + response.message );
            return response;
        }
        if ( typeof dataFile === 'undefined' || dataFile === null )
        {   const response             =   EC.badData;
            logger.error( applicationName + ':eudcc:_02_generateJSONDocument:' + response.message );
            return response;
        }        
        const data                     =   Object.entries( dataFile  );
        const jsonResponse             =   await generateDataFromSchema( schema,data );
        if ( jsonResponse.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:_02_generateJSONDocument:Error in generateDataFromSchema',jsonResponse );
            return jsonResponse;
        }
        logger.trace( applicationName + ':eudcc:_02_generateJSONDocument:Ending' );
        return jsonResponse;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_02_generateJSONDocument:Exception caught: ',ex );
        return response;
    }
}



async function _03_validateJSONDocument ( schema, jsonDocument )
{   try
    {   logger.trace( applicationName + ':eudcc:_03_validateJSONDocument:Starting' );
        const result                   =   await schemaManagement.validateSchema( schema, jsonDocument );
        if ( result.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:_03_validateJSONDocument:Error in validateSchema',result );
            return result;
        }
        logger.trace( applicationName + ':eudcc:_03_validateJSONDocument:Ending' );
        return result;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_03_validateJSONDocument:Exception caught: ',ex );
        return response;
    }
}



async function _04_writeJSONDocument ( jsonDocument )
{   try
    {   logger.trace( applicationName + ':eudcc:_04_writeJSONDocument:Starting' );
        if ( jsonDocument === null || typeof jsonDocument === 'undefined' || outputJson === null || typeof outputJson === 'undefined' )
        {   logger.error( applicationName + ':eudcc:_04_writeJSONDocument:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        await fs.writeFile( outputJson, jsonDocument );
        const response                 =   { ...EC.noError } ;
        response.body                  =   jsonDocument;
        logger.trace( applicationName + ':eudcc:_04_writeJSONDocument:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:_04_writeJSONDocument:Exception caught: ',ex );
        return response;
    }
}



async function _05_transformJSONToCBOR ( jsonDocument )
{   try
    {   logger.trace( applicationName + ':eudcc:_05_transformJSONToCBOR:Starting' );
        if ( jsonDocument === null || typeof jsonDocument === 'undefined' ||  jsonDocument.length === 0 )
        {   logger.error( applicationName + ':eudcc:_05_transformJSONToCBOR:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }         
        const encoded                  =   cbor.encode( JSON.parse( jsonDocument ) );  
        logger.debug( applicationName + `:eudcc:_05_transformJSONToCBOR:encoded: ${encoded}  `);        
      
        await fs.writeFile( outputCBOR, encoded.toString( 'hex' ) );
        
        

/*
const sizeDifference          = Math.trunc( ( ( encoded.length - jsonDocument.length ) / jsonDocument.length ) * 10000 ) / 100;

        logger.debug( applicationName + ':eudcc:_05_transformJSONToCBOR:sizes json: [' + jsonDocument.length + '] => cbor: [' + encoded.length  + '];Size difference: [' + sizeDifference   + '%]' );
*/
        const response                = { ...EC.noError } ;
        response.body                 = encoded;
        logger.trace( applicationName + ':eudcc:_05_transformJSONToCBOR:Ending' );
        return response;
    }
    catch   ( ex )
    {   logger.exception( applicationName + ':eudcc:_05_transformJSONToCBOR:Exception caught: ',ex );
        return response;
    }
}







async function _07_signCBOROPbject ( cborObject, keyInformation )
{   try
    {   logger.trace( applicationName + ':eudcc:_07_signCBOROPbject:Starting' );
        const headers                  =   {   p: { alg: 'ES256' },
                                               u: { kid: '11' }
                                           };

        const signer                   =   {   key: {   d: Buffer.from( '6c1382765aec5358f117733d281c1c7bdc39884d04a45a1e6c67c858bc206c19', 'hex' )}};

        const verifier                 =   {   key: {   x: Buffer.from( '143329cce7868e416927599cf65a34f3ce2ffda55a7eca69ed8919a394d42f0f', 'hex' ),
                                                        y: Buffer.from( '60f7f1a780d8a783bfb7a2dd6b2796e8128dbbcef9d3d168db9529971a36e7b9', 'hex' )
                                                    }
                                           };
        if ( cborObject === null || typeof cborObject === 'undefined' || keyInformation === null || typeof keyInformation === 'undefined' )
        {   logger.error( applicationName + ':eudcc:_07_signCBOROPbject:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        const buf                      =   await cose.sign.create( headers, cborObject, signer );
        const bufVerify                =   await cose.sign.verify( buf, verifier );        
        await fs.writeFile( outputCOSE, buf.toString( 'hex' ) );
        const response                 =   { ...EC.noError } ;
        response.body                  =   cborObject;
        logger.trace( applicationName + ':eudcc:_07_signCBOROPbject:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_07_signCBOROPbject:Exception caught: ',ex );
        return response;
    }
}



async function _09_base45Encode ( zipped )
{   try
    {   logger.trace( applicationName + ':eudcc:_09_base45Encode:Starting' );

        if ( zipped === null || typeof zipped === 'undefined' )
        {   logger.error( applicationName + ':eudcc:_09_base45Encode:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        const base45Encoded            =   base45.encode( zipped );
        await fs.writeFile( base45File,  base45Encoded );
        const sizeDifference          =   Math.trunc( ( ( base45Encoded.length - zipped.length ) / zipped.length ) * 10000 ) / 100;
        logger.debug( applicationName + ':eudcc:_09_base45Encode:sizes zipped: [' + zipped.length + '] => base45: [' + base45Encoded.length  + '];Size difference: [' + sizeDifference   + '%]' );
        const response                =   { ...EC.noError } ;
        response.body                 =   base45Encoded;
        logger.trace( applicationName + ':eudcc:_09_base45Encode:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:_09_base45Encode:Exception caught: ',ex );
        return response;
    }
}



async function _10_zlibCompress ( cborData )
{   try
    {   logger.trace( applicationName + ':eudcc:_10_zlibCompress:Starting' );
        if ( cborData === null || typeof cborData === 'undefined' )
        {   logger.error( applicationName + ':eudcc:_10_zlibCompress:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        const zlibCompressed           =   zlib.deflateSync( cborData );
        const sizeDifference           =   Math.trunc( ( ( zlibCompressed.length - cborData.length ) / cborData.length ) * 10000 ) / 100;
        await fs.writeFile( zlibbed, zlibCompressed );
        logger.debug( applicationName + ':eudcc:_10_zlibCompress:sizes cbor: [' + cborData.length + '] => zlib: [' + zlibCompressed.length  + '];Size difference: [' + sizeDifference   + '%]' );
        const response                 =   { ...EC.noError } ;
        response.body                  =   zlibCompressed;
        logger.trace( applicationName + ':eudcc:_10_zlibCompress:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_10_zlibCompress:Exception caught: ',ex );
        return response;
    }
}



async function _11_getQREncodingVersion ( inputData )
{   try
    {   logger.trace( applicationName + ':eudcc:_11_getQREncodingVersion:Starting' );

        if ( inputData === null || typeof inputData === 'undefined' || inputData.length === 0 )
        {   logger.error( applicationName + ':eudcc:_11_getQREncodingVersion:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        let index                      =   qrcodeVersion.findIndex(qrcode => qrcode.moduleSize > inputData.length );                
        if ( index === -1 )
        {  const response              =   { ...EC.badData } ;
           response.body               =   `input data size is to big to fit in one QR Code: [${inputData.length}]`;
           logger.error( applicationName + ':eudcc:_11_getQREncodingVersion:Error' + response.body );
           logger.trace( applicationName + ':eudcc:_11_getQREncodingVersion:Ending' );
           return response;
        } 
        logger.debug( applicationName + `:eudcc:_11_getQREncodingVersion:Version:${qrcodeVersion[index].version}:modulesize:${qrcodeVersion[index].moduleSize}:inputData.length:${inputData.length} :errorCorrection:${qrcodeVersion[index].errorCorrection}` );

        const response                 =   { ...EC.noError } ;
        response.body                  =   qrcodeVersion[index];            
        logger.trace( applicationName + ':eudcc:_11_getQREncodingVersion:Ending' );
        return response;        
    }
    catch   ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:_11_getQREncodingVersion:Exception caught: ',ex );
        return response;
    }
}



async function _11_transformZlibToQR ( inputData, versionQRCode )
{   try
    {   logger.trace( applicationName + ':eudcc:_11_transformZlibToQR:Starting' );
        if ( inputData === null || typeof inputData === 'undefined' )
        {   logger.error( applicationName + ':eudcc:_11_transformZlibToQR:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        const qrOptions                =   {  version :versionQRCode.version,
                                              errorCorrectionLevel: versionQRCode.errorCorrection
                                           };
        try
        {  await fs.unlink( qrCodeFile );
        }
        catch ( err )
        {  console.log( 'Nothing to delete' );
        }
        logger.debug( applicationName + ':eudcc:_11_transformZlibToQR:qrCodeFile',qrCodeFile );
        QRCode.toFile( qrCodeFile, [{ data: inputData }], qrOptions, function ( error )
                       {  if ( error )
                           {   logger.error( applicationName + ':eudcc:_11_transformZlibToQR:Error whilst generating QR code' );
                           }
                       } );
        const response                 =   { ...EC.noError } ;
        response.body                  =   inputData;
        logger.trace( applicationName + ':eudcc:_11_transformZlibToQR:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_11_transformZlibToQR:Exception caught: ',ex );
        return response;
    }
}



async function  _21_decodeBase45Buffer ( inputData )
{   try
    {   logger.trace( applicationName + ':eudcc:_21_decodeBase45Buffer:Starting' );
        const ZlibData                 =   base45.decode( inputData );
        const response                 =   { ... EC.noError } ;
        response.body                  =   ZlibData;
        logger.trace( applicationName + ':eudcc:_21_decodeBase45Buffer:Succesfully read file' );
        return response;
    }
    catch ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_21_decodeBase45Buffer:Exception caught: ',ex );
        return response;
    }
}



async function _22_decodeZlibBuffer ( inputData )
{   try
    {   logger.trace( applicationName + ':eudcc:_22_decodeZlibBuffer:Starting' );
        const decodedData              =   zlib.inflateSync( inputData );
        const response                 =   { ... EC.noError } ;
        response.body                  =   decodedData;
        logger.trace( applicationName + ':eudcc:_22_decodeZlibBuffer:Succesfully read file' );
        return response;
    }
    catch ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:_22_decodeZlibBuffer:Exception caught: ',ex );
        return response;
    }
}



async function _25_decodeCBORBuffer ( inputData )
{   try
    {   logger.trace( applicationName + ':eudcc:_25_decodeCBORBuffer:Starting' );
        const decodedData              =   cbor.decode( inputData );
        const response                 =   { ... EC.noError } ;
        response.body                  =   decodedData;
        logger.trace( applicationName + ':eudcc:_25_decodeCBORBuffer:Succesfully read file' );
        return response;
    }
    catch ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;        
        logger.exception( applicationName + ':eudcc:_25_decodeCBORBuffer:Exception caught: ',ex );
        return response;
    }
}


/* 21. decode base 45 code to zipped format
   22. unzip CBOR format
   23. extract Cose signature from CBOR
   24  validate cose signature
   25. decode cbor to json
   26. validate json against schema
   27. write json to file
*/
async function QR2JSON ( QRCodeBuffer )
{   try
    {   logger.trace( applicationName + ':eudcc:QR2JSON:Starting' );
        if ( QRCodeBuffer === null || typeof QRCodeBuffer === 'undefined' )
        {   logger.error( applicationName + ':eudcc:QR2JSON:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
       const resultBase45             =   await  _21_decodeBase45Buffer( QRCodeBuffer );
       if ( resultBase45.returnCode !== EC.noError.returnCode )
       {   logger.error( applicationName + ':eudcc:QR2JSON:_21_scanQRCode returned errors',resultBase45 );
           return resultBase45;
       }
       logger.debug( applicationName + ':eudcc:QR2JSON:_21_scanQRCode is done succesfully' );
       const resultCBOR               =   await _22_decodeZlibBuffer( resultBase45.body );
        if ( resultCBOR.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:QR2JSON:_22_decodeZlibBuffer returned errors',resultCBOR );
            return resultCBOR;
        }
        logger.debug( applicationName + ':eudcc:QR2JSON:_22_decodeZlibBuffer is done succesfully' );
        const resultJSON              =   await _25_decodeCBORBuffer( resultCBOR.body );
        if ( resultJSON.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:QR2JSON:_25_decodeCBORBuffer returned errors',resultJSON );
            return resultJSON;
        }           
        logger.debug( applicationName + ':eudcc:QR2JSON:_25_decodeCBORBuffer is done succesfully' );
        const schema                     = _01_readJSONSchema();
        if ( schema.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'QR2JSON:Error in _01_readJSONSchema',schema );
            return schema;

        }
        logger.debug( applicationName + ':QR2JSON:_01_readJSONSchema is done succesfully' );      
        const validation               =   await _03_validateJSONDocument( schema.body, JSON.stringify( resultJSON.body ) );

        if ( validation.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'QR2JSON:Error in _03_validateJSONDocument',validation );
            return validation;
        }

        logger.debug( applicationName + ':QR2JSON:_03_validateJSONDocument is done succesfully' );
        const retVAl                   =   { ... EC.noError } ;
        retVAl.body                    =   resultJSON.body ;
        return retVAl;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:QR2JSON:Exception caught: ',ex );
        return response;
    }
}


/*
   1. read a JSON schema
   2. generate a JSON document from the schema
   3. validate the JSON document against the schema
   4. write the JSON document to a file
   5. transform JSON file to CBOR file
   6. create singing tree with X509 certificates
   7. Sign the CBOR file with a private key as COSE_Sign1
   8. Write the COSE_Sign1 file to a file
   9. zlib compress the signed cbor file
   10.base 45 encode the zlibbed file   10.
   11. get the QR code encoding for sizeOfBase45
   12. Transform the zlib file to a QR code
*/
async function JSON2QR ( inputJSON )
{   try
    {   logger.trace( applicationName + ':JSON2QR:Starting' );
        jsonDocument                   =   ' ';
        const encoded                  =   await _05_transformJSONToCBOR( inputJSON );
        if ( encoded.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _05_transformJSONToCBOR',encoded );
            return encoded;
        }
        logger.debug( applicationName + ':JSON2QR:_05_transformJSONToCBOR is done succesfully' );
        const keyInformation           =   {};

        const resultCose               =   await _07_signCBOROPbject( encoded.body, keyInformation );
        if ( resultCose.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _07_signCBOROPbject',resultCose );
            return resultCose;
        }
        logger.debug( applicationName + ':JSON2QR:_07_signCBOROPbject is done succesfully' );
        const zlibCompressed           =   await _10_zlibCompress( resultCose.body );


        if ( zlibCompressed.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _10_zlibCompress',zlibCompressed );
            return zlibCompressed;
        }
        logger.debug( applicationName + ':JSON2QR:_10_zlibCompress is done succesfully' );
        const base45Encoded            =   await _09_base45Encode( zlibCompressed.body );
        if ( base45Encoded.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _09_base45Encode',base45Encoded );
            return base45Encoded;
        }
        logger.debug( applicationName + ':JSON2QR:_09_base45Encode is done succesfully' );
        const qrCodeVersion            =   await _11_getQREncodingVersion( base45Encoded.body );
        if ( qrCodeVersion.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _11_getQREncodingVersion',qrCodeVersion );
            return qrCodeVersion;
        }
        logger.debug( applicationName + ':JSON2QR:_09_base45Encode is done succesfully' );        
        const resultQR                 =   await _11_transformZlibToQR( base45Encoded.body, qrCodeVersion.body );
        if ( resultQR.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + 'JSON2QR:Error in _11_transformZlibToQR',resultQR );
            return resultQR;
        }
        logger.debug( applicationName + ':JSON2QR:_11_transformZlibToQR is done succesfully' );
        logger.trace( applicationName + ':JSON2QR:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':JSON2QR:Exception caught: ',ex );
        return response;
    }
}



async function String2QR ( inputData  )
{   try
    {   logger.trace( applicationName + ':eudcc:String2QR:Starting' );
        if ( inputData === null || typeof inputData === 'undefined' )
        {   logger.error( applicationName + ':eudcc:String2QR:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }
        const versionQRCode            =   await _11_getQREncodingVersion( inputData );
        const qrOptions                =   {  version :versionQRCode.version,
                                              errorCorrectionLevel: versionQRCode.errorCorrection
                                           };
        try
        {  await fs.unlink( qrCodeFile );
        }
        catch ( err )
        {  console.log( 'Nothing to delete' );
        }
        QRCode.toFile( qrCodeFile, [{ data: inputData }], qrOptions, function ( error )
                       {  if ( error )
                           {   logger.error( applicationName + ':eudcc:String2QR:Error whilst generating QR code' );
                           }
                       } );
        const response                 =   { ...EC.noError } ;
        response.body                  =   inputData;
        logger.trace( applicationName + ':eudcc:String2QR:Ending' );
        return response;
    }
    catch   ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:String2QR:Exception caught: ',ex );
        return response;
    }
}


module.exports.QR2JSON                 =   QR2JSON;
module.exports.JSON2QR                 =   JSON2QR;
module.exports.String2QR               =   String2QR;