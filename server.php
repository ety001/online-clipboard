<?php
require 'func.php';
$config = require 'config.php';
$redis  = new Redis();
$redis->pconnect($config['redis']['host'], $config['redis']['port']);

$ws = new swoole_websocket_server("0.0.0.0", 8080);

$ws->on('open', function ($ws, $request) {
    global $redis;
    $req    = $request->server;
    $uri    = explode('/', $req['request_uri']);
    $cb_name    = $uri[1];
    $cb_pass    = $uri[2];
    $hash   = md5($cb_pass. $cb_name);

    //if fd is 1, the server had been restarted
    if($request->fd==1){
        hash_clear($redis);
    }

    var_dump($hash,$request->fd);

    //save $fd => $hash

    if($redis->hGet('fd.to.hash', $request->fd)!=$hash){
        $redis->hSet('fd.to.hash', $request->fd, $hash);
    }
    //save $hash => $fd, this list be used to publish msg on the channel. 
    $redis->lPush('publish_'.$hash, $request->fd);

    $all    = $redis->lRange($hash, 0, -1);
    krsort($all);
    $result = array('type'=>'all', 'data'=>$all);
    $ws->push($request->fd, json_encode($result));
});

$ws->on('message', function ($ws, $frame) {
    global $redis;
    $hash       = $redis->hGet('fd.to.hash', $frame->fd);
    $r          = json_decode($frame->data, true);
    if(empty($r))return;
    $msg        = $r['msg'];
    if($msg==='')return;
    switch ($r['type']) {
        case 'message':
            save_cb($redis, $hash, $msg);
            publish($redis, $hash, $ws, $msg);
            break;
        default:
            # code...
            break;
    }
});

$ws->on('close', function ($ws, $fd) {
    global $redis;
    $hash   = $redis->hGet('fd.to.hash', $fd);
    //remove $hash=>$fd
    $redis->lRem('publish_'.$hash, $fd, 0);
    //remove $fd=>$hash
    $redis->hDel('fd.to.hash', $fd);
    echo "client-{$fd} is closed\n";
});

$ws->start();