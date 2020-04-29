import UareU from './modules';
import { DpfppdOpenStruct, DpfppdOpenExtStruct } from './modules/interfaces/uareu.interfaces';

const uareu = UareU.getInstance();
let reader: DpfppdOpenStruct | DpfppdOpenExtStruct;

uareu.loadLibs()
    .then((res) => {
        console.log(`Libs initialized. ${res}`);
        return uareu.dpfpddInit();
    })
    .then((res) => {
        console.log(res);
        return uareu.dpfpddQueryDevices();
    })
    .then((res) => {
        console.log(res);
        return uareu.dpfpddOpen(res.devicesList[0]);
    })
    .then((res) => {
        console.log(res);
        reader = res;
        return uareu.dpfpddGetDeviceStatus(reader);
    })
    .then((res) => {
        console.log(res);
        return uareu.dpfpddGetDeviceCapabilities(reader);
    })
    .then((res) => {
        console.log(res);
        return uareu.dpfpddClose(reader);
    })
    .then((res) => {
        console.log(res);
        return uareu.dpfpddExit();
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });