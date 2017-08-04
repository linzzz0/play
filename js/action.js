$(function(){
    var init={
        wh:500,
        num:function(){
            var val=parseInt(prompt('请输入你要挑战的个数?','1'));
            if(val == 1){
                alert('那还玩个毛线！');
                init.num();
            } else if (val > 10) {
                alert('请不要设置过高！(最高为10*10)');
                init.num();
            } else {
                init.num=val;
            }
        },
        // num:3,//单行数量
        index:0,//-->空白位数?
        ran:null,//随机数?
        box:[],//一个点的宽高=盒子宽高/输入的个数?
        n_box:[],//数据另一个版本?
        z_box:[],//控制位置的数组?
        data_run:false,//判断是否运行?
        mouse_c:[],//鼠标位置[lx,ly]
        ins:null,//鼠标位置点[x,y]
        flag:null,//初始格子宽高
        n_flag:null,//放大图片宽高
        now_x:null,
        now_y:null,
        n_x:null,//鼠标x true=- false=+
        n_y:null,//鼠标y
        bool:null,
        swit_b:true,
        s:function(){
            var val=parseInt(prompt('请输入你要的速度?','0'));
            if(val == 0){
                alert('那还玩个毛线！');
                init.s();
            } else if (val > 10) {
                alert('请不要设置过高！(最高为10)');
                init.s();
            } else {
                init.s=val;
            }
        },//移动速度
        c_w:[true, true, true, true],//判断移动
        // c_y:[true, true, true, true],//判断移动
        num_wins:0,
        now:true,//判断输赢

        aj:function(url, func){
            $.ajax({url:url,success: func});
        },
        cal:function(ary){//把XY坐标信息转换成数字序号
            if(ary[1]>=1){
                var num=0;
                for(var i=0;i<ary[1];i++){
                    num+=this.num;
                }
                return num+=ary[0];
            }else{
                return ary[0];
            }
        },
        data:function(num, flag){//数据处理
            n_box=this.n_box;
            if(!this.data_run){
                /*
                 *放大放小数组n_box;
                 *遍历固定位置数组box;
                 *方格位置数组z_box;
                 */
                this.restart(this.box, false);
                this.restart(this.z_box, false);
                this.restart(n_box, true);
                this.data_run=true;
            }else if( init.ins!=null ){

                var fl=n_box[this.ran[init.ins]];
                if(fl[2]>=this.n_flag){
                    if(fl[3]>fl[0] && fl[4]>fl[1]){
                        fl[0]+=0.2;
                        fl[1]+=0.2;
                    }
                    fl[2]-=0.3;
                }else{
                    if(this.n_x===true){
                        fl[0]+=0.2
                    }else if(this.n_x===false){
                        fl[0]-=0.2
                    }
                    if(this.n_y===true){
                        fl[1]+=0.2
                    }else if(this.n_y===false){
                        fl[1]-=0.2
                    }
                }
                if(init.bool){
                    if(init.swit_b){
                        this.s_n=this.box[this.index_n-1];//保存空白坐标
                        this.s_c=this.box[this.ins_cl];//保存点击坐标

                        this.swit_b=false;
                    }else{
                        if(this.z_box[this.ins_cl][0] > this.s_n[0] && this.c_w[0]==true){
                            this.z_box[this.ins_cl][0]-=this.s;

                            this.c_w[1]=this.c_w[2]=this.c_w[3]=false;
                        }else if(this.z_box[this.ins_cl][0] < this.s_n[0] && this.c_w[1]==true){
                            this.z_box[this.ins_cl][0]+=this.s;

                            this.c_w[0]=this.c_w[2]=this.c_w[3]=false
                        }else if(this.z_box[this.ins_cl][1] > this.s_n[1] && this.c_w[2]==true){
                            this.z_box[this.ins_cl][1]-=this.s;

                            this.c_w[0]=this.c_w[1]=this.c_w[3]=false
                        }else if( this.z_box[this.ins_cl][1] < this.s_n[1] && this.c_w[3]==true){
                            this.z_box[this.ins_cl][1]+=this.s;

                            this.c_w[0]=this.c_w[1]=this.c_w[2]=false
                        }else{
                            this.num_wins++;
                        }

                        if(this.num_wins>=1){
                            var a=this.ran[this.ins_cl];
                            this.ran[this.ran.indexOf(this.index)]=a;
                            this.ran[this.ins_cl]=this.index;
                            init.restart(init.z_box,false);
                            this.c_w=this.c_y=[true, true, true, true];

                            init.bool=false;
                            init.swit_b=true;

                            init.aj('pins.inc.php?win='+init.ran , function(e){
                                if(e==1){
                                    alert('你过关了！');
                                    init.now=false;
                                }
                            })
                        }
                    }
                }
            }
        },
        restart:function(obj, bool){//数据重置和设置
            for(var i=0, index=0, num=this.num, flag=this.flag;i<num;i++){
                for(var j=0;j<num;j++){
                    var l=parseInt(i*flag+5);
                    var m=parseInt(j*flag+5);
                    obj[index]=[];
                    obj[index][0]=m;
                    obj[index][1]=l;
                    if(bool){
                        obj[index][2]=init.flag;//flag!!
                        obj[index][3]=m+10;//max x
                        obj[index][4]=l+10;//max y
                    }
                    index++;
                }
            }
        },
        draw:function(ctx, flag){//绘制函数！
            ctx.clearRect(0, 0, this.wh, this.wh);
            for(var i=0, box=this.box, z_box=this.z_box, ran=this.ran ;i<ran.length;i++){
                if(ran[i]==init.index || i==init.ins){
                    continue;
                }else{
                    var z=box[ran[i]];
                    ctx.beginPath();
                    ctx.globalAlpha=1;
                    ctx.drawImage(this.image,  z[0], z[1], flag, flag ,z_box[i][0], z_box[i][1], flag, flag);
                    ctx.closePath();
                }
            }

            if(init.ins!=null ){
                ctx.beginPath();
                var nz=init.n_box[ran[init.ins]];
                if(ran[init.ins]==init.index){
                    ctx.globalAlpha=0.5;
                    ctx.drawImage(this.image,  nz[0], nz[1], nz[2], nz[2] ,z_box[init.ins][0], z_box[init.ins][1], flag, flag);
                }else{
                    ctx.drawImage(this.image,  nz[0], nz[1], nz[2], nz[2] ,z_box[init.ins][0], z_box[init.ins][1], flag, flag);
                }

                ctx.lineWidth="1";
                ctx.strokeStyle="#fff";
                ctx.strokeRect(box[init.ins][0], box[init.ins][1], flag, flag);
                ctx.closePath();
            }
        },
        main:function(){//主要逻辑操作
            window.requestAnimFrame = (function(){
                return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            $('body').append($('<canvas id=can></canvas>').text('您的浏览器不支持canvas!?').css({'border':'1px solid #000','display':'block','float':'left','margin':"20px"})).append($("<img src='img/a.jpg' width="+this.wh+" height="+this.wh+"/>").css({'float':'left', 'margin':"20px"}));
            init.flag=(this.wh-10)/this.num;
            init.n_flag=init.flag-15;

            var can=$("#can"),wh=this.wh, num=this.num, flag=init.flag;
            this.image = new Image();
            this.image.src="a.jpg";

            ctx=can[0].getContext('2d');
            ctx.translate(0.5,0.5);
            can[0].width=wh;
            can[0].height=wh;

            this.image.onload=function(){
                !function look(){
                    init.data();
                    init.draw(ctx, flag);

                    requestAnimationFrame(look);
                }();

                can.on('mouseover',function(){
                    var x, y;
                    can.on('mousemove',function(e){
                        init.ins=init.cal(init.mouse_c);
                        x=e.offsetX;
                        y=e.offsetY;
                        if(x-5>=0 && x<=wh-7 && y-5>=0 && y<=wh-7){
                            var z=[parseInt((x-5)/flag), parseInt((y-5)/flag)];
                            var inc=init.mouse_c;

                            if(inc.toString()!=z.toString()){
                                init.mouse_c=z;
                                init.restart(init.n_box, true);
                                init.ins=init.cal(init.mouse_c);
                            }
                        }
                    })
                }).on('mouseout',function(){
                    init.restart(init.n_box, true);
                    // init.ins=null;
                }).on('click', function(){
                    if((init.num_wins!==0 || init.bool==null) && init.now===true){
                        init.num_wins=0;
                        init.index_n=init.ran.indexOf(init.index)+1;
                        init.ins_cl=init.ins;
                        var ind=init.index_n,//空白位置
                            ins=init.ins_cl,//点击位置
                            row=init.num;//行数
                        init.aj('pins.inc.php?ind='+ind+'&ins='+ins+'&row='+row, function(result){
                            if(result!=1){
                                init.num_wins=2;
                            }
                            init.bool=result;
                        })
                    }
                });
            }();
        }
    };
    $(function(){
        init.num();
        init.s();
        init.aj('pins.inc.php?action='+(init.num*init.num-1) , function(e){
            init.ran=JSON.parse(e);
            init.main();
        });
    });
});
