import React from 'react';
import {Menu, MenuItem, Paper, AppBar, FlatButton} from 'material-ui';
import {styles} from './HeaderStyle';
import {Route} from 'react-router-dom';
import HotList from './../hotList/HotList';
import GoodsList from './../goodsList/GoodsList';
import Category from './../category/Category';
import ActiveList from './../activeList/ActiveList';
import OrderList from './../orderList/OrderList';

class Header extends React.Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname.split('/')[2];
    this.state = {
      menuSelected: pathName
    };
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

  linkToWX = () => {
    window.open('https://mpkf.weixin.qq.com/');
  };

  render() {
    const username = localStorage.getItem('username');
    return (
      <div style={{width: '100%'}}>
        <div style={styles.titleBarContent}>
          <AppBar
            style={styles.titleBar}
            title="小程序后台管理系统"
            iconStyleLeft={{display: 'none'}}
            iconElementRight={<FlatButton label={`${username} 登出`} onClick={this.logout}/>}
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
              {/*<MenuItem value="category" primaryText="分类列表"/>*/}
              <MenuItem value="orderList" primaryText="订单列表"/>
              <MenuItem value="activeList" primaryText="活动列表"/>
              {/*<MenuItem value="hotList" primaryText="热卖产品"/>*/}
              {/*<MenuItem value="null" primaryText="暂未开发"/>*/}
            </Menu>
            <FlatButton
              style={{width: '200px', height: '48px'}}
              primary={true}
              label="打开客服窗口"
              onClick={this.linkToWX}
            />
          </Paper>
          <div style={styles.tableContainer}>
            <Route path="/main/goodsList" component={GoodsList}/>
            <Route path="/main/hotList" component={HotList}/>
            <Route path="/main/category" component={Category}/>
            <Route path="/main/orderList" component={OrderList}/>
            <Route path="/main/activeList" component={ActiveList}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;