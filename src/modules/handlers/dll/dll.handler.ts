import { DPFPDD_PRIORITY, DPFPDD_LED_ID, DPFPDD_LED_MODE_TYPE, DPFPDD_LED_CMD_TYPE, DPFPDD_PARMID, DPFJ_DEV, DPFJ_ENGINE_TYPE, DPFJ_FINGER_POSITION, DPFJ_FMD_FORMAT, DPFJ_FID_FORMAT } from './../types/constant/constant.handler';
import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';
import DllHandlerInterface from './dll.interface';

export default class DllHandler implements DllHandlerInterface {
    public loadDpfppdFrom = (path?: string) => new Promise<any>((resolve, reject) => {
        try {
            resolve(ffi.Library(path ?? 'bin/dpfpdd', {
                'dpfpdd_version': [ref.types.int, ['pointer']],
                'dpfpdd_init': [ref.types.int, []],
                'dpfpdd_exit': [ref.types.int, []],
                'dpfpdd_query_devices': [ref.types.int, ['pointer', 'pointer']],
                'dpfpdd_open': [ref.types.int, ['pointer', 'pointer']],
                'dpfpdd_open_ext': [ref.types.int, ['pointer', DPFPDD_PRIORITY.type, 'pointer']],
                'dpfpdd_close': [ref.types.int, ['pointer']],
                'dpfpdd_get_device_status': [ref.types.int, ['pointer', 'pointer']],
                'dpfpdd_get_device_capabilities': [ref.types.int, ['pointer', 'pointer']],
                'dpfpdd_capture': [ref.types.int, ['pointer', 'pointer', ref.types.uint, 'pointer', 'pointer', 'pointer']],
                'dpfpdd_capture_async': [ref.types.int, ['pointer', 'pointer', 'pointer', 'pointer']],
                'dpfpdd_cancel': [ref.types.int, ['pointer']],
                'dpfpdd_start_stream': [ref.types.int, ['pointer']],
                'dpfpdd_stop_stream': [ref.types.int, ['pointer']],
                'dpfpdd_get_stream_image': [ref.types.int, ['pointer', 'pointer', 'pointer', 'pointer', 'pointer']],
                'dpfpdd_reset': [ref.types.int, ['pointer']],
                'dpfpdd_calibrate': [ref.types.int, ['pointer']],
                'dpfpdd_led_config': [ref.types.int, ['pointer', DPFPDD_LED_ID.type, DPFPDD_LED_MODE_TYPE.type, 'pointer']],
                'dpfpdd_led_ctrl': [ref.types.int, ['pointer', DPFPDD_LED_ID.type, DPFPDD_LED_CMD_TYPE.type]],
                'dpfpdd_set_parameter': [ref.types.int, ['pointer', DPFPDD_PARMID.type, ref.types.int, 'pointer']],
                'dpfpdd_get_parameter': [ref.types.int, ['pointer', DPFPDD_PARMID.type, ref.types.int, 'pointer']],
            }));
        } catch (err) {
            reject(err);
        }
    });

    public loadDpfjFrom = (path?: string) => new Promise<any>((resolve, reject) => {
        try {
            resolve(ffi.Library(path ?? 'bin/dpfj', {
                'dpfj_version': [ref.types.int, ['pointer']],
                'dpfj_select_engine': [ref.types.int, [DPFJ_DEV.type, DPFJ_ENGINE_TYPE.type]],
                'dpfj_create_fmd_from_raw': [ref.types.int, ['pointer', ref.types.int, ref.types.int, ref.types.int, ref.types.int, DPFJ_FINGER_POSITION.type, ref.types.int, DPFJ_FMD_FORMAT.type, 'pointer', 'pointer']],
                'dpfj_create_fmd_from_fid': [ref.types.int, [ref.types.int, 'pointer', ref.types.int, ref.types.int, 'pointer', 'pointer']],
                'dpfj_compare': [ref.types.int, [ref.types.int, 'pointer', ref.types.int, ref.types.int, ref.types.int, 'pointer', ref.types.int, ref.types.int, 'pointer']],
                'dpfj_identify': [ref.types.int, [ref.types.int, 'pointer', ref.types.int, ref.types.int, ref.types.int, ref.types.int, 'pointer', 'pointer', ref.types.int, 'pointer', 'pointer']],
                'dpfj_start_enrollment': [ref.types.int, [DPFJ_FMD_FORMAT.type]],
                'dpfj_add_to_enrollment': [ref.types.int, [ref.types.int, 'pointer', ref.types.int, ref.types.int]],
                'dpfj_create_enrollment_fmd': [ref.types.int, ['pointer', 'pointer']],
                'dpfj_finish_enrollment': [ref.types.int, []],
                'dpfj_fmd_convert': [ref.types.int, [DPFJ_FMD_FORMAT.type, 'pointer', ref.types.int, DPFJ_FMD_FORMAT.type, 'pointer', 'pointer']],
                'dpfj_dp_fid_convert': [ref.types.int, ['pointer', ref.types.int, DPFJ_FID_FORMAT.type, ref.types.int, ref.types.int, 'pointer', 'pointer']],
                'dpfj_raw_convert': [ref.types.int, ['pointer', ref.types.int, ref.types.int, ref.types.int, ref.types.int, DPFJ_FINGER_POSITION.type, ref.types.int, DPFJ_FID_FORMAT.type, ref.types.int, ref.types.int, 'pointer', 'pointer']],
                'dpfj_get_fid_record_params': [ref.types.void, [DPFJ_FID_FORMAT.type, 'pointer', 'pointer']],
                'dpfj_set_fid_record_params': [ref.types.void, ['pointer', DPFJ_FID_FORMAT.type, 'pointer']],
                'dpfj_get_fid_view_offset': [ref.types.uint, [DPFJ_FID_FORMAT.type, 'pointer', ref.types.int]],
                'dpfj_get_fid_view_params': [ref.types.void, ['pointer', 'pointer']],
                'dpfj_set_fid_view_params': [ref.types.void, ['pointer', 'pointer']],
                'dpfj_get_fmd_record_params': [ref.types.void, [DPFJ_FMD_FORMAT.type, 'pointer', 'pointer']],
                'dpfj_set_fmd_record_params': [ref.types.void, ['pointer', DPFJ_FMD_FORMAT.type, 'pointer']],
                'dpfj_get_fmd_view_offset': [ref.types.uint, [DPFJ_FMD_FORMAT.type, 'pointer', ref.types.int]],
                'dpfj_get_fmd_view_params': [ref.types.void, ['pointer', 'pointer']],
                'dpfj_set_fmd_view_params': [ref.types.void, ['pointer', 'pointer']],
            }));
        } catch (err) {
            reject(err);
        }
    });
}