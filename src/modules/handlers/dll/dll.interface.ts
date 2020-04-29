interface LoadDpfppdFrom {
    (path?: string): any;
}

interface LoadDpfjFrom {
    (path?: string): any;
}

export default interface DllHandlerInterface {
    loadDpfppdFrom: LoadDpfppdFrom;
    loadDpfjFrom: LoadDpfjFrom;
}