<?php
$ws = new swoole_websocket_server("0.0.0.0", 8080);

$ws->on('open', function ($ws, $request) {
    var_dump($request->fd, $request->get, $request->server);
    $ws->push($request->fd, "hello, welcome\n");
});

$ws->on('message', function ($ws, $frame) {
    echo "Message: {$frame->data}\n";
    $ws->push($frame->fd, "server: {$frame->data}");
});

$ws->on('close', function ($ws, $fd) {
    echo "client-{$fd} is closed\n";
});

$ws->start();