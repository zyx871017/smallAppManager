import React from 'react';
import {Menu, MenuItem, Paper, AppBar, FlatButton} from 'material-ui';
import {styles} from './HeaderStyle';
import {Route} from 'react-router-dom';
import GoodsList from './../goodsList/GoodsList';
import Category from './../category/Category';
import OrderList from './../orderList/OrderList';

class Header extends React.Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname.split('/')[2];
    this.state = {
      menuSelected: pathName
    }
  }

  menuOnchange = (e, v) => {
    this.setState({
      menuSelected: v
    });
    this.props.history.push(`/main/${v}`);
  };

  logout = () => {
    localStorage.removeItem('token');
    this.props.history.replace('/login');
  };

  render() {
    return (
      <div style={{width: '100%'}}>

        <div style={styles.titleBarContent}>
          <AppBar
            style={styles.titleBar}
            title="小程序后台管理系统"
            iconStyleLeft={{display: 'none'}}
            iconElementRight={
              <FlatButton label="登出" onClick={this.logout}/>
            }
          />
        </div>
        <div style={{width: '1230px', margin: '0 auto'}}>
          <Paper
            style={styles.paperStyle}
          >
            <Menu
              style={styles.menu}
              selectedMenuItemStyle={{
                backgroundColor: 'rgb(0, 188, 212)',
              }}
              value={this.state.menuSelected}
              menuItemStyle={{width: '200px'}}
              onChange={this.menuOnchange}
            >
              <MenuItem value="goodsList" primaryText="商品列表"/>
              <MenuItem value="category" primaryText="分类列表"/>
              <MenuItem value="orderList" primaryText="订单列表"/>
              <MenuItem value="null" primaryText="暂未开发"/>
            </Menu>
          </Paper>
          <div style={styles.tableContainer}>
            <Route path="/main/goodsList" component={GoodsList}/>
            <Route path="/main/category" component={Category}/>
            <Route path="/main/orderList" component={OrderList}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;