import * as ref from 'ref-napi';
import * as ArrayType from 'ref-array-napi';

export const CharArray = (length: number) => ArrayType(ref.types.char, length);

export const UCharArray = (length: number) => ArrayType(ref.types.uchar, length);

export const IntArray = (length: number) => ArrayType(ref.types.int, length);

export const UIntArray = (length: number) => ArrayType(ref.types.uint, length);