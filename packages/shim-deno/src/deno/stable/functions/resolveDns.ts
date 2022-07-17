///<reference path="../lib.deno.d.ts" />

import dns from "dns";

export const resolveDns: typeof Deno.resolveDns = async function resolveDns(
    query,
    recordType,
    options,
): Promise<any[]> {
    switch (recordType) {
        case "A":
            return new Promise((resolve, reject) => {
                dns.resolve4(query, { ttl: false }, (err, addresses) => {
                    if (err)
                        reject(err);
                    else
                        resolve(addresses);
                });
            });
        case "AAAA":
            return new Promise((resolve, reject) => {
                dns.resolve4(query, { ttl: false }, (err, addresses) => {
                    if (err)
                        reject(err);
                    else
                        resolve(addresses);
                });
            })
    }
    return [] as string[];
};
