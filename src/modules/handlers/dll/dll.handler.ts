import * as ffi from 'ffi-napi';

export default class DllHandler {
    public static loadDpfppdFrom = (path: any) => new Promise((resolve, reject) => {
        try {
            resolve(ffi.Library(path, {
                'dpfpdd_init': ['int', []],
                'dpfpdd_version': ['int', ['pointer']],
                'dpfpdd_query_devices': ['int', ['pointer', 'pointer']],
                'dpfpdd_open': ['int', ['pointer', 'pointer']],
                'dpfpdd_close': ['int', ['pointer']],
                'dpfpdd_get_device_status': ['int', ['pointer', 'pointer']],
                'dpfpdd_capture': ['int', ['pointer', 'pointer', 'uint', 'pointer', 'pointer', 'pointer']],
                'dpfpdd_capture_async': ['int', ['pointer', 'pointer', 'pointer', 'pointer']],
                'dpfpdd_exit': ['int', []]
            }))
        } catch (err) {
            reject(err);
        }
    });

    public static loadDpfjFrom = (path: any) => new Promise((resolve, reject) => {
        try {
            resolve(ffi.Library(path, {
                'dpfj_start_enrollment': ['int', ['int']],
                'dpfj_create_fmd_from_fid': ['int', ['int', 'pointer', 'int', 'int', 'pointer', 'pointer']],
                'dpfj_add_to_enrollment': ['int', ['int', 'pointer', 'int', 'int']],
                'dpfj_create_enrollment_fmd': ['int', ['pointer', 'pointer']],
                'dpfj_compare': ['int', ['int', 'pointer', 'int', 'int', 'int', 'pointer', 'int', 'int', 'pointer']],
                'dpfj_identify': ['int', ['int', 'pointer', 'int', 'int', 'int', 'int', 'pointer', 'pointer', 'int', 'pointer', 'pointer']],
                'dpfj_finish_enrollment': ['int', []]
            }))
        } catch (err) {
            reject(err);
        }
    });
}