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
