docker run -it --rm \
       --network lnmp \
       --env-file .env \
       -v $(pwd):/test \
       -p 8090:80 \
       ety001/online_clipboard:akash \
       /bin/ash
