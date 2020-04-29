import * as ref from 'ref-napi';
import * as ArrayType from 'ref-array-napi';
import { CharArray, UCharArray, IntArray, UIntArray, GenericArrayFrom } from './array.interface';

export const charArray: CharArray = (length: number) => ArrayType(ref.types.char, length);

export const uCharArray: UCharArray = (length: number) => ArrayType(ref.types.uchar, length);

export const intArray: IntArray = (length: number) => ArrayType(ref.types.int, length);

export const uIntArray: UIntArray = (length: number) => ArrayType(ref.types.uint, length);

export const genericArrayFrom: GenericArrayFrom = (type: any, length: number) => {
    const arrayType = ArrayType(type);
    const array = new arrayType(length);

    return array.buffer;
}
