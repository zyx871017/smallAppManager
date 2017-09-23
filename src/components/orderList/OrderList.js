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
  Paper,
  Dialog,
  List,
  ListItem
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

  render() {
    const dataRow = this.props.ordersList.ordersList;
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
              <TableHeaderColumn style={styles.smallColumn}>电话</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>收货地址</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>操作</TableHeaderColumn>
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
                    <TableRowColumn style={styles.smallColumn}>
                      <span title={address.phone}>{address.phone}</span>
                    </TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>
                      <span title={addressDetail}>{addressDetail}</span>
                    </TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id, 'showDetail')
                        }}
                      >查看详情</RaisedButton>
                    </TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <Pagination
          total={this.props.ordersList.ordersTotal}
          limit={10}
          pageChange={this.pageChange}
        />
        <Dialog>
          <List>
            <ListItem></ListItem>
          </List>
        </Dialog>
      </Paper>
    )
  }
}

export default connect(
  state => ({
    ordersList: state.ordersList.toJS()
  }),
  dispatch => ({
    saveOrdersList: (dataArr, total) => dispatch(ordersList.saveOrderList(dataArr, total))
  })
)(OrderList);