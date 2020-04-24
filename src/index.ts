import UareU from './modules';
import * as ref from 'ref-napi';

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
    return uareu.dpfpddGetDeviceCapabilities(reader);
}).then((res) => {
    console.log(JSON.stringify(ref.deref(res)));
    return uareu.dpfpddClose(reader);
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});