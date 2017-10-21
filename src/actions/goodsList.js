export const saveGoodsList = (dataArr, total) => {
  return {
    type: 'SAVE_GOODS_LIST',
    dataArr,
    total
  };
};

export const pickGoodDetail = dataObj => {
  return {
    type: 'PICK_GOOD_DETAIL',
    dataObj
  };
};

export const patchGoodDetail = dataObj => {
  return {
    type: 'PATCH_GOOD_DETAIL',
    dataObj
  };
};

export const patchGoodsList = (id, dataObj) => {
  return {
    type: 'PATCH_GOODS_LIST',
    id, dataObj
  };
};

export const addSpec = () => {
  return {
    type: 'ADD_SPEC'
  };
};

export const editSpec = (index, dataObj) => {
  return {
    type: 'EDIT_SPEC',
    index, dataObj
  };
};