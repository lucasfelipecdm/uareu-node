import UareU from './modules';

const uareu = UareU.getInstance();

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
        return uareu.dpfpddExit();
    })
    .catch((err) => {
        console.log(err);
    });