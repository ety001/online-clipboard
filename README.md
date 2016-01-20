#Online Clipboard


###Docker 
```
#get the code
git clone https://github.com/ety001/online-clipboard.git

#run build
cd online-clipboard
docker build -t ety001/online_clipboard .

#run redis
docker run -d --name db microbox/redis

#checkout the gh-pages branch, and change the App.ws_url config.
git checkout gh-pages
vim js/app.js
```
