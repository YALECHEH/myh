/**
 * Created by chenmao on 2017/6/28.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, Redirect, IndexRoute, browserHistory, hashHistory} from 'react-router';

import PPCollectContainer from '../containers/PPCollectContainer'
import * as contants from '../common/Apis/constants'

import HomePage from '../containers/homePageContainer'

class Roots extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}

const history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;


const goodDetails = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/goodDetailsContainer').default)
    }, 'goodDetails')
};
//分类商品列表
const listGoods = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/listGoodsContainer').default)
    }, 'listGoods')
};
//搜索页面
const search = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/searchContainer').default)
    }, 'search')
};
//订单结算页面
const settlement = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/settlementContainer').default)
    }, 'settlement')
};
//订单入口页面
const orderHome = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/orderHomeContainer').default)
    }, 'orderHome')
};
//支付页面
const payment = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/paymentContainer').default)
    }, 'payment')
};


//购物车
const shoppingCart = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/PPShoppingCartContainer').default)
    }, 'shoppingCart')
};

//编辑收货地址
const editAddress = (location, cd) => {
    require.ensure([], require => {
        cd(null, require('../views/shippingAddress/editReceiptAddress').default)
    }, 'editAddress')
}


//售后页面
const afterSale = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/afterSaleContainer').default)
    }, 'afterSale')
};
//订单首页
const orderTabList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/OrderTabList').default)
    }, 'orderTabList')
};
//地址管理
const addressList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/addressListContainer').default)
    },'addressList')
};
//w我的收藏页面
const collectManage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/PPCollectContainer').default)
    },'collectManage')
};
//订单详情(已完成)
const orderDetails = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/PPOrderDetailsContainer').default)
    }, 'orderDetails')
};
//订单详情(待收货)
const toBeReceived = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/toBeReceived').default)
    }, 'toBeReceived')
};
//退货退款详情
const refundsDetailList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/refundsDetailList').default)
    }, 'refundsDetailList')
};
//退款详情
const refundProgress = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/aftersales/refundProgress').default)
    }, 'refundProgress')
};
//登录
const login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/PPLoginContainer').default)
    }, 'login')
};
//申请售后
const applyService = (location,cb) => {
    require.ensure([], require => {
        cb(null, require('../views/aftersales/applyAfterSalesService').default)
    }, 'applyService')
};
//订单详情（待支付）
const pendingOrder = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/aftersales/pendingOrderDetail').default)
    }, 'pendingOrder')
};
//图片浏览
const pictureLook = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/shippingAddress/pictureViewer').default)
    }, 'pictureLook')
};
//申请售后服务成功
const applySuccess = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/aftersales/applyAfterServiceSuccess').default)
    }, 'applySuccess')
};
//物流进度
const logistics = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/aftersales/logisticsDetail').default)
    }, 'logistics')
};
const RouteConfig = (
    <Router history={history}>
        <Route path={`${contants.commonUrl}/`} component={Roots}>
            <IndexRoute component={HomePage}/>
            <Route path={`${contants.commonUrl}/index`} component={HomePage}/>
            <Route path={`${contants.commonUrl}/goodDetails`} getComponent={goodDetails}/>
            <Route path={`${contants.commonUrl}/listGoods`} getComponent={listGoods}/>
            <Route path={`${contants.commonUrl}/afterSale`} getComponent={afterSale}/>
            <Route path={`${contants.commonUrl}/search`} getComponent={search}/>
            <Route path={`${contants.commonUrl}/settlement`} getComponent={settlement}/>
            <Route path={`${contants.commonUrl}/orderHome`} getComponent={orderHome}/>
            <Route path={`${contants.commonUrl}/payment`} getComponent={payment}/>
            <Route path={`${contants.commonUrl}/shoppingCart`} getComponent={shoppingCart}/>
            <Route path={`${contants.commonUrl}/collectManage`} getComponent={collectManage} />
            <Route path={`${contants.commonUrl}/editAddress`} getComponent={editAddress}/>
            <Route path={`${contants.commonUrl}/orderTabList`} getComponent={orderTabList}/>
            <Route path={`${contants.commonUrl}/addressList`} getComponent={addressList}/>
            <Route path={`${contants.commonUrl}/orderDetails`} getComponent={orderDetails}/>
            <Route path={`${contants.commonUrl}/login`} getComponent={login}/>
            <Route path={`${contants.commonUrl}/refundsDetailList`} getComponent={refundsDetailList}/>
            <Route path={`${contants.commonUrl}/refundProgress`} getComponent={refundProgress}/>
            <Route path={`${contants.commonUrl}/toBeReceived`} getComponent={toBeReceived}/>
            <Route path={`${contants.commonUrl}/applyService`} getComponent={applyService}/>
            <Route path={`${contants.commonUrl}/applySuccess`} getComponent={applySuccess}/>
            <Route path={`${contants.commonUrl}/pendingOrder`} getComponent={pendingOrder}/>
            <Route path={`${contants.commonUrl}/pictureLook`} getComponent={pictureLook}/>
            <Route path={`${contants.commonUrl}/logistics`} getComponent={logistics}/>
            <Redirect from='*' to={`${contants.commonUrl}/`}/>
        </Route>
    </Router>
);

export default RouteConfig;