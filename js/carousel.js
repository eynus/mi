$(function () {
    //封装轮播图  --前提需要是n+1的图片结构
    window.Carousel = function ($twoBtn, nextBtnClassName, $dotOfParent, curIndex, unitWidth, len, $imgOfParent, speed, interval) {
        $imgOfParent.css('width', unitWidth * (len+1));
        //先点击一次第一个，使得第一个选中
       
        //绑定点击事件-上/下一张-
        $twoBtn.on('click', clickEventCbs);
        //绑定点击事件-小圆点
        $dotOfParent.on('click', 'a', function () {
            curIndex = $(this).index();
            changeView();
        });
        $dotOfParent.children().first().trigger('click');
        //func：视图切换:slider,小圆点都改变
        function changeView() {
            $imgOfParent.stop(false, true).animate({
                left: -curIndex * unitWidth,
            }, speed)
            $dotOfParent.children().eq(curIndex % len).addClass('active').siblings().removeClass('active');
        }

        function clickEventCbs() {
            // console.log(curIndex);

            if ($(this).hasClass(nextBtnClassName)) {//下一张
                if (curIndex == len) {
                    curIndex = 0;
                    $imgOfParent.css('left', 0)
                    // curIndex = 1;
                }
                curIndex++;
            } else {//上一张
                if (curIndex == 0) {
                    $imgOfParent.css('left', -unitWidth * len);
                    curIndex = len;
                }
                curIndex--;
            }
            changeView();
        }
        // TO DO:animation + autoplay
        setInterval(function () {
            $twoBtn.filter('.' + nextBtnClassName).trigger('click');

        }, interval);
    }
})