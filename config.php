<?php
return array(
    'redis' => array(
        'host'  => getenv('DB_PORT_6379_TCP_ADDR')?getenv('DB_PORT_6379_TCP_ADDR'):'localhost',
        'port'  => getenv('DB_PORT_6379_TCP_PORT')?getenv('DB_PORT_6379_TCP_PORT'):'6379',
        'db'    => getenv('DB_NAME')?getenv('DB_NAME'):'',
        'pass'  => getenv('REDIS_PASSWORD')?getenv('REDIS_PASSWORD'):''
    )
);