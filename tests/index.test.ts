import { sayHello } from './../src/index';

test('First test!', () => {
    expect(sayHello())
        .toMatch('Hello');
})