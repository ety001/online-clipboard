#网络剪切板


###Docker 部署
```
#git clone后，执行build
docker build -t ety001/online_clipboard .

#运行redis
docker run -d --name db microbox/redis

#运行swoole
docker run -d -p 8080:8080 --name online_clipboard --link db:db ety001/online_clipboard
```