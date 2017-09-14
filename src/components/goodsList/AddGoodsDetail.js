import React from 'react';
import {
  TextField,
  Divider,
  SelectField,
  MenuItem,
} from 'material-ui';
import {connect} from 'react-redux';
import { goodsList } from './../../actions';

class AddGoodsDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const {keyWord, categoriesList, goodsList} = this.props;

    let modalTitle = '';
    switch (keyWord) {
      case 'showDetail':
        modalTitle = '商品详情';
        break;
      case 'editDetail':
        modalTitle = '编辑详情';
        break;
      case 'addGoods':
        modalTitle = '添加商品';
        break;
      default:
        break;
    }

    const isDisabled = (keyWord === 'showDetail');

    const editGood = goodsList.editGood;

    return(
      <div>
        <TextField
          hintText="请输入商品名"
          floatingLabelText="商品名"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_name || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_name: e.target.value})
          }}
        />
        <Divider/>
        <SelectField
          hintText="请选择商品类型"
          floatingLabelText="商品类型"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.category_id || 1}
          onChange={(e, i, v) => {
              this.props.patchGoodDetail({category_id: v})
          }}
        >
          {
            categoriesList.categoriesList.map(item => {
              return (
                <MenuItem value={item.id} primaryText={item.name}/>
              )
            })
          }
        </SelectField>
        <Divider/>
        <TextField
          hintText="请输入广告词"
          floatingLabelText="广告词"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_jingle || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_jingle: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品价格"
          floatingLabelText="商品价格"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_price || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_price: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品市场价"
          floatingLabelText="市场价"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_marketprice || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_marketprice: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品库存"
          floatingLabelText="商品库存"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_storage || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_storage: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品销量"
          floatingLabelText="商品销量"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_salenum || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_salenum: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品访问量"
          floatingLabelText="商品访问量"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_click || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_click: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品运费"
          floatingLabelText="商品运费"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.goods_freight || ''}
          onChange={e => {
            this.props.patchGoodDetail({goods_freight: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入评价数"
          floatingLabelText="商品评价数"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.evaluation_count || ''}
          onChange={e => {
            this.props.patchGoodDetail({evaluation_count: e.target.value})
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品星级"
          floatingLabelText="商品星级"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editGood.evaluation_good_star || ''}
          onChange={e => {
            this.props.patchGoodDetail({evaluation_good_star: e.target.value})
          }}
        />
        <Divider/>
      </div>
    )
  }
}

const dispatchSaveGoodsList = dispatch => {
  return{
    saveGoodsList: dataArr => {
      dispatch(goodsList.saveGoodsList(dataArr));
    },
    saveCategoriesList: dataArr => {
      dispatch(goodsList.saveCategoriesList(dataArr));
    },
    patchGoodDetail: dataObj => {
      dispatch(goodsList.patchGoodDetail(dataObj));
    }
  }
};

export default connect(
  state => ({
    goodsList: state.goodsList.toJS(),
    categoriesList : state.categoriesList.toJS()
  }),
  dispatchSaveGoodsList
)(AddGoodsDetail);