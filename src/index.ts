import UareU from './modules';

const uareu = UareU.getInstance();

uareu.loadLibs().then(() => {
    return uareu.dpfpddInit();
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});