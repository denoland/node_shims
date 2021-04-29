///<reference path="../lib.deno.d.ts" />

function makeError(name: string) {
	const err = (function Err(message?: string): Error {
		if (!(this instanceof Err)) {
			return new ((Err as unknown) as new (message?: string) => Error)(
				message
			);
		}
		Object.assign(this, new Error(message));
		this.name = name;
		this.message = message;
	} as unknown) as ErrorConstructor;
	(err as { prototype: Error }).prototype = Error.prototype;
	err.stackTraceLimit = 10;
	err.captureStackTrace = () => {};
	Object.defineProperty(err, 'name', { value: name });
	return err;
}

export const errors: typeof Deno.errors = {
	NotFound: makeError('NotFound'),
	PermissionDenied: makeError('PermissionDenied'),
	ConnectionRefused: makeError('ConnectionRefused'),
	ConnectionReset: makeError('ConnectionReset'),
	ConnectionAborted: makeError('ConnectionAborted'),
	NotConnected: makeError('NotConnected'),
	AddrInUse: makeError('AddrInUse'),
	AddrNotAvailable: makeError('AddrNotAvailable'),
	BrokenPipe: makeError('BrokenPipe'),
	AlreadyExists: makeError('AlreadyExists'),
	InvalidData: makeError('InvalidData'),
	TimedOut: makeError('TimedOut'),
	Interrupted: makeError('Interrupted'),
	WriteZero: makeError('WriteZero'),
	UnexpectedEof: makeError('UnexpectedEof'),
	BadResource: makeError('BadResource'),
	Http: makeError('Http'),
	Busy: makeError('Busy')
};
