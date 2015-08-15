#Dockerfile

FROM centos
MAINTAINER hanxi <hanxi.info@gmail.com>

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

EXPOSE 8000
EXPOSE 80

RUN yum install -y git
RUN git clone https://git.oschina.net/hanxi/md-pages.git /md-pages

WORKDIR /md-pages
RUN git submodule update
RUN mkdir -p http-file-server/files/md

CMD ["/bin/bash", "/md-pages/start.sh"]

#End
