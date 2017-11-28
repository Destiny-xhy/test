;(function(){
    // 设置头部在滑动的时候背景透明度变化
    var topBar=document.querySelector(".jd-header");
    var maxTop=400;
    window.addEventListener("scroll",function(e){
        var top=window.pageYOffset;
        if(top>=maxTop){
            topBar.style.backgroundColor="rgba(201, 21, 35, 0.8)";
        }else{
            topBar.style.backgroundColor="rgba(201, 21, 35, "+ top/maxTop*0.8 +")";
        }
    })


    // 电饭煲，向右滑动
    // 动态设置ul的宽度
    var scrollWrap=document.querySelector(".jd-sc-b ul");
    var lis=scrollWrap.querySelectorAll("li");
    // 动态设置ul的宽度为所有的li的宽度的总和
    scrollWrap.style.width=lis[0].offsetWidth*lis.length+'px';
})();


;(function(){
    // 倒计时
    //   1.有开始时间和结束时间
    var nowDate=new Date();
    var furDate=new Date('Nov 20 2017 21:00:00');
    //   2.获取时间差，获取到的是毫秒数，转换成秒数
    var ds=Math.floor((furDate-nowDate)/1000);
    console.log(ds);
    // 获取时间对应的span元素
    var spans=document.querySelectorAll(".jd-sc-time span")
    //   3.开始定时器，自动秒数自减
    var timer=null;
    // 最开始的时候调用一次time,是的屏幕上一开始就会出现时间
    time();
    timer=setInterval(time,1000);
    function time(){

        // 自动秒数自减
        ds--;

        // 如果时间到了，则停止定时器
        if(ds<0){
            clearInterval(timer);
            return false;
        }

        // 4.将秒数转换成时分秒
        var h=Math.floor(ds%86400/3600);
        var m=Math.floor(ds%3600/60);
        var s=Math.floor(ds%60);

        // 将时间连城字符串
        var str=addZero(h)+':'+addZero(m)+':'+addZero(s);
        //5.将时分秒设置给对应的位置
        for(var i=0;i<str.length;i++){
            spans[i].innerHTML=str[i];
        }
        
        
        
    }

    // 补0函数
    function addZero(n){
        return n>9?n:'0'+n;
    }

})();

;(function(){
    // 自动轮播图
    var newsScroll=document.querySelector(".scroll-wrap");
    var lis=newsScroll.querySelectorAll("li");
    var lisHeight=lis[0].offsetHeight;
    var timer=null;
    var index=0;
    //   1.复制第一个li追加到ul的后面
    newsScroll.appendChild(lis[0].cloneNode(true));
    //   2.设置信号量index，每一次让ul往上移动一个li的高度
    timer=setInterval(function(){
        // // 判断当是最后一个li的时候还原成0
        // if(index>=lis.length){
        //     index=0;
        //     newsScroll.style.transition='none';
        //     newsScroll.style.transform='translateY(0px)';                             
        // }
        // // 强制刷新浏览器的内部队列
        // lis[0].offsetWidth;

        index++;
        newsScroll.style.transition='transform .5s';
        newsScroll.style.transform='translateY('+ (-index*lisHeight) +'px)';                             
    
    },1000);

    // 当上面的过渡结束后，调用的事件监听
    newsScroll.addEventListener("transitionend",function(){
        if(index>=lis.length){
            index=0;
            newsScroll.style.transition='none';
            newsScroll.style.transform='translateY(0px)';
        }
    })
})();


;(function(){
    // 轮播图
    // JS的准备工作
    //     （1）动态设置了ul的高度（将li的高度赋值给ul，在resize的时候重新设置一下）
    //     （2）动态生成了小圆点（根据li的个数得到）
    //     （3）初始化三个变量 这三个变量装最开始的下标
    //         left = lis.length - 1
    //         center = 0
    //         right = 1
    //     （4）执行"归位"
    //     （5）轮转变量里面的下标 执行"归位" 右边的li永远是替补的，不需要添加过渡
    //     （6）设置小圆点 = > 将所有的小圆点都去掉current类 给center的小圆点添加上current
    //         细节：在获取小圆点的时候要在初始化之后
    //     （7）给carousel绑定touch事件 
    //     （8）在touchstart里面获取手指的水平落点，并且干掉定时器
    //     （9）在move里面重新获取手指的水平落点并且减去开始时候的手指落点 得到滑动的距离 
    //     （10）将这个距离加上left center right的初始位置 （因为这个自带正负，所以不需要考虑方向）
    //     （11）在move的时候一定要干掉过渡
    //     （12）在end的时候检测当前滑动是否成功 依据是滑动的距离（dx的绝对值）是否超过屏幕的1/3
    //     超过则判断滑动成功 失败则滑动失败
    //     （13）如果失败 则给left right center 都添加上过渡 进行“归位”
    //     （14）如果成功 则判断是什么方向 如果是左 则执行下一张的逻辑 反之 则执行上一张的逻辑
    //     （15）重新开启定时器
    var carousel=document.querySelector('.carousel');
    var ul=carousel.querySelector("ul");
    var lis=ul.querySelectorAll("li");
    var points=carousel.querySelector(".points");
    var timer=null;

    // 1.动态设置ul的宽度
    ul.style.height=lis[0].offsetHeight+'px';
    // 缩放屏幕的时候重新获取ul的高度
    window.addEventListener('resize',function(){
        ul.style.height=lis[0].offsetHeight+'px';
    })

    // 2.根据li的个数动态生成小圆点
    for(var i=0;i<lis.length;i++){
        var li=document.createElement("li");
        if(i===0){
            li.classList.add("current");
        }
        points.appendChild(li);
    }

    // 3.初始化三个变量
    var left=lis.length-1;
    var center=0;
    var right=1;
    // 初始化三个位置上的li元素
    lis[left].style.transform='translate('+ (-lis[0].offsetWidth) +'px)';
    lis[center].style.transform='translate(0px)';
    lis[right].style.transform='translateX('+ lis[0].offsetWidth +'px)';

    // 轮播逻辑
    timer=setInterval(showNext,1500);

    // 显示下一张图片
    function showNext(){
        // 轮转下标
        left=center;
        center=right;
        right++;
        // 极值判断
        if(right>lis.length-1){
            right=0;
        }
        // 添加过渡
        lis[left].style.transition='transform .5s';
        lis[center].style.transition='transform .5s';
        lis[right].style.transition='none';
        
        // 将li移动
        lis[left].style.transform='translate('+ (-lis[0].offsetWidth) +'px)';
        lis[center].style.transform='translate(0px)';
        lis[right].style.transform='translateX('+ lis[0].offsetWidth +'px)';

        setPoints();
    }

    // 显示上一张图片
    function showPrev(){
        // 轮转下标
        right=center;
        center=left;
        left--;
        // 极值判断
        if(left<0){
            left=lis.length-1;
        }
        // 添加过渡
        lis[right].style.transition='transform .5s';
        lis[center].style.transition='transform .5s';
        lis[left].style.transition='none';
        // 移动li
        lis[left].style.transform='translateX('+(-lis[0].offsetWidth)+'px)';
        lis[center].style.transform='translateX(0px)';
        lis[right].style.transform='translateX('+ lis[0].offsetWidth+'px)';
        
        // 设置小圆点
        setPoints();
    }

    // 获取小圆点的元素，要在创建之后获取
    // 移动li的时候移动小圆点，就是给小圆点添加对应的类
    var pointsLi=points.querySelectorAll("li");
    function setPoints(){
        for(var i=0;i<pointsLi.length;i++){
            pointsLi[i].classList.remove('current');
        }
        pointsLi[center].classList.add('current');
    }

    // 注册touch事件，即触屏事件
    var startX=0;
    var startTime=null;
    carousel.addEventListener('touchstart',function(e){
        // 获取开始滑动的时间
        startTime=new Date();
        // 清除定时器
        clearInterval(timer);
        // 获得开始的时候手指落点
        startX=e.changedTouches[0].clientX;
    });
    carousel.addEventListener('touchmove',function(e){
        // 获得滑动的距离
        var dx=e.changedTouches[0].clientX-startX;
        // 在move时间里面不要添加过渡
        lis[left].style.transition='none';
        lis[center].style.transition='none';
        lis[right].style.transition='none';
        
        // 让三张图片跟随移动
            // 初始化三个位置上的li
        lis[left].style.transform='translateX('+ (-lis[0].offsetWidth+dx) +'px)';
        lis[center].style.transform='translateX('+ dx +'px)';
        lis[right].style.transform='translateX('+ (lis[0].offsetWidth+dx) +'px)';
        

    });
    carousel.addEventListener('touchend',function(e){
        // 获得滑动时间
        // 获得滑动距离
        // 如果滑动超过屏幕的1/3 || 滑动时间小于300ms && 滑动的距离大于30，则滑动成功
        var dTime=new Date()-startTime;
        var dx=e.changedTouches[0].clientX-startX;
        if(Math.abs(dx)>lis[0].offsetWidth/3 || (dTime<300&&Math.abs(dx)>30)){
            if(dx<0){
                showNext();
            }else{
                showPrev();
            }
        }else{
            // 滑动失败
            // 添加过渡
            lis[left].style.transition="transform .5s";
            lis[center].style.transition="transform .5s";
            lis[right].style.transition="transform .5s";
            // 归位
            lis[left].style.transform="translateX("+(-lis[0].offsetWidth)+"px)";
            lis[center].style.transform="translateX(0px)";
            lis[right].style.transform="translateX("+ lis[0].offsetWidth +"px)";

        }
        clearInterval(timer);
        timer=setInterval(showNext,1500);
    })
})();