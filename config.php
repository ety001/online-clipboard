<?php
return array(
    'redis' => array(
        'host'  => ($_ENV['DB_PORT_6379_TCP_ADDR'])?$_ENV['DB_PORT_6379_TCP_ADDR']:'localhost',
        'port'  => ($_ENV['DB_PORT_6379_TCP_PORT'])?$_ENV['DB_PORT_6379_TCP_PORT']:'6379',
        'db'    => ($_ENV['DB_NAME'])?$_ENV['DB_NAME']:'',
        'pass'  => ($_ENV['REDIS_PASSWORD'])?$_ENV['REDIS_PASSWORD']:'';
    )
);