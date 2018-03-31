/**
 * Created by nipeng on 2017/7/8.
 * 登陆view
 */

import React,{Component} from 'react';
import './PPLoginManage.less';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import * as contants from '../../common/Apis/constants';
import * as db from '../../common/Apis/Utils';
import { Carousel,ActivityIndicator,Modal} from 'antd-mobile';
import {wxShare} from '../../common/Apis/wxJsApis';
var wait=60;//时间
var t;//计时器

export default class PPLoginManage extends Component{

    constructor(props){
        super(props);
        this.state={
            authMas:true,
            timeStr:"获取验证码",
            phoneStr:'',
            isFocus:true,


        }

    }
    componentWillMount() {
        document.title = '登陆';

    }
    componentDidMount(){
        let url=db.userAgent()==='Android'?encodeURIComponent(window.location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(url,[],{});


        console.log(this.props)


    }
    render(){
        const {PPLoginReducer,PPLoginAction} = this.props;
        return(//enterpriseIcon@1x
            <div className="container">
                <img className="enterpriseStyle" src={require('../../images/loginPage/enterpriseIcon@1x.png')}/>

                <div className="phoneDiv">

                    <input className="phoneInputStyle" ref="phoneInput" id="mobileId" required="required"  type="tel"  onFocus={()=>this.focusAction()}  placeholder="请输入手机号" maxLength={11} value={this.state.phoneStr} onChange={(e)=>{this.setState({phoneStr:e.target.value})}}/>

                    {this.state.phoneStr&&this.state.isFocus?
                    <img className="clearButton" src={require('../../images/loginPage/clearButton.png')} onClick={()=>{this.clearButtonAction()}}>
                    </img>:null}

                </div>

                <div className="passwordDiv" >

                    <input className="passwordInputStyle" ref="passwordInput" id="passwordInput" onFocus={()=>this.blurAction()} placeholder="请输入验证码" maxLength={9}/>

                    <button id="auth_id" onFocus={()=>this.blurAction()} className="authMaStyle" onClick={this.state.authMas?()=>{this.time(wait)}:null}>
                        {this.state.timeStr}
                    </button>
                </div>

                <div className="tipStyle">
                    如果60s内未收到验证码短信,请重新点击获取验证码
                </div>

                <button className="loginBtnStyle" onFocus={()=>this.blurAction()} onClick={()=>{this.gotoLogin()}}>
                    登录
                </button>

                {PPLoginReducer.isShowLoading?<ActivityIndicator toast text="Loading..." animating={true}/> : null}
            </div>
        )

    }
    focusAction(){

        // alert('122222')
        this.setState({
            isFocus:true
        })

    }
    blurAction(){


        this.setState({
            isFocus:false
        })
    }


    time(wait){// 获取验证码

        if (wait===60){
            if (this.refs.phoneInput.value===''){

                Toast.fail('请输入手机号', 1);

                return;
            }

            if(this.refs.phoneInput.value.length<11||isNaN(this.refs.phoneInput.value)){

                Toast.fail('请输入正确的手机号', 1);
                return;
            }

        }
        if (wait === 0) {
            this.setState({
                authMas:true,
                timeStr:"获取验证码"
            })
            wait = 60;
        }else{

            this.setState({
                authMas:false,
                timeStr:wait+'秒'
            })
            wait--;
            t=setTimeout(()=>{
                this.time(wait);
            },1000)

        }

        if (wait===59){
            const {PPLoginReducer,PPLoginAction} = this.props;
            let url = "/user/sendCode";
            const bodyDate={
                mobile:this.refs.phoneInput.value,
            }
            var that = this;
            PPLoginAction.geterificationPost(url,bodyDate,function (data) {

            },function (err) {
                {
                    that.stopTime()
                    wait=60;
                    that.setState({
                        authMas:true,
                        timeStr:"获取验证码"
                    })
                }
            });
        }



    }

    stopTime(){
        clearTimeout(t);
    }



    gotoLogin(){
        const {PPLoginReducer,PPLoginAction,router,location} = this.props;
        if(this.refs.phoneInput.value===''){
            Toast.fail('请输入手机号', 1);
            return;
        }
        if(this.refs.phoneInput.value.length<11||isNaN(this.refs.phoneInput.value)){

            Toast.fail('请输入正确的手机号', 1);
            return;
        }

        if (this.refs.passwordInput.value===''){
            Toast.fail('请输入验证码', 1);
            return;
        }

        this.stopTime()
        wait=60;
        this.setState({
            authMas:true,
            timeStr:"获取验证码"
        })
        //alert("登录")

        let url = "/user/login";
        const bodyDate={
            userName:this.refs.phoneInput.value,
            checkCode:this.refs.passwordInput.value,
        }

        PPLoginAction.loginButtonPost(url,bodyDate,this.refs.phoneInput.value,function (data) {
            console.log(location)
            // 成功之后调整到想要的界面
            
            switch (location.state.type){
                case 1:{   // 收藏

                    router.goBack();

                    break;
                }
                case 2:{   // 购物车
                    console.log('daghdasfdksjfsaf')
                    let goodInfos = db.readGoods();
                    if (goodInfos){
                        let temAry = [];
                        for (let i=0;i<goodInfos.length;i++){
                            let tempDic = {};
                            let goodInfoDic = goodInfos[i];
                            tempDic['goodsId'] = goodInfoDic.goodsId;
                            tempDic['number'] = goodInfoDic.number;
                            tempDic['param1'] = goodInfoDic.param1;
                            tempDic['param2'] = goodInfoDic.param2;
                            tempDic['param3'] = goodInfoDic.param3;
                            temAry.push(tempDic);
                        }
                        let requestData={
                            userId:data,
                            shopList:JSON.stringify(temAry)
                        };
                        console.log(requestData)
                        PPLoginAction.addShopCart('/shopping/insertshop',requestData,()=>{

                            router.replace({
                                pathname:contants.commonUrl+'/settlement',
                                state:{
                                    goodInfo:location.state.goodInfo
                                }
                            });

                        },(err)=>{



                        });
                    }
                    break;
                }
                case 3:{   //订单结算

                    router.replace({
                        pathname:contants.commonUrl+'/settlement',
                        state:{
                            goodInfo:location.state.goodInfo
                        }
                    });


                }
                case 4:{// 我的订单

                    router.replace({
                        pathname:contants.commonUrl+'/orderHome',
                    })
                    break;
                }
                default:{
                    router.goBack();
                    break;
                }

            }





        },function (err) {


        })



    }

    clearButtonAction(){
        this.refs.phoneInput.value = '';
        document.getElementById("mobileId").focus();
        this.setState({
            phoneStr:'',
        })


        // alert('清除手机号')
    }






}


