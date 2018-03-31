/**
 * Created by chenmao on 2017/7/6.
 */

import React,{Component} from 'react';
import { Carousel,Modal} from 'antd-mobile';
import { Router, Route, Link,browserHistory  } from 'react-router'
import  './goodDetails.less'
import ChooseSpecification from './chooseSpecification'
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants'
let isClick=false;


export default class GoodDetails extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            addCartSuc:false,
            isCollect:1
        };
    }
    //进入店铺回到首页
    goToHomePage(){
        const {router}=this.props;
        //browserHistory.push('/index');
        router.push({
            pathname:contants.commonUrl+'/index'
        })
    }
    //跳转到购物车
    goToCartPage(){
        this.props.router.push({
            pathname:contants.commonUrl+'/shoppingCart'
        })
    }
    //收藏
    collect() {
        const {goodDetails, goodDetailsActions,location}=this.props;
        let userInfo = db.readUserInfo();
        let goodsId=location.state.goodsId;
        let that = this;
        if (userInfo === null) {
            this.props.router.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    type:1
                }
            });
        } else {
            let url = "/goods/collectGoods";
            let bodyData = {
                userId: userInfo.userId,
                goodsId: goodsId,
                isCollection:Number(that.state.isCollect)
            };

            console.log(bodyData);

            goodDetailsActions.collectOrcancel(url, bodyData, function (data) {
                that.setState({isCollect:!that.state.isCollect})
            }, function (error) {

            })
        }
    }
    componentWillMount(){
        document.title='商品详情'
    }
    componentDidMount(){
        const {goodDetailsActions,location}=this.props;
        let userInfo=db.readUserInfo();
        let goodsId=location.state.goodsId;
        let data={
            goodsId:goodsId,
            userId:userInfo?userInfo.userId:-1
        };
        goodDetailsActions.getGoodDetailsFromServer('/goods/getGoodsDetail',data,(response)=>{
            let url=db.userAgent()==='Android'?encodeURIComponent(window.location.href.split('#')[0]):encodeURIComponent(contants.url);
            if(!response.isDelete){
                //微信分享
                let dic={
                    title:response.goodsName,
                    desc:response.describe,
                    imgUrl:response.goodsUrlList[0].hosrUrl+response.goodsUrlList[0].pictureFileUrl,
                    linkUrl:'http://uu.uns1066.com/UU/index.html?goodsId='+goodsId
                };
                wxShare(url,[],dic,true);
                //收藏设置
                this.setState({isCollect:response.isEnshrine});
            }else{
                wxShare(url,[],{});
            }
        },(err)=>{

        });
        
        $(document).bind('touchmove',function(){
            isClick=false;
        });

        $(window).scroll(function() {
            let curIdArr=[];
            const top = $(document).scrollTop();
            const menu = $(".goodDetailsContainer");
            const items = $('.goodDetailsIntro').find("li");
            const items_a=$(".goodDetailsContainer li a");
            let curId = "";
            if(top>200){
                let ratio=top/800;
                if(ratio>=1){
                    ratio=1;
                }
                menu.css({'opacity':ratio,'display':'block'});
            }else{
                let ratio=top/800;
                menu.css({'opacity':ratio,'display':'none'});
            }
            if(!isClick){
                var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
                if(scrollBottom<10){
                    items_a.removeClass('activeStyle');
                    items_a.eq(3).addClass('activeStyle');
                    return;
                }
                items.each(function(i) {
                    const itemsTop = $(this).offset().top;
                    if(itemsTop<=top+50){
                        curId = "#" + $(this).attr("id");
                        curIdArr.push(curId);
                    }else {
                        if(curIdArr.length==0){
                            curId = "#" + $(this).attr("id");
                            curIdArr.push(curId);
                        }else{
                            return false;
                        }
                    }
                });
                const  curLink = menu.find(".activeStyle");
                if(curId && curLink.attr("href") != curIdArr[curIdArr.length-1]) {
                    curLink.removeClass("activeStyle");
                    menu.find("[href='" + curIdArr[curIdArr.length-1] + "']").addClass("activeStyle");
                }
            }
        });
    }
    componentWillUnmount(){
        const {goodDetailsActions}=this.props;
        goodDetailsActions.showDialog(null);
        goodDetailsActions.receiveGoodDetails(null);
    }
    componentDidUpdate(){
        const {goodInfo}=this.props.goodDetails;
        if(goodInfo){
            $('#detail').html(goodInfo.detailString);
            $('#parameter').html(goodInfo.goodsparamString);
            $('#brand').html(goodInfo.goodsBrandString);
            $('#needKnow').html(goodInfo.instructionsString);
            $(".goodDetailsContainer li a").unbind('click').click(function() {
                isClick=true;
                $(".goodDetailsContainer li a").removeClass('activeStyle');
                $(this).addClass('activeStyle');
                $("html, body").animate({
                    scrollTop: $($(this).attr("href")).offset().top-50 + "px"
                }, 500);
                return false;
            });
        }
    }
    showGoodStatusImg(){
        const {goodInfo}=this.props.goodDetails;
        if(goodInfo.status==2){
            return(
                <img src={require('../../images/goodDetails/o2@1x.png')} className="goosStatusImg"/>
            )
        }
        if(!goodInfo.stock){
            return(
                <img src={require('../../images/goodDetails/o1@1x.png')} className="goosStatusImg"/>
            )
        }
    }
    getGoodTypeName(){
        const {goodInfo}=this.props.goodDetails;
        let str='';
        goodInfo.goodsruleslist.map((val,i)=>{
            if(i==0){
                str=val.type;
            }else{
                str+='/'+val.type;
            }
        });
        return str;
    }
    showBottomDialog(i){
        this.props.goodDetailsActions.showDialog(true,i)
    }
    render() {
        const {goodDetails}=this.props;
        const {goodInfo}=goodDetails;
        let goodCondition;
        let goodNoSale;
        if(goodInfo){
            goodCondition=goodInfo.condition &&(goodInfo.condition!='00'||goodInfo.serviceDescription);
            goodNoSale=goodInfo.status==2 || !goodInfo.stock;
        }
        return (
            <div className='goodContainer'>
                {goodInfo?(!goodInfo.isDelete?
                    <div>
                        <ul className='goodDetailsContainer'>
                            <li><a href='#detail' className='activeStyle'>详情</a></li>
                            <li><a href='#parameter'>参数</a></li>
                            <li><a href='#brand'>品牌</a></li>
                            <li><a href='#needKnow'>买家须知</a></li>
                        </ul>
                        <Carousel
                            className="my-carousel"
                            autoplay={goodInfo.goodsUrlList.length>1?true:false}
                            infinite
                            selectedIndex={0}
                            swipeSpeed={35}
                            beforeChange={(from, to) => {}}
                            afterChange={index => {}}
                        >
                            {goodInfo.goodsUrlList.map((val, i)=> (
                                <div key={i} className="carouselContainer">
                                    <img
                                        className='headImgStyle'
                                        src={val.hosrUrl+val.pictureFileUrl}
                                        alt="icon"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        {this.showGoodStatusImg()}
                        <div className='goodDesContainer'>
                            <h1>{goodInfo.goodsName}</h1>
                            <span className="isHasGood">{goodInfo.status==2?'已下架':!goodInfo.stock?'已售罄':'有货'}</span>
                            <p>
                                <span>￥{goodInfo.price}</span>
                            <span onClick={()=>{this.collect()}}>
                                 <img
                                     src={!this.state.isCollect?require('../../images/goodDetails/b6@1x.png'):require('../../images/goodDetails/b2@1x.png')}/>

                            </span>
                            </p>
                            <p>{goodInfo.describe}</p>
                        </div>
                        <div className='stripe'></div>
                        {goodCondition?
                        <div className='goodDesContainer'>
                            <div className='goodCondition'>
                                {goodInfo.condition!='00'?<div className='goodCondition_t'>
                                    {Number(goodInfo.condition.toString().charAt(1))?<div>
                                    <img src={require('../../images/goodDetails/b8@1x.png')}/>
                                    <span>正品保证</span></div>:null}
                                    {Number(goodInfo.condition.toString().charAt(0)) ?<div>
                                        <img src={require('../../images/goodDetails/b8@1x.png')}/>
                                        <span>包邮</span></div>:null}
                                </div>:null}
                                {goodInfo.serviceDescription?<p className='goodCondition_b'>{goodInfo.serviceDescription}</p>:null}
                            </div>
                        </div>:null}
                        {goodCondition?<div className='stripe'></div>:null}
                        <div className={`goodDesContainer ${goodNoSale?'goodGray':'' }`} onClick={()=>{goodNoSale?null:this.showBottomDialog(2)}}>
                            <div className='goodSpecification'>
                                <span>{`选择：${this.getGoodTypeName()}`}</span>
                                <div className="showChooseDialog">
                                    <img src={require('../../images/goodDetails/b24.png')}/>
                                </div>
                            </div>
                        </div>
                        <div className='stripe'></div>
                        <ul className='goodDetailsIntro'>
                            <li id="detail"></li>
                            <li id="parameter"></li>
                            <li id="brand"></li>
                            <li id="needKnow"></li>
                        </ul>
                        <div className='goodDesContainer bottom goodBottomB'>
                            <ul className='goodBottom'>
                                <li onClick={()=>this.goToCartPage()}>
                                    <img src={require('../../images/goodDetails/b4@1x.png')}/>
                                    <span>购物车</span>
                                </li>
                                <li onClick={()=>{this.goToHomePage()}}>
                                    <img src={require('../../images/goodDetails/b5@1x.png')}/>
                                    <span>进入店铺</span>
                                </li>
                                <li onClick={()=>{goodNoSale?null:this.showBottomDialog(0)}} className={goodNoSale?'noAaleMount':'addCartButton'}>加入购物车</li>
                                <li onClick={()=>{goodNoSale?null:this.showBottomDialog(1)}} className={goodNoSale?'noAaleMountToBuy':'goBuyNowButton'}>立即购买</li>
                            </ul>
                        </div>
                    </div>
                    :null):null}
                {/*加入购物车成功*/}
                    <div className={`addCartSuc ${this.state.addCartSuc?'show':'hide'}`}>
                        <img src={require('../../images/goodDetails/b40.png')}/>
                        <span>商品已成功添加到购物车</span>
                    </div>
                {/*商品失效*/}
                {goodInfo?(goodInfo.isDelete?
                    <div className="goodFailure">
                        <img src={require('../../images/goodDetails/o3@1x.png')} />
                        <span>此商品已失效~~</span>
                    </div>:null):null
                }
                {/*选择商品规格组件*/}
                {goodInfo?(!goodInfo.isDelete?<ChooseSpecification
                    {...this.props}
                    callBack={()=>this.callBack()}
                    showDialog={goodDetails.isShow}/>:null):null}
                {/*Loading*/}
                {goodDetails.isShowLoading?<div className="loadingView"></div>:null}
            </div>
        );
    }
    callBack(){
        this.setState({addCartSuc:!this.state.addCartSuc});
    }
}

