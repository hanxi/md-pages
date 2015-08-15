#Dockerfile

FROM centos6-base
MAINTAINER hanxi <hanxi.info@gmail.com>

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

EXPOSE 8000
EXPOSE 8001

RUN yum install -y git
RUN git clone https://git.oschina.net/hanxi/md-pages.git /md-pages

WORKDIR /md-pages
RUN git submodule update
RUN mkdir -p http-file-server/files/md

CMD python -m SimpleHTTPServer 8000 & && python http-file-server/file-server.py http-file-server/files 8001 &

#End
