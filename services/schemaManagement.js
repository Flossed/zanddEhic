/* File             : schemaManagement.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023-2025
   Description      : Routines to manage the handling of JSON Schemas, 
                      including generation of random JSON based on the schema with random values.
                      validation of the generated JSON against the schema.
   Notes            : 
*/
const Validator                        =   require( 'jsonschema' ).Validator;
const $RefParser                       =   require( '@apidevtools/json-schema-ref-parser' );
const pathJson                         =   require('jsonpath');
const {logger, applicationName}        =   require( '../services/generic' );
const EC                               =   require( '../services/errorCatalog' );
let   jsonDocument                     =   ' ';
let   lastSeqNo                        =   0;



function insertArrayObjects ( schema, item, data )
{   try
    {   logger.trace( applicationName + ':eudcc:insertArrayObjects:Starting' );
        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertArrayObjects:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }

        const randomIndex              =   Math.floor( Math.random() * ( 10 ) ) + 1;
        let lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];
  
        if ( lastStringChar === '{' )
        {   jsonDocument               =   jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               =   jsonDocument.concat( ',"' );
        }
        jsonDocument                   =   jsonDocument.concat( item[0],'"', ':[' );
        for ( let i = 0; i < randomIndex; i++ )
        {   lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];
            if ( lastStringChar === '[' )
            {   jsonDocument           =   jsonDocument.concat( '{' );
            }
            else
            {   jsonDocument           =   jsonDocument.concat( ',{' );
            }
            const result               =   traverseObject( schema, item[1].items.properties, data );
            if ( result.returnCode !== EC.noError.returnCode )
            {   logger.error( applicationName + ':eudcc:insertArrayObjects:traverseObject returned errors',result );
                return result;
            }
            jsonDocument = jsonDocument.concat( '}' );
        }
        jsonDocument = jsonDocument.concat( ']' );
        logger.trace( applicationName + ':eudcc:insertArrayObjects:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                =   EC.exception;
        response.body                 =   ex;
        logger.exception( applicationName + ':eudcc:insertArrayObjects:Exception caught: ',ex );
        return response;
   }
}



function insertEmployerSelfEmployedActivityCodes ( schema, item )
{   try
    {   logger.trace( applicationName + ':eudcc:insertEmployerSelfEmployedActivityCodes:Starting' );
        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertEmployerSelfEmployedActivityCodes:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }

        const randomIndex              =   Math.floor( Math.random() * ( 10 ) ) + 1;
        let lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];

        if ( lastStringChar === '{' )
        {   jsonDocument               =   jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               =   jsonDocument.concat( ',"' );
        }
        jsonDocument                   =   jsonDocument.concat( item[0],'"', ':[' );
        for ( let i = 0; i < randomIndex; i++ )
        {   lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];
            if ( lastStringChar === '[' )
            {   jsonDocument           =   jsonDocument.concat( '"' );
            }
            else
            {   jsonDocument           =   jsonDocument.concat( ',"' );
            }
            const retVal               =   generateRandomString( item[1].items );
            if ( retVal.returnCode !== EC.noError.returnCode )
            {   logger.error( applicationName + ':eudcc:insertEmployerSelfEmployedActivityCodes:generateRandomString returned errors',retVal );
                return retVal;
            }
           jsonDocument                =   jsonDocument.concat( retVal.body,'"' );
       }
       jsonDocument                    =   jsonDocument.concat( ']' );
       logger.trace( applicationName + ':eudcc:insertEmployerSelfEmployedActivityCodes:Ending' );
       return EC.noError;
   }
   catch ( ex )
   {   const response                  =   EC.exception;
       response.body                   =   ex;
       logger.exception( applicationName + ':eudcc:insertEmployerSelfEmployedActivityCodes:Exception caught: ',ex );
       return response;
   }
}

function insertRandomAmountOfNationlities ( schema, item )
{   try
    {   logger.trace( applicationName + ':eudcc:insertRandomAmountOfNationlities:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertRandomAmountOfNationlities:incorrect input parameters' );
            const response             =   EC.badRequest;
            return response;
        }

        const nationalityArray         =   item[1].items.enum;
        const randomIndex              =   Math.floor( Math.random() * ( nationalityArray.length - 1 ) );
        let lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];
        if ( lastStringChar === '{' )  
        {   jsonDocument               =   jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               =   jsonDocument.concat( ',"' );
        }  
        jsonDocument                   =   jsonDocument.concat( item[0],'"', ':[' );
        for ( let i = 0; i < randomIndex; i++ )
        {   lastStringChar             =   jsonDocument[jsonDocument.length - 1 ];
            if ( lastStringChar === '[' )
            {   jsonDocument           =   jsonDocument.concat( '"' );
            }
            else
            {   jsonDocument           =   jsonDocument.concat( ',"' );
            }
            jsonDocument               =   jsonDocument.concat( nationalityArray[i],'"' );
        }
        jsonDocument                   =   jsonDocument.concat( ']' );
        logger.trace( applicationName + ':eudcc:insertRandomAmountOfNationlities:Ending' );
        return EC.noError;
     }
    catch ( ex )
    {   const response                 =   EC.exception;
        response.body                  =   ex;
        logger.exception( applicationName + ':eudcc:insertRandomAmountOfNationlities:Exception caught: ',ex );
        return response;
    }
}



function insertArray ( schema, item, data )
{   try
    {   let result;
        logger.trace( applicationName + ':eudcc:insertArray:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertArray:incorrect input parameters' );
            result                       = EC.badRequest;
            return result;
        }

        switch ( item[0] )
        {   case 'nationalities'                      : result       =  insertRandomAmountOfNationlities( schema, item );
                                                        if ( result.returnCode !== EC.noError.returnCode )
                                                        {   logger.error( applicationName + ':eudcc:insertArray:insertRandomAmountOfNationlities returned errors',result );
                                                            return result;
                                                        }
                                                        break;
            case 'employerSelfEmployedActivityCodes'  : result       = insertEmployerSelfEmployedActivityCodes( schema, item );
                                                        if ( result.returnCode !== EC.noError.returnCode )
                                                        {   logger.error( applicationName + ':eudcc:insertArray:insertEmployerSelfEmployedActivityCodes returned errors',result );1;
                                                            return result;
                                                        }
                                                        break;
            case 'workPlaceNames'                     : result       = insertArrayObjects( schema, item, data );
                                                        if ( result.returnCode !== EC.noError.returnCode )
                                                        {   logger.error( applicationName + ':eudcc:insertArray:insertArrayObjects returned errors',result );
                                                            return result;
                                                        }
                                                        break;
            case 'workPlaceAddresses'                 : lastSeqNo = 0;
                                                        result       = insertArrayObjects( schema, item, data );
                                                        if ( result.returnCode !== EC.noError.returnCode )
                                                        {   logger.error( applicationName + ':eudcc:insertArray:insertArrayObjects returned errors',result );
                                                            return result;
                                                        }
                                                        break;
            default                                   : logger.error( applicationName + ':eudcc:insertArray:unknown type', item );
                                                        result = EC.badResult;
                                                        return result;
        }
        logger.trace( applicationName + ':eudcc:insertArray:Ending' );
        return result;
     }
     catch ( ex )
     {   const response                = EC.exception;
         response.body                 = ex;
         logger.exception( applicationName + ':eudcc:insertArray:Exception caught: ',ex );
         return response;
    }
}



function insertAnyOf ( schema, item, data )
{   try
    {  let result;
        logger.trace( applicationName + ':eudcc:insertAnyOf:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertAnyOf:incorrect input parameters' );
            result                       = EC.badRequest;
            return result;
        }

        

        logger.trace( applicationName + ':eudcc:insertAnyOf:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertAnyOf:Exception caught: ',ex );
        return response;
    }   
}



function insertEmum ( schema, item )
{   try
    {   logger.trace( applicationName + ':eudcc:insertEmum:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || Array.isArray( item ) === false )
        {   logger.error( applicationName + ':eudcc:insertEmum:incorrect input parameters' );
            const response              = EC.badRequest;
            return response;
        }

        const randomIndex              = Math.floor( Math.random() * ( item[1].enum.length ) );
        const lastStringChar           = jsonDocument[jsonDocument.length - 1 ];

        if ( lastStringChar === '{' )
        {   jsonDocument               = jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               = jsonDocument.concat( ',"' );
        }
        jsonDocument                   = jsonDocument.concat( item[0],'"', ': ' );
        jsonDocument                   = jsonDocument.concat( '"',item[1].enum[randomIndex],'"' );

        logger.trace( applicationName + ':eudcc:insertEmum:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertEmum:Exception caught: ',ex );
        return response;
   }
}



function insertBoolean ( schema, item )
{   try
    {   logger.trace( applicationName + ':eudcc:insertBoolean:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertBoolean:incorrect input parameters' );
            const response               = EC.badRequest;
            return response;
        }

        const last1StringChar            = jsonDocument[jsonDocument.length - 1 ];

        if ( last1StringChar === '{' )
        {   jsonDocument               = jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               = jsonDocument.concat( ',"' );
        }
        jsonDocument                   = jsonDocument.concat( item[0],'"', ': ' );
        jsonDocument                   = jsonDocument.concat( 'true' );

        logger.trace( applicationName + ':eudcc:insertBoolean:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertBoolean:Exception caught: ',ex );
        return response;
   }
}



function  getOtherTypeOfItem ( schema, item )
{   try
    {   let response                   = { ...EC.noError };
        let getOtherTypeOfItem         = 'unknown type';

        logger.trace( applicationName + ':eudcc:getOtherTypeOfItem:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' )
        {   logger.error( applicationName + ':eudcc:getOtherTypeOfItem:incorrect input parameters' );
            response                   = EC.badRequest;
            return response;
        }
        logger.debug( applicationName + ':eudcc:getOtherTypeOfItem:item',item );

        if ( typeof item[1].enum !== 'undefined' )
        {   getOtherTypeOfItem         = 'enum';
        }
        else
        {   if ( item[1].type == 'boolean' )
            {   getOtherTypeOfItem     = 'boolean';
            }
            else
            if ( item[1].type === 'array' )
            {    getOtherTypeOfItem    = 'array';
            }
            else
            if ( item[1].anyOf !== 'undefined' )
            {    getOtherTypeOfItem    = 'anyOf';
                console.log('item[1].anyOf',item[1].anyOf);     
            }
        }
        if ( getOtherTypeOfItem === 'unknown type' )
        {   response                   = EC.badRequest;
            response.body              = item[1].type;
            return response;
        }
        response.body                  = getOtherTypeOfItem;
        logger.trace( applicationName + ':eudcc:getOtherTypeOfItem:Ending' );
        return response;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:getOtherTypeOfItem:Exception caught: ',ex );
        return response;
    }
}



function generateRandomString ( stringDef )
{   try
    {   logger.trace( applicationName + ':eudcc:generateRandomString:Starting' );

        if ( typeof stringDef === 'undefined' || stringDef === null )
        {   logger.error( applicationName + ':eudcc:generateRandomString:incorrect input parameters' );
            const response             = EC.badRequest;
            return response;
        }

        let maxStringLength            = 10000;
        let tempString                 = '';

        if ( typeof stringDef.maxLength === 'number' )
        {   maxStringLength            = stringDef.maxLength;
        }
        for ( let i = 0; i < maxStringLength; i++ )
        {    tempString                = tempString.concat( String.fromCharCode( Math.round( Math.random() * ( 122 - 97 ) + 97 ) ) );
        }
        logger.trace( applicationName + ':eudcc:generateRandomString:Ending' );
        const response                 = { ... EC.noError};
        response.body                  = tempString;
        return response;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:generateRandomString:Exception caught: ',ex );
        return response;
    }
}



function insertOthers ( schema, item, data )
{   try
    {   let result;

        logger.trace( applicationName + ':eudcc:insertOthers:Starting' );

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertOthers:incorrect input parameters' );
            result                       = { ...EC.badRequest };
            return result;
        }
        

        const retVal                   =  getOtherTypeOfItem( schema, item );
        if ( retVal.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:insertOthers:returned errors', retVal );
            return retVal;
        }

        const typeOfItem               = retVal.body;

        switch ( typeOfItem )
        {   case 'boolean'  :   result =  insertBoolean( schema, item );
                                if ( result.returnCode !== EC.noError.returnCode )
                                {   logger.error( applicationName + ':eudcc:insertOthers:insertBoolean returned errors',result );
                                    return result;
                                }
                                break;
            case 'enum'     :   result =  insertEmum( schema, item );
                                if ( result.returnCode !== EC.noError.returnCode )
                                {   logger.error( applicationName + ':eudcc:insertOthers:insertEmum returned errors',result );
                                    return result;
                                }
                                break;
            case 'array'    :   result = insertArray( schema, item, data );
                                if ( result.returnCode !== EC.noError.returnCode )
                                {   logger.error( applicationName + ':eudcc:insertOthers:insertArray returned errors',result );
                                    return result;
                                }
                                break;
            case 'anyOf'    :   result = insertAnyOf( schema, item, data );
                                if ( result.returnCode !== EC.noError.returnCode )
                                {   logger.error( applicationName + ':eudcc:insertOthers:insertAnyOf returned errors',result );
                                    return result;
                                }
                                break;
                                
            default         :   logger.error(   applicationName + ':eudcc:insertOthers:unknown type', item );
                                result = EC.badResult;
                                return result;
        }
        logger.trace( applicationName + ':eudcc:insertOthers:Ending' );
        return result;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:insertOthers:Exception caught: ',ex );
        return response;
    }
}



function insertNumber ( schema, object )
{   try
    {   logger.trace( applicationName + ':eudcc:insertNumber:Starting' );

        if ( schema === null || typeof schema === 'undefined' || object === null || typeof object === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertNumber:incorrect input parameters' );
            const response               = EC.badRequest;
            return response;
        }

        let seqNo                      = 0;
        const lastStringChar           = jsonDocument[jsonDocument.length - 1 ];

        if ( lastStringChar === '{' )
        {   jsonDocument               = jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               = jsonDocument.concat( ',"' );
        }
        jsonDocument                   = jsonDocument.concat( object[0],'"', ': ' );

        if ( object[0] === 'seqno' )
        {   seqNo                      = lastSeqNo + 1 ;
            lastSeqNo                  = seqNo;
        }
        else
        {  seqNo                       = Math.floor( Math.random() * 10 );
        }
        jsonDocument                   = jsonDocument.concat( seqNo.toString() );

        logger.trace( applicationName + ':eudcc:insertNumber:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertNumber:Exception caught: ',ex );
        return response;
    }
}



function insertObject ( schema, object, data )
{   try
    {   logger.trace( applicationName + ':eudcc:insertObject:Starting' );

        if ( schema === null || typeof schema === 'undefined' || object === null || typeof object === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertObject:incorrect input parameters' );
            return EC.badRequest;
        }

        const lastStringChar             = jsonDocument[jsonDocument.length - 1 ];

        if ( lastStringChar === '{' )
        {   jsonDocument               = jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               = jsonDocument.concat( ',"' );
        }
        jsonDocument                   = jsonDocument.concat( object[0],'"', ': ' );
        jsonDocument                   = jsonDocument.concat( '{' );

        const retVal                   = traverseObject( schema, object[1].properties,data );
        if ( retVal.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:insertObject:traverseObject returned errors',retVal );
            return retVal;
        }

        jsonDocument                   = jsonDocument.concat( '}' );
        logger.trace( applicationName + ':eudcc:insertObject:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertObject:Exception caught: ',ex );
        return response;
    }
}



function insertString ( schema, object, items )
{   try
    {   logger.trace( applicationName + ':eudcc:insertString:Starting' );

        if ( schema === null || typeof schema === 'undefined' || object === null || typeof object === 'undefined' )
        {   logger.error( applicationName + ':eudcc:insertString:incorrect input parameters' );
            const response               = EC.badRequest;
            return response;
        }

        let lastStringChar;

        for ( let i = 0; i < items.length; i++ )
        {   if ( items[i][0] === object[0] )
            {   const arrayObjects   = Object.entries( items[i][1] )[0][1];
                const randomIndex    = Math.floor( Math.random() * ( arrayObjects.length ) );
                lastStringChar     = jsonDocument[jsonDocument.length - 1 ];
                if ( lastStringChar === '{' )
                {   jsonDocument   = jsonDocument.concat( '"' );
                }
                else
                {   jsonDocument   = jsonDocument.concat( ',"' );
                }
                jsonDocument       = jsonDocument.concat( object[0],'"', ': ' );
                jsonDocument       = jsonDocument.concat( '"',arrayObjects[randomIndex],'"' );
                return EC.noError;
            }
        }

        lastStringChar                 = jsonDocument[jsonDocument.length - 1 ];

        if ( lastStringChar === '{' )
        {   jsonDocument               = jsonDocument.concat( '"' );
        }
        else
        {   jsonDocument               = jsonDocument.concat( ',"' );
        }
        jsonDocument                   = jsonDocument.concat( object[0],'"', ': ' );

        if ( typeof object[1].maxLength === 'number' )
        {   const retVal               =  generateRandomString( object[1] );
            if ( retVal.returnCode !== EC.noError.returnCode )
            {   logger.error( applicationName + ':eudcc:insertString:generateRandomString returned errors',retVal );
                return retVal;
            }
            jsonDocument               = jsonDocument.concat( '"', retVal.body, '"' );
        }
        logger.trace( applicationName + ':eudcc:insertString:Ending' );
        return EC.noError;
    }
    catch ( ex )
    {   const response                = EC.exception;
        response.body                 = ex;
        logger.exception( applicationName + ':eudcc:insertString:Exception caught: ',ex );
        return response;
    }
}



function manageItem ( schema,item, data )
{   try
    {   logger.trace( applicationName + ':eudcc:manageItem:Starting' );

        let result;

        if ( schema === null || typeof schema === 'undefined' || item === null || typeof item === 'undefined' || data === null || typeof data === 'undefined' )
        {   logger.error( applicationName + ':eudcc:manageItem:incorrect input parameters' );
            result                       = { ...EC.badRequest };
            return result;
        }
        logger.debug( applicationName + ':eudcc:manageItem:item[1].type',item);
        switch ( item[1].type )
        {   case 'object' :   result   = insertObject( schema, item, data );
                              if ( result.returnCode !== EC.noError.returnCode )
                              {   logger.error( applicationName + ':eudcc:manageItem:insertObject returned errors',result );
                                  return result;
                              }
                              break;
            case 'string' :   result   = insertString( schema, item, data );
                              if ( result.returnCode !== EC.noError.returnCode )
                              {   logger.error( applicationName + ':eudcc:manageItem:insertString returned errors',result );
                                  return result;
                              }
                              break;
            case 'number' :   result   = insertNumber( schema, item );
                              if ( result.returnCode !== EC.noError.returnCode )
                              {   logger.error( applicationName + ':eudcc:manageItem:insertNumber returned errors',result );
                                  return result;
                              }
                              break;
            default       :   result   = insertOthers( schema, item, data );
                              if ( result.returnCode !== EC.noError.returnCode )
                              {   logger.error( applicationName + ':eudcc:manageItem:insertOthers returned errors',result );
                                  return result;
                              }
                              break;
        }
        logger.trace( applicationName + ':eudcc:manageItem:Ending' );
        return result;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:manageItem:Exception caught: ',ex );
        return response;
    }
}



function traverseObject ( schema, jsonObject, data )
{   try
    {   logger.trace( applicationName + ':eudcc:traverseObject:Starting' );
        let response                   = { ...EC.noError };
        
        
        if ( ( typeof jsonObject === 'undefined' || jsonObject === null ) || ( typeof data === 'undefined' || data === null ) )
        {   logger.error( applicationName + ':eudcc:traverseObject:incorrect input parameters' );
            response                   = EC.badRequest;
            return response;
        }

        const arrayOfProperties          = Object.entries( jsonObject );
       

        arrayOfProperties.forEach( function ( item )
        {   const result                  =  manageItem ( schema, item, data );
            if ( result.returnCode !== EC.noError.returnCode )
            {   logger.error( applicationName + ':eudcc:traverseObject:manageItem returned errors',result );
                return result;
            }
        } );
        logger.trace( applicationName + ':eudcc:traverseObject:Ending' );
        return response;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:traverseObject:Exception caught: ',ex );
        return response;
    }
}



async function generateDataFromSchema ( schema, data )
{   try
    {   let response                   = { ...EC.noError };

        if ( typeof schema === 'undefined' || schema === null || typeof data === 'undefined' || data === null )
        {   logger.error( applicationName + ':eudcc:generateDataFromSchema:incorrect input parameters' );
            response                   = EC.badRequest;
            return response;
        }

        const schemaObject             = await $RefParser.dereference( schema, {allowUnknownAttributes: false} );
        let propertyQArray= pathJson.nodes(schemaObject, '$..properties',1);
        let schemaProperties = propertyQArray[0].value;
        
        

        jsonDocument                   = jsonDocument.concat( '{' );

        const traverseObjectResp         = traverseObject( schemaObject, schemaProperties,data );
        if ( traverseObjectResp.returnCode !== EC.noError.returnCode )
        {   logger.error( applicationName + ':eudcc:generateDataFromSchema:traverseObjectResp returned errors' );
            return traverseObjectResp;
        }

        jsonDocument                   = jsonDocument.concat( '}' );
        response.body                  = jsonDocument;
        return response;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:generateDataFromSchema:Exception caught: ',ex );
        return response;
    }
}



async function validateSchema ( schema, jsonInput )
{   try
    {   logger.trace( applicationName + ':eudcc:validateSchema:Stasdasdasdarting' );
        const response                 = { ... EC.noError};

        if ( schema === null || typeof schema === 'undefined' || jsonInput === null || typeof jsonInput === 'undefined' )
        {   logger.error( applicationName + ':eudcc:validateSchema:incorrect input parameters' );
            const response               = EC.badRequest;
            return response;
        }
        

        const validator                = new Validator();

        validator.debug                = true;
        const schemaObject             = await $RefParser.dereference( schema, {allowUnknownAttributes: false} );
        const JSONdata                 = JSON.parse( jsonInput );
        

        const valResult                = validator.validate( JSONdata, schemaObject );
        

        logger.debug( applicationName + ':eudcc:validateSchema:valResult',valResult.errors );
        if ( valResult.errors.length > 0 )
        {   logger.error( applicationName + ':eudcc:validateSchema:Validation returned errors',valResult.errors );
            const response             = EC.schemaValidationError;
            response.body              = valResult.errors;
            return response;
        }

        logger.trace( applicationName + ':eudcc:validateSchema:Ending' );
        return response;
    }
    catch ( ex )
    {   const response                 = EC.exception;
        response.body                  = ex;
        logger.exception( applicationName + ':eudcc:validateSchema:Exception caught in validateSchema: ',ex );
        return response;
    }
}


module.exports.validateSchema                   =   validateSchema;
module.exports.generateDataFromSchema           =   generateDataFromSchema;
module.exports.traverseObject                   =   traverseObject;