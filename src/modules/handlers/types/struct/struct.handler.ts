import { charArray, uCharArray, uIntArray } from '../array/array.handler';
import {
    MAX_STR_LENGTH,
    MAX_DEVICE_NAME_LENGTH,
    DPFPDD_STATUS,
    DPFPDD_HW_MODALITY,
    DPFPDD_HW_TECHNOLOGY,
    DPFPDD_IMAGE_FMT,
    DPFPDD_IMAGE_PROC,
    DPFPDD_QUALITY,
    DPFJ_FINGER_POSITION,
    DPFJ_SCAN_TYPE
} from '../constant/constant.handler';
import * as ref from 'ref-napi';
import * as Struct from 'ref-struct-napi';

export const dpfpdd_ver_info = Struct({
    major: ref.types.int,
    minor: ref.types.int,
    maintenance: ref.types.int
});

export const dpfpdd_version = Struct({
    size: ref.types.uint,
    lib_ver: dpfpdd_ver_info,
    api_ver: dpfpdd_ver_info
});

export const dpfj_ver_info = Struct({
    major: ref.types.int,
    minor: ref.types.int,
    maintenance: ref.types.int
});

export const dpfj_version = Struct({
    size: ref.types.uint,
    lib_ver: dpfj_ver_info,
    api_ver: dpfj_ver_info
});

export const dpfpdd_hw_descr = Struct({
    vendor_name: charArray(MAX_STR_LENGTH),
    product_name: charArray(MAX_STR_LENGTH),
    serial_num: charArray(MAX_STR_LENGTH)
});

export const dpfpdd_hw_id = Struct({
    vendor_id: ref.types.short,
    product_id: ref.types.short,
});

export const dpfpdd_hw_version = Struct({
    hw_ver: dpfpdd_ver_info,
    fw_ver: dpfpdd_ver_info,
    bcd_rev: ref.types.short,
});

export const dpfpdd_dev_info = Struct({
    size: ref.types.uint,
    name: charArray(MAX_DEVICE_NAME_LENGTH),
    descr: dpfpdd_hw_descr,
    id: dpfpdd_hw_id,
    ver: dpfpdd_hw_version,
    modality: DPFPDD_HW_MODALITY.type,
    technology: DPFPDD_HW_TECHNOLOGY.type
});

export const dpfpdd_dev_caps = Struct({
    size: ref.types.uint,
    can_capture_image: ref.types.int,
    can_stream_image: ref.types.int,
    can_extract_features: ref.types.int,
    can_match: ref.types.int,
    can_identify: ref.types.int,
    has_fp_storage: ref.types.int,
    indicator_type: ref.types.uint,
    has_pwr_mgmt: ref.types.int,
    has_calibration: ref.types.int,
    piv_compliant: ref.types.int,
    resolution_cnt: ref.types.uint,
    resolutions: uIntArray(1)
});

export const dpfpdd_dev_status = Struct({
    size: ref.types.uint,
    status: DPFPDD_STATUS.type,
    finger_detected: ref.types.int,
    data: uCharArray(1)
});

export const dpfpdd_capture_param = Struct({
    size: ref.types.uint,
    image_fmt: DPFPDD_IMAGE_FMT.type,
    image_proc: DPFPDD_IMAGE_PROC.type,
    image_res: ref.types.uint,
});

export const dpfpdd_image_info = Struct({
    size: ref.types.uint,
    width: ref.types.uint,
    height: ref.types.uint,
    res: ref.types.uint,
    bpp: ref.types.uint,
});

export const dpfpdd_capture_result = Struct({
    size: ref.types.uint,
    success: ref.types.int,
    quality: DPFPDD_QUALITY.type,
    score: ref.types.uint,
    info: dpfpdd_image_info
});

export const dpfpdd_capture_callback_data_0 = Struct({
    size: ref.types.uint,
    error: ref.types.int,
    capture_parm: dpfpdd_capture_param,
    capture_result: dpfpdd_capture_result,
    image_size: ref.types.uint,
    image_data: 'char *'
});

export const dpfpdd_iomap = Struct({
    addr: ref.types.ushort,
    len: ref.types.ushort,
    buff: uCharArray(1)
});

export const dpfj_candidate = Struct({
    size: ref.types.uint,
    fmd_idx: ref.types.uint,
    view_idx: ref.types.uint
});

export const dpfj_fid_record_params = Struct({
    record_length: ref.types.uint,
    cbeff_id: ref.types.uint,
    capture_device_id: ref.types.uint,
    acquisition_level: ref.types.uint,
    finger_cnt: ref.types.uint,
    scale_units: ref.types.uint,
    scan_res: ref.types.uint,
    image_res: ref.types.uint,
    bpp: ref.types.uint,
    compression: ref.types.uint
});

export const dpfj_fid_view_params = Struct({
    data_length: ref.types.uint,
    finger_position: DPFJ_FINGER_POSITION.type,
    view_cnt: ref.types.uint,
    view_number: ref.types.uint,
    quality: ref.types.uint,
    impression_type: DPFJ_SCAN_TYPE.type,
    width: ref.types.uint,
    height: ref.types.uint,
    view_data: ref.types.char
});

export const dpfj_fmd_record_params = Struct({
    record_length: ref.types.uint,
    cbeff_id: ref.types.uint,
    capture_equipment_comp: ref.types.uint,
    capture_equipment_id: ref.types.uint,
    width: ref.types.uint,
    height: ref.types.uint,
    resolution: ref.types.uint,
    view_cnt: ref.types.uint
});

export const dpfj_fmd_view_params = Struct({
    finger_position: DPFJ_FINGER_POSITION.type,
    view_number: ref.types.uint,
    impression_type: DPFJ_SCAN_TYPE.type,
    quality: ref.types.uint,
    minutia_cnt: ref.types.uint,
    ext_block_length: ref.types.uint,
    ext_block: ref.types.uchar,
});
