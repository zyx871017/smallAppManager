const iniState = {
  goodsList: [],
  addGood: {}
};

const goodsList = (state = iniState, action) => {
  switch(action.type){
    case 'SAVE_GOODS_LIST':
      return Object.assign({}, state, {goodsList: action.dataArr});
    case 'PATCH_GOOD_DETAIL':
      return state;
    case 'PATCH_GOODS_LIST':
      return state;
    default:
      return state;
  }
};

export default goodsList;