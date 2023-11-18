export default function fake_inject(): (import("rollup").Plugin<any> | {
    name: string;
    resolveId(id: any): {
        id: any;
        external: boolean;
    };
    load(id: any): string;
})[];
