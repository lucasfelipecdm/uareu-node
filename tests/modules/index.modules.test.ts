import UareU from '../../src/modules/';
import { DPFPDD_PRIORITY } from '../../src/modules/handlers/types/constant/constant.handler';

test('Get instance of UareU singleton class ', async () => {
    const uareu = UareU.getInstance();
    expect(uareu).not.toBeUndefined();
});

test('Get instance of UareU singleton class and load libs passing right paths', async () => {
    const uareu = UareU.getInstance();
    await expect(uareu.loadLibs('bin/dpfpdd', 'bin/dpfj')).resolves.toBe('SUCCESS');
});

test('Get instance of UareU singleton class and load libs passing wrongs paths', async () => {
    const uareu = UareU.getInstance();
    await expect(uareu.loadLibs('binX/dpfpdd', 'binX/dpfj')).rejects.toThrow();
});

test('Get instance of UareU singleton class and load libs passing without paths', async () => {
    const uareu = UareU.getInstance();
    await expect(uareu.loadLibs()).resolves.toBe('SUCCESS');
});

test('Try get DPFPDD Version using dpfpddVersion function from UareU class expect toThrow', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await expect(uareu.dpfpddVersion()).rejects.toThrow();
});

test('Init DPFPDD using dpfpddInit function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await expect(uareu.dpfpddInit()).resolves.toBe(0);
});

test('Init DPFPDD using dpfpddExit function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await uareu.dpfpddInit();
    await expect(uareu.dpfpddExit()).resolves.toBe(0);
});

test('Get list of reader devices connected using dpfpddQueryDevices function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await uareu.dpfpddInit();
    await expect(uareu.dpfpddQueryDevices()).resolves.not.toBeUndefined();
});

test('Open a reader using dpfpddOpen function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await uareu.dpfpddInit();
    const devices = await uareu.dpfpddQueryDevices();
    await expect(uareu.dpfpddOpen(devices.devicesList[0])).resolves.not.toBeUndefined();
});

// test('Try open a reader using dpfpddOpenExt function from UareU class expecting to throw a error', async () => {
//     const uareu = UareU.getInstance();
//     await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
//     await uareu.dpfpddInit();
//     const devices = await uareu.dpfpddQueryDevices();
//     await expect(uareu.dpfpddOpenExt(devices.devicesList[0], DPFPDD_PRIORITY.DPFPDD_PRIORITY_EXCLUSIVE)).rejects.toThrow();
// });

// test('Close a reader using dpfpddClose function from UareU class', async () => {
//     const uareu = UareU.getInstance();
//     await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
//     await uareu.dpfpddInit();
//     const devices = await uareu.dpfpddQueryDevices();
//     const reader = await uareu.dpfpddOpen(devices.devicesList[0]);
//     await expect(uareu.dpfpddClose(reader)).resolves.toBe(0);
// });

// test('Try open a reader using dpfpddGetDeviceStatus function from UareU class expecting to throw a error', async () => {
//     const uareu = UareU.getInstance();
//     await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
//     await uareu.dpfpddInit();
//     const devices = await uareu.dpfpddQueryDevices();
//     const reader = await uareu.dpfpddOpen(devices.devicesList[0]);
//     await expect(uareu.dpfpddGetDeviceStatus(reader)).resolves.not.toBeUndefined();
// });