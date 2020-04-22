import {
    MAX_STR_LENGTH,
    MAX_DEVICE_NAME_LENGTH,
    DPFJ_PROBABILITY_ONE,
    DPFPDD_DEV,
    DPFJ_DEV,
    DPFPDD_HW_MODALITY,
    DPFPDD_HW_TECHNOLOGY,
    DPFPDD_PRIORITY,
    DPFPDD_STATUS,
    DPFPDD_QUALITY,
    DPFPDD_IMAGE_FMT,
    DPFPDD_IMAGE_PROC,
    DPFPDD_IMG_PROC_NONE,
    DPFPDD_LED_ID,
    DPFPDD_LED_MODE_TYPE,
    DPFPDD_LED_CMD_TYPE,
    DPFPDD_PARMID,
    DPFPDD_PARMID_SPOOFDETECT_ENABLE,
    DPFJ_FID_FORMAT,
    DPFJ_FMD_FORMAT,
    DPFJ_FINGER_POSITION,
    DPFJ_SCAN_TYPE,
    DPFJ_ENGINE_TYPE,
    MAX_FMD_SIZE,
} from '../../../../../src/modules/handlers/types/constant/constant.handler';

test('Get value from MAX_STR_LENGTH constant', () => {
    expect(MAX_STR_LENGTH).toBe(128);
});

test('Get value from MAX_DEVICE_NAME_LENGTH constant', () => {
    expect(MAX_DEVICE_NAME_LENGTH).toBe(1024);
});

test('Get value from DPFJ_PROBABILITY_ONE constant', () => {
    expect(DPFJ_PROBABILITY_ONE).toBe(0x7fffffff);
});

test('Get type from DPFPDD_DEV constant', () => {
    expect(DPFPDD_DEV.type).toBe('void *');
});

test('Get value from DPFJ_DEV constant', () => {
    expect(DPFJ_DEV.type).toBe('void *');
});

test('Get value from DPFPDD_HW_MODALITY constant', () => {
    expect(DPFPDD_HW_MODALITY.DPFPDD_HW_MODALITY_UNKNOWN).toBe(0);
});

test('Get value from DPFPDD_HW_TECHNOLOGY constant', () => {
    expect(DPFPDD_HW_TECHNOLOGY.DP_HW_TECHNOLOGY_PRESSURE).toBe(4);
});

test('Get value from DPFPDD_PRIORITY constant', () => {
    expect(DPFPDD_PRIORITY.DPFPDD_PRIORITY_EXCLUSIVE).toBe(4);
});

test('Get value from DPFPDD_STATUS constant', () => {
    expect(DPFPDD_STATUS.DPFPDD_STATUS_NEED_CALIBRATION).toBe(2);
});

test('Get value from DPFPDD_QUALITY constant', () => {
    expect(DPFPDD_QUALITY.DPFPDD_QUALITY_SCAN_SKEWED).toBe((1 << 9));
});

test('Get value from DPFPDD_IMAGE_FMT constant', () => {
    expect(DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381).toBe(0x001B0401);
});

test('Get value from DPFPDD_IMAGE_PROC constant', () => {
    expect(DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV).toBe(1);
});

test('Get value from DPFPDD_IMG_PROC_NONE constant', () => {
    expect(DPFPDD_IMG_PROC_NONE).toBe(DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT);
});

test('Get value from DPFPDD_LED_ID constant', () => {
    expect(DPFPDD_LED_ID.DPFPDD_LED_FINGER_DETECT).toBe(0x10);
});

test('Get value from DPFPDD_LED_MODE_TYPE constant', () => {
    expect(DPFPDD_LED_MODE_TYPE.DPFPDD_LED_CLIENT).toBe(2);
});

test('Get value from DPFPDD_LED_CMD_TYPE constant', () => {
    expect(DPFPDD_LED_CMD_TYPE.DPFPDD_LED_CMD_ON).toBe(1);
});

test('Get value from DPFPDD_PARMID constant', () => {
    expect(DPFPDD_PARMID.DPFPDD_PARMID_PAD_DP_ENABLE).toBe(0x201);
});

test('Get value from DPFPDD_PARMID_SPOOFDETECT_ENABLE constant', () => {
    expect(DPFPDD_PARMID_SPOOFDETECT_ENABLE).toBe(DPFPDD_PARMID.DPFPDD_PARMID_PAD_DP_ENABLE);
});

test('Get value from DPFJ_FID_FORMAT constant', () => {
    expect(DPFJ_FID_FORMAT.DPFJ_FID_ANSI_381_2004).toBe(0x001B0401);
});

test('Get value from DPFJ_FMD_FORMAT constant', () => {
    expect(DPFJ_FMD_FORMAT.DPFJ_FMD_ISO_19794_2_2005).toBe(0x01010001);
});

test('Get value from DPFJ_FINGER_POSITION constant', () => {
    expect(DPFJ_FINGER_POSITION.DPFJ_POSITION_RINDEX).toBe(2);
});

test('Get value from DPFJ_SCAN_TYPE constant', () => {
    expect(DPFJ_SCAN_TYPE.DPFJ_SCAN_NONLIVE_ROLLED).toBe(3);
});

test('Get value from DPFJ_ENGINE_TYPE constant', () => {
    expect(DPFJ_ENGINE_TYPE.DPFJ_ENGINE_DPFJ7).toBe(2);
});

test('Get value from MAX_FMD_SIZE constant', () => {
    expect(MAX_FMD_SIZE).toBe(1562);
});
