import * as ref from 'ref-napi';
import * as ffi from 'ffi-napi';
import * as ArrayType from 'ref-array-napi';

import DllHandler from "./handlers/dll/dll.handler";
import ErrorHandler from "./handlers/error/error.handler";
import { dpfpdd_version, dpfpdd_dev_info, dpfpdd_dev_status, dpfpdd_dev_caps, dpfpdd_capture_param, dpfpdd_capture_result, dpfj_version, dpfpdd_capture_callback_data_0, dpfj_candidate, dpfj_fid_record_params, dpfj_fmd_record_params, dpfj_fmd_view_params, dpfj_fid_view_params } from "./handlers/types/struct/struct.handler";
import { genericArrayFrom } from "./handlers/types/array/array.handler";
import { DPFPDD_HW_MODALITY, DPFPDD_HW_TECHNOLOGY, DPFPDD_DEV, DPFPDD_PRIORITY, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_PROC, DPFJ_ENGINE_TYPE, DPFJ_FMD_FORMAT, MAX_FMD_SIZE, DPFJ_PROBABILITY_ONE, DPFPDD_STATUS, DPFPDD_PRIORITY_TYPE, DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC_TYPE } from "./handlers/types/constant/constant.handler";
import { CaptureCallback, Fmd, CompareResult, IdentifyResult, UareUInterface, DpfppdVersionStruct, DpfppdInitStruct, DpfppdExitStruct, DpfppdQueryDevicesStruct, ReaderStruct, DpfppdOpenStruct, DpfppdOpenExtStruct, DpfppdCloseStruct, DpfppdGetDeviceStatusStruct, DpfppdGetDeviceCapabilitiesStruct, DpfpddCaptureStruct } from "./interfaces/uareu.interfaces";
import keyByValue from './handlers/types/constant/constant.utils';

export default class UareU implements UareUInterface {
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
                    readableRet: 'Image captured. Extended result is in capture_result.',
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
                            heigth: captureResult.info.heigth,
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

    public dpfpddCaptureAsync = (
        reader: any,
        imageFmt: typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ISOIEC19794 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER,
        imageProc: typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED_2 | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_UNPROCESSED,
        callback: CaptureCallback
    ) => new Promise<any>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(reader).then((readerCaps) => {
            const context = ref.alloc('void *');
            const captureParam = new dpfpdd_capture_param;
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = readerCaps.deviceCaps.resolutions;
            const CaptureCallback = ffi.Callback('void', ['pointer', 'int', 'int', 'pointer'], callback);
            const res = UareU.dpfpdd.dpfpdd_capture_async(reader, captureParam.ref(), context, CaptureCallback);
            if (res === 0) {
                resolve(res);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddCancel = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_cancel(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStartStream = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_start_stream(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStopStream = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_stop_stream(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetStreamImage = (
        reader: any,
        imageFmt: typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ISOIEC19794 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER,
        imageProc: typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED_2 | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_UNPROCESSED
    ) => new Promise<any>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(reader).then((readerCaps) => {
            const IMAGE_DATA_SIZE = 2048;
            const captureResult = new dpfpdd_capture_result;
            const captureParam = new dpfpdd_capture_param;
            const imgSize = ref.alloc(ref.types.uint, IMAGE_DATA_SIZE);
            const imgData = Buffer.alloc(IMAGE_DATA_SIZE);
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = readerCaps.deviceCaps.resolutions;
            const res = UareU.dpfpdd.dpfpdd_get_stream_image(reader, captureParam.ref(), captureResult.ref(), imgSize, imgData);
            if (res === 0) {
                resolve(res);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddReset = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_reset(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddCalibrate = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_calibrate(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedConfig = (reader: any, ledId: number, ledMode: number) => new Promise<any>((resolve, reject) => {
        const reserved = ref.alloc('void *');
        const res = UareU.dpfpdd.dpfpdd_led_config(reader, ledId, ledMode, reserved);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedCtrl = (reader: any, ledId: number, ledCmd: number) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_led_ctrl(reader, ledId, ledCmd);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddSetParameter = (reader: any, parmId: number, buffer: Buffer) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_set_parameter(reader, parmId, buffer.length, buffer);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetParameter = (reader: any, parmId: number, buffer: Buffer) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_get_parameter(reader, parmId, buffer.length, buffer);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjVersion = () => new Promise<any>((resolve, reject) => {
        const ver = ref.alloc(dpfj_version);
        const res = UareU.dpfj.dpfj_version(ver);
        if (res === 0) {
            resolve(ver);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSelectEngine = (reader: any, engine: typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_DPFJ | typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_DPFJ7 | typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_INNOVATRICS_ANSIISO) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_select_engine(reader, engine);
        if (res === 0) {
            resolve(res);
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

    public dpfjCreateFmdFromFid = (imageData: any, imageSize: number, fmdType: number) => new Promise<Fmd>((resolve, reject) => {
        const image = new dpfpdd_capture_callback_data_0(ref.reinterpret(imageData, imageSize));
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_fmd_from_fid(image.capture_parm.image_fmt, image.image_data, image.image_size, fmdType, fmd, fmdSize);
        if (res === 0) {
            resolve({ size: ref.deref(fmdSize), fmdType, data: fmd });
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCompare = (fmd1: Fmd, fmd2: Fmd) => new Promise<CompareResult>((resolve, reject) => {
        const score = ref.alloc(ref.types.uint);
        const res = UareU.dpfj.dpfj_compare(fmd1.fmdType, fmd1.data, fmd1.size, 0, fmd2.fmdType, fmd2.data, fmd2.size, 0, score);
        if (res === 0) {
            if (score.readUInt8() === 0) {
                resolve({
                    result: 'MATCH',
                    score: score.readUInt8()
                });
            } else {
                resolve({
                    result: 'DONT MATCH',
                    score: score.readUInt8()
                });
            }
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjIdentify = (fmd1: Fmd, fmdList: Fmd[]) => new Promise<IdentifyResult>((resolve, reject) => {
        const ucharArray = ArrayType('uchar *');
        const uintArray = ArrayType(ref.types.uint);
        const fmdListPointer = new ucharArray(fmdList.length);
        const fmdListSizePointer = new uintArray(fmdList.length);
        fmdList.forEach((fmd, index) => {
            fmdListPointer[index] = fmd.data;
            fmdListSizePointer[index] = fmd.size;
        });
        const candidate = new dpfj_candidate;
        const candidateCnt = ref.alloc(ref.types.uint, 1);
        const falsePositiveRate = DPFJ_PROBABILITY_ONE / 100000;
        const res = UareU.dpfj.dpfj_identify(fmd1.fmdType, fmd1.data, fmd1.size, 0, fmdList[0].fmdType, fmdList.length, fmdListPointer.buffer, fmdListSizePointer.buffer, falsePositiveRate, candidateCnt, candidate.ref());
        if (res === 0) {
            resolve({ index: candidateCnt.readUInt8() === 0 ? 'No finger match.' : candidate.fmd_idx });
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjStartEnrollment = (fmdType: number) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_start_enrollment(fmdType);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjAddToEnrollment = (fmd: Fmd) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_add_to_enrollment(fmd.fmdType, fmd.data, fmd.size, 0);
        const errorCode = res.toString(16).slice(-3);
        if (res === 0 || errorCode === '00d') {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCreateEnrollmentFmd = () => new Promise<any>((resolve, reject) => {
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_enrollment_fmd(fmd, fmdSize);
        if (res === 0) {
            resolve(fmd);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjFinishEnrollment = () => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_finish_enrollment();
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjFmdConvert = (fmd: Fmd, toFormat: number) => new Promise<Fmd>((resolve, reject) => {
        const fmdOut = Buffer.alloc(MAX_FMD_SIZE);
        const fmdOutSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_fmd_convert(fmd.fmdType, fmd.data, fmd.size, toFormat, fmdOut, fmdOutSize);
        if (res === 0) {
            resolve({ size: ref.deref(fmdOutSize), fmdType: toFormat, data: fmdOut });
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

    public dpfjGetFidRecordParams = (fidType: number, fid: any) => new Promise<void>((resolve, reject) => {
        const params = new dpfj_fid_record_params;
        const res = UareU.dpfj.dpfj_get_fid_record_params(fidType, fid, params.ref());
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSetFidRecordParams = (fidType: number, fid: any, params: Buffer) => new Promise<void>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_set_fid_record_params(params, fidType, fid);
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjGetFidViewOffset = (fidType: number, fid: any, viewIndex: number) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_get_fid_view_offset(fidType, fid, viewIndex);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjGetFidViewParams = (fidView: any) => new Promise<void>((resolve, reject) => {
        const params = new dpfj_fid_view_params;
        const res = UareU.dpfj.dpfj_get_fid_view_params(fidView, params.ref());
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSetFidViewParams = (fidView: any, params: Buffer) => new Promise<void>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_set_fid_view_params(params, fidView);
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjGetFmdRecordParams = (fmdType: number, fmd: Fmd) => new Promise<void>((resolve, reject) => {
        const params = new dpfj_fmd_record_params;
        const res = UareU.dpfj.dpfj_get_fmd_record_params(fmdType, fmd.data, params.ref());
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSetFmdRecordParams = (fmdType: number, fmd: Fmd, params: Buffer) => new Promise<void>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_set_fmd_record_params(params, fmdType, fmd.data);
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjGetFmdViewOffset = (fmdType: number, fmd: any, viewIndex: number) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_get_fmd_view_offset(fmdType, fmd.data, viewIndex);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjGetFmdViewParams = (fmd: any) => new Promise<void>((resolve, reject) => {
        const params = new dpfj_fmd_view_params;
        const res = UareU.dpfj.dpfj_get_fmd_view_params(fmd.data, params.ref());
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSetFmdViewParams = (fmd: any, params: Buffer) => new Promise<void>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_set_fmd_view_params(fmd.data, params);
        if (res === 0) {
            resolve();
        } else {
            reject(new ErrorHandler(res));
        }
    });
};
