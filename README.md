# uareu-node &middot; [![npm version](https://img.shields.io/npm/v/uareu-node.svg?style=flat)](https://www.npmjs.com/package/uareu-node) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lucasfelipecdm/uareu-node/blob/master/LICENSE)

`uareu-node` is a typescript library that aims to allow communication between a nodejs application and the DLL / SO of the DPFJ and DPFPDD libraries created by [DigitalPersona / HID Global](https://www.hidglobal.com.br/products/software/activid/digitalpersona).

* **Attention:** 

    - This library has only been tested in this environment(s):
        - SO: **Windows**;
        - Architecture: **x64**;
        - NodeJS: [**12.17.0(x64)**, **12.13.0(x32)**];

    - This library does not replace the original library provided by HID Global, only facilities the communication between it and the aplication.

    - Originally this library was created to a specific device (_**Digital Persona 4500 Fingerprint Reader**_), but while we were running the tests, another device worked (_**Synaptics FP sensor**_) a device built into the laptop.

    - If using the **x32** _dpfj_ and _dpfpdd_ libraries, use a **x32** node version, if using **x64**, use a **x64** node version. :)

## Requirements

  -  _**A Digital Persona 4500 Fingerprint Reader**_ or similar;
  - **[_dpfj.dll_](#), [_dpfpdd.dll_](#)** for **Windows**, and **[_dpfj.so_](#), [_dpfpdd.so_](#)** for **Linux**, both should be located in a folder named "bin" at the root of the project.
    ### 
        .
        ├── ...
        ├── bin                     # Libraries files
        │   ├── dpfj.dll            # DPFJ library
        │   ├── dpfpdd.dll          # DPFPDD library
        │   └── ...                 # etc.
        └── ...
        
  - If you choose to keep the library files in another location, when loading the library you must provide the path to the libraries.
    - Example:
        ```js
            // You just need to specific the path if the libs are not in a 'bin' folder at root.
            uareu.loadLibs('src/libs/dpfpdd.dll', 'src/libs/dpfj.dll')
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {throw err;});
        ```

## Installation 

Just need to invoke:
``` bash
$ npm install uareu-node
```

## Examples

You can find this example inside the 'example' folder, and run it invoking:
``` bash
$ node example/index.js
```
Code:

``` js
    const { UareU, CONSTANTS } = require('uareu-node'); // Import
    const uareu = UareU.getInstance(); // Get a unique instance of library handler.
    let reader; // Create a variable to keep the reader handle after 'open' the device.

    // Probably the code below will also work for you.
    uareu.loadLibs() // Load libs
        .then(() => uareu.dpfpddInit()) // Init libs
        .then(() => uareu.dpfpddQueryDevices()) // Search reader devices connected
        .then((res) => uareu.dpfpddOpen(res.devicesList[0])}) // 'Open' the reader device, it's needed for use others functions like: dpfpddCaptureAsync
        .then((res) => { if (res) reader = res }) // Set reader variable
        .catch((err) => { throw err; });

    // After this initial configuration you can create some functions to capture a fingerprint, identify it, compare it and etc...
    // Note: Identify and Compare are different, the main diference between it are: - Compare only compares two fingerprints;  - Identify compares a fingerprint against a list of fingerprints;

    uareu.dpfpddCaptureAsync(reader, CONSTANTS.DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381, CONSTANTS.DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT, (data, dataSize) => {
        // Here you receive the data of a fingerprint image data (FID)
        // Before compare it, you need to generate a fingerprint minutie data (FMD)
        uareu.dpfjCreateFmdFromFid(data, CONSTANTS.DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004)
        .then((res) => {
            // Here you receive the FMD and then you can compare it, save it to compare with the next fingerprint, identify it with a database, etc...
            return uareu.dpfjIdentify(res, [FMD LIST]);
        })
        .then((res) => {
            // Finger was identified or not? The answer you get here.
        })
        .catch((err) => console.log(err));
    });
```
## Contributing

One of the problems that we have already identified, but we have not been able to find a solution is the fact that nodejs stops running a few times when removing and placing the finger very quickly on the reader. Can you help us?
Any help is welcome, open a issue, make a pull request, send me a email: lucasfelipecdm@gmail.com.

## License

MIT License. See the `LICENSE` file.