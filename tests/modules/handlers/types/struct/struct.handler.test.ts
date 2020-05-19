import {
    dpfpdd_ver_info,
    dpfj_ver_info,
    dpfpdd_version,
    dpfj_version,
    dpfpdd_hw_descr,
    dpfpdd_hw_id,
    dpfpdd_hw_version,
    dpfpdd_dev_info,
    dpfpdd_dev_caps,
    dpfpdd_dev_status,
    dpfpdd_capture_param,
    dpfpdd_image_info,
    dpfpdd_capture_result,
    dpfpdd_capture_callback_data_0,
    dpfpdd_iomap,
    dpfj_candidate,
    dpfj_fid_record_params,
    dpfj_fid_view_params,
    dpfj_fmd_record_params,
    dpfj_fmd_view_params
} from '../../../../../src/modules/handlers/types/struct/struct.handler';

test('Create dpfpdd_ver_info struct type', () => {
    const struct = new dpfpdd_ver_info();
    expect(struct.maintenance).toBe(0);
    expect(struct.major).toBe(0);
    expect(struct.minor).toBe(0);
});

test('Create dpfpdd_version struct type', () => {
    const struct = new dpfpdd_version();
    expect(struct.size).toBe(0);

    expect(struct.lib_ver.maintenance).toBe(0);
    expect(struct.lib_ver.major).toBe(0);
    expect(struct.lib_ver.minor).toBe(0);

    expect(struct.api_ver.maintenance).toBe(0);
    expect(struct.api_ver.major).toBe(0);
    expect(struct.api_ver.minor).toBe(0);
});

test('Create dpfj_ver_info struct type', () => {
    const struct = new dpfj_ver_info();
    expect(struct.maintenance).toBe(0);
    expect(struct.major).toBe(0);
    expect(struct.minor).toBe(0);
});

test('Create dpfj_version struct type', () => {
    const struct = new dpfj_version();
    expect(struct.size).toBe(0);

    expect(struct.lib_ver.maintenance).toBe(0);
    expect(struct.lib_ver.major).toBe(0);
    expect(struct.lib_ver.minor).toBe(0);

    expect(struct.api_ver.maintenance).toBe(0);
    expect(struct.api_ver.major).toBe(0);
    expect(struct.api_ver.minor).toBe(0);
});

test('Create dpfpdd_hw_descr struct type', () => {
    const struct = new dpfpdd_hw_descr();

    expect(struct.product_name.length).toBe(128);
    expect(struct.serial_num.length).toBe(128);
    expect(struct.vendor_name.length).toBe(128);
});

test('Create dpfpdd_hw_id struct type', () => {
    const struct = new dpfpdd_hw_id();

    expect(struct.vendor_id).toBe(0);
    expect(struct.product_id).toBe(0);
});

test('Create dpfpdd_hw_version struct type', () => {
    const struct = new dpfpdd_hw_version();

    expect(struct.hw_ver.maintenance).toBe(0);
    expect(struct.hw_ver.major).toBe(0);
    expect(struct.hw_ver.minor).toBe(0);

    expect(struct.fw_ver.maintenance).toBe(0);
    expect(struct.fw_ver.major).toBe(0);
    expect(struct.fw_ver.minor).toBe(0);

    expect(struct.bcd_rev).toBe(0);
});

test('Create dpfpdd_dev_info struct type', () => {
    const struct = new dpfpdd_dev_info();

    expect(struct.size).toBe(0);
    expect(struct.name.length).toBe(1024);

    expect(struct.descr.product_name.length).toBe(128);
    expect(struct.descr.serial_num.length).toBe(128);
    expect(struct.descr.vendor_name.length).toBe(128);

    expect(struct.id.product_id).toBe(0);
    expect(struct.id.vendor_id).toBe(0);

    expect(struct.ver.bcd_rev).toBe(0);

    expect(struct.ver.fw_ver.maintenance).toBe(0);
    expect(struct.ver.fw_ver.major).toBe(0);
    expect(struct.ver.fw_ver.minor).toBe(0);

    expect(struct.ver.hw_ver.maintenance).toBe(0);
    expect(struct.ver.hw_ver.major).toBe(0);
    expect(struct.ver.hw_ver.minor).toBe(0);

    expect(struct.modality).toBe(0);
    expect(struct.technology).toBe(0);
});

test('Create dpfpdd_dev_caps struct type', () => {
    const struct = new dpfpdd_dev_caps();

    expect(struct.size).toBe(0);
    expect(struct.can_capture_image).toBe(0);
    expect(struct.can_stream_image).toBe(0);
    expect(struct.can_extract_features).toBe(0);
    expect(struct.can_match).toBe(0);
    expect(struct.can_identify).toBe(0);
    expect(struct.has_fp_storage).toBe(0);
    expect(struct.indicator_type).toBe(0);
    expect(struct.has_pwr_mgmt).toBe(0);
    expect(struct.has_calibration).toBe(0);
    expect(struct.piv_compliant).toBe(0);
    expect(struct.resolution_cnt).toBe(0);
    expect(struct.resolutions.length).toBe(1);
});

test('Create dpfpdd_dev_status struct type', () => {
    const struct = new dpfpdd_dev_status();

    expect(struct.size).toBe(0);
    expect(struct.status).toBe(0);
    expect(struct.finger_detected).toBe(0);
    expect(struct.data.length).toBe(1);
});

test('Create dpfpdd_capture_param struct type', () => {
    const struct = new dpfpdd_capture_param();

    expect(struct.size).toBe(0);
    expect(struct.image_fmt).toBe(0);
    expect(struct.image_proc).toBe(0);
    expect(struct.image_res).toBe(0);
});

test('Create dpfpdd_image_info struct type', () => {
    const struct = new dpfpdd_image_info();

    expect(struct.size).toBe(0);
    expect(struct.width).toBe(0);
    expect(struct.height).toBe(0);
    expect(struct.res).toBe(0);
    expect(struct.bpp).toBe(0);
});

test('Create dpfpdd_capture_result struct type', () => {
    const struct = new dpfpdd_capture_result();

    expect(struct.size).toBe(0);
    expect(struct.success).toBe(0);
    expect(struct.quality).toBe(0);
    expect(struct.score).toBe(0);

    expect(struct.info.size).toBe(0);
    expect(struct.info.width).toBe(0);
    expect(struct.info.height).toBe(0);
    expect(struct.info.res).toBe(0);
    expect(struct.info.bpp).toBe(0);
});

test('Create dpfpdd_capture_callback_data_0 struct type', () => {
    const struct = new dpfpdd_capture_callback_data_0();

    expect(struct.size).toBe(0);
    expect(struct.error).toBe(0);

    expect(struct.capture_parm.size).toBe(0);
    expect(struct.capture_parm.image_fmt).toBe(0);
    expect(struct.capture_parm.image_proc).toBe(0);
    expect(struct.capture_parm.image_res).toBe(0);

    expect(struct.capture_result.size).toBe(0);
    expect(struct.capture_result.success).toBe(0);
    expect(struct.capture_result.quality).toBe(0);
    expect(struct.capture_result.score).toBe(0);

    expect(struct.capture_result.info.size).toBe(0);
    expect(struct.capture_result.info.width).toBe(0);
    expect(struct.capture_result.info.height).toBe(0);
    expect(struct.capture_result.info.res).toBe(0);
    expect(struct.capture_result.info.bpp).toBe(0);

    expect(struct.image_size).toBe(0);
    expect(struct.image_data).toMatchObject({type: { alignment: 1, name: "char"}})
});

test('Create dpfpdd_iomap struct type', () => {
    const struct = new dpfpdd_iomap();
    expect(struct.addr).toBe(0);
    expect(struct.len).toBe(0);
    expect(struct.buff.length).toBe(1);
});

test('Create dpfj_candidate struct type', () => {
    const struct = new dpfj_candidate();
    expect(struct.size).toBe(0);
    expect(struct.fmd_idx).toBe(0);
    expect(struct.view_idx).toBe(0);
});

test('Create dpfj_fid_record_params struct type', () => {
    const struct = new dpfj_fid_record_params();

    expect(struct.record_length).toBe(0);
    expect(struct.cbeff_id).toBe(0);
    expect(struct.capture_device_id).toBe(0);
    expect(struct.acquisition_level).toBe(0);
    expect(struct.finger_cnt).toBe(0);
    expect(struct.scale_units).toBe(0);
    expect(struct.scan_res).toBe(0);
    expect(struct.image_res).toBe(0);
    expect(struct.bpp).toBe(0);
    expect(struct.compression).toBe(0);
});

test('Create dpfj_fid_view_params struct type', () => {
    const struct = new dpfj_fid_view_params();

    expect(struct.data_length).toBe(0);
    expect(struct.finger_position).toBe(0);
    expect(struct.view_cnt).toBe(0);
    expect(struct.view_number).toBe(0);
    expect(struct.quality).toBe(0);
    expect(struct.impression_type).toBe(0);
    expect(struct.width).toBe(0);
    expect(struct.height).toBe(0);
    expect(struct.view_data).toBe(0);
});

test('Create dpfj_fmd_record_params struct type', () => {
    const struct = new dpfj_fmd_record_params();

    expect(struct.record_length).toBe(0);
    expect(struct.cbeff_id).toBe(0);
    expect(struct.capture_equipment_comp).toBe(0);
    expect(struct.capture_equipment_id).toBe(0);
    expect(struct.width).toBe(0);
    expect(struct.height).toBe(0);
    expect(struct.resolution).toBe(0);
    expect(struct.view_cnt).toBe(0);
});

test('Create dpfj_fmd_view_params struct type', () => {
    const struct = new dpfj_fmd_view_params();

    expect(struct.finger_position).toBe(0);
    expect(struct.view_number).toBe(0);
    expect(struct.impression_type).toBe(0);
    expect(struct.quality).toBe(0);
    expect(struct.minutia_cnt).toBe(0);
    expect(struct.ext_block_length).toBe(0);
    expect(struct.ext_block).toBe(0);
});
