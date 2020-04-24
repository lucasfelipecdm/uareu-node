import UareU from './modules';
import * as ref from 'ref-napi';
import { DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_PROC } from './modules/handlers/types/constant/constant.handler';

const uareu = UareU.getInstance();
let reader: any;
uareu.loadLibs().then(() => {
    return uareu.dpfpddInit();
}).then((res) => {
    return uareu.dpfpddQueryDevices();
}).then((res) => {
    return uareu.dpfpddOpen(res.devicesList[0]);
}).then((res) => {
    reader = res;
    // return uareu.dpfpddCaptureAsync(reader, DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER, DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT, (context, reserved, dataSize, data) => {
    //     console.log(context);
    //     console.log(reserved);
    //     console.log(dataSize);
    //     console.log(data);
    // });
}).then((res) => {
    return uareu.dpfpddCalibrate(reader);
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});