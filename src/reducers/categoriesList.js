import {fromJS} from 'immutable';

const iniState = {
  categoriesList: [],
};

const categoriesList = (state = fromJS(iniState), action) => {
  switch(action.type){
    case 'SAVE_CATEGORIES_LIST':
      return state.set('categoriesList', action.dataArr);
    case 'PATCH_GOOD_DETAIL':
      return state;
    case 'PATCH_GOODS_LIST':
      return state;
    default:
      return state;
  }
};

export default categoriesList;