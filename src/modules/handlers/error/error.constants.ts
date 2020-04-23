const DPERROR_CONSTANTS = {
    '00a': {
        dll_info: {
            code: '0x0a',
            define: 'DPFJ_E_NOT_IMPLEMENTED'
        },
        brief: 'API call is not implemented.'
    },
    '00b': {
        dll_info: {
            code: '0x0b',
            define: 'DPFJ_E_FAILURE'
        },
        brief: 'Unspecified failure. "Catch-all" generic failure code. Can be returned by all API calls in case of failure, when the reason for the failure is unknown or cannot be specified.'
    },
    '00c': {
        dll_info: {
            code: '0x0c',
            define: 'DPFJ_E_NO_DATA'
        },
        brief: 'No data is available.'
    },
    '00d': {
        dll_info: {
            code: '0x0d',
            define: 'DPFJ_E_MORE_DATA'
        },
        brief: 'Memory allocated by application is not enough to contain data which is expected.'
    },
    '014': {
        dll_info: {
            code: '0x14',
            define: 'DPFJ_E_INVALID_PARAMETER'
        },
        brief: 'One or more parameters passed to the API call are invalid.'
    },
    '015': {
        dll_info: {
            code: '0x15',
            define: 'DPFPDD_E_INVALID_DEVICE'
        },
        brief: 'Reader handle is not valid.'
    },
    '01e': {
        dll_info: {
            code: '0x1e',
            define: ' DPFPDD_E_DEVICE_BUSY'
        },
        brief: 'The API call cannot be completed because another call is in progress.'
    },
    '01f': {
        dll_info: {
            code: '0x1f',
            define: 'DPFPDD_E_DEVICE_FAILURE'
        },
        brief: 'The reader is not working properly.'
    },
    '021': {
        dll_info: {
            code: '0x21',
            define: 'DPFPDD_E_PAD_LIBRARY'
        },
        brief: 'Spoof detection library not found or cant be loaded.'
    },
    '022': {
        dll_info: {
            code: '0x22',
            define: 'DPFPDD_E_PAD_DATA'
        },
        brief: 'Spoof detection database/classifier not found or cant be loaded.'
    },
    '023': {
        dll_info: {
            code: '0x23',
            define: 'DPFPDD_E_PAD_LICENSE'
        },
        brief: 'Spoof detection license not found or invalid.'
    },
    '024': {
        dll_info: {
            code: '0x24',
            define: 'DPFPDD_E_PAD_FAILURE'
        },
        brief: 'Failure to perform spoof detection.'
    },
    '065': {
        dll_info: {
            code: '0x65',
            define: 'DPFJ_E_INVALID_FID'
        },
        brief: 'FID is invalid.'
    },
    '066': {
        dll_info: {
            code: '0x66',
            define: 'DPFJ_E_TOO_SMALL_AREA'
        },
        brief: 'Image is too small.'
    },
    '0c9': {
        dll_info: {
            code: '0xc9',
            define: 'DPFJ_E_INVALID_FMD'
        },
        brief: 'FMD is invalid.'
    },
    '12d': {
        dll_info: {
            code: '0x12d',
            define: 'DPFJ_E_ENROLLMENT_IN_PROGRESS'
        },
        brief: 'Enrollment operation is in progress.'
    },
    '12e': {
        dll_info: {
            code: '0x12e',
            define: 'DPFJ_E_ENROLLMENT_NOT_STARTED'
        },
        brief: 'Enrollment operation has not begun.'
    },
    '12f': {
        dll_info: {
            code: '0x12f',
            define: 'DPFJ_E_ENROLLMENT_NOT_READY'
        },
        brief: 'Not enough in the pool of FMDs to create enrollment FMD.'
    },
    '130': {
        dll_info: {
            code: '0x130',
            define: 'DPFJ_E_ENROLLMENT_INVALID_SET'
        },
        brief: 'Unable to create enrollment FMD with the collected set of FMDs.'
    },
};

export default DPERROR_CONSTANTS;