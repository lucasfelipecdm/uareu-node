import { CharArray, UCharArray, IntArray, UIntArray } from '../../../../../src/modules/handlers/types/array/array.handler';
import { MAX_STR_LENGTH } from '../../../../../src/modules/handlers/types/constant/constant.handler';
import * as ref from 'ref-napi';

test('Create CharArray using MAX_STR_LENGTH', () => {
    const array = CharArray(MAX_STR_LENGTH);
    expect(array.size).toBe(MAX_STR_LENGTH);
    expect(array.type).toBe(ref.types.char);
});

test('Create UCharArray using MAX_STR_LENGTH', () => {
    const array = UCharArray(1);
    expect(array.size).toBe(1);
    expect(array.type).toBe(ref.types.uchar);
});

test('Create IntArray using MAX_STR_LENGTH', () => {
    const array = IntArray(MAX_STR_LENGTH);
    expect(array.size).toBe(MAX_STR_LENGTH * ref.types.int.size);
    expect(array.type).toBe(ref.types.int);
});

test('Create UIntArray using MAX_STR_LENGTH', () => {
    const array = UIntArray(1);
    expect(array.size).toBe(ref.types.uint.size);
    expect(array.type).toBe(ref.types.uint);
});
