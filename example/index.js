const { UareU, CONSTANTS } = require('../dist');
const readline = require('readline');

const uareu = UareU.getInstance();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let reader;
let fmdList = [];

const init = async () => {
    return await uareu.loadLibs()
        .then(() => uareu.dpfpddInit())
        .then(() => uareu.dpfpddQueryDevices())
        .then((res) => uareu.dpfpddOpen(res.devicesList[0]))
        .then((res) => { if (res) reader = res })
        .catch((err) => { throw err; });
};

const exit = async () => {
    uareu.dpfpddClose(reader)
        .then(() => uareu.dpfpddExit())
        .catch((err) => { throw err });
}

const initialQuest = () => {
    const question = `
    What do you want to test?
    1 - Compare;
    2 - Identify;
    0 - Exit;
`;

    rl.question(question, (answer) => {
        switch (answer) {
            case '0':
                console.log('You selected: Exit');
                exit()
                    .then(() => process.exit(0));
                break;
            case '1':
                console.log('You selected: Comparation');
                identifyOrCompare('compare')
                    .then(() => console.log('Put your finger on reader.'))
                    .catch((err) => console.log(err));
                break;
            case '2':
                console.log('You selected: Identification');
                identifyOrCompare('identify')
                    .then(() => console.log('Put your finger on reader.'))
                    .catch((err) => console.log(err));
                break;
            default:
                console.log('Invalid option.');
                initialQuest();
                break;
        };
    });
};

const identifyCallback = (data) => {
    uareu.dpfjCreateFmdFromFid(data, CONSTANTS.DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004)
        .then((res) => {
            if (fmdList.length > 0) {
                return uareu.dpfjIdentify(res, fmdList);
            } else {
                fmdList.push(res);
                console.log('Put the same finger (or not), to identify.');
            }
        })
        .then((res) => {
            if (res) {
                console.log(res.resultMessage);
                fmdList = [];
                initialQuest();
            }
        })
        .catch((err) => console.log(err));
};

const compareCallback = (data) => {
    uareu.dpfjCreateFmdFromFid(data, CONSTANTS.DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004)
        .then((res) => {
            if (fmdList.length > 0) {
                return uareu.dpfjCompare(res, fmdList[0]);
            } else {
                fmdList.push(res);
                console.log('Put the same finger (or not), to compare.');
            }
        })
        .then((res) => {
            if (res) {
                console.log(res.resultMessage);
                fmdList = [];
                initialQuest();
            }
        })
        .catch((err) => console.log(err));
};

const identifyOrCompare = async (type) => {
    await uareu.dpfpddCancel(reader);
    const callback = type === 'identify' ? identifyCallback : compareCallback;
    return await uareu.dpfpddCaptureAsync(reader, CONSTANTS.DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381, CONSTANTS.DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT, callback);
};

init()
    .then(() => initialQuest())
    .catch((err) => console.log(err));