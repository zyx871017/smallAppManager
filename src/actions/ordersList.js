export const saveOrderList = (dataArr, total) => {
  return {
    type: 'SAVE_ORDER_LIST',
    dataArr,
    total
  };
};

export const pickOrderDetail = dataObj => {
  return {
    type: 'PICK_ORDER_DETAIL',
    dataObj
  };
};

export const patchOrderList = (id, dataObj) => {
  return {
    type: 'PATCH_ORDER_LIST',
    id, dataObj
  };
};