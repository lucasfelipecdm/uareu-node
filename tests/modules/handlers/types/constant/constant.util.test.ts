import keyByValue from '../../../../../src/modules/handlers/types/constant/constant.utils';
import { DPFPDD_STATUS, DPFPDD_QUALITY } from '../../../../../src/modules/handlers/types/constant/constant.handler';

test('Get key by value from DPFPDD_STATUS constant', () => {
    expect(keyByValue(DPFPDD_STATUS, 2)).toBe('DPFPDD_STATUS_NEED_CALIBRATION');
});

test('Get key by value from DPFPDD_QUALITY constant', () => {
    expect(keyByValue(DPFPDD_QUALITY, (1 << 13))).toBe('DPFPDD_QUALITY_SCAN_TOO_FAST');
});
