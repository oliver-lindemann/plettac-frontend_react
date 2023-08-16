import { lazy } from "react";

export function lazyLoad(path, namedExport) {
    return lazy(async () => {
        const promise = import(path);
        if (!namedExport) {
            return promise;
        } else {
            return promise.then(module => ({ default: module[namedExport] }));
        }
    });
}