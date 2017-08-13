/**
 * Created by 49234 on 2017/8/6.
 */
$(document).ready(function () {
    var config={
        syncURL:"https://wd0581696758ryfuwr.wilddogio.com/"
    }
    wilddog.initializeApp(config);
    var ref = wilddog.sync().ref();
    var arr=[];
    //点击发送按钮把弹幕文字发送到屏幕，同时清空文本框里面的文字
    $(".send_btn").click(function () {
        //获取文本框的文字
        var text=$(".inputText").val();
        //把信息添加到wilddog数据库
        ref.child('message').push(text);
        //清空文本框
        $(".inputText").val('');
    });
    //监听回车键
    $(".inputText").keypress(function (event) {
        //回车键的ASCII码为13
        if(event.keyCode=="13"){
            $(".send_btn").trigger('click');
        }
    });
    //清屏的点击事件
    $(".clear_btn").click(function () {
        //清屏就是把数据库的弹幕清零
        ref.remove();
        arr=[];
        //同时div区域内容清除
        $(".danmuShow").empty();
    });



    //屏幕在显示弹幕屏幕的时候，如果要加载新弹幕，那么就会触发child_added.
    ref.child('message').on('child_added',function (snapshot) {
        //获取新弹幕内容
        var text=snapshot.val();
        //把弹幕存到后台数据库
        arr.push(text);
        var textObj=$("<div class=\"danmuMessage\"></div>");
        textObj.text(text);
        //把弹幕内容追加到.d_show这个节点下面。
        $(".danmuShow").append(textObj);
        //弹幕移动方法
        moveObj(textObj);
    });

    ref.on('child_removed',function () {
        arr=[];
        $('.danmuShow').empty();
    });

    //获取屏幕左上角的点的高度,.dammuMask在html中对应的是视频区域的div
    var topMin=$('.danmuMask').offset().top;
    //获取屏幕左下角的点的高度
    var topMax=topMin+$('.danmuMask').height();
    var _top=topMin;

    var moveObj=function (obj) {
        var _left=$('.danmuMask').width()-obj.width();
        //为了保证弹幕是从右边从上往下依次出来,我们每发一条弹幕,下一条的弹幕位置就在上一条下面出来。
        _top=_top+50;
        //当一次往下最后一条弹幕的高度小于最小的50px的时候,弹幕从屏幕上方开始发。
        if(_top>(topMax-50)){
            _top=topMin;
        }
        obj.css({left:_left,top:_top,color:getReandomColor()});
        var time=20000+10000+Math.random();
        obj.animate({left:"-"+_left+"px"},time,function () {
            obj.remove();
        });
    }
    var getReandomColor=function () {
        return'#'+(function (h) {
                return new Array(7-h.length).join("0")+h})((Math.random()*0x1000000<<0).toString(16))
    }
    var getAndRun=function () {
        if(arr.length>0){
            var n=Math.floor(Math.random()*arr.length+1)-1;
            var textObj=$("<div>"+arr[n]+"</div>");
            $(".danmuShow").append(textObj);
            moveObj(textObj);
        }
        setTimeout(getAndRun,3000)
    }
    //jQuery.fx.interval 属性用于改变以毫秒计的动画运行速率。可操作该属性来调整动画运行的每秒帧数
    jQuery.fx.interval=50;
    getAndRun();
});