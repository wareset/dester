export declare type TypeAgruments = {
    help: boolean;
    input: string;
    output: string;
    remove: boolean | string;
    types: string;
    watch: boolean;
    silent: boolean;
    pkg: boolean | string;
    tsc: boolean | string;
    babel: boolean | string;
    force: boolean;
    minify: boolean;
    pkgbeauty: boolean;
};
declare const init: ({ input, output, remove, types, watch, silent, pkg: _pkg, tsc: _tsc, babel: _babel, force, minify, pkgbeauty }: TypeAgruments) => void;
export default init;
