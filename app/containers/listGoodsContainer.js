/**
 * Created by AndyWang on 2017/7/7.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ListGoods from '../views/listGoods/listGoods';
import * as action1Creators from '../actions/listGoodsAction.js';

class AppContainer extends React.Component {
    render() {
        return (
            <ListGoods {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  ListGoods  = state.get('ListGoods').toJS();
    return {
        ListGoods
    };
};

const mapDispatchToProps = (dispatch) => {
    const ListGoodsActions = bindActionCreators(action1Creators, dispatch);
    return {
        ListGoodsActions
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);