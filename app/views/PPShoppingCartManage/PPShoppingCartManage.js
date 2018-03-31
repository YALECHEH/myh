/**
 * Created by nipeng on 2017/7/10.
 * 购物车view
 */

import React,{Component} from 'react';
import  './PPShoppingCardManage.less';
import '../../common/styles/common.less'
import { SwipeAction, List } from 'antd-mobile';
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants'
import { Carousel,ActivityIndicator,Modal} from 'antd-mobile';
import PopularRecommendation from '../search/popularRecommendation';//热门推荐
import {wxShare} from '../../common/Apis/wxJsApis';



export default class PPShoppingCartManage extends Component{

    constructor(props){
        super(props);
        this.state={
            repertoryStr:'',
            isUserId:false,
            userId:'',
        }

    }

    componentWillMount() {
        document.title = '购物车';

    }

    componentDidMount(){


        let url=db.userAgent()==='Android'?encodeURIComponent(window.location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(url,[],{});

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let userInfo = db.readUserInfo();

        if (userInfo===null){
            let shopCartList = db.readGoods()
            let tempAry = [];
            if (shopCartList!==null){
                tempAry = shopCartList;
            }
            console.log('购物车读取')
            console.log('cheng '+tempAry)
            this.setState({
                isUserId:false,
            })
            PPShoppingCartAction.setShoppingCartList(tempAry);
        }else {
            this.setState({
                isUserId:true,
                userId:userInfo.userId
            })
            let url = '/shopping/shoppingcart';
            let urlHot = '/goods/hotRecommend';
            let body = {
                userId:userInfo.userId,
                // orderId:1
            }
            let bodyHot = {

            }

            PPShoppingCartAction.getShoppingCartPost(url,urlHot,body,bodyHot,function (data) {

            },function (error) {

            })

        }

    }
    render(){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let tempStyle = PPShoppingCartReducer.goodsList.length===0?"containerTwo":"containerOne";
        return(

            <div className="container">

                <div className={tempStyle}>

                    {PPShoppingCartReducer.goodsList.length===0?
                        <div className="PPnoAddress">
                            <img src={require('../../images/shoppingCardPage/noShopCart_Icon.png')}/>
                            <p>暂无商品</p>
                            <p>您的购物车里没有商品，去商城看看~~</p>
                            <p onClick={()=>{this.addShopCartAction()}}>去购物</p>
                        </div>
                        :
                        <div>
                        <div className="themeStyle">
                            帽雅会
                        </div>

                        <List>
                            {
                                this.textCell()
                            }
                        </List>


                    </div>
                    }

                {/*<div className="hotRecommend">*/}
                    {/*<div className="lineTwoView"></div>*/}
                    {/*<span className="hotLabel">热门推荐</span>*/}
                    {/*<img src={require('../../images/shoppingCardPage/recommend.png')} className=""/>*/}
                    {/*<div className="lineTwoView"></div>*/}
                {/*</div>*/}



                    <PopularRecommendation {...this.props}/>
                {/*<ul className="hotStyle">*/}
                    {/*{*/}
                        {/*this.bottomCellView()*/}
                    {/*}*/}
                {/*</ul>*/}

                </div>


                {PPShoppingCartReducer.goodsList.length===0?null:<div className="bottemView">
                    {PPShoppingCartReducer.goodsList.length!==0?<div onClick={()=>{this.changeSelectState()}}>
                        {PPShoppingCartReducer.allSelectImag?<img src={require('../../images/shippingAddress/k7.png')}/>:
                            <img src={require('../../images/shippingAddress/k11.png')}/>}
                    </div>:
                        <div>
                        {PPShoppingCartReducer.allSelectImag?<img src={require('../../images/shippingAddress/k7.png')}/>:
                            <img src={require('../../images/shippingAddress/k11.png')}/>}
                    </div>}

                    <p className="allSelect">全选</p>
                    {PPShoppingCartReducer.priceString==0?<p className="allTotal">合计￥{PPShoppingCartReducer.priceString}</p>
                        :
                    <div>
                        <p className="numberMoneyStyle">合计￥{PPShoppingCartReducer.priceString}</p>
                        <p className="numberShopCart">共计{PPShoppingCartReducer.numberShopCart}件商品</p>
                    </div>}


                    {PPShoppingCartReducer.priceString===0?<button className="PPaccountButton">去结算</button>:<button className="PPaccountButtons" onClick={()=>{this.accountAction()}}>去结算</button>}

                </div>}
                {PPShoppingCartReducer.isShowLoading?<ActivityIndicator toast text="Loading..." animating={true}/> : null}
            </div>

        )
    }

    addShopCartAction(){
        // 去添加商品
        this.props.router.push({
            pathname: contants.commonUrl+'/index',
        })
    }

    textCell(){

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        var that = this;
        return(

            PPShoppingCartReducer.goodsList.map(function(data,i) {


                console.log(PPShoppingCartReducer.goodsList)
                return(

                    <SwipeAction
                        key={i}
                        style={{ backgroundColor: 'white' }}
                        autoClose
                        right={[
                            {
                                text: '取消',
                                onPress: () => console.log('cancel'),
                                style: { backgroundColor: '#ddd', color: 'white' },
                            },
                            {
                                text: '删除',
                                onPress: () => that.deleShoppingAction(data,i,PPShoppingCartReducer.goodsList,PPShoppingCartReducer.priceString,PPShoppingCartReducer.allSelectImag),
                                style: { backgroundColor: '#F4333C', color: 'white' },
                            },
                        ]}

                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}
                    >
                        <List.Item

                        >
                            <div className="commodityCell">

                                {that.state.isUserId?
                                    data.status===1&&data.isdelete===0?<div className="selectIcon" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                        {data.selected?
                                            <img src={require('../../images/shippingAddress/k7.png')}/>
                                            :
                                            <img src={require('../../images/shippingAddress/k11.png')}/>
                                        }
                                    </div>:<div className="selectIcon" onClick={()=>{}}><img src={require('../../images/shippingAddress/k11.png')}/></div>
                                    :
                                    <div className="selectIcon" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                        {data.selected?
                                            <img src={require('../../images/shippingAddress/k7.png')}/>
                                            :
                                            <img src={require('../../images/shippingAddress/k11.png')}/>
                                        }
                                    </div>
                                }

                                {
                                    that.state.isUserId?
                                        <div className="shopImages">
                                            <img className="shopImage" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                            {data.isdelete===1?<img className="loseImages" src={require('../../images/goodDetails/o6@1x.png')}/>:data.status===1?null:data.status===2?<img className="loseImages" src={require('../../images/goodDetails/o2@1x.png')}/>:data.status===4?<img className="loseImages" src={require('../../images/goodDetails/o1@1x.png')}/>:<img className="loseImages" src={require('../../images/goodDetails/o2@1x.png')}/>}
                                        </div>

                                        :
                                        <div className="shopImages">
                                            <img className="shopImage" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                        </div>

                                }

                                <div className="contentStyle">
                                    {that.state.isUserId?<div>
                                        <p className="ellips themeStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodsName}</p>
                                            <label className="ellips pColorStyle" onClick={()=>{that.selectCellRemond(data,1)}}>{data.sizeString}</label>
                                        <div className="priceAndRepertory">
                                            <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}>¥{data.price}</p>
                                            <div className="repertoryStylep">

                                                {data.number!==1&&(data.status===1&&data.isdelete===0)?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                                <p className="numStyle">{data.number}</p>
                                                {data.stock!==data.number&&(data.status===1&&data.isdelete===0)?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                            </div>
                                        </div>
                                        </div>
                                        :
                                        <div>
                                            <p className="ellips themeStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodNam}</p>
                                            <p className="ellips pColorStyle" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodSpecification}</p>
                                            <div className="priceAndRepertory">
                                                <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}>¥{data.price}</p>
                                                <div className="repertoryStylep">
                                                    {data.number!==1?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                                    <p className="numStyle">{data.number}</p>
                                                    {data.stock!==data.number?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                                </div>
                                            </div>
                                        </div>
                                        }

                                </div>

                            </div>
                        </List.Item>
                    </SwipeAction>

                )
            })
        )
    }


    bottomCellView()
    {
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        var that = this;

        return(
            PPShoppingCartReducer.recommendList.map(function(data,i) {
                return(
                    <li key={i} onClick={()=>{that.selectCellRemond(data,2)}}>
                        <img src={data.hostUrl+data.fileUrl}/>
                        <p className="itmeName">{data.goodName}</p>
                        <p className="itmeMoney">￥{data.price}</p>
                    </li>
                )
            })
        )
    }
    changeSelectState(){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        PPShoppingCartAction.setAllSelectImg(PPShoppingCartReducer.goodsList,!PPShoppingCartReducer.allSelectImag,PPShoppingCartReducer.numberShopCart,this.state.isUserId)
    }

    changeState(data,list,i){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        PPShoppingCartAction.setSelectImg(data,list,i,PPShoppingCartReducer.priceString,PPShoppingCartReducer.allSelectImag,PPShoppingCartReducer.numberShopCart,this.state.isUserId);
    }
    accountAction(){
        // alert('去结算')
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let temp = [];
        for (let i=0;i<PPShoppingCartReducer.goodsList.length;i++){

            let tempDic = PPShoppingCartReducer.goodsList[i];
            if (tempDic.selected){
                let tempDic1 = {};
                if (this.state.isUserId){
                    tempDic1 = {
                        goodNam:tempDic.goodsName,
                        goodsId:tempDic.goodsId,
                        number:tempDic.number,
                        param1:tempDic.param1,
                        param2:tempDic.param2,
                        param3:tempDic.param3,
                        zoomUrl:tempDic.zoomUrl,
                        price:tempDic.price,
                        stock:tempDic.stock,
                        goodSpecification:tempDic.sizeString,
                    }
                }else {
                    tempDic1= tempDic
                }

                temp.push(tempDic1);

            }

        }

        if (!this.state.isUserId){

            this.props.router.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    type:2,
                    goodInfo:temp
                }
            });

        }else {
            // 去结算
            this.props.router.push({
                pathname:contants.commonUrl+'/settlement',
                state:{
                    goodInfo:temp
                }
            });

        }


    }


    jianhaoAction(data,i){
        // alert("减减减")
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        if (data.number===1){
            return;
        }
        if(this.state.isUserId){
            if (data.status!==1&&data.isdelete!==0){
                return;
            }
        }

        let numberStr = PPShoppingCartReducer.goodsList[i].number - 1;

        if (this.state.isUserId){

            let url = '/shopping/shopnumber';
            let body = {
                userId:this.state.userId,
                combinationId:data.combinationId,
                number:numberStr,
                goodsId:data.goodsId
            }

            PPShoppingCartAction.setShoppingNuberPost(url,body,numberStr,data,i,PPShoppingCartReducer.goodsList,this.state.isUserId,PPShoppingCartReducer.priceString,0,PPShoppingCartReducer.numberShopCart,function (data) {

            },function (error) {

            })
        }else {

            PPShoppingCartAction.setNumberAction(data,i,numberStr,PPShoppingCartReducer.goodsList,this.state.isUserId,data.stock,PPShoppingCartReducer.priceString,0,PPShoppingCartReducer.numberShopCart);

        }



    }

    jiahaoAction(data,i){

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        if (data.number===data.stock){
            return;
        }
        if(this.state.isUserId){
            if (data.status!==1&&data.isdelete!==0){
                return;
            }
        }


        let numberStr = PPShoppingCartReducer.goodsList[i].number + 1;
        console.log(this.state.isUserId)
        if (this.state.isUserId){

            let url = '/shopping/shopnumber';
            let body = {
                userId:this.state.userId,
                combinationId:data.combinationId,
                number:numberStr,
                goodsId:data.goodsId
            }
            PPShoppingCartAction.setShoppingNuberPost(url,body,numberStr,data,i,PPShoppingCartReducer.goodsList,this.state.isUserId,PPShoppingCartReducer.priceString,1,PPShoppingCartReducer.numberShopCart,function (data) {



            },function (error) {



            })

        }else {
            PPShoppingCartAction.setNumberAction(data,i,numberStr,PPShoppingCartReducer.goodsList,this.state.isUserId,data.stock,PPShoppingCartReducer.priceString,1,PPShoppingCartReducer.numberShopCart);
        }

    }
    deleShoppingAction(data,i,list,priceStr,allSelectImg){

            const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
            let userInfo = db.readUserInfo();
            if(this.state.isUserId){  // 登录删网络
                let url = '/shopping/deleteshop';
                let body = {
                    userId:userInfo.userId,
                    goodsId:JSON.stringify([{
                        goodsId:data.goodsId
                    }])
                }
                PPShoppingCartAction.deletaShoppingCartPost(url,body,data,i,list,priceStr,allSelectImg,this.state.isUserId,PPShoppingCartReducer.numberShopCart,function (data) {

                },function (error) {

                })
            }else {   // 没登录删缓存

                PPShoppingCartAction.setDelectList(data,list,i,priceStr,allSelectImg,this.state.isUserId,PPShoppingCartReducer.numberShopCart)

            }

    }



    selectCellRemond(data,type){
        // 点击了cell 跳转到商品详情

        this.props.router.push({
            pathname:contants.commonUrl+'/goodDetails',
            state:{
                goodsId:data.goodsId
            }
        });


    }
}



