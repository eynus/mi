$(function () {
    const tpl = $(`
    <div class="topbar">
    <div class="container">
        <div class="topbar-nav">
            <a href="">小米商城</a><span>|</span>
            <a href="">MIUI</a><span>|</span>
            <a href="">IoT</a><span>|</span>
            <a href="">云服务</a><span>|</span>
            <a href="">金融</a><span>|</span>
            <a href="">有品</a><span>|</span>
            <a href="">小爱开放平台</a><span>|</span>
            <a href="">政企服务</a><span>|</span>
            <a href="">Select Region</a>
        </div>
        <div class="topbar-cart logined"><a href="cart.html"><i class="iconfont ">&#xe60c;</i>购物车(&nbsp;&nbsp;<span
                    class="cart-num">0</span>&nbsp;)</a></div>
        <div class="topbar-info clearfix">
            <a href="serviceLogin.html" class="not-logined">登录</a><span class="logined">|</span>
            <a href="serviceLogin.html?tab=register" class="not-logined">注册</a><span class="logined">|</span>
            <a href="javascript:;" class="logined username"></a><span class="logined">|</span>
            <a href="javascript:;" class="logined logout">注销</a>
            <a href="" class="sep logined">消息通知</a>
        </div>
    </div>
</div>

<div class="header">
    <div class="container">
        <div class="header-logo">
            <a href="#" class="lr">小米官网</a>
        </div>
        <div class="header-nav">
            <ul class="nav-list clearfix">
                <li class="nav-category">
                    <a href="">全部商品分类</a>
                    <div class="category-list">
                        <ul>
                            <li class="tpl-cat">
                                <a class="title">
                                    <span></span>
                                    <i class="iconfont"></i>
                                </a>
                                <div class="children clearfix">
                                    <ul class="children-list">
                                        <li class="tpl-children">
                                            <a href="#">
                                                <img src="" alt="">
                                                <span class="text"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
     
                <li class="nav-item tpl-nav">
                    <a href=""></a>
                </li>
            </ul>
        </div> 
        <div class="header-search">
            <form action="" class="search-form">
                <input type="search" name="keyword" class="search-text">
                <input type="submit" value="&#xe616;" class="search-btn iconfont">
            </form>
        </div>
    </div>
</div>
`);
    // 利用$形成dom节点，再生成模板，再删除
    const catUl = tpl.find('.category-list ul');
    const childTpl = tpl.find('.tpl-children').remove();//先提取子模板li，再删除
    const catTpl = tpl.find('.tpl-cat').remove();//先提取父模板，再删除。

    const navUl = tpl.find('.nav-list');//整个页面导航ul
    const navTpl = tpl.find('.tpl-nav').remove();//除了全部分类之外的导航item

    //剔除模板后插入到页面占位置
    $('body').prepend(tpl);
    //请求左侧cat-ajax
    $.apiGet('/menu?type=left',{silent:true}).done(function (result) {
        // console.log(result);

        let catClone, childrenUl, childClone;
        for (const cat of result) {
            catClone = catTpl.clone();
            //cat-name赋值
            catClone.find('a span').text(cat.name);
            //子元素
            if (cat.list) {
                childrenUl = catClone.find('.children-list');
                for (const item of cat.list) {
                    childClone = childTpl.clone();
                    childClone.find('a').attr('href', $.productLink(item.pid));//设置链接href
                    childClone.find('a span').text(item.name);//设置name
                    childClone.find('a img').attr('src', item.img);//设置图片

                    //插入ul中
                    childrenUl.append(childClone);
                }
            } else {
                //没有list-删除div
                catClone.find('.children').remove();
            }
            //插入
            catUl.append(catClone);
        }

    })
    //请求导航栏数据
    $.apiGet('/menu?type=top',{silent:true}).done(function (result) {
        // console.log(result);
        let navClone;
        for (const item of result) {
            navClone = navTpl.clone();
            navClone.find('a').text(item.name).attr('href', item.url);

            navUl.append(navClone);
        }
    })
    //判断登录状态
    $.getUserInfo().then(function (data) {
        //已登录
        $('.not-logined').hide();
        $('.logined').show();
        $('.username').text(data.name);//设置用户名
        $('.logout').on('click', function () {
            $.logout();
        })
        //请求购物车数据
        $.apiGet('/user/cart').done(function (data) {
            // console.log(data);
            $('.cart-num').text(data.reduce(function (sum, item) {
                return sum + +item.quantity;
            }, 0))

        })
    }, function () {
        //未登录-
        $('.not-logined').show();
        $('.logined').hide();
    })


})
