<?php
return ['default'=>env('DB_CONNECTION','pgsql'),'connections'=>['pgsql'=>['driver'=>'pgsql','host'=>env('DB_HOST','127.0.0.1'),'port'=>env('DB_PORT','5432'),'database'=>env('DB_DATABASE','lb_platform'),'username'=>env('DB_USERNAME','app'),'password'=>env('DB_PASSWORD',''),'charset'=>'utf8','prefix'=>'','schema'=>'public']],'migrations'=>'migrations'];
