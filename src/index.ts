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
    uareu.dpfjStartEnrollment(DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004).then((res) => console.log('Init enrollment.'));
    return uareu.dpfpddCaptureAsync(reader, DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381, DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT, (context, reserved, dataSize, data) => {
        uareu.dpfjCreateFmdFromFid(data, dataSize, DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004).then((res) => {
            return uareu.dpfjAddToEnrollment(res);
        }).then((res) => {
            if (res === 0) {
                console.log('FMD enrollment finish.');
                return uareu.dpfjCreateEnrollmentFmd();
            } else {
                console.log('Press the same finger again.');
                return 1
            };
        }).then((res) => {
            if (res === 0) return uareu.dpfjFinishEnrollment();
        }).then((res) => {
            console.log('Finish enrollment.');
        }).catch((err) => {
            console.log(err);
        });
    });
}).then((res) => {
    const TEMPO = 60;
    setTimeout(() => {
        console.log(`Deu ${TEMPO} seg`);
    }, 1000 * TEMPO);
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});