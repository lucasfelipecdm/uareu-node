import { charArray, uCharArray, intArray, uIntArray, genericArrayFrom } from '../../../../../src/modules/handlers/types/array/array.handler';
import { MAX_STR_LENGTH } from '../../../../../src/modules/handlers/types/constant/constant.handler';
import * as ref from 'ref-napi';
import { dpfpdd_dev_info } from '../../../../../src/modules/handlers/types/struct/struct.handler';

test('Create CharArray using MAX_STR_LENGTH', () => {
    const array = charArray(MAX_STR_LENGTH);
    expect(array.size).toBe(MAX_STR_LENGTH);
    expect(array.type).toBe(ref.types.char);
});

test('Create UCharArray using MAX_STR_LENGTH', () => {
    const array = uCharArray(1);
    expect(array.size).toBe(1);
    expect(array.type).toBe(ref.types.uchar);
});

test('Create IntArray using MAX_STR_LENGTH', () => {
    const array = intArray(MAX_STR_LENGTH);
    expect(array.size).toBe(MAX_STR_LENGTH * ref.types.int.size);
    expect(array.type).toBe(ref.types.int);
});

test('Create UIntArray using MAX_STR_LENGTH', () => {
    const array = uIntArray(1);
    expect(array.size).toBe(ref.types.uint.size);
    expect(array.type).toBe(ref.types.uint);
});

test('Create genericArrayFrom dpfpdd_dev_info with size 2', () => {
    const array = genericArrayFrom(dpfpdd_dev_info, 2);
    expect(array.length).toBe(2904);
});
