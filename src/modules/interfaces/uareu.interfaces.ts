import { DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC_TYPE, DPFPDD_PRIORITY_TYPE, DPFPDD_LED_ID_TYPE, DPFPDD_LED_MODE_TYPE_TYPE, DPFPDD_LED_CMD_TYPE_TYPE, DPFPDD_PARMID_TYPE, DPFJ_ENGINE_TYPE, DPFJ_ENGINE_TYPE_TYPE, DPFJ_FMD_FORMAT_TYPE } from './../handlers/types/constant/constant.handler';

export interface IdentifyResult {
    index: number | string;
};

export interface CompareResult {
    result: 'MATCH' | 'DONT MATCH';
    score: number;
};

export interface BaseResultStruct {
    callbackRet: number;
    readableRet: string;
};

export interface LoadLibsFunc {
    (dpfpddLibPath?: string, dpfjLibPath?: string): Promise<number>;
};

export interface DpfpddVerInfoStruct {
    major: number;
    minor: number;
    maintenance: number;
};

export interface DpfppdVersionStruct extends BaseResultStruct {
    size: number;
    lib_ver: DpfpddVerInfoStruct;
    api_ver: DpfpddVerInfoStruct;
};

export interface DpfppdVersionFunc {
    (): Promise<DpfppdVersionStruct>;
};

export interface DpfppdInitStruct extends BaseResultStruct { };

export interface DpfppdInitFunc {
    (): Promise<DpfppdInitStruct>;
};

export interface DpfppdExitStruct extends BaseResultStruct { };

export interface DpfppdExitFunc {
    (): Promise<DpfppdExitStruct>;
};

export interface DpfpddHwDescrStruct {
    vendorName: string;
    productName: string;
    serialNum: string;
};

export interface DpfpddHwIdStruct {
    vendorId: number;
    productId: number;
};

export interface DpfpddHwVersionStruct {
    hwVer: DpfpddVerInfoStruct;
    fwVer: DpfpddVerInfoStruct;
    bcdVer: number;
};

export interface ReaderStruct {
    size: number;
    name: string;
    dpfpddHwDescr: DpfpddHwDescrStruct;
    dpfpddHwId: DpfpddHwIdStruct;
    dpfpddHwVersion: DpfpddHwVersionStruct;
    modality: string;
    technology: string;
    data: any;
};

export interface DpfppdQueryDevicesStruct extends BaseResultStruct {
    devicesNumber: number;
    devicesList: ReaderStruct[];
};

export interface DpfppdQueryDevicesFunc {
    (): Promise<DpfppdQueryDevicesStruct>;
};

export interface DpfppdOpenStruct extends BaseResultStruct {
    readerName: string;
    readerHandle: any;
};

export interface DpfppdOpenFunc {
    (reader: ReaderStruct): Promise<DpfppdOpenStruct>;
};

export interface DpfppdOpenExtStruct extends BaseResultStruct {
    readerName: string;
    readerHandle: any;
    readerPriority: string;
};

export interface DpfppdOpenExtFunc {
    (
        reader: ReaderStruct,
        priority: DPFPDD_PRIORITY_TYPE
    ): Promise<DpfppdOpenExtStruct>;
};

export interface DpfppdCloseStruct extends BaseResultStruct { };

export interface DpfppdCloseFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdCloseStruct>;
};

export interface DpfpddDevStatusStruct {
    size: number;
    status: string;
    fingerDetected: number;
    data: string;
};

export interface DpfppdGetDeviceStatusStruct extends BaseResultStruct {
    deviceStatus: DpfpddDevStatusStruct;
};

export interface DpfppdGetDeviceStatusFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceStatusStruct>;
};

export interface DpfpddDevCapsStruct {
    size: number,
    canCaptureImage: number,
    canStreamImage: number,
    canExtractFeatures: number,
    canMatch: number,
    canIdentify: number,
    hasFpStorage: number,
    indicatorType: number,
    hasPwrMgmt: number,
    hasCalibration: number,
    pivCompliant: number,
    resolutionCnt: number,
    resolutions: number[]
};

export interface DpfppdGetDeviceCapabilitiesStruct extends BaseResultStruct {
    deviceCaps: DpfpddDevCapsStruct;
};

export interface DpfppdGetDeviceCapabilitiesFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceCapabilitiesStruct>;
};

export interface DpfpddCaptureParamStruct {
    size: number;
    imageFmt: string;
    imageProc: string;
    imageRes: number;
};

export interface DpfpddImageInfoStruct {
    size: number;
    width: number;
    height: number;
    res: number;
    bpp: number;
};

export interface DpfpddCaptureResultStruct {
    size: number;
    success: number;
    quality: string;
    score: number;
    info: DpfpddImageInfoStruct;
};

export interface DpfpddCaptureStruct extends BaseResultStruct {
    captureParam: DpfpddCaptureParamStruct;
    captureResult: DpfpddCaptureResultStruct;
};

export interface DpfpddCaptureFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        imageFmt: DPFPDD_IMAGE_FMT_TYPE,
        imageProc: DPFPDD_IMAGE_PROC_TYPE,
        timeout: number
    ): Promise<DpfpddCaptureStruct>;
};

export interface DpfpddCaptureCallbackData0 {
    size: number;
    error: number;
    captureParm: DpfpddCaptureParamStruct;
    captureResult: DpfpddCaptureResultStruct;
    imageSize: number;
    imageData: Buffer;
    data: any;
}

export interface DpfpddCaptureCallbackFunc {
    (imageData: DpfpddCaptureCallbackData0, imageDataSize: number): void;
};

export interface DpfpddCaptureAsyncStruct extends BaseResultStruct {
    captureParam: DpfpddCaptureParamStruct;
};

export interface DpfpddCaptureAsyncFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        imageFmt: DPFPDD_IMAGE_FMT_TYPE,
        imageProc: DPFPDD_IMAGE_PROC_TYPE,
        callback: DpfpddCaptureCallbackFunc
    ): Promise<DpfpddCaptureAsyncStruct>;
};

export interface DpfpddCancelStruct extends BaseResultStruct { };

export interface DpfpddCancelFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfpddCancelStruct>;
};

export interface DpfpddStartStreamStruct extends BaseResultStruct { };

export interface DpfpddStartStreamFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfpddStartStreamStruct>;
};

export interface DpfpddStopStreamStruct extends BaseResultStruct { };

export interface DpfpddStopStreamFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfpddStopStreamStruct>;
};

export interface DpfpddGetStreamImageStruct extends BaseResultStruct {
    captureParam: DpfpddCaptureParamStruct;
    captureResult: DpfpddCaptureResultStruct;
};

export interface DpfpddGetStreamImageFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        imageFmt: DPFPDD_IMAGE_FMT_TYPE,
        imageProc: DPFPDD_IMAGE_PROC_TYPE
    ): Promise<DpfpddGetStreamImageStruct>;
};

export interface DpfpddResetStruct extends BaseResultStruct { };

export interface DpfpddResetFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfpddResetStruct>;
};

export interface DpfpddCalibrateStruct extends BaseResultStruct { };

export interface DpfpddCalibrateFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfpddCalibrateStruct>;
};

export interface DpfpddLedConfigStruct extends BaseResultStruct { };

export interface DpfpddLedConfigFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        ledId: DPFPDD_LED_ID_TYPE,
        ledMode: DPFPDD_LED_MODE_TYPE_TYPE,
    ): Promise<DpfpddLedConfigStruct>;
};

export interface DpfpddLedCtrlStruct extends BaseResultStruct { };

export interface DpfpddLedCtrlFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        ledId: DPFPDD_LED_ID_TYPE,
        ledMode: DPFPDD_LED_CMD_TYPE_TYPE,
    ): Promise<DpfpddLedCtrlStruct>;
};

export interface DpfpddSetParameterStruct extends BaseResultStruct { };

export interface DpfpddSetParameterFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        parmId: DPFPDD_PARMID_TYPE,
        parmBuffer: Buffer
    ): Promise<DpfpddSetParameterStruct>;
};

export interface DpfpddGetParameterStruct extends BaseResultStruct {
    paramBuffer: any;
};

export interface DpfpddGetParameterFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        parmId: DPFPDD_PARMID_TYPE,
        parmBuffer: Buffer
    ): Promise<DpfpddGetParameterStruct>;
};

export interface DpfjVerInfoStruct {
    major: number;
    minor: number;
    maintenance: number;
};

export interface DpfjVersionStruct extends BaseResultStruct {
    size: number;
    lib_ver: DpfjVerInfoStruct;
    api_ver: DpfjVerInfoStruct;
};

export interface DpfjVersionFunc {
    (): Promise<DpfjVersionStruct>;
};

export interface DpfjSelectEngineStruct extends BaseResultStruct {
    engine: string;
};

export interface DpfjSelectEngineFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        engine: DPFJ_ENGINE_TYPE_TYPE
    ): Promise<DpfjSelectEngineStruct>;
};

export interface DpfjCreateFmdFromFidStruct extends BaseResultStruct {
    size: number;
    type: string;
    typeCode: number,
    fmd: any;
};

export interface DpfjCreateFmdFromFidFunc {
    (
        captureData: DpfpddCaptureCallbackData0,
        fmdFormat: DPFJ_FMD_FORMAT_TYPE
    ): Promise<DpfjCreateFmdFromFidStruct>
};

export interface DpfjCompareStruct extends BaseResultStruct {
    resultMessage: string;
    dissimilarityScore: number;
};

export interface DpfjCompareFunc {
    (
        fmd1: DpfjCreateFmdFromFidStruct,
        fmd2: DpfjCreateFmdFromFidStruct,
    ): Promise<DpfjCompareStruct>
};

export interface DpfjIdentifyStruct extends BaseResultStruct {
    resultMessage: string;
    fmdCandidateIndex: number;
};

export interface DpfjIdentifyFunc {
    (
        fmd: DpfjCreateFmdFromFidStruct,
        fmdList: DpfjCreateFmdFromFidStruct[],
    ): Promise<DpfjIdentifyStruct>
};

export interface DpfjStartEnrollmentStruct extends BaseResultStruct {
    type: string;
    typeCode: number,
};

export interface DpfjStartEnrollmentFunc {
    (
        fmdFormat: DPFJ_FMD_FORMAT_TYPE
    ): Promise<DpfjStartEnrollmentStruct>
};

export interface DpfjAddToEnrollmentStruct extends BaseResultStruct {
    resultMessage: string;
};

export interface DpfjAddToEnrollmentFunc {
    (
        fmd: DpfjCreateFmdFromFidStruct
    ): Promise<DpfjAddToEnrollmentStruct>
};

export interface DpfjCreateEnrollmentFmdStruct extends DpfjCreateFmdFromFidStruct { };

export interface DpfjCreateEnrollmentFmdFunc {
    (): Promise<DpfjCreateEnrollmentFmdStruct>
};

export interface DpfjFinishEnrollmentStruct extends BaseResultStruct { };

export interface DpfjFinishEnrollmentFunc {
    (): Promise<DpfjFinishEnrollmentStruct>
};

export interface UareUInterface {
    loadLibs: LoadLibsFunc;
    dpfpddVersion: DpfppdVersionFunc;
    dpfpddInit: DpfppdInitFunc;
    dpfpddExit: DpfppdExitFunc;
    dpfpddQueryDevices: DpfppdQueryDevicesFunc;
    dpfpddOpen: DpfppdOpenFunc;
    dpfpddOpenExt: DpfppdOpenExtFunc;
    dpfpddClose: DpfppdCloseFunc;
    dpfpddGetDeviceStatus: DpfppdGetDeviceStatusFunc;
    dpfpddGetDeviceCapabilities: DpfppdGetDeviceCapabilitiesFunc;
    dpfpddCapture: DpfpddCaptureFunc;
    dpfpddCaptureAsync: DpfpddCaptureAsyncFunc;
    dpfpddCancel: DpfpddCancelFunc;
    dpfpddStartStream: DpfpddStartStreamFunc;
    dpfpddStopStream: DpfpddStopStreamFunc;
    dpfpddGetStreamImage: DpfpddGetStreamImageFunc;
    dpfpddReset: DpfpddResetFunc;
    dpfpddCalibrate: DpfpddCalibrateFunc;
    dpfpddLedConfig: DpfpddLedConfigFunc;
    dpfpddLedCtrl: DpfpddLedCtrlFunc;
    dpfpddSetParameter: DpfpddSetParameterFunc;
    dpfpddGetParameter: DpfpddGetParameterFunc;
    dpfjVersion: DpfjVersionFunc;
    dpfjSelectEngine: DpfjSelectEngineFunc;
    // dpfjCreateFmdFromRaw: DpfjCreateFmdFromRawFunc;
    dpfjCreateFmdFromFid: DpfjCreateFmdFromFidFunc;
    dpfjCompare: DpfjCompareFunc;
    dpfjIdentify: DpfjIdentifyFunc;
    dpfjStartEnrollment: DpfjStartEnrollmentFunc;
    dpfjAddToEnrollment: DpfjAddToEnrollmentFunc;
    dpfjCreateEnrollmentFmd: DpfjCreateEnrollmentFmdFunc;
    dpfjFinishEnrollment: DpfjFinishEnrollmentFunc;
};