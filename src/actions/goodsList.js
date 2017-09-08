export const saveGoodsList = dataArr => {
  return{
    type: 'SAVE_GOODS_LIST',
    dataArr
  }
};

export const patchGoodDetail = dataObj => {
  return{
    type: 'PATCH_GOOD_DETAIL',
    dataObj
  }
};

export const patchGoodsList = (id,dataObj) => {
  return{
    type: 'PATCH_GOODS_LIST',
    id,dataObj
  }
};