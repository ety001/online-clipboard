<?php
function save_cb($redis, $hash, $content){
    if(!$redis || !$hash || !$content)return;
    if($hash=='8d3c0804d35128b9546b526245bb9b64'){
        if($redis->lSize($hash)<500){
            $redis->lPush($hash, $content);
        } else {
            $redis->rPop($hash);
            $redis->lPush($hash, $content);
        }
    } else {
        if($redis->lSize($hash)<50){
            $redis->lPush($hash, $content);
        } else {
            $redis->rPop($hash);
            $redis->lPush($hash, $content);
        }
    }
}

function publish($redis, $hash, $ws, $content){
    if(!$hash || !$redis || !$ws || !$content)return;
    $result = $redis->lRange('publish_'.$hash, 0, -1);
    krsort($result);
    foreach ($result as $k => $v) {
        $tmp    = array('type'=>'single', 'data'=>$content);
        $ws->push($v, json_encode($tmp));
        //var_dump('publish', $v, $tmp);
    }
}