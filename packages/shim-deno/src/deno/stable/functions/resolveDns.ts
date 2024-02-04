///<reference path="../lib.deno.d.ts" />

import dns from "dns";

export const resolveDns: typeof Deno.resolveDns = function resolveDns(
  query,
  recordType,
  options,
): Promise<any[]> {
  if (options) {
    throw Error(`resolveDns option not implemnted yet`);
  }
  switch (recordType) {
    case "A":
    /* falls through */
    case "AAAA":
    case "CNAME":
    case "NS":
    case "PTR":
      return new Promise((resolve, reject) => {
        dns.resolve(query, recordType, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve(addresses as string[]);
          }
        });
      });
    case "ANAME":
    case "CAA":
    case "MX":
    case "NAPTR":
    case "SOA":
    case "SRV":
    case "TXT":
    default:
      throw Error(`resolveDns type ${recordType} not implemnted yet`);
  }
};
