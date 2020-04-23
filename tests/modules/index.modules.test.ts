import UareU from '../../src/modules/';

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

test('Get DPFPDD Version using dpfpddVersion function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await expect(uareu.dpfpddVersion()).rejects.toThrow();
});

test('Init DPFPDD using dpfpddInit function from UareU class', async () => {
    const uareu = UareU.getInstance();
    await uareu.loadLibs('bin/dpfpdd', 'bin/dpfj');
    await expect(uareu.dpfpddInit()).resolves.toBe(0);
});
