#!/bin/bash

filepath=$(cd $(dirname $0) && pwd)
cd $filepath
python -m SimpleHTTPServer 80 >md-pages.log 2>&1 &
python ../http-file-server/file-server.py ../http-file-server/files 8001 >file-server.log 2>&1 &

