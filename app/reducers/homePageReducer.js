/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShowLoading:true,
    homePageList:[]
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.HOMEPAGE_IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.HOMEPAGE_LIST_OF_GOODS:{
            return state.merge({
                homePageList:action.listOfGoods
            })
        }
        default:
            return state;
    }
};

export default MainReducer;