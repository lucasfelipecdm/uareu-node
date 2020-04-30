import UareU from './modules';
import { DpfppdOpenStruct, DpfppdOpenExtStruct, DpfpddCaptureCallbackFunc, DpfpddCaptureCallbackData0, DpfjCompareStruct, DpfjCreateFmdFromFidStruct } from './modules/interfaces/uareu.interfaces';
import { DPFPDD_PRIORITY, DPFPDD_PRIORITY_TYPE, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC, DPFPDD_IMAGE_PROC_TYPE, DPFJ_FMD_FORMAT, DPFJ_FMD_FORMAT_TYPE } from './modules/handlers/types/constant/constant.handler';

const uareu = UareU.getInstance();
let fmdToCompare: DpfjCreateFmdFromFidStruct;

const callback: DpfpddCaptureCallbackFunc = (data: DpfpddCaptureCallbackData0, dataSize: number) => {
    console.log("\x1b[33m", `[${new Date().toLocaleTimeString()}] Finger captured.`, "\x1b[0m");
    if (data.data.capture_result.quality === 0) {
        uareu.dpfjCreateFmdFromFid(data, DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004 as DPFJ_FMD_FORMAT_TYPE)
            .then((res) => {
                console.log("\x1b[32m", `[${new Date().toLocaleTimeString()}] FMD created.`, "\x1b[0m");
                if (!fmdToCompare) {
                    fmdToCompare = res;
                } else {
                    uareu.dpfjCompare(fmdToCompare, res)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

let reader: DpfppdOpenStruct | DpfppdOpenExtStruct;

uareu.loadLibs()
    .then((res) => {
        console.log(`Libs found. Return: ${res}`);
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