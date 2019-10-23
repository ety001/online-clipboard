FROM ety001/swoole:4.4.3
MAINTAINER ety001 <ety001@domyself.me>
RUN apk --no-cache add php7-redis
ADD . /web
EXPOSE 8080
CMD ["/web/server.php"]
