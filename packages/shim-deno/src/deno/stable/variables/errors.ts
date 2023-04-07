///<reference path="../lib.deno.d.ts" />

// please keep sorted
export class AddrInUse extends Error {}
export class AddrNotAvailable extends Error {}
export class AlreadyExists extends Error {}
export class BadResource extends Error {}
export class BrokenPipe extends Error {}
export class Busy extends Error {}
export class ConnectionAborted extends Error {}
export class ConnectionRefused extends Error {}
export class ConnectionReset extends Error {}
export class Http extends Error {}
export class Interrupted extends Error {}
export class InvalidData extends Error {}
export class NotConnected extends Error {}
export class NotFound extends Error {
  code = "ENOENT";
}
export class PermissionDenied extends Error {}
export class TimedOut extends Error {}
export class UnexpectedEof extends Error {}
export class WriteZero extends Error {}
