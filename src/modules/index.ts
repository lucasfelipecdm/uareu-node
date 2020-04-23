import DllHandler from "./handlers/dll/dll.handler";

export default class UareU {
    private static instance: UareU;
    private dpfpdd: any;
    private dpfj: any;

    private constructor() { }

    public loadLibs = (dpfpddLibPath?: string, dpfjLibPath?: string) => new Promise(async (resolve, reject) => {
        try {
            this.dpfpdd = await DllHandler.loadDpfppdFrom(dpfpddLibPath);
            this.dpfj = await DllHandler.loadDpfjFrom(dpfjLibPath);
            resolve('SUCCESS');
        } catch (e) {
            reject(e);
        }
    })

    public static getInstance = (): UareU => {
        if (!UareU.instance) UareU.instance = new UareU();
        return UareU.instance;
    }
}