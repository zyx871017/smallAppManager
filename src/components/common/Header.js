import React from 'react';
import {Menu, MenuItem, Paper, AppBar} from 'material-ui';
import {styles} from './HeaderStyle';
import {request} from './../../common/request';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuSelected: 'Maps'
        }
    }

    menuOnchange = (e, v) => {
      console.log(v);
      this.setState({
          menuSelected: v
      })
    };

    render() {
        return (
            <div style={{width: '1230px', margin: '0 auto'}}>
                <div style={styles.titleBarContent}>
                    <AppBar
                        style={styles.titleBar}
                        title="小程序后台管理系统"
                        iconStyleLeft={{display: 'none'}}
                    />
                </div>
                <Paper
                    style={styles.paperStyle}
                >
                    <Menu
                        style={styles.menu}
                        selectedMenuItemStyle={{
                            backgroundColor: 'rgb(0, 151, 167)',
                            color: 'rgb(48,48,48)'
                        }}
                        value={this.state.menuSelected}
                        menuItemStyle={{width: '200px'}}
                        onChange={this.menuOnchange}
                    >
                        <MenuItem value="Maps" primaryText="Maps"/>
                        <MenuItem value="Books" primaryText="Books"/>
                        <MenuItem value="Flights" primaryText="Flights"/>
                        <MenuItem value="Apps" primaryText="Apps"/>
                    </Menu>
                </Paper>
            </div>
        )
    }
}

export default Header;