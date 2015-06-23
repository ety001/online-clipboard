<?php
function save_cb($redis, $hash, $content){
    if(!$redis || !$hash)return;
    $content    = htmlspecialchars($content);
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
    $redis->bgsave();
}

function publish($redis, $hash, $ws, $content){
    if(!$hash || !$redis || !$ws)return;
    $content    = htmlspecialchars($content);
    $result = $redis->lRange('publish_'.$hash, 0, -1);
    krsort($result);
    foreach ($result as $k => $v) {
        $tmp    = array('type'=>'single', 'data'=>$content);
        $ws->push($v, json_encode($tmp));
        //var_dump('publish', $v, $tmp);
    }
}

function hash_clear($redis){
    if(!$redis)return;
    $allkeys    = $redis->hKeys('fd.to.hash');
    $all        = $redis->hGetAll('fd.to.hash');
    foreach ($all as $k => $v) {
        $redis->lRem('publish_'.$v, $k, 0);
    }

    foreach ($allkeys as $k => $v) {
        $redis->hDel('fd.to.hash', $v);
    }
    return;
}