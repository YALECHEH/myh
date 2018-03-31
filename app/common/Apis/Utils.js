/**
 * Created by chengjiabing on 17/7/11.
 * 工具类
 */

import alert from "antd-mobile/es/modal/alert";
export const readGoods=()=>//获取购物车缓存
{
    let str  =localStorage.getItem("shoppingCart");
    let goods= JSON.parse(localStorage.getItem("shoppingCart"));
    return goods;
}
export const saveGoods=(goodsAry,isUpdate)=>{//向购物车添加商品 isUpdate true 代表更新,fales 增加
    // goodId:100,
    //     zoomUrl:'www.baidu.com',
    // goodNam:'龙虾',//	商品名称	String
    // AnotherName:'胜多负少发',//	商品别名	String
    // goodPrice:'33',//	商品价格	double
    // goodNum:1,
    //goodSpecification
       // param1
        //param2
       // param3
    console.log(goodsAry)
    let readGoods= JSON.parse(localStorage.getItem("shoppingCart"));
    if(readGoods===null)
    {
        localStorage.setItem("shoppingCart",JSON.stringify(goodsAry));
    }
    else{
        for(let i =0;i<goodsAry.length;i++)
        {
            let dic = goodsAry[i]
            let haveExsit = false;
            for(let j =0;j<readGoods.length;j++)
            {
                let read = readGoods[j]
                if(dic.goodsId===read.goodsId&&dic.param1===read.param1&&dic.param2===read.param2&&dic.param3===read.param3)//商品已经存在
                {
                    if(isUpdate&&isUpdate===true)
                    {
                        read.number = dic.number;
                        haveExsit =true;
                        if(dic.number===0) // 0 代表删除
                            readGoods.splice(j,1)
                    }
                    else
                    {
                        read.number = read.number+dic.number;
                        haveExsit =true;
                    }
                    break
                }
            }
            if(haveExsit===false)//新商品
            {
                readGoods.push(dic)
            }
        }
        localStorage.setItem("shoppingCart",JSON.stringify(readGoods));
    }
}

export const deleteGoods=(goodsAry)=>{//更新购物车添加商品
    console.log(goodsAry+'haha')
    let readGoods= JSON.parse(localStorage.getItem("shoppingCart"));
    if(readGoods===null)
        return;
    else{
        for(let i =0;i<goodsAry.length;i++)
        {
            let dic = goodsAry[i]
            for(let j =0;j<readGoods.length;j++)
            {
                let read = readGoods[j]
                if(dic.goodsId===read.goodsId&&dic.param1===read.param1&&dic.param2===read.param2&&dic.param3===read.param3)//商品已经存在
                {
                    readGoods.splice(j,1)
                    break
                }
            }
        }
        localStorage.setItem("shoppingCart",JSON.stringify(readGoods));
    }
}


export const readUserInfo=()=>{ // 获取用户信息

    let str = localStorage.getItem("userInfo")
    let user = JSON.parse(localStorage.getItem("userInfo"))
    console.log(user);
    return user;
}


export const saveUserId =(userInfo)=>{ // 存储用户信息
    // userId 用户id
    // let readUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    // if (readUserInfo===null){

        localStorage.setItem("userInfo",JSON.stringify(userInfo));

    // }else {
    //
    //
    //
    // }
}




// 对时间戳进行格式化
export const format=(time,format)=> {
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}


//文件数组data{file，userID}，回掉serverCallback
export function fileUpload(data, serverCallback) {
    console.log(data);
    var UploadSuccessData = [];
    //console.log(data.files);
    if(data == null || data.length == 0) {
        //console.log('sdsdsd');
        serverCallback("上传文件为空");
    } else {
        //console.log(data);
        var files = data.file;
        for(var i = 0; i < files.length; i++) {
            console.log(files[i]);
            var fileSuffix=files[i].type.split('/')[1];//文件后缀
            getAllHash(files[i],function(HashData){
                //console.log(HashData);
                var httpTest = window.location.protocol;
                var test = window.location.host;
                var dataFile={
                    hostUrl:httpTest+"//"+test,
                    fileUrl:HashData.yuanHash+"."+fileSuffix,
                    zoomUrl:HashData.yaHash+"."+fileSuffix,
                    fileType:0
                };
                var dataFiles=[];
                dataFiles.push(dataFile);
                //console.log(dataFiles);
                var UploadData={
                    userId:data.userId,
                    file:dataFiles
                };
                //console.log(UploadData);
                $.ajax({
                    type: "post",
                    url: "http://192.168.9.81/myh-admin/file/insertFileUrl",
                    contentType:"application/json",
                    data:JSON.stringify(UploadData),
                    dataType: "json",
                    success: function(data) {
                        //console.log("上传图片接口",data);
                        UploadSuccessData.push(data[0]);
                        if(UploadSuccessData.length==files.length){
                            //console.log(i);
                            var data={
                                status:1,
                                UploadSuccessData:UploadSuccessData
                            };
                            serverCallback(data);
                        }else{
                            return null;
                        }
                    },
                    error: function(err) {
                        console.log('-----err----',"失败");
                        alert("网络错误");
                    }
                });
            });

            /*fileData.append("fileType", 0);
             fileData.append("userId", data.userId);*/
            /*generateHash(fileData,function(data){
             console.log(data);
             });*/
            /*$.ajax({
             type: "post",
             url: "http://192.168.9.81/upload",
             async: true,
             data: fileData,
             processData:false,
             contentType:false,
             success: function(data) {
             console.log("生成hash",data);
             UploadSuccessData.push(data);
             if(UploadSuccessData.length==files.length){
             console.log(i);
             var data={
             status:1,
             UploadSuccessData:UploadSuccessData
             };
             serverCallback(data);
             }else{
             return null;
             }
             },
             error: function(err) {
             console.log("失败");
             alert("网络错误");
             }
             });*/
        };
    }
};
//获取大图和缩略图hash值
function getAllHash(files,getHashCallback){
    var imgSuccessDate={};
    var whetherOver=0;
    //压缩图片
    resizeImage(files.url,function(data){
        var fileDataYa = new FormData();
        fileDataYa.append("file", convertBase64UrlToBlob(data));
        generateHash(fileDataYa,function(data){
            imgSuccessDate.yaHash=data.Hash;
            imgSuccessDate.yaName=data.Name;
            whetherOver=whetherOver+1;
            console.log(whetherOver);
            if(whetherOver==2){
                getHashCallback(imgSuccessDate);
            }
        });
    },256,256);
    //上传原图
    var fileData = new FormData();
    fileData.append("file", files);
    generateHash(fileData,function(data){
        imgSuccessDate.yuanHash=data.Hash;
        imgSuccessDate.yuanName=data.Name;
        whetherOver=whetherOver+1;
        //console.log(whetherOver);
        if(whetherOver==2){
            getHashCallback(imgSuccessDate);
        }
    });
};
//上传图片获取hash值请求
function generateHash(fileData,successCallback){
    $.ajax({
        type: "post",
        url: "http://192.168.9.81/upload",
        async: true,
        data: fileData,
        processData:false,
        contentType:false,
        success:successCallback,
        error: function(err) {
            console.log('----------图片上传失败------------',err);
            alert("网络错误");
        }
    });
};
//base64格式转Blob
function convertBase64UrlToBlob(urlData) {
    var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for(var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
};

//src图片路径，callback回掉函数 ，w宽度，h高度
function resizeImage(src,callback,w,h){
    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        im = new Image();
    w = w || 0,
        h = h || 0;
    im.onload = function(){
        //为传入缩放尺寸用原尺寸
        !w && (w = this.width);
        !h && (h = this.height);
        //以长宽最大值作为最终生成图片的依据
        if(w !== this.width || h !== this.height){
            var ratio;
            if(w>h){
                ratio = this.width / w;
                h = this.height / ratio;
            }else if(w===h){
                if(this.width>this.height){
                    ratio = this.width / w;
                    h = this.height / ratio;
                }else{
                    ratio = this.height / h;
                    w = this.width / ratio;
                }
            }else{
                ratio = this.height / h;
                w = this.width / ratio;
            }
        }
        //以传入的长宽作为最终生成图片的尺寸
        if(w>h){
            var offset = (w - h) / 2;
            canvas.width = canvas.height = w;
            ctx.drawImage(im,0,offset,w,h);
        }else if(w<h){
            var offset = (h - w) / 2;
            canvas.width = canvas.height = h;
            ctx.drawImage(im,offset,0,w,h);
        }else{
            canvas.width = canvas.height = h;
            ctx.drawImage(im,0,0,w,h);
        }
        callback(canvas.toDataURL("image/png"));
    };
    im.src = src;
}

export const userAgent=()=>{
    const u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        return 'Android'
    }else{
        return 'IOS'
    }
}

//去除字符串前后空格
export const  trim=(param)=>{
    if ((vRet = param) == '') { return vRet; }
    if ((vRet = param) == null) { return ''; }

    while (true) {
        if (vRet.indexOf (' ') == 0) {
            vRet = vRet.substring(1, parseInt(vRet.length));
        } else if ((parseInt(vRet.length) != 0) && (vRet.lastIndexOf (' ') == parseInt(vRet.length) - 1)) {
            vRet = vRet.substring(0, parseInt(vRet.length) - 1);
        } else {
            return vRet;
        }
    }
}


