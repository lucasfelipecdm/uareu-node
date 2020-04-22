import {
    dpfpdd_ver_info,
    dpfpdd_version,
} from '../../../../../src/modules/handlers/types/struct/struct.handler';

test('Create dpfpdd_ver_info struct type', () => {
    const obj = new dpfpdd_ver_info();
    expect(obj.maintenance).toBe(0);
    expect(obj.major).toBe(0);
    expect(obj.minor).toBe(0);
});

test('Create dpfpdd_version struct type', () => {
    const obj = new dpfpdd_version();
    expect(obj.size).toBe(0);

    expect(obj.lib_ver.maintenance).toBe(0);
    expect(obj.lib_ver.major).toBe(0);
    expect(obj.lib_ver.minor).toBe(0);

    expect(obj.api_ver.maintenance).toBe(0);
    expect(obj.api_ver.major).toBe(0);
    expect(obj.api_ver.minor).toBe(0);
});