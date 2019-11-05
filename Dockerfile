FROM ety001/swoole:latest
MAINTAINER ety001 <ety001@domyself.me>
RUN apk --no-cache add php7-redis
ADD . /source
EXPOSE 8080
CMD ["/source/server.php"]
