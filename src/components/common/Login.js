import React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {styles} from './LoginStyle';
import {request} from './../../common/request';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    inputChange=key => {
        const obj = {};
        return e => {
            obj[key] = e.target.value;
            this.setState(obj);
        }
    };

    clickLogin = () => {
      const {username, password} = this.state;
      const that = this;
      request('admin/admin-info',{
          method: 'POST',
          body: JSON.stringify({
              admin: username,
              password: password
          })
      })
          .then(function (res) {
              if(res.retCode === 0){
                  localStorage.setItem('token', res.token);
                  that.props.history.push('/main/goodsList');
              }else{
                  alert(res.msg);
              }
          });
    };

    render() {
        return (
            <div>
                <div style={styles.title}>小程序后台数据维护系统</div>
                <TextField
                    style={styles.input}
                    hintText="请输入用户名"
                    floatingLabelText="用户名"
                    value={this.state.username}
                    onChange={this.inputChange('username')}
                />
                <TextField
                    style={styles.input}
                    hintText="请输入密码"
                    floatingLabelText="密码"
                    value={this.state.password}
                    type="password"
                    onChange={this.inputChange('password')}
                />
                <RaisedButton
                    style={styles.button}
                    label="确定登陆"
                    primary={true}
                    onClick={this.clickLogin}
                />
                <span style={styles.tips}>如果登陆有问题请联系技术人员。</span>
            </div>
        )
    }
}

export default Login;