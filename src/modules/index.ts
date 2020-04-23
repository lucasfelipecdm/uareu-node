import DllHandler from "./handlers/dll/dll.handler";
import * as ref from 'ref-napi';
import { dpfpdd_version } from "./handlers/types/struct/struct.handler";
import ErrorHandler from "./handlers/error/error.handler";
export default class UareU {
    private static instance: UareU;
    private static dpfpdd: any;
    private static dpfj: any;

    private constructor() { };

    public static getInstance = (): UareU => {
        if (!UareU.instance) UareU.instance = new UareU();
        return UareU.instance;
    };

    public loadLibs = (dpfpddLibPath?: string, dpfjLibPath?: string) => new Promise(async (resolve, reject) => {
        try {
            UareU.dpfpdd = await DllHandler.loadDpfppdFrom(dpfpddLibPath);
            UareU.dpfj = await DllHandler.loadDpfjFrom(dpfjLibPath);
            resolve('SUCCESS');
        } catch (e) {
            reject(e);
        }
    });

    public dpfpddVersion = () => new Promise<any>((resolve, reject) => {
        const ver = ref.alloc(dpfpdd_version);
        const res = UareU.dpfpdd.dpfpdd_version(ver);
        if (res === 0) {
            resolve(ver);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddInit = () => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_init();
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });
}