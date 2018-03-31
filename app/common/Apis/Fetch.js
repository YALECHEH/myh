/**
 * 封装get,post等请求方法
 * Created by chenmao on 2017/6/28.
 */
 const commonUrl="http://192.168.9.81/myh-admin";
//const commonUrl="http://172.22.200.107:9090/myh-admin";
export const get=(url,successCallback,failCallback)=>{
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data){
            successCallback(data);
        },
        error:function (err) {
            failCallback(err);
        }
    });
};

export const post=(url,data,successCallback,failCallback)=>{
    let Url=commonUrl+url;
    $.ajax({
        type: "POST",
        url: Url,
        data: data,
        dataType: "json",
        beforeSend:function(){
            //发送之前的回调，返回false可以取消本次请求
        },
        success: function(data){
            successCallback(data);
        },
        error:function (err) {
            failCallback(err);
        },
        complete:function () {
            //不管成功失败都走这个回调
        }
    });
};

export const postTow=(url,data,successCallback,failCallback)=>{
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        beforeSend:function(){
            //发送之前的回调，返回false可以取消本次请求
        },
        success: function(data){
            successCallback(data);
        },
        error:function (err) {
            failCallback(err);
        },
        complete:function () {
            //不管成功失败都走这个回调
        }
    });
};


