# Online Clipboard

## 公共服务
我已经搭建了可以使用的公共服务 
网页版: [https://oc.to0l.cn](https://oc.to0l.cn) 
Android App: [https://fir.im/yhu7](https://fir.im/yhu7) 
iOS App: [https://apps.apple.com/us/app/%E7%BD%91%E7%BB%9C%E5%89%AA%E5%88%87%E6%9D%BF/id1485974770](https://apps.apple.com/us/app/%E7%BD%91%E7%BB%9C%E5%89%AA%E5%88%87%E6%9D%BF/id1485974770) 


## 部署
```
#获取服务端代码
git clone https://github.com/ety001/online-clipboard.git

#服务端代码封装成docker容器
cd online-clipboard
docker build -t ety001/online_clipboard .

#创建网络
docker network create --gateway "172.20.0.1" --subnet "172.20.0.0/24" oc

#运行redis
docker run -itd --name db --network oc --ip "172.20.0.2" microbox/redis

#运行服务端
docker run -itd -p 8080:8080 --name online_clipboard \
  --network oc --ip "172.20.0.3" \
  -e "DB_PORT_6379_TCP_ADDR=172.20.0.2" \
  -e "DB_PORT_6379_TCP_PORT=6379" \
  ety001/online_clipboard

#获取前端代码
git checkout gh-pages
```

## App源码

[https://github.com/ety001/oc_flutter](https://github.com/ety001/oc_flutter)
