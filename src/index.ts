import UareU from './modules';
import { DpfppdOpenStruct, DpfppdOpenExtStruct } from './modules/interfaces/uareu.interfaces';
import { DPFPDD_PRIORITY, DPFPDD_PRIORITY_TYPE, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC, DPFPDD_IMAGE_PROC_TYPE } from './modules/handlers/types/constant/constant.handler';

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
    // .then((res) => {
    //     console.log(res);
    //     reader = res;
    //     return uareu.dpfpddGetDeviceStatus(reader);
    // })
    // .then((res) => {
    //     console.log(res);
    //     return uareu.dpfpddGetDeviceCapabilities(reader);
    // })
    .then((res) => {
        console.log(res);
        reader = res;
        return uareu.dpfpddCapture(reader, DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 as DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT as DPFPDD_IMAGE_PROC_TYPE);
    })
    .then((res) => {
        console.log(res);
        setTimeout(() => {
            return 1;
        }, 5000)
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