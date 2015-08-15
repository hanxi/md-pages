#!/bin/bash

netstat -tunlp|grep ":80"|awk '{print $7}'|awk -F/ '{print $1}'|xargs kill -9
netstat -tunlp|grep ":8000"|awk '{print $7}'|awk -F/ '{print $1}'|xargs kill -9
cd /md-pages
python -m SimpleHTTPServer 8000 &
python /md-pages/http-file-server/file-server.py /md-pages/http-file-server/files 80 &
