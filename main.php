<?php
    class __init{
        public static $row=null;//行数
        public static $ind=null;//空白位
        public static $ins=null;//请求位
        private $num=null;

        private function __construct($num)
        {
            $this->num=range(0, $num);

            shuffle($this->num);
            echo json_encode($this->num);
            /*$a=new arrayIterator($this->num);
            iterator_apply($a, function($a){
                echo $a->current();
                return true;
            }, [$a]);*/
        }
        private function __clone()
        {
        }
        public static function swit()
        {

            $row=(int)self::$row;
            $ind=(int)self::$ind;
            $ary=[];

            $ind % $row == 0 && array_push($ary, $ind-1) || $ind % $row == 1 && array_push($ary, $ind+1) || array_push($ary, $ind+1) && array_push($ary, $ind-1);

            $ind <= $row && array_push($ary, $ind+$row) || $ind > pow($row, 2)-$row && array_push($ary, $ind-$row) || array_push ($ary, $ind+$row) && array_push($ary, $ind-$row);

            return $ary;

        }

        public static function runmin()
        {
            echo in_array((int)self::$ins, self::swit());
        }
        public static function wins()
        {
            $a=$o=explode(',',$_GET['win']);
            sort($a);

            echo $a==$o;

        }
        public static function run()
        {
            if(isset($_GET['action'])){
                return new self($_GET['action']);
            }else if(isset($_GET['ind']) && isset($_GET['ind']) && isset($_GET['row'])){
                self::$row=$_GET['row'];
                self::$ins=$_GET['ins']+1;
                self::$ind=$_GET['ind'];

                self::runmin();
            }else if(isset($_GET['win'])){
                self::wins();
            }
        }
    }
    __init::run();
