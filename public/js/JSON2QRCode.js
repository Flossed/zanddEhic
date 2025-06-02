function openFile()
{    
      
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.click(); 
      input.addEventListener('change', function (e) 
      {   let file = input.files[0];
          let reader = new FileReader();
          reader.onload = function (e) 
          {   let textArea = document.getElementById("displayJson");
              textArea.value =  JSON.stringify(JSON.parse( e.target.result), undefined, 3);
              let variable = document.getElementById("inputJSON");
              variable.value =  e.target.result;
          };
          reader.readAsText(file);
      }, false);
}   

function formulierActie(action)
{  let form = document.getElementById("QRCODEForm");    
    form.submit();
}

function init(inputJson)
{   if(typeof inputJson !== 'undefined' && Object.keys(inputJson).length !== 0)
    {    let textArea                  = document.getElementById("displayJson");
         textArea.value                = JSON.stringify(  inputJson, undefined, 3);
         let variable                  = document.getElementById("inputJSON");
         variable.value                = inputJson;
    }
}