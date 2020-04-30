import UareU from './modules';
import { DpfppdOpenStruct, DpfppdOpenExtStruct, DpfpddCaptureCallbackFunc, DpfpddCaptureCallbackData0 } from './modules/interfaces/uareu.interfaces';
import { DPFPDD_PRIORITY, DPFPDD_PRIORITY_TYPE, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC, DPFPDD_IMAGE_PROC_TYPE } from './modules/handlers/types/constant/constant.handler';

const uareu = UareU.getInstance();
const callback: DpfpddCaptureCallbackFunc = (data: DpfpddCaptureCallbackData0, dataSize: number) => {
    console.log("\x1b[33m", `[${new Date().toLocaleTimeString()}] Finger captured.`, "\x1b[0m");
    console.log(data);
}

let reader: DpfppdOpenStruct | DpfppdOpenExtStruct;

uareu.loadLibs()
    .then((res) => {
        console.log(`Libs found... ${res}`);
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
        reader = res;
        console.log(res);
        return uareu.dpfpddCaptureAsync(reader, DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 as DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT as DPFPDD_IMAGE_PROC_TYPE, callback);
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

setTimeout(() => {
    console.log('Test finished!');
    uareu.dpfpddClose(reader);
    uareu.dpfpddExit();
}, 1000 * 180);