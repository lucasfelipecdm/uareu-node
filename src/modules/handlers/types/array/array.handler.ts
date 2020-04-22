import * as ref from 'ref-napi';
import * as ArrayType from 'ref-array-napi';

export const CharArray = (length: number): typeof ArrayType => ArrayType(ref.types.char, length);