# @deno/sham-weakref

Sham for `WeakRef`. It is not possible to shim `WeakRef` in old node
environments, so this module provides a sham to allow the code to compile, but
it will throw when used. The sham will use the global `WeakRef` if it exists
though.
