$.extend({
    //token-存取localStorage
    setToken: function (token) {
        localStorage.setItem('Token', token);
    },
    getToken: function () {
        return localStorage.getItem('Token');
    },
    logout: function () {
        localStorage.removeItem('Token');//删除token
        window.location.reload();//刷新页面
    },

    //ajax-api
    api: function (method, path, data, context) {
        const HOST = 'http://vip.chanke.xyz/mi';

        return $.ajax({
            method: method,
            url: HOST + path,
           
            headers: {
                Token: this.getToken()//token
            },
            //禁用cookie模式-跨域时使用
            xhrFields:{
                withCredentials:true
            },
            data: data,
            context: context || this,
        }).then(function (data) {
            if (!data.errorCode && data.data) {//当data.data存在且没有errorCode
                return data.data;
            }
        }, function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(errorThrown);
            let errorMsg;
            //通用失败处理-errorMsg获取
            if (jqXHR.responseJSON && jqXHR.responseJSON.errorMessage) {//errorMessage存在时
                errorMsg = jqXHR.responseJSON.errorMessage;
            } else {
                errorMsg = errorThrown || textStatus;
            }
            //可控制失败处理方式-errorMsg展示方式
            if (this.silent) {
                console.warn(jqXHR);
                console.warn(errorMsg);
            } else {
                window.alert(errorMsg);//粗暴提醒
            }
            return $.Deferred().reject();//确保外面进入fail分支
        });
    },
    apiGet: function (path) {
        return this.api('GET', path);
    },
    apiPost: function (path, data) {
        return this.api('POST', path, data);
    },
    //获取用户信息-登录
    getUserInfo: function () {
        if (this.getToken()) {//本地是否有token
            return this.api('GET', '/user/getUserInfo', false, { silent: true })//false-data，this.silent就有了判断
                .fail(this.logout);//请求失败就说明token失效，立即注销
        } else {
            return this.Deferred().reject();//本地根本没有token,直接进入fail.确保外面进入fail分支
        }
    },

    //商品详情页的url规则
    productLink: function (pid) {
        return 'product.html?pid=' + pid;
    },
    parseProductId: function () {
        const match = location.search.match(/^\?pid=(\d+)$/);
        return match ? match[1] : false;
    },
})