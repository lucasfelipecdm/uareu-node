import * as ArrayType from 'ref-array-di';
import * as ref from 'ref-napi';
import { CharArray, GenericArrayFrom, IntArray, UCharArray, UIntArray } from './array.interface';

const Array = ArrayType(ref);

export const charArray: CharArray = (length: number) => Array(ref.types.char, length);

export const uCharArray: UCharArray = (length: number) => Array(ref.types.uchar, length);

export const intArray: IntArray = (length: number) => Array(ref.types.int, length);

export const uIntArray: UIntArray = (length: number) => Array(ref.types.uint, length);

export const genericArrayFrom: GenericArrayFrom = (type: any, length: number) => {
    const arrayType = Array(type);
    const array = new arrayType(length);

    return array.buffer;
}
