/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../common/Apis/constants'
import {readUserInfo} from '../../common/Apis/Utils';

export default class Navigation extends Component {
    render() {
        return (
                <div className="Navigation">
                    <div className="search" onClick={()=>{this.goSearch()}}>
                        <img src={require('../../images/homePage/searchX.png')}/>
                    </div>
                    <div className="logoImg">
                        <img src={require('../../images/homePage/logo.png')}/>
                    </div>
                    <div className="shoppingCart" onClick={()=>{this.goShoppingCart()}}>
                        <img src={require('../../images/homePage/shoppingCartX.png')}/>
                    </div>
                    <div className="homePageOrder" onClick={()=>{this.goOrderHome()}}>
                        <img src={require('../../images/homePage/orderX.png')}/>
                    </div>
                </div>
        )
    }
    //搜索页面
    goSearch(){
        const {router}=this.props;
        router.push({
            pathname:contants.commonUrl+'/search'
        });
    };
    //订单首页
    goOrderHome(){
        let userInfo=readUserInfo();
        const {router}=this.props;
        if(userInfo===null){
            router.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    pathname:contants.commonUrl+'/orderHome',
                    type:4
                }
            });
        }else {
            router.push({
                pathname:contants.commonUrl+'/orderHome'
            });
        }
    };
    //购物车
    goShoppingCart(){
        const {router}=this.props;
        router.push({
            pathname:contants.commonUrl+'/shoppingCart'
        });
    };
}