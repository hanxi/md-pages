#!/bin/bash

cd /md-pages
/usr/bin/python -m SimpleHTTPServer 8000 &
/usr/bin/python http-file-server/file-server.py http-file-server/files 80 &
