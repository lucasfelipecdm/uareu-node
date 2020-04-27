import UareU from './modules';
import * as ref from 'ref-napi';
import { DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_PROC, DPFJ_FMD_FORMAT } from './modules/handlers/types/constant/constant.handler';
import Fmd from './modules/interfaces/fmd';

const uareu = UareU.getInstance();
let fmd1: Fmd;
let reader: any;

uareu.loadLibs().then(() => {
    return uareu.dpfpddInit();
}).then((res) => {
    return uareu.dpfpddQueryDevices();
}).then((res) => {
    return uareu.dpfpddOpen(res.devicesList[0]);
}).then((res) => {
    reader = res;
    return uareu.dpfpddCaptureAsync(reader, DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381, DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT, (context, reserved, dataSize, data) => {
        uareu.dpfjCreateFmdFromFid(data, dataSize, DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004).then((res) => {
            if (!fmd1) {
                console.log('First FMD save');
                fmd1 = res;
            } else {
                console.log('Comparing the fmds');
                return uareu.dpfjCompare(fmd1, res);
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    });
}).then((res) => {
    const TEMPO = 20;
    setTimeout(() => {
        console.log(`Deu ${TEMPO} seg`);
    }, 1000 * TEMPO);
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});