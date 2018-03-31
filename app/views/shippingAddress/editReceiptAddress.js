/**
 * Created by JieLi on 2017/7/8.
 * 编辑收货地址
 */
import React,{Component} from 'react';
import {TextareaItem,Picker, List,InputItem,Toast,ActivityIndicator} from 'antd-mobile';
import {post} from '../../common/Apis/Fetch'
import * as db from '../../common/Apis/Utils';
import './editReceiptAddress.less';
import {wxShare} from '../../common/Apis/wxJsApis';
import * as contants from '../../common/Apis/constants'



import {areaInfo} from './regionalData'

const AreaChoose = props => (
    <div
        onClick={props.onClick}
        style={{ }}
    >
        <div className="areaChoose">
            <p>{props.children}</p>
            <p id="areaName">{props.extra}</p>
            <img src={require('../../images/shippingAddress/k12.png')}></img>
        </div>
    </div>
);

let userId='';
export default class EditReceiptAddress extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow:false,
            addressId : '',
            defaultAddress:false,
            areaNameCode:[],
            receiptName:'',
            receiptTel:'',
            receiptAddress:'',

            nameFocus:0,
            telFocus:0,

        };
      }

    selectImage(){
        return(
            this.state.defaultAddress
                ?
                <img src={require('../../images/shippingAddress/k7.png')}></img>
                :
                <img src={require('../../images/shippingAddress/k11.png')}></img>

        )
    }


    /*
     {this.state.receiptName&&this.state.receiptTel&&this.state.areaNameCode.length&&this.state.receiptAddress
     ?
     <div className="saveAddress">
     <p onClick={()=>{this.saveAddress()}}>保存</p>
     </div>
     :
     <div className="disableBtn">
     <p>保存</p>
     </div>
     }
     */

    render() {
        return (
            <div className="containV">
                <div className="defaultAddress">
                    <span>设为默认地址</span>
                    {this.props.location.state.dataLength
                        ?
                        <div onClick={()=>{this.setDefaultAddress()}}>
                            {this.selectImage()}
                        </div>
                        :
                        <div>
                            {this.selectImage()}
                        </div>
                    }

                </div>
                <div className="receiptPeople">
                    <div className="name">
                        <p>收货人</p>
                        <input id="name" required="required" ref='name' onFocus={()=>this.showNameClearBtn(1)} type="text" placeholder="请输入姓名" maxLength="20" value={this.state.receiptName} onChange={(e)=>this.setReceiptName(e)}/>
                        {this.state.receiptName&&this.state.nameFocus
                        ?
                            <img src={require('../../images/shippingAddress/n6@0.5x.png')} className="clear-input" onClick={()=>this.clearNameInput({receiptName:''})}/>
                        :
                            null
                        }
                    </div>
                    <div className="userTel">
                        <p>手机</p>
                        <input id="tel" required="required" ref="tel" placeholder="请输入手机号码" onFocus={()=>this.showTelClearBtn(1)} maxLength="11" type="tel" value={this.state.receiptTel} onChange={(e)=>this.setReceiptTel(e)}/>
                        {this.state.receiptTel&&this.state.telFocus
                        ?
                            <img className="clear-input" src={require('../../images/shippingAddress/n6@0.5x.png')} onClick={()=>this.clearTelInput({receiptTel:''})}/>
                        :
                            null
                        }

                    </div>

                </div>
                <div className="selectArea">

                    <Picker
                        extra="请选择区域"
                        data={areaInfo}
                        value={this.state.areaNameCode}
                        onChange={e=>this.setState({areaNameCode:e})}
                        onOk={()=>this.hiddenClearBtn()}
                        onDismiss={()=>this.hiddenClearBtn()}
                    >
                        <AreaChoose>所在地区</AreaChoose>
                    </Picker>


                    <TextareaItem
                        id="detailsAdd"
                        title="详细地址"
                        placeholder="请输入详细地址"
                        data-seed="logId"
                        autoFocus
                        autoHeight
                        value={this.state.receiptAddress}
                        onChange={(e)=>{this.setReceiptAddress(e)}}
                        maxLength="30"
                    />
                </div>
                <div className="saveAddress">
                    <p onClick={()=>{this.saveAddress()}}>保存</p>
                </div>
                
                {this.state.isShow?<div className="loadingView"></div>:null}


            </div>
        )
    }

    //设置输入框的值
    setReceiptName(param){
        this.setState({
            receiptName:param.target.value
        });
    }

    setReceiptTel(param){
        this.setState({
            receiptTel:param.target.value
        });
    }

    setReceiptAddress(param){
        this.setState({
            receiptAddress:param,
            nameFocus:0,
            telFocus:0
        });
    }

    setDefaultAddress(){
        let addressState = this.state.defaultAddress;
        this.setState({
            defaultAddress:!addressState,
            nameFocus:0,
            telFocus:0
        });
    }

    hiddenClearBtn(){
        this.setState({
            nameFocus:0,
            telFocus:0
        });
    }


    //清楚输入框内容
    clearNameInput(param){
        this.refs.name.focus();
        this.setState({
            receiptName:''
       });
    }
    clearTelInput(){
        this.refs.tel.focus();
        this.setState({
            receiptTel:''
        });
    }

    //设置清除按钮是否显示
    showNameClearBtn(param){

        this.setState({
            nameFocus:param,
            telFocus:0
        });
    }
    showTelClearBtn(param){
        this.setState({
            telFocus:param,
            nameFocus:0
        });
    }

    componentWillMount() {
        if(this.props.location.state.pageType == 'edit'){
            document.title = "编辑收货地址";

        }else {
            document.title = "新增收货地址";
        }

    }





    componentDidMount() {
        let url=db.userAgent()==='Android'?encodeURIComponent(window.location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(url,[],{});
        userId=db.readUserInfo().userId;
        if(this.props.location.state.dataLength == 0){
            this.setState({
                defaultAddress:1
            });
        }
        if(this.props.location.state.addressInfo){
            let addressInfo = this.props.location.state.addressInfo;
            this.setState({
                areaNameCode:[addressInfo.provinceCode,addressInfo.cityCode, addressInfo.countryCode],
                receiptName:addressInfo.receiveName,
                receiptTel:addressInfo.phone,
                receiptAddress:addressInfo.adress,
                addressId:addressInfo.receiveId,
            });
            // this.state.addressId=addressInfo.receiveId;
            if(addressInfo.isdefault){
                this.setState({
                    defaultAddress:1
                });
            }
        }

    }

    //保存地址
    saveAddress(){
        let name = document.getElementById('name').value;
        let tels = document.getElementById('tel').value;
        let details = document.getElementById('detailsAdd').value;
        let code = this.state.areaNameCode;

        if(!name){
            Toast.info('请输入姓名!!!', 1);
            return;
        }
        if(!tels){
            Toast.info('请输入电话号码!!!', 1);
            return;
        }
        if(!this.isPhoneNum(tels)){
            return;
        }
        if(!code.length){
            Toast.info('请选择区域!!!', 1);
            return
        }
        if(!details){
            Toast.info('请输入地址!!!', 1);
            return;
        }



        let defaultS;
        if(this.state.defaultAddress){
            defaultS=1;
        }else {
            defaultS = 0;
        }

        let requireData;
        if(this.state.addressId){
            requireData = {userId:userId,isdefault:defaultS,receiveName:name,phone:tels,provinceCode:code[0],cityCode:code[1],countyCode:code[2],adress:details,adressId:this.state.addressId};

        }else {
            requireData = {userId:userId,isdefault:defaultS,receiveName:name,phone:tels,provinceCode:code[0],cityCode:code[1],countyCode:code[2],adress:details,adressId:''};

        }
        this.setActivityIndicator(true);
        post('/adress/insertOrudate',requireData,(response)=>{
            let that = this;
            that.setActivityIndicator(false)
            that.props.router.goBack();

        },(error)=>{
            let that = this;
            that.setActivityIndicator(false)
            Toast.info('保存失败,请稍后再试', 1);
            console.log(error);
        })

    }

    setActivityIndicator(isShow){
        this.setState({
            isShow:isShow
        });
    }


    isPhoneNum(phoneNum) {
        var partten = /^1[3|4|5|7|8][0-9]{9}$/;
        if(partten.test(phoneNum))
        {
            return true;
        }
        else
        {
            Toast.info('请输入正确号码!!!', 1);
            return false;
        }
    }



}