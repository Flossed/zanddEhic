# II. Registering a New Trusted Issuer in the DID Registry of EBSI.

In order to be able to use verifiable credentials in a business flow, different players need to be attached to eachother in a specific way so that there is a credential which can be verified. 
the following players are required to exist.
1. the entity that will create the verifiable credential which will be issued to a entity for whom the credential is created. this will be call the trusted issuer (TI).
2. the holder of the verifiable credential, often the subject for  which the credential is created 
3. the verifier of the verifiable credential, this is the entity which will validate the authenticity of the issued credential, and the data contained in it. 
4. the trusted registries against which the identity of the issuers of credentials are verified.

The registries are managed by a trusted party which is independent of the issuer, holder and verifier. their identity stand above any reproach, and these are implicitly trusted, and the information in their registries are implicity trusted as well.

In order to become a trusted issuer, the issuer will need to be registered in the trusted registries, for this we will follow the process described hereunder to be able to register the Issuer into the registries of the EBSI.


## Step 1 : register new TI on DID registry

First step is to use the Root Authority to register the DID of the TI in the DID - registry. 
for this we should create and run a script using the CLI, see ref 3 for underlying specifcations. 
!NOTE: a more automatic approach is in the making. 
NOTE: all these steps need to be executed in sequence during one session of the CLI, as we will use to CLI to store intermitted results required in further steps, if the CLI is terminated the intermitted results will be lost and subsequenty the process will fail.


High level flow : 
1. start the CLI
2. load the pilot environment
3. create a new DID with both ES256K and ES256 keys
4. store the created information in local variables.
5. load the TAO as authority which will sign off on the registgration of the DID.
6. as TAO create a VC containing a VerifiableAuthorisationToOnboard 
7. Create a Presentation request as issuer to register the DID document
8. start DID insertion ( using the loaded DID identity of the new issuer for the creation of the did document).
10. prepare a presentation request using the did document, authorisation token and access token of open ID and present it to the EBSI DIDR.


### 1. Start CLI
After installing the CLI (see above), we start the CLI. 

````
>yarn start
````

Result: 
<div class="output">
  <pre>
> yarn start
yarn run v1.22.19
$ node dist/src/index
(node:169) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node18 --trace-warnings ...` to show where the warning was created)
==>
  </pre>
</div>  

We are now in the CLI and are able to communicate with the EBSI blockchain using the CLI


### 2. load the pilot environment
For the next step we will register the new issuer on the pilot environment of the EBSI. IN order to do so we must tell the CLI to use the pilot environment, next to the pilot environment there is also:
1. conformance, 
2. test
3.  production.


We will not use any other environment than pilot
No win the CLI execute the following commands : 

````
env pilot
````
Result: 
<div class="output">
  <pre>
==> env pilot
Environment pilot loaded
{
  "domain": "https://api-pilot.ebsi.eu",
  "contractAddresses": {
    "timestamp": "0xaD00Eb7A224cBB0f3fCeC68595a4F4FF87e7eB2F",
    "timestampNew": "0x8b7ddD28FdE20080A337Bff5badCa043163Bc3a3",
    "didOld": "0xD55bDf1407E57D55C92BdB67088ECdA554b76B45",
    "did": "0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa",
    "didNew": "0x76C8190D7422e5fa2A0190Bc2313bab0b2afEC78",
    "tar": "0x3Ba8dE431d3741A6077A20656aCC01027FF920e3",
    "tarNew": "0x35fE6e9be02Bc93381117e6c424B5688894B0639",
    "tir": "0xB1D9B0EC0B52aD095bab2A5320a808aCb7c9F186",
    "tirNew": "0x5C87455c82617579A10AD39C2DB3e60E846E7266",
    "tsr": "0x30cC78D20E21C8422F3B62052FD4C15D4b7894A4",
    "tsrNew": "0xF3aFc480b171CB8c2D89c3753FF46104d7011B07",
    "tpr": "0x3591e30eaea83343ed69A077D059821c5099154A",
    "tprNew": "0x81872fccf3AEDD94C00E643bC2967Bd7aC91CFEB"
  },
  "urls": [
    "https://api-pilot.ebsi.eu/timestamp/v4",
    "https://api-pilot.ebsi.eu/timestamp/v3",
    "https://api-pilot.ebsi.eu/storage/v3",
    "https://api-pilot.ebsi.eu/ledger/v4",
    "https://api-pilot.ebsi.eu/ledger/v3",
    "https://api-pilot.ebsi.eu/notifications/v2",
    "https://api-pilot.ebsi.eu/authorisation/v4",
    "https://api-pilot.ebsi.eu/authorisation/v3",
    "https://api-pilot.ebsi.eu/authorisation/v2",
    "https://api-pilot.ebsi.eu/users-onboarding/v2",
    "https://api-pilot.ebsi.eu/did-registry/v5",
    "https://api-pilot.ebsi.eu/did-registry/v4",
    "https://api-pilot.ebsi.eu/did-registry/v3",
    "https://api-pilot.ebsi.eu/proxy-data-hub/v3",
    "https://api-pilot.ebsi.eu/trusted-apps-registry/v4",
    "https://api-pilot.ebsi.eu/trusted-apps-registry/v3",
    "https://api-pilot.ebsi.eu/trusted-issuers-registry/v5",
    "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4",
    "https://api-pilot.ebsi.eu/trusted-issuers-registry/v3",
    "https://api-pilot.ebsi.eu/trusted-schemas-registry/v3",
    "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2",
    "https://api-pilot.ebsi.eu/trusted-policies-registry/v3",
    "https://api-pilot.ebsi.eu/trusted-policies-registry/v2",
    "https://api-pilot.ebsi.eu/conformance/v4",
    "https://api-pilot.ebsi.eu/conformance/v3",
    "https://api-pilot.ebsi.eu/conformance/v2"
  ],
  "env": "pilot"
}
==>
  </pre>
</div>  

As you can see diffent pre-sets [domain, contracAddresses, urls, env]  are setup to now point to the pilot environment. The CLI will use these presets when contacting EBSI.


### 3. create a new DID with both ES256K and ES256 keys

We will now create the DID for the new issuer, we will use the CLI to generate a DID and a key set. Note : although the CLI is used to create the DID and attached keys, these key are not yet registered, so don't terminate the CLi undtil the registration is done, or copy and paste the resulting DID document and all the generated key information for later usage. Using the CLI involves a couple of steps. 
a. cleaning the in memory object that will contain the newly created data.
b. generate a DID and the ES256K key 
c. generate subseqeuntly an ES256 Key


The ES256K key is used to access the EBSI blockchain, this will not be used for signing, even if it can be, the tooling available to check the nature of JWK's often don't support this encryption type.  (see ref. 5 for more information on this key and its purpose.).  The ES256 key will be used to sign issued verifiable credentials. the DID will be the identifier of the issuer. 

#### a. Clear the user object in the CLI.

First wel will clear the 'user' profile  which will ensure that we will not use any old data

Now in the CLI execute the following commands : 

````
using user null
````
Result: 
<div class="output">
  <pre>
==> using user null
User removed
==>
  </pre>
</div>  

To trust is good to check is better lets see what the user profile has stored for us after cleaning it. 


````
view user
````
Result: 
<div class="output">
  <pre>
==> view user
{
  "keys": {},
  "privateKeyHex": "",
  "publicKeyHex": "",
  "address": ""
}
==>
  </pre>
</div>  

The user in the CLI which is wiped the moment the CLI is exitted, so copy if needed. is an object which will holde information concerning the user, it will hold [keys, privateKeyHex, publicKeyHex, address], and all these spaces are empty at the moment.

#### b. Generate a DID and the ES256K key  (for accessing the EBSI). 
To generate the DID we create a DID document with the CLI requesting to create a DID and an ES256K key which will be used to access the EBSI by the issuer.

````
using user ES256K
````
Result: 
<div class="output">
  <pre>
==> using user ES256K
{
  "keys": {
    "ES256K": {
      "id": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      }
    }
  },
  "privateKeyHex": "0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7",
  "publicKeyHex": "0x044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada19",
  "address": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
  "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "didVersion": 1
}
==>
  </pre>
</div>  

The system has now created filled in the in memory user object containing the keys, did privatekeyHex and so forth, C 
NOTE I: This is not the DID document, the DID document contains less information and is formated in a different fashion according to the format of the EBSI DID document specification. 
NOTE II: The ES5256K key is only used for Accessing the EBSI we will still need to create the key information that we will use siging the created VC's.

#### c. Generate a DID and the ES256 key (for signing the created Credentials).
We again use the CLI to generate the signing key and add it to the existing user object.

````
using user ES256
````
Result: 
<div class="output">
  <pre>
==> using user ES256
{
  "keys": {
    "ES256K": {
      "id": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      }
    },
    "ES256": {
      "id": "iu1Mav6kmbMnkh11-cx7v0A7KERwdfqCpsXZRwPtfg4",
      "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#iu1Mav6kmbMnkh11-cx7v0A7KERwdfqCpsXZRwPtfg4",
      "privateKeyJwk": {
        "kty": "EC",
        "x": "6NKhtR9tlbKA5F8h6psq5N-NNB-ty_Qb5rnUlWBpe3Y",
        "y": "CDNr__fFocwmMy0EkXFnOwFr1Q0HVzvlgyx1gf8InIY",
        "crv": "P-256",
        "d": "rr9v1Il3LDrklHNVW0gT18qFZlz5j_QCbBgffVE9EDU"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "x": "6NKhtR9tlbKA5F8h6psq5N-NNB-ty_Qb5rnUlWBpe3Y",
        "y": "CDNr__fFocwmMy0EkXFnOwFr1Q0HVzvlgyx1gf8InIY",
        "crv": "P-256"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "x": "n_m6Knyobx2MdVx4CNAoLpDHBKgEDVbvX3mxZCntapk",
        "y": "SsIKfonFYRyQWuXDRshPC3roSJS0qfLYHHeDlNaPsbc",
        "crv": "P-256",
        "d": "lkSwtKKorRN1pMAWMvJPx0ywkVnViO02s3Si5ehNW5Y"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "x": "n_m6Knyobx2MdVx4CNAoLpDHBKgEDVbvX3mxZCntapk",
        "y": "SsIKfonFYRyQWuXDRshPC3roSJS0qfLYHHeDlNaPsbc",
        "crv": "P-256"
      }
    }
  },
  "privateKeyHex": "0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7",
  "publicKeyHex": "0x044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada19",
  "address": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
  "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "didVersion": 1
}
==>
  </pre>
</div>  

The system has now added to the in memory user object an ES256 KEY.!!! This information is vital to keep 

!!! Copy this and keep this result,!!!
The privatekey information will be essential to use later on in accessing the EBSI and signing Verifieable credentials. In a system envirinment this information will form the identitiy of an issuer, and should be store in what can be called an Enterprise wallet. 

NOTE!: This is not the DID document, the DID document contains less information and is formated in a different fashion according to the format of the EBSI DID document specification. 

### 4. Retain the created id and private key for next steps.
At this time the ID and private key of the new issuer have been created, in the subsequent steps we will need this information to register the ID and accredit the issuer with issuance of the credentials. 

At this point in time I need to stress again the importance of copying this information and storing it security and persistently. Not doing so will render the remainder of this exercise as useless as you will not be able to sign any VC. !!!!!


````
set PrivateKeyIssuer user.privateKeyHex
````
Result: 
<div class="output">
  <pre>
==> set PrivateKeyIssuer user.privateKeyHex
Value saved in 'PrivateKeyIssuer':
0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7
==>
  </pre>
</div>  

Checking the setting of the variable. 
````
view PrivateKeyIssuer
````
Result: 
<div class="output">
  <pre>
==> view PrivateKeyIssuer
0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7
==>
  </pre>
</div>  



````
set DidIssuer user.did
````
Result: 
<div class="output">
  <pre>
==> set DidIssuer user.did
Value saved in 'DidIssuer':
did:ebsi:z21NqAkAUjTgG9FazC6LzG35
==>
  </pre>
</div>  

Checking the setting of the variable. 
````
view DidIssuer
````
Result: 
<div class="output">
  <pre>
==> view DidIssuer
did:ebsi:z21NqAkAUjTgG9FazC6LzG35
==>
  </pre>
</div>  

The CLI now has two variables defined containing the information that was created for the setup of the keystore of the issuer. (PrivateKeyIssuer, DidIssuer)





### 5. load the TAO as authority which will sign off on the registgration of the DID.

Now that we saved the essential information of the new issuer in variables in the CLI, we progress with switching the context to take the role of the TAO in preparation of providing a verifiable authrosation to onboard the issuer on the EBSI DID registry as a vc for the Issuer.

We will consecutively do the following: 
a. clear the user context  in the CLI. 
b. load the identity of the TAO
c. setup local variables with the result of loading of the context of the TAO.


#### a. clear the user context  in the CLI. 
Now in the CLI execute the following commands : 

````
using user null
````
Result: 
<div class="output">
  <pre>
==> using user null
User removed
==>
  </pre>
</div>  

To trust is good to check is better lets see what the user profile has stored for us after cleaning it. 


````
view user
````
Result: 
<div class="output">
  <pre>
==> view user
{
  "keys": {},
  "privateKeyHex": "",
  "publicKeyHex": "",
  "address": ""
}
==>
  </pre>
</div>  

NOTE: at this point in time the variables PrivateKeyIssuer and DidIssuer still exist and still have the values from the new issuer. 


#### b. load the identity of the TAO
Ladin gthe identity of the TOA required setting up the user storage with the:
I. ES256K private key of the TAO
II. the ES256 private key of the TAO. 
III. storing the KEY information from the TAO

##### I. ES256K private key of the TAO
We will load the ES256 K key of the TAO by loading the private hexadecimal key of the TOA. The name of the key is 'privateKeyHex'and is highlighted below in bold and red. 

<div class="output">
  <pre>
ROAT TAO for PDA1 Issuer:
{
  "keys": {
    "ES256K": {
      "id": "wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "kid": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2#wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      }
    },
    "ES256": {
      "id": "m7ZTHjzbQqPkT4Mpr6I82yzyv8S1x3EUYKMtJVnyPKI",
      "kid": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2#m7ZTHjzbQqPkT4Mpr6I82yzyv8S1x3EUYKMtJVnyPKI",
      <b style='color:blue'>"privateKeyJwk": {
        "kty": "EC",
        "x": "lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0",
        "y": "5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ",
        "crv": "P-256",
        "d": "QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"
      },</b>
      "publicKeyJwk": {
        "kty": "EC",
        "x": "lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0",
        "y": "5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ",
        "crv": "P-256"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "x": "1qno7xbTJGRYI7C57reaf8-yaVQRnJ7ZUF2xRQH3e-8",
        "y": "oVNSziFI7SjNNJSjaDEJ1JK6JhN4qJPkytTnC8AZsgM",
        "crv": "P-256",
        "d": "5Aytan_qVn358olaWfsyHbR8kIykvQ7rUQ9QgVPY7fs"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "x": "1qno7xbTJGRYI7C57reaf8-yaVQRnJ7ZUF2xRQH3e-8",
        "y": "oVNSziFI7SjNNJSjaDEJ1JK6JhN4qJPkytTnC8AZsgM",
        "crv": "P-256"
      }
    }
  },
  <b style='color:red'>"privateKeyHex": "0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb",</b>
  "publicKeyHex": "0x0481209255399950536526e1ff8f0e9ce0cad8d617eed4094eb10b6c922677f411011ae045f752809d3eaed221ae6050af58fa3ae193345e39423d29b666517bac",
  "address": "0xd8a150EAa0026935fD50DB437B36FE3FC1B1833f",
  "did": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",
  "didVersion": 1
}
  </pre>
</div> 





````
using user ES256K did1 0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb did:ebsi:zjXU19gTNuQTAudP7hQwMr2
````
Result: 
<div class="output">
  <pre>
==> using user ES256K did1 0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb did:ebsi:zjXU19gTNuQTAudP7hQwMr2
{
  "keys": {
    "ES256K": {
      "id": "wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "kid": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2#wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      }
    }
  },
  "privateKeyHex": "0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb",
  "publicKeyHex": "0x0481209255399950536526e1ff8f0e9ce0cad8d617eed4094eb10b6c922677f411011ae045f752809d3eaed221ae6050af58fa3ae193345e39423d29b666517bac",
  "address": "0xd8a150EAa0026935fD50DB437B36FE3FC1B1833f",
  "did": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",
  "didVersion": 1
}
==>
  </pre>
</div>  

As you can see above the result the loaded identity is identical to the intial document shown except for the ES256 key. 


##### II. ES256 private key of the TAO
We will load the ES256 key of the TAO by loading the private Jwk key of the TOA. The name of the key is 'privateKeyJwk'and is highlighted below in bold and red. 
!NOTE: don't use the 'privateKeyEncryptionJwk' to load the identity of the ES256 key. 
please see the bold blue section in the key set above.

````
using user ES256 did1 {"kty":"EC","x":"lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0","y":"5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ","crv": "P-256","d":"QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"}  did:ebsi:zjXU19gTNuQTAudP7hQwMr2
````
Result: 
<div class="output">
  <pre>
==> using user ES256 did1 {"kty":"EC","x":"lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0","y":"5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ","crv": "P-256","d":"QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"}  did:ebsi:zjXU19gTNuQTAudP7hQwMr2
{
  "keys": {
    "ES256K": {
      "id": "wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "kid": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2#wLq6D0RA8sLf3CgDISCK1Mu75H42Kcu9qiHPQZVwks8",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w",
        "d": "nVtqj8WCuryMOxOTjt-ZPFZNkuzNWFeVT3d3HZ4iFes"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "gSCSVTmZUFNlJuH_jw6c4MrY1hfu1AlOsQtskiZ39BE",
        "y": "ARrgRfdSgJ0-rtIhrmBQr1j6OuGTNF45Qj0ptmZRe6w"
      }
    },
    "ES256": {
      "id": "m7ZTHjzbQqPkT4Mpr6I82yzyv8S1x3EUYKMtJVnyPKI",
      "kid": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2#m7ZTHjzbQqPkT4Mpr6I82yzyv8S1x3EUYKMtJVnyPKI",
      "privateKeyJwk": {
        "kty": "EC",
        "x": "lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0",
        "y": "5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ",
        "crv": "P-256",
        "d": "QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "x": "lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0",
        "y": "5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ",
        "crv": "P-256"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "x": "jlFvC7F_ih-3qPPboXJu0SEn6jcTW1Po8FzOw9xcZk8",
        "y": "tzQYrhFBdgcySBHVB69iOZdKwoDa3nfBq3N5Zi8I1JA",
        "crv": "P-256",
        "d": "eQzXodPeT6OAG1A8qFLM9cmiadDALTKzzGfZDiLPEJM"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "x": "jlFvC7F_ih-3qPPboXJu0SEn6jcTW1Po8FzOw9xcZk8",
        "y": "tzQYrhFBdgcySBHVB69iOZdKwoDa3nfBq3N5Zi8I1JA",
        "crv": "P-256"
      }
    }
  },
  "privateKeyHex": "0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb",
  "publicKeyHex": "0x0481209255399950536526e1ff8f0e9ce0cad8d617eed4094eb10b6c922677f411011ae045f752809d3eaed221ae6050af58fa3ae193345e39423d29b666517bac",
  "address": "0xd8a150EAa0026935fD50DB437B36FE3FC1B1833f",
  "did": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",
  "didVersion": 1
}
==>
  </pre>
</div>  

!NOTE: Ignore  the difference in encryption key set this is indeed different from the original. the encyption keys is is not relevant anymore it was used in the old API's.  

##### III. Storing the KEY information from the TAO

Now that the identity of the TAO is loaded we will store the relevant infromation of the TAO required for the creation of the VerifiableAuthorisationToOnboard credential. 
We will keep the following [ES256K key, ES256 Key, the Issuer DID]. 


###### The ES256K key
````
set issuerPrivateKeyES256K user.privateKeyHex
````
Result: 
<div class="output">
  <pre>
==> set issuerPrivateKeyES256K user.privateKeyHex
Value saved in 'issuerPrivateKeyES256K':
0x9d5b6a8fc582babc8c3b13938edf993c564d92eccd5857954f77771d9e2215eb
==>
  </pre>
</div>  


###### The ES256 key
````
set issuerPrivateKeyES256 user.keys.ES256.privateKeyJwk
````
Result: 
<div class="output">
  <pre>
==> set issuerDid user.did
Value saved in 'issuerDid':
did:ebsi:zjXU19gTNuQTAudP7hQwMr2
==>
  </pre>
</div>  

###### The DID of the Issuer 
````
set issuerDid user.did
````
Result: 
<div class="output">
  <pre>
==> set issuerPrivateKeyES256 user.keys.ES256.privateKeyJwk
Value saved in 'issuerPrivateKeyES256':
{
  "kty": "EC",
  "x": "lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0",
  "y": "5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ",
  "crv": "P-256",
  "d": "QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"
}
==>
  </pre>
</div>  

The Key elements of the TAO are now loaded in the system and we can proceed to create the  VerifiableAuthorisationToOnboard credential. 

### 6. as TAO create a VC containing a VerifiableAuthorisationToOnboard 
The Tao will create for the issuer to be, a verifiable credential which will allow the issuer to self register on the EBSI DID. For this the schema of the VerifiableAuthorisationToOnboard credential is first loaded in the CLI, after which some of the data is set explicitly to match the request between issuer and TAO in order to be able to create the VC.
Steps to take in this part of the process are: 
a. Load the schema for creating the VerifiableAuthorisationToOnboard Credential
b. set the issuer DID
c. set the credential Subject ID.
d. set the credential Schema. 
e. set the terms Of Use Id
f create the VC. 


#### a. Load the schema for creating the VerifiableAuthorisationToOnboard Credential
We will now create a Verifiable Authorisation Credential as TAO for the ISsuer which he need to use to onboard. The schema for this is located in the subdirectory of the test-scripts installation under '.scripts/assets/VerifiableAuthorisationToOnboard.json'. This schema template is empty and requires to be setup once loaded. 

````
payloadVc: load scripts/assets/VerifiableAuthorisationToOnboard.json
````
Result: 
<div class="output">
  <pre>
==> payloadVc: load scripts/assets/VerifiableAuthorisationToOnboard.json
Value saved in 'payloadVc':
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential",
    "VerifiableAttestation",
    "VerifiableAuthorisationToOnboard"
  ],
  "issuer": "",
  "credentialSubject": {
    "id": "",
    "accreditedFor": []
  },
  "termsOfUse": {
    "id": "",
    "type": "IssuanceCertificate"
  },
  "credentialSchema": {
    "id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",
    "type": "FullJsonSchemaValidator2021"
  }
}
==>
  </pre>
</div>  

The empty schema is now loaded in the CLI, and you can see thare are no values set for [iussuer, credentialSubject, terms of use] .  The credentialsubject schema happens to be set and set correctly we will however not to deviate from the script that EBSI provided set this element again. 

#### b. set the issuer DID

````
set payloadVc.issuer issuerDid
````
Result: 
<div class="output">
  <pre>
==> set payloadVc.issuer issuerDid
Value saved in 'payloadVc.issuer':
did:ebsi:zjXU19gTNuQTAudP7hQwMr2
  </pre>
</div>  

The result is a bit to plain lets view the payloaddVC to make sure all is set well.

````
view payloadVc
````
Result: 
<div class="output">
  <pre>
==> view payloadVc
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential",
    "VerifiableAttestation",
    "VerifiableAuthorisationToOnboard"
  ],
  <b style="color:red;">"issuer": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2", </b>
  "credentialSubject": {
    "id": "",
    "accreditedFor": []
  },
  "termsOfUse": {
    "id": "",
    "type": "IssuanceCertificate"
  },
  "credentialSchema": {
    "id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",
    "type": "FullJsonSchemaValidator2021"
  }
}
==>
  </pre>
</div>  

Now we see clearly that the issuer is set with the DID of the TAO.  ( it is highlighted in bold red above) . 

#### c. set the credential Subject ID.
````
set payloadVc.credentialSubject.id DidIssuer 
````
Result: 
<div class="output">
  <pre>
==> set payloadVc.credentialSubject.id DidIssuer
Value saved in 'payloadVc.credentialSubject.id':
did:ebsi:z21NqAkAUjTgG9FazC6LzG35
  </pre>
</div>  

The result is a bit to plain lets view the payloaddVC to make sure all is set well.

````
view payloadVc
````
Result: 
<div class="output">
  <pre>
==> view payloadVc
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential",
    "VerifiableAttestation",
    "VerifiableAuthorisationToOnboard"
  ],
  <b style="color:blue;">"issuer": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",</b>
  "credentialSubject": {
    <b style="color:red;">"id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",</b>
    "accreditedFor": []
  },
  "termsOfUse": {
    "id": "",
    "type": "IssuanceCertificate"
  },
  "credentialSchema": {
    "id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",
    "type": "FullJsonSchemaValidator2021"
  }
}
==>
  </pre>
</div>  

Now we see clearly that the credentialsubject.id  is set with the DID of the new TI.  ( it is highlighted in bold red above) . 

#### d. set the credential Schema.
````
set payloadVc.credentialSchema.id https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM 
````
Result: 
<div class="output">
  <pre>
==> set payloadVc.credentialSchema.id https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM
Value saved in 'payloadVc.credentialSchema.id':
https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM
  </pre>
</div>  

The result is a bit to plain lets view the payloaddVC to make sure all is set well.

````
view payloadVc
````
Result: 
<div class="output">
  <pre>
==> view payloadVc
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential",
    "VerifiableAttestation",
    "VerifiableAuthorisationToOnboard"
  ],
  <b style="color:blue;">"issuer": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",</b>
  "credentialSubject": {
    <b style="color:blue;">"id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",</b>
    "accreditedFor": []
  },
  "termsOfUse": {
    "id": "",
    "type": "IssuanceCertificate"
  },
  "credentialSchema": {
    <b style="color:red;">"id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",</b>
    "type": "FullJsonSchemaValidator2021"
  }
}
==>
  </pre>
</div>  

In this particular case the credentialSchema was already correcty filled in so the result of setting the credentialschema didn't result in a differrent value from the initial setup, so this step is a bit academic, however sometimes in can occur that schema's are being updated if that were the case we see how we can update the initial value with the actual required value. To continue the academic example the 'change' is  highlighted in bold red above. 


#### e. set the terms Of Use Id
the Term of USE ID is a bit more elaborate than the others, as the others all use variables that were already setup in the CLI prior to executing the setting up of the values of this particular VC. for the script command <b>set payloadVc .termsOfUse.id URL_ISSUER_ACCREDITATION</b> we first need to determine the <b>URL_ISSUER_ACCREDITATION</b>. 
The terms of use variable pertains to the registration of the TAO in the TIR, and in order to get this value we need to check the registration of the TAO on the TIR by going to https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/<DID TAO>/attributes =>https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes
  
So open a browser and lets see what we get? Fill in the following URL in a browser:
  
````
https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes
````
beutified result will look like: 
<div class="output">
  <pre>
{
  "self": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes?page[after]=1&page[size]=10",
  "items": [
    {
      "id": "52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d",
      "href":<b style="color:red;">"https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d"</b>
    }
  ],
  "total": 1,
  "pageSize": 10,
  "links": {
    "first": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes?page[after]=1&page[size]=10",
    "prev": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes?page[after]=1&page[size]=10",
    "next": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes?page[after]=1&page[size]=10",
    "last": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes?page[after]=1&page[size]=10"
  }
}
  </pre>
</div>  
  
 The <b>URL_ISSUER_ACCREDITATION</b> that needs to be set will be what is highlighted in red in the response in the browser, the items[1] => href value which in this case will be <b style="color:red;">"https:// api-pilot.ebsi .eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d"</b>
  
Let proceed by setting up the termsofuse.id
````
set payloadVc.termsOfUse.id https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d
````
Result: 
<div class="output">
  <pre>
==> set payloadVc.termsOfUse.id https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d
Value saved in 'payloadVc.termsOfUse.id':
https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d
  </pre>
</div>  

The result is afain a bit meager lets view the payloaddVC to make sure all is set well.

````
view payloadVc
````
Result: 
<div class="output">
  <pre>
==> view payloadVc
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential",
    "VerifiableAttestation",
    "VerifiableAuthorisationToOnboard"
  ],
  "issuer": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",
  "credentialSubject": {
    "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
    "accreditedFor": []
  },
  "termsOfUse": {
    "id": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d",
    "type": "IssuanceCertificate"
  },
  "credentialSchema": {
    "id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",
    "type": "FullJsonSchemaValidator2021"
  }
}
==>
  </pre>
</div>  

The template for the VC is now completle setup we can proceed by creating a JWT with the payload for the verifiable credential which is a verifiable authorisation that can be used to onboard the new trusted issuer in the DID registry.  
  
  
  
#### f. create the VC.   

````
vcToOnboard: compute createVcJwt payloadVc {} ES256
````
Result: 
<div class="output">
  <pre>
==> vcToOnboard: compute createVcJwt payloadVc {} ES256
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA
Value saved in 'vcToOnboard':
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA
==>
  </pre>
</div>  

A JWT is created containing the  'VerifiableAuthorisationToOnboard' attestation and it is stored in the variable 'vcToOnboard', feel free to check it by doing view vcToOnboard. 

The JWT is quite a mysterious beast looking quite unintelligble, however this can be easily unraffeled by using a tool provided to view the contents of JTW's on internet JWT .io => [https://jwt.io/](https://jwt.io/)
  
if you paste the block starting with 'eyJhbGciOi ... XNjfAaBA' in the window called <b style='color:red;'>EncodedPASTE A TOKEN HERE'</b> of the site of [JWT.io](https://jwt.io/) you will be able to decypher the JWT
  
The contents of the JWT should look like this: 
<div class="output">
  <pre>
==> vcToOnboard: compute createVcJwt payloadVc {} ES256
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA
Value saved in 'vcToOnboard':
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA
==>
  </pre>
</div>    
  
The JWT looks quite mysterious, it is actually an encoded JSON containing a header, body and signature. To view this encoded data we can use a website which can display the encoded token [jwt.io](https://jwt.io).    
  
If we enter the JWT in the text area called <b style="color:red;"> EncodedPASTE A TOKEN HERE </b> on the website of [jwt.io](https://jwt.io).  we can see the following payload:   
   
<div class="output">
  <pre>
{
  "iat": 1700036220,
  "jti": "urn:uuid:75e3f08a-8549-4e64-9820-f7d057cbf1b1",
  "nbf": 1700036220,
  "exp": 1731572220,
  "sub": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "id": "urn:uuid:75e3f08a-8549-4e64-9820-f7d057cbf1b1",
    "type": [
      "VerifiableCredential",
      "VerifiableAttestation",
      "VerifiableAuthorisationToOnboard"
    ],
    "issuer": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2",
    "issuanceDate": "2023-11-15T08:17:00Z",
    "issued": "2023-11-15T08:17:00Z",
    "validFrom": "2023-11-15T08:17:00Z",
    "expirationDate": "2024-11-14T08:17:00Z",
    "credentialSubject": {
      "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
      "accreditedFor": []
    },
    "termsOfUse": {
      "id": "https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d",
      "type": "IssuanceCertificate"
    },
    "credentialSchema": {
      "id": "https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM",
      "type": "FullJsonSchemaValidator2021"
    }
  },
  "iss": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2"
}
  </pre>
</div>   
  
We will detail the breakdown of the JWT in a separate section not here, but important to know is the validity of the payload   <b>"expirationDate": "2024-11-14T08:17:00Z"</b>, in short it is usable for about a year before it expires, this will most likely change in the future, so take the expiration time of the VC into account when registering the Issuer on the DID registry of the EBSI. Now that the TAO created the VC for authorisation to onboard the new Issuer, we will switch context again and proceed as Issuer to use this VC to actually onboard on the EBSI.
  
  
### 7. Create a Presentation request as issuer to register the DID document  
We will now proceed in the CLI as the new Issuer, we already have the VC from the TAO from the previous step which allows us to proceed with the onboarding. 
We will need to present this VC in the form of a verifiable presentation which will contain not only the VC of the TAO, but our identity as issuer and an access token to the EBSI based on the issued VC from the TAO. 
  
We will do the following steps to achieve this: 
a. clear the inmemory user object of the CLI to prepare loading the identity of the new issuer. 
b. loading the ES256K key of the new issuer as part of the ID
c. get the openid-configuration. 
d. create the verifiable presentation based on the VC we received and the openIDconfig of the issuer.
e. get a authorisation token allowing us to write on the DID registry, by presenting the VP.
f. sestting the bearer token to access the EBSI
g. Create DID on the EBSI blockchain. 
h. completing the DID document and an extra signing key.
  
  
#### a. clear the inmemory user object of the CLI to prepare loading the identity of the new issuer.  
````
using user null
````
Result: 
<div class="output">
  <pre>
==> using user null
User removed
==>
  </pre>
</div>  

use view to see that indeed all is removed
````
view user
````
Result: 
<div class="output">
  <pre>
==> view user
{
  "keys": {},
  "privateKeyHex": "",
  "publicKeyHex": "",
  "address": ""
}
==>
  </pre>
</div>  

The user in the CLI which is wiped the moment the CLI is exitted, so copy if needed. is an object which will holde information concerning the user, it will hold [keys, privateKeyHex, publicKeyHex, address], and all these spaces are empty at the moment.
  
#### b. loading the ES256K key of the new issuer as part of the ID

````
using user ES256K did1 PrivateKeyIssuer DidIssuer
````
Result: 
<div class="output">
  <pre>
==> using user ES256K did1 PrivateKeyIssuer DidIssuer
{
  "keys": {
    "ES256K": {
      "id": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      },
      "privateKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk",
        "d": "mTIeawXWSMlKyiAUd6p9oDeov20JD2_7BvdoQHwwVec"
      },
      "publicKeyEncryptionJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      }
    }
  },
  "privateKeyHex": "0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7",
  "publicKeyHex": "0x044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada19",
  "address": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
  "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "didVersion": 1
}
==>
  </pre>
</div> 
  
Note: The key that will be used for signing the issued attestations, the ES256 key is not here, it Must be registered as well to prove that the signature make sense, this can be done at  a later stage.
  
#### c. get the openid-configuration.
````
openidconf: authorisation get /.well-known/openid-configuration
````
Result: 
<div class="output">
  <pre>
==> openidconf: authorisation get /.well-known/openid-configuration
GET https://api-pilot.ebsi.eu/authorisation/v3/.well-known/openid-configuration
{
  "headers": {}
}

2662 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "941",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 13:51:28 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "issuer": "https://api-pilot.ebsi.eu/authorisation/v3",
  "authorization_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/authorize",
  "token_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/token",
  "presentation_definition_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/presentation-definitions",
  "jwks_uri": "https://api-pilot.ebsi.eu/authorisation/v3/jwks",
  "scopes_supported": [
    "openid",
    "didr_invite",
    "didr_write",
    "tir_invite",
    "tir_write"
  ],
  "response_types_supported": [
    "token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "none"
  ],
  "subject_syntax_types_supported": [
    "did:ebsi",
    "did:key"
  ],
  "token_endpoint_auth_methods_supported": [
    "private_key_jwt"
  ],
  "vp_formats_supported": {
    "jwt_vp": {
      "alg_values_supported": [
        "ES256"
      ]
    },
    "jwt_vc": {
      "alg_values_supported": [
        "ES256"
      ]
    }
  },
  "grant_types_supported": [
    "vp_token"
  ],
  "subject_trust_frameworks_supported": [
    "ebsi"
  ],
  "id_token_types_supported": [
    "subject_signed_id_token"
  ]
}
Value saved in 'openidconf':
{
  "issuer": "https://api-pilot.ebsi.eu/authorisation/v3",
  "authorization_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/authorize",
  "token_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/token",
  "presentation_definition_endpoint": "https://api-pilot.ebsi.eu/authorisation/v3/presentation-definitions",
  "jwks_uri": "https://api-pilot.ebsi.eu/authorisation/v3/jwks",
  "scopes_supported": [
    "openid",
    "didr_invite",
    "didr_write",
    "tir_invite",
    "tir_write"
  ],
  "response_types_supported": [
    "token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "none"
  ],
  "subject_syntax_types_supported": [
    "did:ebsi",
    "did:key"
  ],
  "token_endpoint_auth_methods_supported": [
    "private_key_jwt"
  ],
  "vp_formats_supported": {
    "jwt_vp": {
      "alg_values_supported": [
        "ES256"
      ]
    },
    "jwt_vc": {
      "alg_values_supported": [
        "ES256"
      ]
    }
  },
  "grant_types_supported": [
    "vp_token"
  ],
  "subject_trust_frameworks_supported": [
    "ebsi"
  ],
  "id_token_types_supported": [
    "subject_signed_id_token"
  ]
}
==>
  </pre>
</div> 
 
We receive the capabilities of the EBSI in the form of an OPENDID configuration, this configuration doesn't contain any context of the issuer and specfies only the capabilties of EBSI. 
  
#### d. create the verifiable presentation based on the VC we received and the openIDconfig of the issuer.
To request authorisation from EBSI the ISsuer needs to formulate the question to register the DID, but prior to that request the authorisation before attempting the actual onboarding. The Permissiong will be granted in the form of an access token, and to give this access token the received VC created by the TAO for onboarding must be presented in the form of a presntation credential which contains the created VC and is signed by the new issuer, which is part of the verifiable presentation, and also whcih is signed by the issuer. there are now three pieces of evidence in the resulting presentation. the signature of the issuer that is requesting the token to register the identity in the DID registry of the DID. The issued VC from the TAO which is a VC that authorizes to the issuer the right to register in the DID registry. and the request that wraps the vc from the TAO which contains again the identity of the party for which the request is made. These 3 DID"s of issuer should match else the onboarding cannot proceed. ie. the issued VC from the TAO allowing the issuer to register can only be used by that issuer, and only that issuer by means of signature of the VP can request the access token which will allow the actual registration.
  
````
vpJwt1: compute createPresentationJwt vcToOnboard ES256K openidconf.issuer
````
Result: 
<div class="output">
  <pre>
==> vpJwt1: compute createPresentationJwt vcToOnboard ES256K openidconf.issuer
{
  "jwtVp": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA1NjU1NiwiZXhwIjoxNzAwMDU3NTU2LCJpYXQiOjE3MDAwNTY2NTYsImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiYzU4NzlhN2UtOWI4MS00ZmNkLWJlMzYtZDFiNWEzODkxZDJlIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucHFXRlV4T1dkVVRuVlJWRUYxWkZBM2FGRjNUWEl5STIwM1dsUklhbnBpVVhGUWExUTBUWEJ5TmtrNE1ubDZlWFk0VXpGNE0wVlZXVXROZEVwV2JubFFTMGtpZlEuZXlKcFlYUWlPakUzTURBd016WXlNakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW01aVppSTZNVGN3TURBek5qSXlNQ3dpWlhod0lqb3hOek14TlRjeU1qSXdMQ0p6ZFdJaU9pSmthV1E2WldKemFUcDZNakZPY1VGclFWVnFWR2RIT1VaaGVrTTJUSHBITXpVaUxDSjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKcFpDSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpTENKV1pYSnBabWxoWW14bFFYVjBhRzl5YVhOaGRHbHZibFJ2VDI1aWIyRnlaQ0pkTENKcGMzTjFaWElpT2lKa2FXUTZaV0p6YVRwNmFsaFZNVGxuVkU1MVVWUkJkV1JRTjJoUmQwMXlNaUlzSW1semMzVmhibU5sUkdGMFpTSTZJakl3TWpNdE1URXRNVFZVTURnNk1UYzZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNeTB4TVMweE5WUXdPRG94Tnpvd01Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXpMVEV4TFRFMVZEQTRPakUzT2pBd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TkMweE1TMHhORlF3T0RveE56b3dNRm9pTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnBaQ0k2SW1ScFpEcGxZbk5wT25veU1VNXhRV3RCVldwVVowYzVSbUY2UXpaTWVrY3pOU0lzSW1GalkzSmxaR2wwWldSR2IzSWlPbHRkZlN3aWRHVnliWE5QWmxWelpTSTZleUpwWkNJNkltaDBkSEJ6T2k4dllYQnBMWEJwYkc5MExtVmljMmt1WlhVdmRISjFjM1JsWkMxcGMzTjFaWEp6TFhKbFoybHpkSEo1TDNZMEwybHpjM1ZsY25NdlpHbGtPbVZpYzJrNmVtcFlWVEU1WjFST2RWRlVRWFZrVURkb1VYZE5jakl2WVhSMGNtbGlkWFJsY3k4MU1tRmhNalF3T0RnM01qUXpZekkzTldSaU0yUTBZelJqTXpsbVpHWmhNV0l5WXpNMk1EVXhNRFpsTTJZMk1UVTRZV1kwWm1Jd01HSTFNV0k0TWpsa0lpd2lkSGx3WlNJNklrbHpjM1ZoYm1ObFEyVnlkR2xtYVdOaGRHVWlmU3dpWTNKbFpHVnVkR2xoYkZOamFHVnRZU0k2ZXlKcFpDSTZJbWgwZEhCek9pOHZZWEJwTFhCcGJHOTBMbVZpYzJrdVpYVXZkSEoxYzNSbFpDMXpZMmhsYldGekxYSmxaMmx6ZEhKNUwzWXlMM05qYUdWdFlYTXZlak5OWjFWR1ZXdGlOekl5ZFhFMGVETmtkalY1UVVwdGJrNXRla1JHWlVzMVZVTTRlRGd6VVc5bFRFcE5JaXdpZEhsd1pTSTZJa1oxYkd4S2MyOXVVMk5vWlcxaFZtRnNhV1JoZEc5eU1qQXlNU0o5ZlN3aWFYTnpJam9pWkdsa09tVmljMms2ZW1wWVZURTVaMVJPZFZGVVFYVmtVRGRvVVhkTmNqSWlmUS5CTWoxTjdHOEQtWGNXZFp0RXFEbWwtTGFDb1RQTXpia2FfSWR4VG5qblFfbGZpazZsR1llNG1JeUJrZ3luVkEwcFRtQWZvaVZSTmJDR09YTmpmQWFCQSJdfX0.U_hNx2hDS0-ZOLOW2Hy_uZOHQ9Dbf0Hyq6vSEYSvT98aEQ0QB7N7eyTnGD5sP_ExfRkskoNXfxhF5ZLz7fPEUw",
  "payload": {
    "id": "urn:did:23b1a4be-271c-4f89-91db-345115c4916c",
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
    "verifiableCredential": [
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA"
    ]
  }
}
Value saved in 'vpJwt1':
eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA1NjU1NiwiZXhwIjoxNzAwMDU3NTU2LCJpYXQiOjE3MDAwNTY2NTYsImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiYzU4NzlhN2UtOWI4MS00ZmNkLWJlMzYtZDFiNWEzODkxZDJlIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucHFXRlV4T1dkVVRuVlJWRUYxWkZBM2FGRjNUWEl5STIwM1dsUklhbnBpVVhGUWExUTBUWEJ5TmtrNE1ubDZlWFk0VXpGNE0wVlZXVXROZEVwV2JubFFTMGtpZlEuZXlKcFlYUWlPakUzTURBd016WXlNakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW01aVppSTZNVGN3TURBek5qSXlNQ3dpWlhod0lqb3hOek14TlRjeU1qSXdMQ0p6ZFdJaU9pSmthV1E2WldKemFUcDZNakZPY1VGclFWVnFWR2RIT1VaaGVrTTJUSHBITXpVaUxDSjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKcFpDSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpTENKV1pYSnBabWxoWW14bFFYVjBhRzl5YVhOaGRHbHZibFJ2VDI1aWIyRnlaQ0pkTENKcGMzTjFaWElpT2lKa2FXUTZaV0p6YVRwNmFsaFZNVGxuVkU1MVVWUkJkV1JRTjJoUmQwMXlNaUlzSW1semMzVmhibU5sUkdGMFpTSTZJakl3TWpNdE1URXRNVFZVTURnNk1UYzZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNeTB4TVMweE5WUXdPRG94Tnpvd01Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXpMVEV4TFRFMVZEQTRPakUzT2pBd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TkMweE1TMHhORlF3T0RveE56b3dNRm9pTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnBaQ0k2SW1ScFpEcGxZbk5wT25veU1VNXhRV3RCVldwVVowYzVSbUY2UXpaTWVrY3pOU0lzSW1GalkzSmxaR2wwWldSR2IzSWlPbHRkZlN3aWRHVnliWE5QWmxWelpTSTZleUpwWkNJNkltaDBkSEJ6T2k4dllYQnBMWEJwYkc5MExtVmljMmt1WlhVdmRISjFjM1JsWkMxcGMzTjFaWEp6TFhKbFoybHpkSEo1TDNZMEwybHpjM1ZsY25NdlpHbGtPbVZpYzJrNmVtcFlWVEU1WjFST2RWRlVRWFZrVURkb1VYZE5jakl2WVhSMGNtbGlkWFJsY3k4MU1tRmhNalF3T0RnM01qUXpZekkzTldSaU0yUTBZelJqTXpsbVpHWmhNV0l5WXpNMk1EVXhNRFpsTTJZMk1UVTRZV1kwWm1Jd01HSTFNV0k0TWpsa0lpd2lkSGx3WlNJNklrbHpjM1ZoYm1ObFEyVnlkR2xtYVdOaGRHVWlmU3dpWTNKbFpHVnVkR2xoYkZOamFHVnRZU0k2ZXlKcFpDSTZJbWgwZEhCek9pOHZZWEJwTFhCcGJHOTBMbVZpYzJrdVpYVXZkSEoxYzNSbFpDMXpZMmhsYldGekxYSmxaMmx6ZEhKNUwzWXlMM05qYUdWdFlYTXZlak5OWjFWR1ZXdGlOekl5ZFhFMGVETmtkalY1UVVwdGJrNXRla1JHWlVzMVZVTTRlRGd6VVc5bFRFcE5JaXdpZEhsd1pTSTZJa1oxYkd4S2MyOXVVMk5vWlcxaFZtRnNhV1JoZEc5eU1qQXlNU0o5ZlN3aWFYTnpJam9pWkdsa09tVmljMms2ZW1wWVZURTVaMVJPZFZGVVFYVmtVRGRvVVhkTmNqSWlmUS5CTWoxTjdHOEQtWGNXZFp0RXFEbWwtTGFDb1RQTXpia2FfSWR4VG5qblFfbGZpazZsR1llNG1JeUJrZ3luVkEwcFRtQWZvaVZSTmJDR09YTmpmQWFCQSJdfX0.U_hNx2hDS0-ZOLOW2Hy_uZOHQ9Dbf0Hyq6vSEYSvT98aEQ0QB7N7eyTnGD5sP_ExfRkskoNXfxhF5ZLz7fPEUw
==>
  </pre>
</div> 
The verifiable presentation is created. We will again unroll this presentation to see what is in it and show the support for above story. 

This VP is just a CRYPTO blob containing all de required evidences for the question which has yet to be asked we will do that now. 
  
The Verifiable Presentation wqwhich again represents an encoded JSON containing a header, body and signature. To view this encoded data we can use a website which can display the encoded token [jwt.io](https://jwt.io).    
  
If we enter the JWT in the text area called <b style="color:red;"> EncodedPASTE A TOKEN HERE </b> on the website of [jwt.io](https://jwt.io).  we can see the following header and payload ( the signature is obfuscatredin the tool but could be manutally caluclated if desireable:   
   
<div class="output">
  <pre>
  {
  "alg": "ES256K",
  "typ": "JWT",
  "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
}

{
  "jti": "urn:did:23b1a4be-271c-4f89-91db-345115c4916c",
  "sub": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "iss": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "nbf": 1700056556,
  "exp": 1700057556,
  "iat": 1700056656,
  "aud": "https://api-pilot.ebsi.eu/authorisation/v3",
  "nonce": "c5879a7e-9b81-4fcd-be36-d1b5a3891d2e",
  "vp": {
    "id": "urn:did:23b1a4be-271c-4f89-91db-345115c4916c",
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
    "verifiableCredential": [
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpqWFUxOWdUTnVRVEF1ZFA3aFF3TXIyI203WlRIanpiUXFQa1Q0TXByNkk4Mnl6eXY4UzF4M0VVWUtNdEpWbnlQS0kifQ.eyJpYXQiOjE3MDAwMzYyMjAsImp0aSI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsIm5iZiI6MTcwMDAzNjIyMCwiZXhwIjoxNzMxNTcyMjIwLCJzdWIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjc1ZTNmMDhhLTg1NDktNGU2NC05ODIwLWY3ZDA1N2NiZjFiMSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJWZXJpZmlhYmxlQXV0aG9yaXNhdGlvblRvT25ib2FyZCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6alhVMTlnVE51UVRBdWRQN2hRd01yMiIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTEtMTVUMDg6MTc6MDBaIiwiaXNzdWVkIjoiMjAyMy0xMS0xNVQwODoxNzowMFoiLCJ2YWxpZEZyb20iOiIyMDIzLTExLTE1VDA4OjE3OjAwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyNC0xMS0xNFQwODoxNzowMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImFjY3JlZGl0ZWRGb3IiOltdfSwidGVybXNPZlVzZSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y0L2lzc3VlcnMvZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIvYXR0cmlidXRlcy81MmFhMjQwODg3MjQzYzI3NWRiM2Q0YzRjMzlmZGZhMWIyYzM2MDUxMDZlM2Y2MTU4YWY0ZmIwMGI1MWI4MjlkIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1zY2hlbWFzLXJlZ2lzdHJ5L3YyL3NjaGVtYXMvejNNZ1VGVWtiNzIydXE0eDNkdjV5QUptbk5tekRGZUs1VUM4eDgzUW9lTEpNIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fSwiaXNzIjoiZGlkOmVic2k6empYVTE5Z1ROdVFUQXVkUDdoUXdNcjIifQ.BMj1N7G8D-XcWdZtEqDml-LaCoTPMzbka_IdxTnjnQ_lfik6lGYe4mIyBkgynVA0pTmAfoiVRNbCGOXNjfAaBA"
    ]
  }
}
  </pre>
</div> 
In the resulting JSON (header + payload) above we can see the payload is of type <b>"VerifiablePresentation"</b>, the DID of the issuer comes back a number of times, it is in the header encoded in the KID, this will then make up part of the signature which is set by the issuing part under this VP, it is the issuer, and subject and also detailed as holder in the VP setion. if we unroll the verifiable credential we see this is the VC previously issued by the TAO. IN the VC we can see that the credential subject will again contain the same DID as mentioned in the header, and subject and issuer of the payload of the VP. By correlating these different id's we can state that the entity signing the vp, is the same as requesting the onboarding to did registry (as specified in the VP), and is the same as the entity that received the authorisation from the TAO to do so, which independently can be check that it is a legally recgonized entity in EBSI which has the right to issue authorisations to TI's. 

#### e. get a authorisation token allowing us to write on the DID registry, by presenthing the VP.

now that we have created the Verifiable presentation with the Verifiable Crdential for the authentication to register on the DID-R the DID of the issuer we need to request an authorisation token from the EBSI whcih will process the VP and either give the access token or not 
  
````
t1: authorisation token didr_invite_presentation vpJwt1
````
BAD Result: 
<div class="output">
  <pre>
==> t1: authorisation token didr_invite_presentation vpJwt1
POST https://api-pilot.ebsi.eu/authorisation/v3/token
{
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded"
  }
}
Data:
grant_type=vp_token&scope=openid+didr_invite&vp_token=eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA1NjU1NiwiZXhwIjoxNzAwMDU3NTU2LCJpYXQiOjE3MDAwNTY2NTYsImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiYzU4NzlhN2UtOWI4MS00ZmNkLWJlMzYtZDFiNWEzODkxZDJlIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjIzYjFhNGJlLTI3MWMtNGY4OS05MWRiLTM0NTExNWM0OTE2YyIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucHFXRlV4T1dkVVRuVlJWRUYxWkZBM2FGRjNUWEl5STIwM1dsUklhbnBpVVhGUWExUTBUWEJ5TmtrNE1ubDZlWFk0VXpGNE0wVlZXVXROZEVwV2JubFFTMGtpZlEuZXlKcFlYUWlPakUzTURBd016WXlNakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW01aVppSTZNVGN3TURBek5qSXlNQ3dpWlhod0lqb3hOek14TlRjeU1qSXdMQ0p6ZFdJaU9pSmthV1E2WldKemFUcDZNakZPY1VGclFWVnFWR2RIT1VaaGVrTTJUSHBITXpVaUxDSjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKcFpDSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpTENKV1pYSnBabWxoWW14bFFYVjBhRzl5YVhOaGRHbHZibFJ2VDI1aWIyRnlaQ0pkTENKcGMzTjFaWElpT2lKa2FXUTZaV0p6YVRwNmFsaFZNVGxuVkU1MVVWUkJkV1JRTjJoUmQwMXlNaUlzSW1semMzVmhibU5sUkdGMFpTSTZJakl3TWpNdE1URXRNVFZVTURnNk1UYzZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNeTB4TVMweE5WUXdPRG94Tnpvd01Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXpMVEV4TFRFMVZEQTRPakUzT2pBd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TkMweE1TMHhORlF3T0RveE56b3dNRm9pTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnBaQ0k2SW1ScFpEcGxZbk5wT25veU1VNXhRV3RCVldwVVowYzVSbUY2UXpaTWVrY3pOU0lzSW1GalkzSmxaR2wwWldSR2IzSWlPbHRkZlN3aWRHVnliWE5QWmxWelpTSTZleUpwWkNJNkltaDBkSEJ6T2k4dllYQnBMWEJwYkc5MExtVmljMmt1WlhVdmRISjFjM1JsWkMxcGMzTjFaWEp6TFhKbFoybHpkSEo1TDNZMEwybHpjM1ZsY25NdlpHbGtPbVZpYzJrNmVtcFlWVEU1WjFST2RWRlVRWFZrVURkb1VYZE5jakl2WVhSMGNtbGlkWFJsY3k4MU1tRmhNalF3T0RnM01qUXpZekkzTldSaU0yUTBZelJqTXpsbVpHWmhNV0l5WXpNMk1EVXhNRFpsTTJZMk1UVTRZV1kwWm1Jd01HSTFNV0k0TWpsa0lpd2lkSGx3WlNJNklrbHpjM1ZoYm1ObFEyVnlkR2xtYVdOaGRHVWlmU3dpWTNKbFpHVnVkR2xoYkZOamFHVnRZU0k2ZXlKcFpDSTZJbWgwZEhCek9pOHZZWEJwTFhCcGJHOTBMbVZpYzJrdVpYVXZkSEoxYzNSbFpDMXpZMmhsYldGekxYSmxaMmx6ZEhKNUwzWXlMM05qYUdWdFlYTXZlak5OWjFWR1ZXdGlOekl5ZFhFMGVETmtkalY1UVVwdGJrNXRla1JHWlVzMVZVTTRlRGd6VVc5bFRFcE5JaXdpZEhsd1pTSTZJa1oxYkd4S2MyOXVVMk5vWlcxaFZtRnNhV1JoZEc5eU1qQXlNU0o5ZlN3aWFYTnpJam9pWkdsa09tVmljMms2ZW1wWVZURTVaMVJPZFZGVVFYVmtVRGRvVVhkTmNqSWlmUS5CTWoxTjdHOEQtWGNXZFp0RXFEbWwtTGFDb1RQTXpia2FfSWR4VG5qblFfbGZpazZsR1llNG1JeUJrZ3luVkEwcFRtQWZvaVZSTmJDR09YTmpmQWFCQSJdfX0.U_hNx2hDS0-ZOLOW2Hy_uZOHQ9Dbf0Hyq6vSEYSvT98aEQ0QB7N7eyTnGD5sP_ExfRkskoNXfxhF5ZLz7fPEUw&presentation_submission=%7B%22id%22%3A%221fdc1ab9-f312-4dc9-a675-eb1262c9f612%22%2C%22definition_id%22%3A%22didr_invite_presentation%22%2C%22descriptor_map%22%3A%5B%7B%22id%22%3A%22didr_invite_credential%22%2C%22format%22%3A%22jwt_vp%22%2C%22path%22%3A%22%24%22%2C%22path_nested%22%3A%7B%22id%22%3A%22didr_invite_credential%22%2C%22format%22%3A%22jwt_vc%22%2C%22path%22%3A%22%24.verifiableCredential%5B0%5D%22%7D%7D%5D%7D

3318 milliseconds
Response HTTP Status 400
{
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
  "content-length": "98",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 15:29:16 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "pragma": "no-cache",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "error": "invalid_request",
  "error_description": "Invalid Verifiable Presentation: JWT has expired"
}
Error: Request failed with status code 400: {"error":"invalid_request","error_description":"Invalid Verifiable Presentation: JWT has expired"}
    at useAxios (file:///home/decaan/EBSI/LT/test-scripts/dist/src/utils/http.js:81:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async authorisationToken (file:///home/decaan/EBSI/LT/test-scripts/dist/src/commands/authorisation-v3.js:61:22)
    at async execCommand (file:///home/decaan/EBSI/LT/test-scripts/dist/src/app.js:1040:30)
    at async main (file:///home/decaan/EBSI/LT/test-scripts/dist/src/app.js:1198:13)
==>
  </pre>
</div>   
  
  The JWT issued is time sensetive, if the requestor waits to long the VP in the JWT will expire and no access token will be granted. This can be overcome by requesting the VP again. and not wait to long to requuest the token.
  
Good Result : 
  <div class="output">
  <pre>
==> t1: authorisation token didr_invite_presentation vpJwt1
POST https://api-pilot.ebsi.eu/authorisation/v3/token
{
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded"
  }
}
Data:
grant_type=vp_token&scope=openid+didr_invite&vp_token=eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOmQ2NTM4NzNjLTZhMTgtNGQ4Ni05NTAzLWMzMTA0OGM1YzQxMiIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA2MjExMCwiZXhwIjoxNzAwMDYzMTEwLCJpYXQiOjE3MDAwNjIyMTAsImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiNzcxZWFlOGQtZWY1ZC00MGE4LWFhYjAtMWI2NjlhZDc1NTdiIiwidnAiOnsiaWQiOiJ1cm46ZGlkOmQ2NTM4NzNjLTZhMTgtNGQ4Ni05NTAzLWMzMTA0OGM1YzQxMiIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucHFXRlV4T1dkVVRuVlJWRUYxWkZBM2FGRjNUWEl5STIwM1dsUklhbnBpVVhGUWExUTBUWEJ5TmtrNE1ubDZlWFk0VXpGNE0wVlZXVXROZEVwV2JubFFTMGtpZlEuZXlKcFlYUWlPakUzTURBd016WXlNakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW01aVppSTZNVGN3TURBek5qSXlNQ3dpWlhod0lqb3hOek14TlRjeU1qSXdMQ0p6ZFdJaU9pSmthV1E2WldKemFUcDZNakZPY1VGclFWVnFWR2RIT1VaaGVrTTJUSHBITXpVaUxDSjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKcFpDSTZJblZ5YmpwMWRXbGtPamMxWlRObU1EaGhMVGcxTkRrdE5HVTJOQzA1T0RJd0xXWTNaREExTjJOaVpqRmlNU0lzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpTENKV1pYSnBabWxoWW14bFFYVjBhRzl5YVhOaGRHbHZibFJ2VDI1aWIyRnlaQ0pkTENKcGMzTjFaWElpT2lKa2FXUTZaV0p6YVRwNmFsaFZNVGxuVkU1MVVWUkJkV1JRTjJoUmQwMXlNaUlzSW1semMzVmhibU5sUkdGMFpTSTZJakl3TWpNdE1URXRNVFZVTURnNk1UYzZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNeTB4TVMweE5WUXdPRG94Tnpvd01Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXpMVEV4TFRFMVZEQTRPakUzT2pBd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TkMweE1TMHhORlF3T0RveE56b3dNRm9pTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnBaQ0k2SW1ScFpEcGxZbk5wT25veU1VNXhRV3RCVldwVVowYzVSbUY2UXpaTWVrY3pOU0lzSW1GalkzSmxaR2wwWldSR2IzSWlPbHRkZlN3aWRHVnliWE5QWmxWelpTSTZleUpwWkNJNkltaDBkSEJ6T2k4dllYQnBMWEJwYkc5MExtVmljMmt1WlhVdmRISjFjM1JsWkMxcGMzTjFaWEp6TFhKbFoybHpkSEo1TDNZMEwybHpjM1ZsY25NdlpHbGtPbVZpYzJrNmVtcFlWVEU1WjFST2RWRlVRWFZrVURkb1VYZE5jakl2WVhSMGNtbGlkWFJsY3k4MU1tRmhNalF3T0RnM01qUXpZekkzTldSaU0yUTBZelJqTXpsbVpHWmhNV0l5WXpNMk1EVXhNRFpsTTJZMk1UVTRZV1kwWm1Jd01HSTFNV0k0TWpsa0lpd2lkSGx3WlNJNklrbHpjM1ZoYm1ObFEyVnlkR2xtYVdOaGRHVWlmU3dpWTNKbFpHVnVkR2xoYkZOamFHVnRZU0k2ZXlKcFpDSTZJbWgwZEhCek9pOHZZWEJwTFhCcGJHOTBMbVZpYzJrdVpYVXZkSEoxYzNSbFpDMXpZMmhsYldGekxYSmxaMmx6ZEhKNUwzWXlMM05qYUdWdFlYTXZlak5OWjFWR1ZXdGlOekl5ZFhFMGVETmtkalY1UVVwdGJrNXRla1JHWlVzMVZVTTRlRGd6VVc5bFRFcE5JaXdpZEhsd1pTSTZJa1oxYkd4S2MyOXVVMk5vWlcxaFZtRnNhV1JoZEc5eU1qQXlNU0o5ZlN3aWFYTnpJam9pWkdsa09tVmljMms2ZW1wWVZURTVaMVJPZFZGVVFYVmtVRGRvVVhkTmNqSWlmUS5CTWoxTjdHOEQtWGNXZFp0RXFEbWwtTGFDb1RQTXpia2FfSWR4VG5qblFfbGZpazZsR1llNG1JeUJrZ3luVkEwcFRtQWZvaVZSTmJDR09YTmpmQWFCQSJdfX0.40eBLhnt-9yZfzJSNBNzQza64_Ds_snFsXoKwu8GP3FtTbANADAI_DeWRsUwo-EM3-r7Tc8e7vKtbPixHh1oow&presentation_submission=%7B%22id%22%3A%22c7c2d088-33a2-4035-8322-a8db2b43f322%22%2C%22definition_id%22%3A%22didr_invite_presentation%22%2C%22descriptor_map%22%3A%5B%7B%22id%22%3A%22didr_invite_credential%22%2C%22format%22%3A%22jwt_vp%22%2C%22path%22%3A%22%24%22%2C%22path_nested%22%3A%7B%22id%22%3A%22didr_invite_credential%22%2C%22format%22%3A%22jwt_vc%22%2C%22path%22%3A%22%24.verifiableCredential%5B0%5D%22%7D%7D%5D%7D

3334 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
  "content-length": "1175",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 15:30:18 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "pragma": "no-cache",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ",
  "token_type": "Bearer",
  "expires_in": 7200,
  "scope": "openid didr_invite",
  "id_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwianRpIjoiYzMwYTRmMTYtZjQyYy00MDgyLWJlMTctNzViZmQzOWZlZTZkIiwibm9uY2UiOiI3NzFlYWU4ZC1lZjVkLTQwYTgtYWFiMC0xYjY2OWFkNzU1N2IiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.2udQ0yKkyXXrPVhynYtjv83TDhLcQ3T7I26L7Ivscj5LBwc4ozSz8EWofY4dK5hX0G1jFyEpX7QvfTwiAgktjw"
}
Value saved in 't1':
{
  "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ",
  "token_type": "Bearer",
  "expires_in": 7200,
  "scope": "openid didr_invite",
  "id_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwianRpIjoiYzMwYTRmMTYtZjQyYy00MDgyLWJlMTctNzViZmQzOWZlZTZkIiwibm9uY2UiOiI3NzFlYWU4ZC1lZjVkLTQwYTgtYWFiMC0xYjY2OWFkNzU1N2IiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.2udQ0yKkyXXrPVhynYtjv83TDhLcQ3T7I26L7Ivscj5LBwc4ozSz8EWofY4dK5hX0G1jFyEpX7QvfTwiAgktjw"
}
==>  
   </pre>
</div> 

The access token in the repsone is stored in a T1 variable which will be used later to set the bearer token to call the Blockchain
The Access token is again a JTW. Lets have a look at the contents
The Verifiable Presentation wqwhich again represents an encoded JSON containing a header, body and signature. To view this encoded data we can use a website which can display the encoded token [jwt.io](https://jwt.io).    
  
If we enter the JWT in the text area called <b style="color:red;"> EncodedPASTE A TOKEN HERE </b> on the website of [jwt.io](https://jwt.io).  we can see the following header and payload ( the signature is obfuscatredin the tool but could be manutally caluclated if desireable:   
   
<div class="output">
  <pre>
    {
  "alg": "ES256",
  "kid": "xzo0lfd6MzImdS4eGmkCchBQPFl8yze5f4DdSFY9qHQ",
  "typ": "JWT"
}
{
  "iat": 1700062218,
  "exp": 1700069418,
  "sub": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "aud": "https://api-pilot.ebsi.eu/authorisation/v3",
  "scp": "openid didr_invite",
  "jti": "fe9e1a8a-3973-4704-884a-2adb11e323fa",
  "iss": "https://api-pilot.ebsi.eu/authorisation/v3"
}
  </pre>
</div> 
  
Important here is that the KID in the header is from the EBSI, so it is not  only the TAO granting the rights to execute, but the EBSI checks to see that the request is valid and then grants persmission to continue to start the registration process of the DID on the DID-R of EBSI.
!NOTE: at this point in time nothing has been registered on the blockchain, we just received the the auth9orisation to perform operations in the scope of <b>"scp": "openid didr_invite", </b> to start the DIDR_invite. So only now we can start the process of actually writing to the blockchain. 
  
#### f. sestting the bearer token to access the EBSI 
But first we need to use the token we received in every call we make to the blockchain, this is done by setting the 'bearer' token in the HTTP header to the value that we received as part of the access_token. the CLI provides a methode we will use to set the bearer token. 
````
using token t1.access_token
````
Result: 
<div class="output">
  <pre>
==> using token t1.access_token
eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ
==>
  </pre>
</div>     
The bearer token is now set.   

You can check with view
````
view token
````
Result: 
<div class="output">
  <pre>
==> view token
eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ
==>
  </pre>
</div>     

#### g. Create DID on the EBSI blockchain.
We have finally arrived at the registration of the issuer DID on the blockchain, the CLI will invoke a number of smart contracts with the bearer token that was created to write on the blockchain. THe technology for the blockchain is an ethereum BESU fabric. in the redaering of the output it is visible that with the token eventually a DID is Mined on the block chain. In less techie speak the DID is written on the blockchain, and all the blockchain nodes are synched as part of this exercise. Essential to this part is that the whole chain of variables is setup in order for this to be executed correctly and within the exparation time defined for the differrent tokens and JWT VP's.
 
Here we go, the apotheosis ! : 
  
````
did build-insertDidDocument
````
  
<div class="output">
  <pre>  
==> did build-insertDidDocument
POST https://api-pilot.ebsi.eu/did-registry/v4/jsonrpc
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "insertDidDocument",
  "params": [
    {
      "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
      "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
      "baseDocument": "{\"@context\":[\"https://www.w3.org/ns/did/v1\",\"https://w3id.org/security/suites/jws-2020/v1\"]}",
      "vMethodId": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "publicKey": "0x044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada19",
      "isSecp256k1": true,
      "notBefore": 1700063210,
      "notAfter": 1854458210
    }
  ],
  "id": 17
}

2941 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "1589",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 15:46:53 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 17,
  "result": {
    "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
    "to": "0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa",
    "data": "0xfbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000",
    "value": "0x0",
    "nonce": "0x00",
    "chainId": "0x1823",
    "gasLimit": "0x16d176",
    "gasPrice": "0x0"
  }
}
Did document
did:ebsi:z21NqAkAUjTgG9FazC6LzG35
==> compute signTransaction {"from":"0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B","to":"0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa","data":"0xfbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000","value":"0x0","nonce":"0x00","chainId":"0x1823","gasLimit":"0x16d176","gasPrice":"0x0"}
0xf9030880808316d17694755ded5d5e81282f0be85edae8e6852814bac3fa80b902a4fbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000823069a0e36c2f75488581702371e01f3b7788e73d9977d460b9f66a6fa9d22c156989a6a07c566060d6573a54da83d28b729a689d89f2f49134ae190bbd39ef43afa9ca68
==> did sendSignedTransaction {"from":"0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B","to":"0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa","data":"0xfbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000","value":"0x0","nonce":"0x00","chainId":"0x1823","gasLimit":"0x16d176","gasPrice":"0x0"} 0xf9030880808316d17694755ded5d5e81282f0be85edae8e6852814bac3fa80b902a4fbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000823069a0e36c2f75488581702371e01f3b7788e73d9977d460b9f66a6fa9d22c156989a6a07c566060d6573a54da83d28b729a689d89f2f49134ae190bbd39ef43afa9ca68
POST https://api-pilot.ebsi.eu/did-registry/v4/jsonrpc
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "sendSignedTransaction",
  "params": [
    {
      "protocol": "eth",
      "unsignedTransaction": {
        "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
        "to": "0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa",
        "data": "0xfbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000",
        "value": "0x0",
        "nonce": "0x00",
        "chainId": "0x1823",
        "gasLimit": "0x16d176",
        "gasPrice": "0x0"
      },
      "r": "0xe36c2f75488581702371e01f3b7788e73d9977d460b9f66a6fa9d22c156989a6",
      "s": "0x7c566060d6573a54da83d28b729a689d89f2f49134ae190bbd39ef43afa9ca68",
      "v": "0x3069",
      "signedRawTransaction": "0xf9030880808316d17694755ded5d5e81282f0be85edae8e6852814bac3fa80b902a4fbb2240800000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000823069a0e36c2f75488581702371e01f3b7788e73d9977d460b9f66a6fa9d22c156989a6a07c566060d6573a54da83d28b729a689d89f2f49134ae190bbd39ef43afa9ca68"
    }
  ],
  "id": 55
}

238 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "103",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 15:46:53 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 55,
  "result": "0x5bfdeab556c95862a0195fe50e0ca408d5aa0476f92e999b31486ded67febfce"
}
Waiting to be mined...
==> ledger getTransactionReceipt 0x5bfdeab556c95862a0195fe50e0ca408d5aa0476f92e999b31486ded67febfce
POST https://api-pilot.ebsi.eu/ledger/v3/blockchains/besu
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": [
    "0x5bfdeab556c95862a0195fe50e0ca408d5aa0476f92e999b31486ded67febfce"
  ],
  "id": 373
}

184 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "2766",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 15:46:58 GMT",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 373,
  "result": {
    "blockHash": "0x4677bc54d7db2263137331ce145597e61e4202fe0e0646871196345bb5e5e1f1",
    "blockNumber": "0x38a578",
    "contractAddress": null,
    "cumulativeGasUsed": "0xf85dd",
    "from": "0x257f1000ed59e2a09fff3f400b1b14985fe0f12b",
    "gasUsed": "0xf85dd",
    "effectiveGasPrice": "0x0",
    "logs": [
      {
        "address": "0x755ded5d5e81282f0be85edae8e6852814bac3fa",
        "topics": [
          "0x2c43613a74534e88678d32134a11b760c58a4bb1d6762d16adfb8ce6ff6a0deb"
        ],
        "data": "0x00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006554e7ea000000000000000000000000000000000000000000000000000000006e88c96200000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c7b2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f6e732f6469642f7631222c2268747470733a2f2f773369642e6f72672f73656375726974792f7375697465732f6a77732d323032302f7631225d7d00000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d6332630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041044c6317379f8211b545fe3fd0865d55a02078c7866259aae7288747e1173b85c5627e947470eac15b655f29e07af84680c3b7d58c87801a8a88288eff6f7ada1900000000000000000000000000000000000000000000000000000000000000",
        "blockNumber": "0x38a578",
        "transactionHash": "0x5bfdeab556c95862a0195fe50e0ca408d5aa0476f92e999b31486ded67febfce",
        "transactionIndex": "0x0",
        "blockHash": "0x4677bc54d7db2263137331ce145597e61e4202fe0e0646871196345bb5e5e1f1",
        "logIndex": "0x0",
        "removed": false
      }
    ],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000002000000000",
    "status": "0x1",
    "to": "0x755ded5d5e81282f0be85edae8e6852814bac3fa",
    "transactionHash": "0x5bfdeab556c95862a0195fe50e0ca408d5aa0476f92e999b31486ded67febfce",
    "transactionIndex": "0x0",
    "type": "0x0"
  }
}
==> view transactionInfo
Did document
did:ebsi:z21NqAkAUjTgG9FazC6LzG35
==>
   </pre>
</div>   
  
The DID is created on the EBSI blockchain, at this point in time it is incomplete  because the ES256 KEY still needs to be registered as part of the information. but we can already check the registration via the HTTPS Endpoints from the EBSI environment
  
Enter the following URL in browser ( replacing the DID with the one you created)  
````
https://api-pilot.ebsi.eu/did-registry/v4/identifiers/did:ebsi:z21NqAkAUjTgG9FazC6LzG35
````
Result: 
<div class="output">
  <pre>
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "controller": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35"
  ],
  "verificationMethod": [
    {
      "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "type": "JsonWebKey2020",
      "controller": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      }
    }
  ],
  "authentication": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
  ],
  "capabilityInvocation": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
  ]
}

  </pre>
</div>    

##### h. completing the DID document and an extra signing key.
We will augment the DID document in the DID registry with some essential informations to be able to use it in issueance of VC's 
1. we will add verification method
2. we will add an assertionmethod.
  
First we will request a new beared token to be able to write these new methods to the blockchain. 
  
````
vpJwt2: compute createPresentationJwt empty ES256K openidconf.issuer
````
Result: 
<div class="output">
  <pre>
  
==> vpJwt2: compute createPresentationJwt empty ES256K openidconf.issuer
{
  "jwtVp": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA2ODUzOSwiZXhwIjoxNzAwMDY5NTM5LCJpYXQiOjE3MDAwNjg2MzksImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiNDliYTNlZTYtM2UwNC00ZTZmLWIxMTEtYTc4MmI0NjlhMmJiIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W119fQ.IdKYycp7shY22OQZ2gKeDzACEP-wyPjdovf8Fi1aOGlImZ7s11ckceQIelDe08HznGs697nPGH1ZsPthhbsRRQ",
  "payload": {
    "id": "urn:did:91615fea-96cf-4102-a629-383e67661d86",
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
    "verifiableCredential": []
  }
}
Value saved in 'vpJwt2':
eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA2ODUzOSwiZXhwIjoxNzAwMDY5NTM5LCJpYXQiOjE3MDAwNjg2MzksImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiNDliYTNlZTYtM2UwNC00ZTZmLWIxMTEtYTc4MmI0NjlhMmJiIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W119fQ.IdKYycp7shY22OQZ2gKeDzACEP-wyPjdovf8Fi1aOGlImZ7s11ckceQIelDe08HznGs697nPGH1ZsPthhbsRRQ
==>
  </pre>
</div>    

The Access token is again a JWT. Lets have a look at the contents
the JWT represents an encoded JSON containing a header, body and signature. To view this encoded data we can use a website which can display the encoded token [jwt.io](https://jwt.io).    
  
If we enter the JWT in the text area called <b style="color:red;"> EncodedPASTE A TOKEN HERE </b> on the website of [jwt.io](https://jwt.io).  we can see the following header and payload ( the signature is obfuscatredin the tool but could be manutally caluclated if desireable:   
   
<div class="output">
  <pre> 
{
  "alg": "ES256K",
  "typ": "JWT",
  "kid": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
}
{
  "jti": "urn:did:91615fea-96cf-4102-a629-383e67661d86",
  "sub": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "iss": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "nbf": 1700068539,
  "exp": 1700069539,
  "iat": 1700068639,
  "aud": "https://api-pilot.ebsi.eu/authorisation/v3",
  "nonce": "49ba3ee6-3e04-4e6f-b111-a782b469a2bb",
  "vp": {
    "id": "urn:did:91615fea-96cf-4102-a629-383e67661d86",
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
    "verifiableCredential": []
  }
}
  </pre>
</div> 
Interresting thing here is that the Token that is requested is not issued from the perspective of EBSI but of the issuer itself. Look out to do the actions in a timely fasion as the token has a short life time here. (15 minutes). 
  

````
t2: authorisation token didr_write_presentation vpJwt2
````
Result: 
<div class="output">
  <pre>
==> t2: authorisation token didr_write_presentation vpJwt2
POST https://api-pilot.ebsi.eu/authorisation/v3/token
{
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded",
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjIyMTgsImV4cCI6MTcwMDA2OTQxOCwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfaW52aXRlIiwianRpIjoiZmU5ZTFhOGEtMzk3My00NzA0LTg4NGEtMmFkYjExZTMyM2ZhIiwiaXNzIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIn0.5YMJq_pidBEwzv-SlSqSs-9dPCAHaa3ty6vj0RVaWGQDHmxzObZ_sbtM7KNs7xiIbmP_-XCaykDjSpNHF5gDzQ"
  }
}
Data:
grant_type=vp_token&scope=openid+didr_write&vp_token=eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUjOW02c1hvSS1fckVpTlFSbWhSd0p1VnoydUlKOVM4ZVhvVHlmRVY2LWMyYyJ9.eyJqdGkiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsInN1YiI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsImlzcyI6ImRpZDplYnNpOnoyMU5xQWtBVWpUZ0c5RmF6QzZMekczNSIsIm5iZiI6MTcwMDA2ODUzOSwiZXhwIjoxNzAwMDY5NTM5LCJpYXQiOjE3MDAwNjg2MzksImF1ZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvYXV0aG9yaXNhdGlvbi92MyIsIm5vbmNlIjoiNDliYTNlZTYtM2UwNC00ZTZmLWIxMTEtYTc4MmI0NjlhMmJiIiwidnAiOnsiaWQiOiJ1cm46ZGlkOjkxNjE1ZmVhLTk2Y2YtNDEwMi1hNjI5LTM4M2U2NzY2MWQ4NiIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6ZWJzaTp6MjFOcUFrQVVqVGdHOUZhekM2THpHMzUiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W119fQ.IdKYycp7shY22OQZ2gKeDzACEP-wyPjdovf8Fi1aOGlImZ7s11ckceQIelDe08HznGs697nPGH1ZsPthhbsRRQ&presentation_submission=%7B%22id%22%3A%22ac6d66cc-7c46-43bb-9f27-9985dd8c45c6%22%2C%22definition_id%22%3A%22didr_write_presentation%22%2C%22descriptor_map%22%3A%5B%5D%7D

1429 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
  "content-length": "1173",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 17:19:06 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "pragma": "no-cache",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ",
  "token_type": "Bearer",
  "expires_in": 7200,
  "scope": "openid didr_write",
  "id_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwianRpIjoiYmRkYzA5ODItNWM4MS00MmQyLTgyNWEtMjMzOTY5NzQ0MzFkIiwibm9uY2UiOiI0OWJhM2VlNi0zZTA0LTRlNmYtYjExMS1hNzgyYjQ2OWEyYmIiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.w8-wqzOZBh-uArSgqx2jlKBLq_YBYHFJr3iw_z-IebIPzkST6k7bnECrw0Ilb6W-fXbIuLXdxON8USrUABMNIg"
}
Value saved in 't2':
{
  "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ",
  "token_type": "Bearer",
  "expires_in": 7200,
  "scope": "openid didr_write",
  "id_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwianRpIjoiYmRkYzA5ODItNWM4MS00MmQyLTgyNWEtMjMzOTY5NzQ0MzFkIiwibm9uY2UiOiI0OWJhM2VlNi0zZTA0LTRlNmYtYjExMS1hNzgyYjQ2OWEyYmIiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.w8-wqzOZBh-uArSgqx2jlKBLq_YBYHFJr3iw_z-IebIPzkST6k7bnECrw0Ilb6W-fXbIuLXdxON8USrUABMNIg"
}
==>
  </pre>
</div>    
  
The Access token is again a JWT. Lets have a look at the contents
the JWT represents an encoded JSON containing a header, body and signature. To view this encoded data we can use a website which can display the encoded token [jwt.io](https://jwt.io).    
  
If we enter the JWT in the text area called <b style="color:red;"> EncodedPASTE A TOKEN HERE </b> on the website of [jwt.io](https://jwt.io).  we can see the following header and payload ( the signature is obfuscatredin the tool but could be manutally caluclated if desireable:   
   
<div class="output">
  <pre> 
{
  "iat": 1700068746,
  "exp": 1700075946,
  "sub": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "aud": "https://api-pilot.ebsi.eu/authorisation/v3",
  "scp": "openid didr_write",
  "jti": "3185760b-4d93-4791-938d-b45000d34c78",
  "iss": "https://api-pilot.ebsi.eu/authorisation/v3"
}
  </pre>
  
  
````
using token t2.access_token
````
Result: 
<div class="output">
  <pre>
==> using token t2.access_token
eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ
==>
  </pre>
</div>    
  



````
did addVerificationRelationship user.did assertionMethod ES256K  
````
Result: 
<div class="output">
  <pre>
==> did addVerificationRelationship user.did assertionMethod ES256K
==> did build-addVerificationRelationship user.did assertionMethod ES256K
POST https://api-pilot.ebsi.eu/did-registry/v4/jsonrpc
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "addVerificationRelationship",
  "params": [
    {
      "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
      "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
      "name": "assertionMethod",
      "vMethodId": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "notBefore": 1700068910,
      "notAfter": 1854463910
    }
  ],
  "id": 534
}

852 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "1078",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 17:21:50 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 534,
  "result": {
    "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
    "to": "0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa",
    "data": "0x49df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d633263000000000000000000000000000000000000000000",
    "value": "0x0",
    "nonce": "0x01",
    "chainId": "0x1823",
    "gasLimit": "0x093633",
    "gasPrice": "0x0"
  }
}
Add verification relationship
{
  "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "name": "assertionMethod",
  "vMethodId": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
  "notBefore": 1700068910,
  "notAfter": 1854463910
}
==> compute signTransaction {"from":"0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B","to":"0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa","data":"0x49df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d633263000000000000000000000000000000000000000000","value":"0x0","nonce":"0x01","chainId":"0x1823","gasLimit":"0x093633","gasPrice":"0x0"}
0xf9020801808309363394755ded5d5e81282f0be85edae8e6852814bac3fa80b901a449df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d63326300000000000000000000000000000000000000000082306aa06e2d146e287f407ca4819397156d6bd85103199507e1018f407817c4a07ede4ea007b833f628aa6459f6232c46aea24a859971ee7d4b3a83adbb1d40febcd027a0
==> did sendSignedTransaction {"from":"0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B","to":"0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa","data":"0x49df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d633263000000000000000000000000000000000000000000","value":"0x0","nonce":"0x01","chainId":"0x1823","gasLimit":"0x093633","gasPrice":"0x0"} 0xf9020801808309363394755ded5d5e81282f0be85edae8e6852814bac3fa80b901a449df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d63326300000000000000000000000000000000000000000082306aa06e2d146e287f407ca4819397156d6bd85103199507e1018f407817c4a07ede4ea007b833f628aa6459f6232c46aea24a859971ee7d4b3a83adbb1d40febcd027a0
POST https://api-pilot.ebsi.eu/did-registry/v4/jsonrpc
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "sendSignedTransaction",
  "params": [
    {
      "protocol": "eth",
      "unsignedTransaction": {
        "from": "0x257F1000ED59E2a09ffF3f400B1b14985fe0f12B",
        "to": "0x755DEd5d5e81282F0BE85EDaE8e6852814bAC3fa",
        "data": "0x49df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d633263000000000000000000000000000000000000000000",
        "value": "0x0",
        "nonce": "0x01",
        "chainId": "0x1823",
        "gasLimit": "0x093633",
        "gasPrice": "0x0"
      },
      "r": "0x6e2d146e287f407ca4819397156d6bd85103199507e1018f407817c4a07ede4e",
      "s": "0x07b833f628aa6459f6232c46aea24a859971ee7d4b3a83adbb1d40febcd027a0",
      "v": "0x306a",
      "signedRawTransaction": "0xf9020801808309363394755ded5d5e81282f0be85edae8e6852814bac3fa80b901a449df6b2600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d63326300000000000000000000000000000000000000000082306aa06e2d146e287f407ca4819397156d6bd85103199507e1018f407817c4a07ede4ea007b833f628aa6459f6232c46aea24a859971ee7d4b3a83adbb1d40febcd027a0"
    }
  ],
  "id": 290
}

198 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "104",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 17:21:50 GMT",
  "ebsi-image-tag": "3b8040f62cbd9b1d03e3197fb57aa8af59e2ef0a",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 290,
  "result": "0x37a3b0be58ef5ff7d252d09f523b0f3d5c1dd1b29aa035a3686e71e9c4558964"
}
Waiting to be mined...
==> ledger getTransactionReceipt 0x37a3b0be58ef5ff7d252d09f523b0f3d5c1dd1b29aa035a3686e71e9c4558964
POST https://api-pilot.ebsi.eu/ledger/v3/blockchains/besu
{
  "headers": {
    "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6Inh6bzBsZmQ2TXpJbWRTNGVHbWtDY2hCUVBGbDh5emU1ZjREZFNGWTlxSFEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE3MDAwNjg3NDYsImV4cCI6MTcwMDA3NTk0Niwic3ViIjoiZGlkOmVic2k6ejIxTnFBa0FValRnRzlGYXpDNkx6RzM1IiwiYXVkIjoiaHR0cHM6Ly9hcGktcGlsb3QuZWJzaS5ldS9hdXRob3Jpc2F0aW9uL3YzIiwic2NwIjoib3BlbmlkIGRpZHJfd3JpdGUiLCJqdGkiOiIzMTg1NzYwYi00ZDkzLTQ3OTEtOTM4ZC1iNDUwMDBkMzRjNzgiLCJpc3MiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L2F1dGhvcmlzYXRpb24vdjMifQ.J-MWDCzGcBSI2xLBE9aJHrmB2RONUUndLh9yXEbacCNyWalYc-kwVJ43VVjDk4BVCaYS-siglgRYzEWfbiTfrQ"
  }
}
Data:
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": [
    "0x37a3b0be58ef5ff7d252d09f523b0f3d5c1dd1b29aa035a3686e71e9c4558964"
  ],
  "id": 737
}

137 milliseconds
Response HTTP Status 200
{
  "access-control-allow-origin": "*",
  "content-length": "2254",
  "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "date": "Wed, 15 Nov 2023 17:21:56 GMT",
  "origin-agent-cluster": "?1",
  "referrer-policy": "origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; preload",
  "vary": "Origin",
  "x-content-type-options": "nosniff",
  "x-dns-prefetch-control": "off",
  "x-download-options": "noopen",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
  "x-xss-protection": "0",
  "connection": "close"
}
Data:
{
  "jsonrpc": "2.0",
  "id": 737,
  "result": {
    "blockHash": "0xb7680bd72d527b60f069750868633a6d8958753a4dd7e41f7d73717c36654f61",
    "blockNumber": "0x38a827",
    "contractAddress": null,
    "cumulativeGasUsed": "0x63ee5",
    "from": "0x257f1000ed59e2a09fff3f400b1b14985fe0f12b",
    "gasUsed": "0x63ee5",
    "effectiveGasPrice": "0x0",
    "logs": [
      {
        "address": "0x755ded5d5e81282f0be85edae8e6852814bac3fa",
        "topics": [
          "0x6b11f32fc48b87d6eadf010a5294a4f611261624bc2c894d26f61e9d8c43bf79"
        ],
        "data": "0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000006554fe2e000000000000000000000000000000000000000000000000000000006e88dfa600000000000000000000000000000000000000000000000000000000000000216469643a656273693a7a32314e71416b41556a5467473946617a43364c7a47333500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f617373657274696f6e4d6574686f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b396d3673586f492d5f7245694e51526d6852774a75567a3275494a39533865586f5479664556362d633263000000000000000000000000000000000000000000",
        "blockNumber": "0x38a827",
        "transactionHash": "0x37a3b0be58ef5ff7d252d09f523b0f3d5c1dd1b29aa035a3686e71e9c4558964",
        "transactionIndex": "0x0",
        "blockHash": "0xb7680bd72d527b60f069750868633a6d8958753a4dd7e41f7d73717c36654f61",
        "logIndex": "0x0",
        "removed": false
      }
    ],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "status": "0x1",
    "to": "0x755ded5d5e81282f0be85edae8e6852814bac3fa",
    "transactionHash": "0x37a3b0be58ef5ff7d252d09f523b0f3d5c1dd1b29aa035a3686e71e9c4558964",
    "transactionIndex": "0x0",
    "type": "0x0"
  }
}
==> view transactionInfo
Add verification relationship
{
  "did": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "name": "assertionMethod",
  "vMethodId": "9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
  "notBefore": 1700068910,
  "notAfter": 1854463910
}
==>

  </pre>
</div>      

The DID, that was created on the EBSI blockchain, is now updated. and we can check the update via the endpoint in the browsesr.
  
Enter the following URL in browser ( replacing the DID with the one you created)  
````
https://api-pilot.ebsi.eu/did-registry/v4/identifiers/did:ebsi:z21NqAkAUjTgG9FazC6LzG35
````
Result: 
<div class="output">
  <pre>
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
  "controller": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35"
  ],
  "verificationMethod": [
    {
      "id": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c",
      "type": "JsonWebKey2020",
      "controller": "did:ebsi:z21NqAkAUjTgG9FazC6LzG35",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "TGMXN5-CEbVF_j_Qhl1VoCB4x4ZiWarnKIdH4Rc7hcU",
        "y": "Yn6UdHDqwVtlXyngevhGgMO31YyHgBqKiCiO_2962hk"
      }
    }
  ],
  "authentication": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
  ],
  <b style="color:red;">"assertionMethod": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
  ],</b>
  "capabilityInvocation": [
    "did:ebsi:z21NqAkAUjTgG9FazC6LzG35#9m6sXoI-_rEiNQRmhRwJuVz2uIJ9S8eXoTyfEV6-c2c"
  ]
}


  </pre>
</div>  
  
You can see that the assertion method is added to the DID document. 
in part III the process to postload information to a DID document is explained, for those who payed close attention something is missing in this registration.   
  
## The Script
  
The complete script for onboarding the trusted issuer on the EBSI block change as found in "..\test-scripts\scripts\onboardLegalEntity" in the installation directory of the CLI. 
!NOTE : missing here are the actual values [PRIVATE_KEY_ES256K_ISSUER, DID_ISSUER, PRIVATE_KEY_ES256_ISSUER, URL_ISSUER_ACCREDITATION] and the environment which we used in the actual example. 
  |Variable Name|Variable |Example|
  |---|---|---|	
  |PRIVATE_KEY_ES256K_ISSUER|The Hex value of the private key of the TAO, EOS or Another Authorithy on EBSI | "privateKeyHex": "0x99321e6b05d648c94aca201477aa7da037a8bf6d090f6ffb06f768407c3055e7"|
  | DID_ISSUER | The Decentralized ID of the of the private key of the TAO, EOS or Another Authorithy on EBSI | "did": "did:ebsi:zjXU19gTNuQTAudP7hQwMr2" |
  | PRIVATE_KEY_ES256_ISSUER | EC256 Key ofthe TAO, EOS or Another Authorithy on EBSI  | see footnote  ^1^|
  | URL_ISSUER_ACCREDITATION | A link the the URI of the TOA exposing its Attributes| https://api-pilot.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zjXU19gTNuQTAudP7hQwMr2/attributes/52aa240887243c275db3d4c4c39fdfa1b2c3605106e3f6158af4fb00b51b829d |
  
footnote 1 : 
  <div class="output">
  <pre>
{"kty":"EC","x":"lj_vBxMirqTVytVT4bDq7VBGrZdqrSXoyvO7kbadio0","y":"5YUhVWqlOwKmrTJGXo9-PfHiqczhA-1PvYx4Zu99xiQ","crv":"P-256","d":"QNAnVrGBrdrukDDe-Jlz0ZRJSmePNOruDTpYtCmQaCU"},
    </pre>
</div>  
  
&#8203;##### new legal entity
using user null
using user ES256K
set lePrivateKey user.privateKeyHex
set leDid user.did

&#8203;##### load issuer
using user null
using user ES256K did1 <b>[PRIVATE_KEY_ES256K_ISSUER] [DID_ISSUER]</b>
using user ES256 did1 <b>[PRIVATE_KEY_ES256_ISSUER] [DID_ISSUER]</b>
set issuerPrivateKeyES256K user.privateKeyHex
set issuerPrivateKeyES256 user.keys.ES256.privateKeyJwk
set issuerDid user.did

payloadVc: load scripts/assets/VerifiableAuthorisationToOnboard.json
set payloadVc.issuer issuerDid
set payloadVc.credentialSubject.id leDid
set payloadVc.credentialSchema.id https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM
  set payloadVc.termsOfUse.id <b>[URL_ISSUER_ACCREDITATION]</b>
vcToOnboard: compute createVcJwt payloadVc {} ES256

using user null
using user ES256K did1 lePrivateKey leDid

&#8203;##### register DID document
openidconf: authorisation get /.well-known/openid-configuration
vpJwt1: compute createPresentationJwt vcToOnboard ES256K openidconf.issuer
t1: authorisation token didr_invite_presentation vpJwt1
using token t1.access_token

did insertDidDocument

&#8203;#####  h. Completing the DID document and an extra signing key.

vpJwt2: compute createPresentationJwt empty ES256K openidconf.issuer
t2: authorisation token didr_write_presentation vpJwt2
using token t2.access_token

did addVerificationRelationship user.did assertionMethod ES256K
did get /identifiers/ leDid
  


<style type="text/css" rel="stylesheet">
.output 
{   padding:1em; 
    background-color:#FFFEDF; 
    color:#69337A; 
    border-color: brown;  
    border-style: solid;  
    border-width: 1px;
}
  
</style>
