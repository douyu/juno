#!/usr/bin/bash
export PATH=$PATH:/usr/local/go/bin:/home/www/system/pprof/graphviz/bin:/home/www/system/pprof/FlameGraph:/usr/bin
./bin/juno-admin --config config/single-prod.toml --host 0.0.0.0
