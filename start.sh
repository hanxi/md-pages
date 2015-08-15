#!/bin/bash

cd /md-pages
python -m SimpleHTTPServer 8000 &
python /md-pages/http-file-server/file-server.py /md-pages/http-file-server/files 80 &
