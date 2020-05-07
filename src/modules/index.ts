import * as ref from 'ref-napi';
import * as ffi from 'ffi-napi';
import * as ArrayType from 'ref-array-napi';

import DllHandler from "./handlers/dll/dll.handler";
import ErrorHandler from "./handlers/error/error.handler";
import { dpfpdd_version, dpfpdd_dev_info, dpfpdd_dev_status, dpfpdd_dev_caps, dpfpdd_capture_param, dpfpdd_capture_result, dpfj_version, dpfpdd_capture_callback_data_0, dpfj_candidate, dpfj_fid_record_params, dpfj_fmd_record_params, dpfj_fmd_view_params, dpfj_fid_view_params } from "./handlers/types/struct/struct.handler";
import { genericArrayFrom } from "./handlers/types/array/array.handler";
import { DPFPDD_HW_MODALITY, DPFPDD_HW_TECHNOLOGY, DPFPDD_DEV, DPFPDD_PRIORITY, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_PROC, DPFJ_ENGINE_TYPE, DPFJ_FMD_FORMAT, MAX_FMD_SIZE, DPFJ_PROBABILITY_ONE, DPFPDD_STATUS, DPFPDD_PRIORITY_TYPE, DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC_TYPE, DPFPDD_QUALITY, DPFPDD_LED_ID_TYPE, DPFPDD_LED_CMD_TYPE_TYPE, DPFPDD_LED_MODE_TYPE_TYPE, DPFPDD_PARMID_TYPE, DPFJ_ENGINE_TYPE_TYPE, DPFJ_FMD_FORMAT_TYPE, DPFJ_FID_FORMAT_TYPE } from "./handlers/types/constant/constant.handler";
import { CompareResult, IdentifyResult, UareUInterface, DpfppdVersionStruct, DpfppdInitStruct, DpfppdExitStruct, DpfppdQueryDevicesStruct, ReaderStruct, DpfppdOpenStruct, DpfppdOpenExtStruct, DpfppdCloseStruct, DpfppdGetDeviceStatusStruct, DpfppdGetDeviceCapabilitiesStruct, DpfpddCaptureStruct, DpfpddCaptureAsyncStruct, DpfpddCaptureCallbackFunc, DpfpddCaptureCallbackData0, DpfpddCancelStruct, DpfpddStartStreamStruct, DpfpddStopStreamStruct, DpfpddGetStreamImageStruct, DpfpddResetStruct, DpfpddCalibrateStruct, DpfpddLedConfigStruct, DpfpddLedCtrlStruct, DpfpddSetParameterStruct, DpfpddGetParameterStruct, DpfjVersionStruct, DpfjSelectEngineStruct, DpfjCreateFmdFromFidStruct, DpfjCompareStruct, DpfjIdentifyStruct, DpfjStartEnrollmentStruct, DpfjAddToEnrollmentStruct, DpfjCreateEnrollmentFmdStruct, DpfjFinishEnrollmentStruct, DpfjFmdConvertStruct, DpfjGetFidRecordParamsStruct, DpfjSetFidRecordParamsStruct, DpfjFidRecordParamsStruct } from "./interfaces/uareu.interfaces";
import keyByValue from './handlers/types/constant/constant.utils';

let captureCallback: any;
export default class UareU implements UareUInterface {
    private currentEnrollmentFmdFormat: number;
    private static instance: UareU;
    private static dpfpdd: any;
    private static dpfj: any;
    private constructor() { };

    public static getInstance = (): UareU => {
        if (!UareU.instance) UareU.instance = new UareU();
        return UareU.instance;
    };

    public loadLibs = (dpfpddLibPath?: string, dpfjLibPath?: string) => new Promise<number>(async (resolve, reject) => {
        try {
            const dllHandler = new DllHandler();
            UareU.dpfpdd = await dllHandler.loadDpfppdFrom(dpfpddLibPath);
            UareU.dpfj = await dllHandler.loadDpfjFrom(dpfjLibPath);
            resolve(0);
        } catch (e) {
            reject(new ErrorHandler('Fail to load libs', e));
        }
    });

    public dpfpddVersion = () => new Promise<DpfppdVersionStruct>((resolve, reject) => {
        const ver = new dpfpdd_version;
        const res = UareU.dpfpdd.dpfpdd_version(ver.ref());
        if (res === 0) {
            const verObj = {
                callbackRet: res,
                readableRet: 'Version information was acquired.',
                size: ver.size,
                lib_ver: {
                    major: ver.lib_ver.major,
                    minor: ver.lib_ver.minor,
                    maintenance: ver.lib_ver.maintenance
                },
                api_ver: {
                    major: ver.api_ver.major,
                    minor: ver.api_ver.minor,
                    maintenance: ver.api_ver.maintenance
                }
            };
            resolve(verObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddInit = () => new Promise<DpfppdInitStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_init();
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Library was initialized.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddExit = () => new Promise<DpfppdExitStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_exit();
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Library was released.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddQueryDevices = () => new Promise<DpfppdQueryDevicesStruct>((resolve, reject) => {
        const MAX_DEVICE_NUMBER = 5;
        const devInfo = new dpfpdd_dev_info;
        const devInfoSize = devInfo.ref().buffer.byteLength;
        const dev_infos = genericArrayFrom(dpfpdd_dev_info, MAX_DEVICE_NUMBER);
        const devCnt = Buffer.alloc(ref.types.uint.size, MAX_DEVICE_NUMBER);
        const res = UareU.dpfpdd.dpfpdd_query_devices(devCnt, dev_infos);
        if (res === 0) {
            const resObj: DpfppdQueryDevicesStruct = {
                callbackRet: res,
                readableRet: 'Information about connected readers obtained.',
                devicesNumber: devCnt.readInt8(),
                devicesList: [],
            }

            for (let i: number = 1; i <= devCnt.readInt8(); i++) {
                const device = new dpfpdd_dev_info(ref.reinterpret(dev_infos, devInfoSize, ((i - 1) * devInfoSize)));
                const deviceObj: ReaderStruct = {
                    size: device.size,
                    name: device.name.buffer.toString().replace(/\0/g, '').trim(),
                    dpfpddHwDescr: {
                        vendorName: device.descr.vendor_name.buffer.toString().replace(/\0/g, '').trim(),
                        productName: device.descr.product_name.buffer.toString().replace(/\0/g, '').trim(),
                        serialNum: device.descr.serial_num.buffer.toString().replace(/\0/g, '').trim(),
                    },
                    dpfpddHwId: {
                        vendorId: device.id.vendor_id,
                        productId: device.id.product_id
                    },
                    dpfpddHwVersion: {
                        hwVer: {
                            major: device.ver.hw_ver.major,
                            minor: device.ver.hw_ver.minor,
                            maintenance: device.ver.hw_ver.maintenance
                        },
                        fwVer: {
                            major: device.ver.fw_ver.major,
                            minor: device.ver.fw_ver.minor,
                            maintenance: device.ver.fw_ver.maintenance
                        },
                        bcdVer: device.ver.bcd_ver
                    },
                    modality: keyByValue(DPFPDD_HW_MODALITY, device.modality)!,
                    technology: keyByValue(DPFPDD_HW_TECHNOLOGY, device.modality)!,
                    data: device,
                };
                resObj.devicesList.push(deviceObj);
            }

            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddOpen = (readerInfo: ReaderStruct) => new Promise<DpfppdOpenStruct>((resolve, reject) => {
        const name = readerInfo.data.name.buffer;
        const reader = ref.alloc(DPFPDD_DEV.type.toString());
        const res = UareU.dpfpdd.dpfpdd_open(name, reader);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'A valid reader handle is in the readerHandle.',
                readerName: readerInfo.name,
                readerHandle: reader
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddOpenExt = (readerInfo: ReaderStruct, priority: DPFPDD_PRIORITY_TYPE) => new Promise<DpfppdOpenExtStruct>((resolve, reject) => {
        const name = readerInfo.data.name.buffer;
        const reader = ref.alloc(DPFPDD_DEV.type.toString());
        const res = UareU.dpfpdd.dpfpdd_open_ext(name, priority, reader);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'A valid reader handle is in the readerHandle.',
                readerName: readerInfo.name,
                readerHandle: reader,
                readerPriority: keyByValue(DPFPDD_PRIORITY, priority)!
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddClose = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfppdCloseStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_close(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Reader closed, handle released.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetDeviceStatus = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfppdGetDeviceStatusStruct>((resolve, reject) => {
        const devStatus = new dpfpdd_dev_status;
        const res = UareU.dpfpdd.dpfpdd_get_device_status(ref.deref(readerHandle), devStatus.ref());
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Reader status obtained.',
                deviceStatus: {
                    size: devStatus.size,
                    status: keyByValue(DPFPDD_STATUS, devStatus.status)!,
                    fingerDetected: devStatus.finger_detected,
                    data: devStatus.data
                }
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetDeviceCapabilities = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfppdGetDeviceCapabilitiesStruct>((resolve, reject) => {
        const devCaps = new dpfpdd_dev_caps;
        const res = UareU.dpfpdd.dpfpdd_get_device_capabilities(ref.deref(readerHandle), devCaps.ref());
        if (res === 0) {
            resolve(devCaps);
        } else {
            const errorCode = res.toString(16).slice(-3);
            if (errorCode === '00d') {
                const res = UareU.dpfpdd.dpfpdd_get_device_capabilities(ref.deref(readerHandle), devCaps.ref());
                if (res === 0) {
                    const resObj = {
                        callbackRet: res,
                        readableRet: 'Reader capabilities obtained.',
                        deviceCaps: {
                            size: devCaps.size,
                            canCaptureImage: devCaps.can_capture_image,
                            canStreamImage: devCaps.can_stream_image,
                            canExtractFeatures: devCaps.can_extract_features,
                            canMatch: devCaps.can_match,
                            canIdentify: devCaps.can_identify,
                            hasFpStorage: devCaps.has_fp_storage,
                            indicatorType: devCaps.indicator_type,
                            hasPwrMgmt: devCaps.has_pwr_mgmt,
                            hasCalibration: devCaps.has_calibration,
                            pivCompliant: devCaps.piv_compliant,
                            resolutionCnt: devCaps.resolution_cnt,
                            resolutions: devCaps.resolutions.buffer.readUIntLE(0, ref.types.uint.size)
                        }
                    }
                    resolve(resObj);
                } else {
                    reject(new ErrorHandler(res));
                }
            } else {
                reject(new ErrorHandler(res));
            }
        }
    });

    public dpfpddCapture = (readerInfo: DpfppdOpenStruct | DpfppdOpenExtStruct, imageFmt: DPFPDD_IMAGE_FMT_TYPE, imageProc: DPFPDD_IMAGE_PROC_TYPE, timeout: number = 5000) => new Promise<DpfpddCaptureStruct>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(readerInfo).then((readerCaps) => {
            const IMAGE_DATA_SIZE = 2048;
            const captureResult = new dpfpdd_capture_result;
            const captureParam = new dpfpdd_capture_param;
            const imgSize = ref.alloc(ref.types.uint, IMAGE_DATA_SIZE);
            const imgData = Buffer.alloc(IMAGE_DATA_SIZE);
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = readerCaps.deviceCaps.resolutions;
            const res = UareU.dpfpdd.dpfpdd_capture(ref.deref(readerInfo.readerHandle), captureParam.ref(), timeout, captureResult.ref(), imgSize, imgData);
            if (res === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Image captured. Extended result is in captureResult.',
                    captureParam: {
                        size: captureParam.size,
                        imageFmt: captureParam.image_fmt,
                        imageProc: captureParam.image_proc,
                        imageRes: captureParam.image_res
                    },
                    captureResult: {
                        size: captureResult.size,
                        success: captureResult.success,
                        quality: captureResult.quality,
                        score: captureResult.score,
                        info: {
                            size: captureResult.info.size,
                            width: captureResult.info.width,
                            height: captureResult.info.height,
                            res: captureResult.info.res,
                            bpp: captureResult.info.bpp
                        }
                    }
                }
                resolve(resObj);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddCaptureAsync = (readerInfo: DpfppdOpenStruct | DpfppdOpenExtStruct, imageFmt: DPFPDD_IMAGE_FMT_TYPE, imageProc: DPFPDD_IMAGE_PROC_TYPE, callback: DpfpddCaptureCallbackFunc) => new Promise<DpfpddCaptureAsyncStruct>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(readerInfo).then((readerCaps) => {
            captureCallback = ffi.Callback('void', ['pointer', 'int', 'int', 'pointer'], (ctx: any, rsv: number, dtSize: number, dt: any) => {
                const dtReinterpreted = new dpfpdd_capture_callback_data_0(ref.reinterpret(dt, dtSize));
                const dtObj = {
                    size: dtReinterpreted.size,
                    error: dtReinterpreted.error,
                    captureParm: {
                        size: dtReinterpreted.capture_parm.size,
                        imageFmt: keyByValue(DPFPDD_IMAGE_FMT, dtReinterpreted.capture_parm.image_fmt)!,
                        imageProc: keyByValue(DPFPDD_IMAGE_PROC, dtReinterpreted.capture_parm.image_proc)!,
                        imageRes: dtReinterpreted.capture_parm.image_res
                    },
                    captureResult: {
                        size: dtReinterpreted.capture_result.size,
                        success: dtReinterpreted.capture_result.success,
                        quality: keyByValue(DPFPDD_QUALITY, dtReinterpreted.capture_result.quality)!,
                        score: dtReinterpreted.capture_result.score,
                        info: {
                            size: dtReinterpreted.capture_result.info.size,
                            width: dtReinterpreted.capture_result.info.width,
                            height: dtReinterpreted.capture_result.info.height,
                            res: dtReinterpreted.capture_result.info.res,
                            bpp: dtReinterpreted.capture_result.info.bpp
                        }
                    },
                    imageSize: dtReinterpreted.image_size,
                    imageData: dtReinterpreted.image_data,
                    data: dtReinterpreted
                }
                callback(dtObj, dtSize);
            });
            const context = ref.alloc('void *');
            const captureParam = new dpfpdd_capture_param;
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = readerCaps.deviceCaps.resolutions;
            const res = UareU.dpfpdd.dpfpdd_capture_async(ref.deref(readerInfo.readerHandle), captureParam.ref(), context, captureCallback);
            if (res === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Async capture started, put your finger on reader and the callback function will receive the data.',
                    captureParam: {
                        size: captureParam.size,
                        imageFmt: keyByValue(DPFPDD_IMAGE_FMT, captureParam.image_fmt)!,
                        imageProc: keyByValue(DPFPDD_IMAGE_PROC, captureParam.image_proc)!,
                        imageRes: captureParam.image_res
                    }
                }
                resolve(resObj);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddCancel = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfpddCancelStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_cancel(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Capture canceled.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStartStream = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfpddStartStreamStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_start_stream(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Reader put into streaming mode.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStopStream = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfpddStopStreamStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_stop_stream(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Streaming was stopped.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetStreamImage = (readerInfo: DpfppdOpenStruct | DpfppdOpenExtStruct, imageFmt: DPFPDD_IMAGE_FMT_TYPE, imageProc: DPFPDD_IMAGE_PROC_TYPE) => new Promise<DpfpddGetStreamImageStruct>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(readerInfo).then((readerCaps) => {
            const IMAGE_DATA_SIZE = 2048;
            const captureResult = new dpfpdd_capture_result;
            const captureParam = new dpfpdd_capture_param;
            const imgSize = ref.alloc(ref.types.uint, IMAGE_DATA_SIZE);
            const imgData = Buffer.alloc(IMAGE_DATA_SIZE);
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = readerCaps.deviceCaps.resolutions;
            const res = UareU.dpfpdd.dpfpdd_get_stream_image(ref.deref(readerInfo.readerHandle), captureParam.ref(), captureResult.ref(), imgSize, imgData);
            if (res === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Image acquired from the stream. Extended result is in captureResult.',
                    captureParam: {
                        size: captureParam.size,
                        imageFmt: captureParam.image_fmt,
                        imageProc: captureParam.image_proc,
                        imageRes: captureParam.image_res
                    },
                    captureResult: {
                        size: captureResult.size,
                        success: captureResult.success,
                        quality: captureResult.quality,
                        score: captureResult.score,
                        info: {
                            size: captureResult.info.size,
                            width: captureResult.info.width,
                            height: captureResult.info.height,
                            res: captureResult.info.res,
                            bpp: captureResult.info.bpp
                        }
                    }
                }
                resolve(resObj);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddReset = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfpddResetStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_reset(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Reset succeeded.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddCalibrate = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct) => new Promise<DpfpddCalibrateStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_calibrate(ref.deref(readerHandle));
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Calibration succeeded.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedConfig = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct, ledId: DPFPDD_LED_ID_TYPE, ledMode: DPFPDD_LED_MODE_TYPE_TYPE) => new Promise<DpfpddLedConfigStruct>((resolve, reject) => {
        const reserved = ref.alloc('void *');
        const res = UareU.dpfpdd.dpfpdd_led_config(ref.deref(readerHandle), ledId, ledMode, reserved);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'New led config set.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedCtrl = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct, ledId: DPFPDD_LED_ID_TYPE, ledCmd: DPFPDD_LED_CMD_TYPE_TYPE) => new Promise<DpfpddLedCtrlStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_led_ctrl(ref.deref(readerHandle), ledId, ledCmd);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Led changed.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddSetParameter = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct, parmId: DPFPDD_PARMID_TYPE, parmBuffer: Buffer) => new Promise<DpfpddSetParameterStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_set_parameter(ref.deref(readerHandle), parmId, parmBuffer.length, parmBuffer);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Parameter was set.'
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetParameter = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct, parmId: DPFPDD_PARMID_TYPE, parmBuffer: Buffer) => new Promise<DpfpddGetParameterStruct>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_get_parameter(ref.deref(readerHandle), parmId, parmBuffer.length, parmBuffer);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Parameter was get.',
                paramBuffer: parmBuffer,
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjVersion = () => new Promise<DpfjVersionStruct>((resolve, reject) => {
        const ver = new dpfj_version;
        const res = UareU.dpfj.dpfj_version(dpfj_version.ref());
        if (res === 0) {
            const verObj = {
                callbackRet: res,
                readableRet: 'Version information was acquired.',
                size: ver.size,
                lib_ver: {
                    major: ver.lib_ver.major,
                    minor: ver.lib_ver.minor,
                    maintenance: ver.lib_ver.maintenance
                },
                api_ver: {
                    major: ver.api_ver.major,
                    minor: ver.api_ver.minor,
                    maintenance: ver.api_ver.maintenance
                }
            };
            resolve(verObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSelectEngine = ({ readerHandle }: DpfppdOpenStruct | DpfppdOpenExtStruct, engine: DPFJ_ENGINE_TYPE_TYPE) => new Promise<DpfjSelectEngineStruct>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_select_engine(ref.deref(readerHandle), engine);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Engine is selected.',
                engine: keyByValue(DPFJ_ENGINE_TYPE, engine)!
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    // public dpfjCreateFmdFromRaw = (imageData: any,
    //     fmdType: typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004 | typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ISO_19794_2_2005,
    //     ) => new Promise<any>((resolve, reject) => {
    //         const ver = ref.alloc(dpfj_version);
    //         const res = UareU.dpfpdd.dpfj_create_fmd_from_raw(ver);
    //         if (res === 0) {
    //             resolve(ver);
    //         } else {
    //             reject(new ErrorHandler(res));
    //         }
    //     });

    public dpfjCreateFmdFromFid = (captureData: DpfpddCaptureCallbackData0, fmdFormat: DPFJ_FMD_FORMAT_TYPE) => new Promise<DpfjCreateFmdFromFidStruct>((resolve, reject) => {
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_fmd_from_fid(captureData.data.capture_parm.image_fmt, captureData.data.image_data, captureData.data.image_size, fmdFormat, fmd, fmdSize);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'FMD was created.',
                size: ref.deref(fmdSize),
                type: keyByValue(DPFJ_FMD_FORMAT, fmdFormat)!,
                typeCode: fmdFormat,
                fmd: fmd
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCompare = (fmd1: DpfjCreateFmdFromFidStruct, fmd2: DpfjCreateFmdFromFidStruct) => new Promise<DpfjCompareStruct>((resolve, reject) => {
        const score = ref.alloc(ref.types.uint);
        const res = UareU.dpfj.dpfj_compare(fmd1.typeCode, fmd1.fmd, fmd1.size, 0, fmd2.typeCode, fmd2.fmd, fmd2.size, 0, score);
        if (res === 0) {
            if (score.readUInt8() === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Comparison finished.',
                    resultMessage: 'Fingers match.',
                    dissimilarityScore: score.readUInt8()
                };
                resolve(resObj);
            } else {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Comparison finished.',
                    resultMessage: "Fingers don't match.",
                    dissimilarityScore: score.readUInt8()
                };
                resolve(resObj);
            }
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjIdentify = (fmd: DpfjCreateFmdFromFidStruct, fmdList: DpfjCreateFmdFromFidStruct[]) => new Promise<DpfjIdentifyStruct>((resolve, reject) => {
        const ucharArray = ArrayType('uchar *');
        const uintArray = ArrayType(ref.types.uint);
        const fmdListPointer = new ucharArray(fmdList.length);
        const fmdListSizePointer = new uintArray(fmdList.length);
        fmdList.forEach((fmdObj, index) => {
            fmdListPointer[index] = fmdObj.fmd;
            fmdListSizePointer[index] = fmdObj.size;
        });
        const candidate = new dpfj_candidate;
        const candidateCnt = ref.alloc(ref.types.uint, 1);
        const falsePositiveRate = DPFJ_PROBABILITY_ONE / 100000;
        const res = UareU.dpfj.dpfj_identify(fmd.typeCode, fmd.fmd, fmd.size, 0, fmdList[0].typeCode, fmdList.length, fmdListPointer.buffer, fmdListSizePointer.buffer, falsePositiveRate, candidateCnt, candidate.ref());
        if (res === 0) {
            if (candidateCnt.readUInt8() === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Identification finished.',
                    resultMessage: 'No finger match.',
                    fmdCandidateIndex: -1
                };
                resolve(resObj);
            } else {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'Identification finished.',
                    resultMessage: `Finger found.`,
                    fmdCandidateIndex: candidate.fmd_idx
                };
                resolve(resObj);
            }
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjStartEnrollment = (fmdType: DPFJ_FMD_FORMAT_TYPE) => new Promise<DpfjStartEnrollmentStruct>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_start_enrollment(fmdType);
        UareU.getInstance().currentEnrollmentFmdFormat = fmdType;
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Enrollment started.',
                type: keyByValue(DPFJ_FMD_FORMAT, fmdType)!,
                typeCode: fmdType
            };
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjAddToEnrollment = (fmd: DpfjCreateFmdFromFidStruct) => new Promise<DpfjAddToEnrollmentStruct>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_add_to_enrollment(fmd.typeCode, fmd.fmd, fmd.size, 0);
        const errorCode = res.toString(16).slice(-3);
        if (res === 0 || errorCode === '00d') {
            if (res === 0) {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'FMD added, enrollment is ready.',
                    resultMessage: 'The fmd is complete, use dpfjCreateEnrollmentFmd to finish the process.'
                };
                resolve(resObj);
            } else {
                const resObj = {
                    callbackRet: res,
                    readableRet: 'FMD added, more FMDs for enrollment required.',
                    resultMessage: 'The fmd need more data, put the same finger again on reader.'
                };
                resolve(resObj);
            }
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCreateEnrollmentFmd = () => new Promise<DpfjCreateEnrollmentFmdStruct>((resolve, reject) => {
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_enrollment_fmd(fmd, fmdSize);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'FMD was created.',
                size: ref.deref(fmdSize),
                type: keyByValue(DPFJ_FMD_FORMAT, UareU.getInstance().currentEnrollmentFmdFormat)!,
                typeCode: UareU.getInstance().currentEnrollmentFmdFormat,
                fmd: fmd
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjFinishEnrollment = () => new Promise<DpfjFinishEnrollmentStruct>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_finish_enrollment();
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'Enrollment ended.'
            };
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjFmdConvert = (fmd: DpfjCreateFmdFromFidStruct, toFormat: DPFJ_FMD_FORMAT_TYPE) => new Promise<DpfjFmdConvertStruct>((resolve, reject) => {
        const fmdOut = Buffer.alloc(MAX_FMD_SIZE);
        const fmdOutSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_fmd_convert(fmd.typeCode, fmd.fmd, fmd.size, toFormat, fmdOut, fmdOutSize);
        if (res === 0) {
            const resObj = {
                callbackRet: res,
                readableRet: 'FMD was converted.',
                size: ref.deref(fmdOutSize),
                type: keyByValue(DPFJ_FMD_FORMAT, UareU.getInstance().currentEnrollmentFmdFormat)!,
                typeCode: UareU.getInstance().currentEnrollmentFmdFormat,
                fmd: fmdOut
            }
            resolve(resObj);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    // public dpfjDpFidConvert = () => new Promise<number>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_dp_fid_convert();
    //     if (res === 0) {
    //         resolve(res);
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjRawConvert = () => new Promise<number>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_raw_convert();
    //     if (res === 0) {
    //         resolve(res);
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    public dpfjGetFidRecordParams = (fidType: DPFJ_FID_FORMAT_TYPE, captureData: DpfpddCaptureCallbackData0) => new Promise<DpfjGetFidRecordParamsStruct>((resolve) => {
        const params = new dpfj_fid_record_params;
        UareU.dpfj.dpfj_get_fid_record_params(fidType, captureData.data.image_data, params.ref());
        const resObj = {
            callbackRet: 0,
            readableRet: 'Fid records params obtained.',
            params: {
                recordLength: params.record_length,
                cbeffId: params.cbeff_id,
                captureDeviceId: params.capture_device_id,
                acquisitionLevel: params.acquisition_level,
                fingerCnt: params.finger_cnt,
                scaleUnits: params.scale_units,
                scanRes: params.scan_res,
                imageRes: params.image_res,
                bpp: params.bpp,
                compression: params.compression
            }
        }
        resolve(resObj);
    });

    public dpfjSetFidRecordParams = (fidType: DPFJ_FID_FORMAT_TYPE, captureData: DpfpddCaptureCallbackData0, params: DpfjFidRecordParamsStruct) => new Promise<DpfjSetFidRecordParamsStruct>((resolve) => {
        const paramsBuffer = new dpfj_fid_record_params;
        paramsBuffer.record_length = params.recordLength;
        paramsBuffer.cbeff_id = params.cbeffId;
        paramsBuffer.capture_device_id = params.captureDeviceId;
        paramsBuffer.acquisition_level = params.acquisitionLevel;
        paramsBuffer.finger_cnt = params.fingerCnt;
        paramsBuffer.scale_units = params.scaleUnits;
        paramsBuffer.scan_res = params.scanRes;
        paramsBuffer.image_res = params.imageRes;
        paramsBuffer.bpp = params.bpp;
        paramsBuffer.compressio = params.compression;
        UareU.dpfj.dpfj_set_fid_record_params(paramsBuffer.ref(), fidType, captureData.data.image_data);
        const resObj = {
            callbackRet: 0,
            readableRet: 'Fid records params setted.'
        }
        resolve(resObj);
    });

    // public dpfjGetFidViewOffset = (fidType: number, fid: any, viewIndex: number) => new Promise<number>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_get_fid_view_offset(fidType, fid, viewIndex);
    //     if (res === 0) {
    //         resolve(res);
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjGetFidViewParams = (fidView: any) => new Promise<void>((resolve, reject) => {
    //     const params = new dpfj_fid_view_params;
    //     const res = UareU.dpfj.dpfj_get_fid_view_params(fidView, params.ref());
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjSetFidViewParams = (fidView: any, params: Buffer) => new Promise<void>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_set_fid_view_params(params, fidView);
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjGetFmdRecordParams = (fmdType: number, fmd: Fmd) => new Promise<void>((resolve, reject) => {
    //     const params = new dpfj_fmd_record_params;
    //     const res = UareU.dpfj.dpfj_get_fmd_record_params(fmdType, fmd.data, params.ref());
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjSetFmdRecordParams = (fmdType: number, fmd: Fmd, params: Buffer) => new Promise<void>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_set_fmd_record_params(params, fmdType, fmd.data);
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjGetFmdViewOffset = (fmdType: number, fmd: any, viewIndex: number) => new Promise<number>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_get_fmd_view_offset(fmdType, fmd.data, viewIndex);
    //     if (res === 0) {
    //         resolve(res);
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjGetFmdViewParams = (fmd: any) => new Promise<void>((resolve, reject) => {
    //     const params = new dpfj_fmd_view_params;
    //     const res = UareU.dpfj.dpfj_get_fmd_view_params(fmd.data, params.ref());
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });

    // public dpfjSetFmdViewParams = (fmd: any, params: Buffer) => new Promise<void>((resolve, reject) => {
    //     const res = UareU.dpfj.dpfj_set_fmd_view_params(fmd.data, params);
    //     if (res === 0) {
    //         resolve();
    //     } else {
    //         reject(new ErrorHandler(res));
    //     }
    // });
};

process.on('exit', function () {
    captureCallback
});