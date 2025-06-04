const html5QrCode = new Html5Qrcode(/* element id */ "reader");
// File based scanning
const fileinput = document.getElementById("qr-input-file");


fileinput.addEventListener("change", (e) => {
  if (e.target.files.length == 0) {
    // No file selected, ignore
    return;
  }

  const imageFile = e.target.files[0];
  // Scan QR Code
  html5QrCode
    .scanFile(imageFile, true)
    .then((decodedText) => {
      base64String = decodedText.toString("base64");

      document.getElementById("qr-contents").innerText = decodedText;
      document.getElementById("decodedQRCode").innerHTML = decodedText;
      
    })
    .catch((err) => {
      // failure, handle it.
      console.log(`Error scanning file. Reason: ${err}`);
    });
});

function init() 
{   console.log("init() called");
    const PDA1PN = document.getElementById("PDA1PN").value;
    console.log("PDA1PN: " ,  PDA1PN);
    
    if (PDA1PN.length > 0) 
    {   console.log("PDA1PN is not empty, displaying information");
        const decodedQRCode = JSON.parse( PDA1PN)
        console.log("Decoded QR Code: ", decodedQRCode);
        document.getElementById("qr-result").innerHTML = JSON.stringify(decodedQRCode.body,null, 2);
    }
}

function convert()
{   document.getElementById("QRCODEForm").submit();
}


init()
