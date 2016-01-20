#Online Clipboard


#### 
```
#get the code
git clone https://github.com/ety001/online-clipboard.git

#run build
cd online-clipboard
docker build -t ety001/online_clipboard .

#run redis
docker run -d --name db microbox/redis

#run server
docker run -d -p 8080:8080 --name online_clipboard --link db:db ety001/online_clipboard

#checkout the gh-pages branch, and change the App.ws_url config.
git checkout gh-pages
vim js/app.js
```

####Daocloud compose
```
server:
  image: daocloud.io/ety001/clip:latest
  restart: always
  links:
  - db:db
  ports:
  - 8080:8080
db:
  image: microbox/redis
  restart: always
  ports:
  - 6379:6379
```
