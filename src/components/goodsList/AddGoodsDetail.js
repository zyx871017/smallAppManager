import React from 'react';
import {
  TextField,
  Divider,
  SelectField,
  MenuItem,
} from 'material-ui';

class AddGoodsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{}
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    this.setState(data);
  }

  render() {

    const {keyWord, categories} = this.props;

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

    return(
      <div>
        <TextField
          hintText="请输入商品名"
          floatingLabelText="商品名"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_name || ''}
          onChange={(e) => {
            this.setState({
              goods_name: e.target.value
            });
          }}
        />
        <Divider/>
        <SelectField
          hintText="请选择商品类型"
          floatingLabelText="商品类型"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.category_id || 1}
          onChange={(e, i, v) => {
            this.setState({
              category_id: v
            })
          }}
        >
          {
            categories.map(item => {
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
          value={this.state.goods_jingle || ''}
          onChange={e => {
            this.setState({
              goods_jingle: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品价格"
          floatingLabelText="商品价格"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_price || ''}
          onChange={e => {
            this.setState({
              goods_price: e.target.value
            });
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品市场价"
          floatingLabelText="市场价"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_marketprice || ''}
          onChange={e => {
            this.setState({
              goods_marketprice: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品库存"
          floatingLabelText="商品库存"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_storage || ''}
          onChange={e => {
            this.setState({
              goods_storage: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品销量"
          floatingLabelText="商品销量"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_salenum || ''}
          onChange={e => {
            this.setState({
              goods_salenum: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品访问量"
          floatingLabelText="商品访问量"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_click || ''}
          onChange={e => {
            this.setState({
              goods_click: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品运费"
          floatingLabelText="商品运费"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.goods_freight || ''}
          onChange={e => {
            this.setState({
              goods_freight: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入评价数"
          floatingLabelText="商品评价数"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.evaluation_count || ''}
          onChange={e => {
            this.setState({
              evaluation_count: e.target.value
            })
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入商品星级"
          floatingLabelText="商品星级"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={this.state.evaluation_good_star || ''}
          onChange={e => {
            this.setState({
              evaluation_good_star: e.target.value
            })
          }}
        />
        <Divider/>
      </div>
    )
  }
}

export default AddGoodsDetail;