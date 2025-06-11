/* File             : configuration.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021-2025   
   Notes            : 
   Description      : 
*/

const nconf                             = require('nconf');

function Config()
{   try
    {   var environment
    
        console.log("configuration:Config:Starting")        
        
        nconf.file("default", "./config/default.json");
        console.log("configuration:Config:done")    
    } 
    catch(ex)
    {   console.log("configuration:Config:An Exception occurred:["+ex+"]")
    }
}

Config.prototype.get = function(key) 
{    return nconf.get(key);
};

module.exports = new Config();
