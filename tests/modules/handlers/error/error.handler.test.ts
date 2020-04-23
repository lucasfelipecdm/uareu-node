import ErrorHandler from '../../../../src/modules/handlers/error/error.handler';

test('Error handler code 00a', () => {
    const throwError = () => new ErrorHandler(96075796);
    expect(throwError)
        .toThrow('One or more parameters passed to the API call are invalid.');
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