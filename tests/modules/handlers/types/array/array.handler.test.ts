import { CharArray } from '../../../../../src/modules/handlers/types/array/array.handler';
import { MAX_STR_LENGTH } from '../../../../../src/modules/handlers/types/constant/constant.handler';
import * as ref from 'ref-napi';

test('Create CharArray using MAX_STR_LENGTH', () => {
    const obj = CharArray(MAX_STR_LENGTH);
    expect(obj.size).toBe(MAX_STR_LENGTH);
    expect(obj.type).toBe(ref.types.char);
});
