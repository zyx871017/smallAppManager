import React from 'react';
import {request} from './../../common/request';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  RaisedButton,
  Paper
} from 'material-ui';
import common from './../../common/common';
import DetailModal from './DetailModal';
import {styles} from './GoodsListStyles';
import {connect} from 'react-redux';
import {goodsList, categoriesList} from './../../actions';
import Pagination from './../common/Pagination';

class GoodsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showData: {},
      modalShow: false,
      keyWord: ''
    };
  }

  componentDidMount() {
    const that = this;
    request('admin/home/goods-list', {}, {limit: 10, offset: 0})
      .then(res => {
        if (res.retCode === 0) {
          that.props.saveGoodsList(res.data.dataArr, res.data.total);
        }
      });

    request('category/get-categories-list', {})
      .then(res => {
        if (res.retCode === 0) {
          that.props.saveCategoriesList(res.data);
        }
      });
  }

  showModal = (id, key) => {
    if (id !== null) {
      const that = this;
      request(`admin/home/get-goods-info/${id}`, {})
        .then(res => {
          if (res.retCode === 0) {
            that.props.pickGoodDetail(res.data);
          }
        });
    } else {
      this.props.pickGoodDetail(common.noDataGood);
    }
    this.setState({
      keyWord: key,
      modalShow: true
    });
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  pageChange = index => {
    const that = this;
    request('admin/home/goods-list', {}, {limit: 10, offset: (index - 1) * 10})
      .then(res => {
        if (res.retCode === 0) {
          that.props.saveGoodsList(res.data.dataArr, res.data.total);
        }
      });
  };

  render() {
    const dataRow = this.props.goodsList.goodsList;
    return (
      <Paper>
        <RaisedButton
          primary={true}
          style={{margin: '8px'}}
          onClick={() => {
            this.showModal(null, 'addGoods');
          }}
        >
          添加
        </RaisedButton>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={styles.smallColumn}>ID</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>商品名称</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>商品价格</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>库存</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>销量</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataRow.map(item => {
                return (
                  <TableRow key={item.id} selectable={false}>
                    <TableRowColumn style={styles.smallColumn}>{item.id}</TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>{item.goods_name}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_price}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_storage}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_salenum}</TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id, 'showDetail');
                        }}
                      >查看详情</RaisedButton>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id, 'editDetail');
                        }}
                      >编辑</RaisedButton>
                      <RaisedButton primary={true}>删除</RaisedButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
        <Pagination
          total={this.props.goodsList.goodsTotal}
          limit={10}
          pageChange={this.pageChange}
        />
        <DetailModal
          keyWord={this.state.keyWord}
          open={this.state.modalShow}
          handleClose={this.modalClose}
        />
      </Paper>
    );
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS()
  }),
  dispatch => ({
    saveGoodsList: (dataArr,total) => dispatch(goodsList.saveGoodsList(dataArr,total)),
    saveCategoriesList: dataObj => dispatch(categoriesList.saveCategoriesList(dataObj)),
    pickGoodDetail: dataObj => dispatch(goodsList.pickGoodDetail(dataObj))
  })
)(GoodsList);