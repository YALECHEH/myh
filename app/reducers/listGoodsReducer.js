/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    commodityList:[]
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.COMMODITY_LIST:{
            return state.merge({
                commodityList:action.commodityList
            })
        }
        default:
            return state;
    }
};

export default MainReducer;