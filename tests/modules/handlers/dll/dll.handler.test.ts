import DllHandler from '../../../../src/modules/handlers/dll/dll.handler';

test('Loading of dpfpdd library with correct path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfppdFrom('bin/dpfpdd')).resolves.not.toBeUndefined();
});

test('Loading of dpfpdd library with wrong path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfppdFrom('binX/dpfpdd')).rejects.toThrow('error');
});

test('Loading of dpfpdd library without a path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfppdFrom()).resolves.not.toBeUndefined();
});

test('Loading of dpfj library with correct path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfjFrom('bin/dpfj')).resolves.not.toBeUndefined();
});

test('Loading of dpfj library with wrong path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfjFrom('binX/dpfj')).rejects.toThrow('error');
});

test('Loading of dpfj library without a path', async () => {
    const handler = new DllHandler();
    await expect(handler.loadDpfjFrom()).resolves.not.toBeUndefined();
});