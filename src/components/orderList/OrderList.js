import React from 'react';
import {request} from './../../common/request';
import {status} from './../../common/common';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  RaisedButton,
  Paper,
  Dialog,
  List,
  ListItem,
  TextField
} from 'material-ui';
import {styles} from './OrderListStyles';
import {connect} from 'react-redux';
import {ordersList} from './../../actions';
import Pagination from './../common/Pagination';

class OrderList extends React.Component {
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
    request('admin/order/order-list', {}, {limit: 10, offset: 0})
      .then(res => {
        if (res.retCode === 0) {
          that.props.saveOrdersList(res.data.dataArr, res.data.total);
        }
      });
  }

  pageChange = index => {
    const that = this;
    request('admin/order/order-list', {}, {limit: 10, offset: (index - 1) * 10})
      .then(res => {
        if (res.retCode === 0) {
          that.props.saveOrdersList(res.data.dataArr, res.data.total);
        }
      });
  };

  refund = orderNo => {
    request('admin/order/refund', {
      method: 'POST',
      body: JSON.stringify({orderNo})
    })
      .then(function (res) {
        if(res.retCode === 0){
          alert('退款成功');
        }
      });
  };

  deliver = () => {
    const {orderId, trackingNo} = this.state;
    request(`admin/order/send/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({trackingNo})
    })
      .then(res => {
        if (res.retCode === 0) {
          alert('确认发货');
        }
      });
  };

  handleClose = () => {
    this.setState({
      modalShow: false
    });
  };

  showModal = id => {
    const that = this;
    const ordersList = this.props.ordersList.ordersList;
    ordersList.forEach(item => {
      if (item.id === id) {
        that.setState({
          modalShow: true,
          method: 'detail'
        }, () => {
          that.props.pickOrderDetail(item);
        });
      }
    });
  };

  openDeliver = id => {
    this.setState({
      orderId: id,
      modalShow: true,
      method: 'deliver'
    });
  };

  render() {
    const dataRow = this.props.ordersList.ordersList;
    const orderDetail = this.props.ordersList.orderDetail;
    const detailAddr = orderDetail.userAddressInfo;
    const addressDetail = detailAddr?`${detailAddr.province}${detailAddr.province === detailAddr.city ? '' : detailAddr.city}
    ${detailAddr.district}${detailAddr.detail}`: '';
    const actions = [
      <RaisedButton
        label="取消"
        onClick={this.handleClose}
        style={{marginRight: 12}}
      />,
      this.state.method === 'deliver'?(
        <RaisedButton
          label="确定"
          onClick={this.deliver}
          style={{marginRight: 12}}
        />):null
    ];
    return (
      <Paper>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={styles.smallColumn}>ID</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>收货人</TableHeaderColumn>
              <TableHeaderColumn style={styles.middleColumn}>电话</TableHeaderColumn>
              <TableHeaderColumn style={styles.middleColumn}>收货地址</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>订单状态</TableHeaderColumn>
              <TableHeaderColumn style={styles.middleColumn}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataRow.map(item => {
                const address = item.userAddressInfo;
                let addressDetail = `${address.province}${address.province === address.city ? '' : address.city}
                ${address.district}${address.detail}`;
                return (
                  <TableRow key={item.id} selectable={false}>
                    <TableRowColumn style={styles.smallColumn}>{item.id}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{address.receiver}</TableRowColumn>
                    <TableRowColumn style={styles.middleColumn}>
                      <span title={address.phone}>{address.phone}</span>
                    </TableRowColumn>
                    <TableRowColumn style={styles.middleColumn}>
                      <span title={addressDetail}>{addressDetail}</span>
                    </TableRowColumn>
                    <TableHeaderColumn style={styles.smallColumn}>
                      {status[item.status]}
                    </TableHeaderColumn>
                    <TableRowColumn style={styles.middleColumn}>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id);
                        }}
                      >查看详情</RaisedButton>
                      {
                        item.status === 4 ? (
                          <RaisedButton
                            primary={true}
                            onClick={() => {
                              this.refund(item.orderNo);
                            }}
                          >确认退货</RaisedButton>
                        ) : null
                      }
                      {
                        item.status === 2 ? (
                          <RaisedButton
                            primary={true}
                            onClick={() => {
                              this.openDeliver(item.id);
                            }}
                          >确认发货</RaisedButton>
                        ) : null
                      }
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
        <Pagination
          total={this.props.ordersList.ordersTotal}
          limit={10}
          pageChange={this.pageChange}
        />
        <Dialog
          open={this.state.modalShow}
          actions={actions}
        >
          {this.state.method === 'deliver' ? (
            <div>
              <TextField
                hintText="请输入快递单号"
                floatingLabelText="快递单号"
                style={{width: '100%'}}
                value={this.state.trackingNo || ''}
                onChange={e => {
                  this.setState({
                    trackingNo: e.target.value
                  });
                }}
              />
            </div>
          ) : (
            <List>
              <ListItem primaryText={`订单时间: ${orderDetail.createTime}`}/>
              <ListItem primaryText={`订单价格: ${orderDetail.actual_price / 100}`}/>
              <ListItem primaryText={`订单原价: ${orderDetail.original_price / 100}`}/>
              <ListItem primaryText={`发货地址: ${addressDetail}`}/>
              <ListItem primaryText={`快递单号: ${orderDetail.trackingNo||'未发货'}`}/>
            </List>)}
        </Dialog>
      </Paper>
    );
  }
}

export default connect(
  state => ({
    ordersList: state.ordersList.toJS()
  }),
  dispatch => ({
    saveOrdersList: (dataArr, total) => dispatch(ordersList.saveOrderList(dataArr, total)),
    pickOrderDetail: (dataObj) => dispatch(ordersList.pickOrderDetail(dataObj))
  })
)(OrderList);