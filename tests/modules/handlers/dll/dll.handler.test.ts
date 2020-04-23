import DllHandler from '../../../../src/modules/handlers/dll/dll.handler';

test('Loading of dpfpdd library with correct path', async () => {
    await expect(DllHandler.loadDpfppdFrom('bin/dpfpdd')).resolves.not.toBeUndefined();
});

test('Loading of dpfpdd library with wrong path', async () => {
    await expect(DllHandler.loadDpfppdFrom('binX/dpfpdd')).rejects.toThrow('error');
});

test('Loading of dpfpdd library without a path', async () => {
    await expect(DllHandler.loadDpfppdFrom()).resolves.not.toBeUndefined();
});

test('Loading of dpfj library with correct path', async () => {
    await expect(DllHandler.loadDpfjFrom('bin/dpfj')).resolves.not.toBeUndefined();
});

test('Loading of dpfj library with wrong path', async () => {
    await expect(DllHandler.loadDpfjFrom('binX/dpfj')).rejects.toThrow('error');
});

test('Loading of dpfj library without a path', async () => {
    await expect(DllHandler.loadDpfjFrom()).resolves.not.toBeUndefined();
});