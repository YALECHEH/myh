/**
 * Created by chenmao on 2017/7/11.
 */
import * as Util from './Fetch'
import * as constant from './constants'
/**
 * shareInfo={
 *      title:'',分享标题,
 *      desc:'',分享描述,
 *      imgUrl:'',分享图片缩略图url,
 *      linkUrl:'',分享连接url
 * }
 *jsApiList是一个需要用到微信api数组；例如['checkJsApi','chooseImage','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ']；
 *url当前页面通过encodeURIComponent(location.href.split('#')[0]);取得
 * isGoodDetailPage判断是否是商品详情的分享
 */
export const wxShare=(url,jsApiArr,shareContent,isGoodDetailPage)=>{
    let shareInfo;
    if(isGoodDetailPage){
        shareInfo=shareContent;
    }else{
        shareInfo={
            title:constant.shareShopTitle,
            desc:constant.shareShopDesc,
            linkUrl:'http://uu.uns1066.com/UU/index.html',
            imgUrl:constant.shareShopImgUrl
        }
    }
    console.log(shareInfo)
    let jsApiList=['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareQZone','chooseImage','previewImage'];
    Util.get("http://192.168.9.81:9090/myh-admin/weixin/sharePage?pageUrl="+url,(res)=>{
        //alert(JSON.stringify(res))
        if(res.status==0){
            wx.config({
                debug: false,
                appId: constant.appId,
                timestamp: res.body.nowTime,
                nonceStr: res.body.noncestr,
                signature: res.body.encodeTicket,
                jsApiList: jsApiList
            });

            wx.ready(function(){
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: shareInfo.title,
                    link: shareInfo.linkUrl,
                    imgUrl: shareInfo.imgUrl,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                       // alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        //alert('已分享');
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                       // alert('失败');
                        //alert(JSON.stringify(res));
                    }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title:shareInfo.title,
                    desc: shareInfo.desc,
                    link: shareInfo.linkUrl,
                    imgUrl: shareInfo.imgUrl,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                        //alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        //alert('已分享');
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                       // alert('失败')
                        //alert(JSON.stringify(res));
                    }
                });
                //分享到QQ
                wx.onMenuShareQQ({
                    title: shareInfo.title,
                    desc:shareInfo.desc,
                    link: shareInfo.linkUrl,
                    imgUrl: shareInfo.imgUrl,
                    trigger: function (res) {
                        //alert('用户点击分享到QQ');
                    },
                    complete: function (res) {
                        //alert('成功')
                        //alert(JSON.stringify(res));
                    },
                    success: function (res) {
                        //alert('已分享');
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                        //alert('失败');
                        //alert(JSON.stringify(res));
                    }
                });
                //分享到QQ空间
                wx.onMenuShareQZone({
                    title: shareInfo.title, // 分享标题
                    desc: shareInfo.desc, // 分享描述
                    link: shareInfo.linkUrl, // 分享链接
                    imgUrl: shareInfo.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        }else{
            //alert(res.msg);
        }
    },(err)=>{
        console.log(err);
    });
};