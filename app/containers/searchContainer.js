/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from '../views/search/search';
import * as action1Creators from '../actions/searchAction.js';

class AppContainer extends React.Component {
    render() {
        return (
            <Search {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  Search  = state.get('Search').toJS();
    return {
        Search
    };
};

const mapDispatchToProps = (dispatch) => {
    const SearchActions = bindActionCreators(action1Creators, dispatch);
    return {
        SearchActions
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);