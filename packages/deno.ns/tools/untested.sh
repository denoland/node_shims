#!/bin/sh
set -eu

ls third_party/deno/cli/tests/unit/*_test.ts | comm -3 - tools/working_test_files.txt
