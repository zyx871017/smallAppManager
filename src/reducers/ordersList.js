import {fromJS} from 'immutable';

const iniState = {
  ordersList: [],
  orderDetail: {},
  ordersTotal: 0
};

const goodsList = (state = fromJS(iniState), action) => {
  switch (action.type) {
    case 'SAVE_ORDER_LIST':
      return state.merge(fromJS({ordersList: action.dataArr, ordersTotal: action.total}));
    case 'PICK_ORDER_DETAIL':
      return state.set('orderDetail', fromJS(action.dataObj));
    default:
      return state;
  }
};

export default goodsList;