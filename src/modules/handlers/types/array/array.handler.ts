import * as ref from 'ref-napi';
import * as ArrayType from 'ref-array-napi';

export const CharArray = (length: number): typeof ArrayType => ArrayType(ref.types.char, length);

export const UCharArray = (length: number): typeof ArrayType => ArrayType(ref.types.uchar, length);

export const IntArray = (length: number): typeof ArrayType => ArrayType(ref.types.int, length);

export const UIntArray = (length: number): typeof ArrayType => ArrayType(ref.types.uint, length);