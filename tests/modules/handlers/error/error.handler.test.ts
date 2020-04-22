import ErrorHandler from '../../../../src/modules/handlers/error/error.handler';

test('Error handler code 0x0a', () => {
    const throwError = () => new ErrorHandler(0x0a);
    expect(throwError)
        .toThrow('API call is not implemented.');
});

test('Error handler code unknown', () => {
    const throwError = () => new ErrorHandler(0xff);
    expect(throwError)
        .toThrow('Unknown code error.');
});

test('Error handler string', () => {
    const throwError = () => new ErrorHandler('This message need to comeback in throw.');
    expect(throwError)
        .toThrow('This message need to comeback in throw.');
});