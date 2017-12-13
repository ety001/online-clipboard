FROM ety001/min_swoole
MAINTAINER ety001 <ety001@domyself.me>
RUN mkdir /web
ADD . /web
EXPOSE 8080
CMD ["/web/server.php"]
