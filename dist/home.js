!function(e){function t(l){if(n[l])return n[l].exports;var o=n[l]={i:l,l:!1,exports:{}};return e[l].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,l){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:l})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=7)}([function(e,t){e.exports=vendor_8cea12ab1e509049c2b8},function(e,t,n){e.exports=n(0)(0)},function(e,t,n){e.exports=n(0)(331)},function(e,t,n){e.exports=n(0)(548)},function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),u=n(1),s=l(u),c=n(5),f=n(2),d=n(18),p=l(d),m=n(20),h=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.showModal=function(e,t){n.setState({showData:e,keyWord:t,modalShow:!0})},n.modalClose=function(){n.setState({modalShow:!1})},n.state={data:[],showData:{},modalShow:!1,keyWord:"",categories:[]},n}return r(t,e),i(t,[{key:"componentDidMount",value:function(){var e=this;(0,c.request)("home/goods-list",{},{limit:10,offset:0}).then(function(t){0===t.retCode&&e.setState({data:t.data.dataArr})}),(0,c.request)("category/get-categories-list",{}).then(function(t){console.log(t),0===t.retCode&&e.setState({categories:t.data})})}},{key:"render",value:function(){var e=this,t=this.state.data;return s.default.createElement(f.Paper,null,s.default.createElement(f.RaisedButton,{primary:!0,style:{margin:"8px"},onclick:function(){e.showModal(null,"addGoods")}},"添加"),s.default.createElement(f.Table,null,s.default.createElement(f.TableHeader,{displaySelectAll:!1,adjustForCheckbox:!1},s.default.createElement(f.TableRow,null,s.default.createElement(f.TableHeaderColumn,{style:m.styles.smallColumn},"ID"),s.default.createElement(f.TableHeaderColumn,{style:m.styles.bigColumn},"商品名称"),s.default.createElement(f.TableHeaderColumn,{style:m.styles.smallColumn},"商品价格"),s.default.createElement(f.TableHeaderColumn,{style:m.styles.smallColumn},"库存"),s.default.createElement(f.TableHeaderColumn,{style:m.styles.smallColumn},"销量"),s.default.createElement(f.TableHeaderColumn,{style:m.styles.bigColumn},"操作"))),s.default.createElement(f.TableBody,{displayRowCheckbox:!1},t.map(function(t){return s.default.createElement(f.TableRow,{key:t.id,selectable:!1},s.default.createElement(f.TableRowColumn,{style:m.styles.smallColumn},t.id),s.default.createElement(f.TableRowColumn,{style:m.styles.bigColumn},t.goods_name),s.default.createElement(f.TableRowColumn,{style:m.styles.smallColumn},t.goods_price),s.default.createElement(f.TableRowColumn,{style:m.styles.smallColumn},t.goods_storage),s.default.createElement(f.TableRowColumn,{style:m.styles.smallColumn},t.goods_salenum),s.default.createElement(f.TableRowColumn,{style:m.styles.bigColumn},s.default.createElement(f.RaisedButton,{primary:!0,onClick:function(){e.showModal(t,"showDetail")}},"查看详情"),s.default.createElement(f.RaisedButton,{primary:!0,onClick:function(){e.showModal(t,"editDetail")}},"编辑"),s.default.createElement(f.RaisedButton,{primary:!0},"删除")))}))),s.default.createElement(p.default,{keyWord:this.state.keyWord,data:this.state.showData,open:this.state.modalShow,handleClose:this.modalClose,categories:this.state.categories}))}}]),t}(s.default.Component);t.default=h},function(e,t,n){"use strict";var l=n(17),o=function(e){return e&&e.__esModule?e:{default:e}}(l),a=localStorage.getItem("token")||"";a?"#/login"===window.location.hash&&(window.location.hash="/main/goodsList"):window.location.hash="/login",e.exports.request=function(e,t,n){var l="";n&&Object.keys(n).forEach(function(e,t){l+="&&"+e+"="+n[e]});var r=Object.assign({},{headers:{"Cache-Control":"no-cache",Accept:"application/json","Content-Type":"application/json"},method:"GET"},t);return e+="?token="+a+l,new Promise(function(t,n){fetch(""+o.default.apiPrefix+e,r).then(function(e){if(200===e.status)return e.json();n(t)}).then(function(e){0===e.retCode?t(e):n(e)})}).catch(function(e){return alert("请求出错，请稍后重试！"),e})}},function(e,t,n){"use strict";function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),i=n(1),u=function(e){return e&&e.__esModule?e:{default:e}}(i),s=function(e){function t(){return l(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),r(t,[{key:"render",value:function(){return u.default.createElement("div",null,"Category page.")}}]),t}(u.default.Component);t.default=s},function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}var o=n(1),a=l(o),r=n(8),i=l(r),u=n(3),s=n(9),c=l(s),f=n(13),d=l(f),p=n(14),m=l(p),h=n(15),y=l(h),b=n(21),g=l(b),w=n(4),x=(l(w),n(6));l(x);i.default.render(a.default.createElement(d.default,{muiTheme:(0,m.default)(c.default)},a.default.createElement(u.HashRouter,null,a.default.createElement("div",null,a.default.createElement(u.Route,{path:"/main",component:y.default}),a.default.createElement(u.Route,{path:"/login",component:g.default})))),document.getElementById("app-root"))},function(e,t,n){e.exports=n(0)(16)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=n(10),o=n(11),a=n(12),r=function(e){return e&&e.__esModule?e:{default:e}}(a);t.default={spacing:r.default,fontFamily:"Roboto, sans-serif",borderRadius:2,palette:{primary1Color:l.cyan700,primary2Color:l.cyan700,primary3Color:l.grey600,accent1Color:l.pinkA200,accent2Color:l.pinkA400,accent3Color:l.pinkA100,textColor:l.fullWhite,secondaryTextColor:(0,o.fade)(l.fullWhite,.7),alternateTextColor:"#303030",canvasColor:"#303030",borderColor:(0,o.fade)(l.fullWhite,.3),disabledColor:(0,o.fade)(l.fullWhite,.3),pickerHeaderColor:(0,o.fade)(l.fullWhite,.12),clockCircleColor:(0,o.fade)(l.fullWhite,.12)}}},function(e,t,n){e.exports=n(0)(133)},function(e,t,n){e.exports=n(0)(37)},function(e,t,n){e.exports=n(0)(470)},function(e,t,n){e.exports=n(0)(465)},function(e,t,n){e.exports=n(0)(466)},function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),u=n(1),s=l(u),c=n(2),f=n(16),d=n(3),p=n(4),m=l(p),h=n(6),y=l(h),b=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.menuOnchange=function(e,t){n.setState({menuSelected:t}),n.props.history.push("/main/"+t)},n.logout=function(){localStorage.removeItem("token"),n.props.history.replace("/login")};var l=n.props.location.pathname.split("/")[2];return n.state={menuSelected:l},n}return r(t,e),i(t,[{key:"render",value:function(){return s.default.createElement("div",{style:{width:"100%"}},s.default.createElement("div",{style:f.styles.titleBarContent},s.default.createElement(c.AppBar,{style:f.styles.titleBar,title:"小程序后台管理系统",iconStyleLeft:{display:"none"},iconElementRight:s.default.createElement(c.FlatButton,{label:"登出",onClick:this.logout})})),s.default.createElement("div",{style:{width:"1230px",margin:"0 auto"}},s.default.createElement(c.Paper,{style:f.styles.paperStyle},s.default.createElement(c.Menu,{style:f.styles.menu,selectedMenuItemStyle:{backgroundColor:"rgb(0, 151, 167)",color:"rgb(48,48,48)"},value:this.state.menuSelected,menuItemStyle:{width:"200px"},onChange:this.menuOnchange},s.default.createElement(c.MenuItem,{value:"goodsList",primaryText:"商品列表"}),s.default.createElement(c.MenuItem,{value:"category",primaryText:"分类列表"}),s.default.createElement(c.MenuItem,{value:"null",primaryText:"暂未开发"}),s.default.createElement(c.MenuItem,{value:"null",primaryText:"暂未开发"}))),s.default.createElement("div",{style:f.styles.tableContainer},s.default.createElement(d.Route,{path:"/main/goodsList",component:m.default}),s.default.createElement(d.Route,{path:"/main/category",component:y.default}))))}}]),t}(s.default.Component);t.default=b},function(e,t,n){"use strict";e.exports.styles={paperStyle:{display:"inline-block",width:"200px",marginTop:"30px",float:"left"},titleBarContent:{width:"100%",height:"64px",backgroundColor:"rgb(0, 151, 167)"},titleBar:{maxWidth:"1230px",boxShadow:"none",height:"64px",margin:"0 auto"},mainContainer:{width:"1230px",margin:"0 auto",position:"relative"},menu:{width:"200px"},tableContainer:{float:"left",width:"1000px",margin:"30px 0 30px 25px"}}},function(e,t,n){"use strict";e.exports={apiPrefix:"https://www.qaformath.com/zbuniserver-api/"}},function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),u=n(2),s=n(19),c=l(s),f=n(1),d=l(f),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleClose=function(){n.props.handleClose()},n.fileSelect=function(e){var t=n,l=e.currentTarget.files[0],o=new FileReader;o.readAsDataURL(l),o.onload=function(e){t.setState({fileUrl:e.target.result})}},n.state={fileUrl:""},n}return r(t,e),i(t,[{key:"render",value:function(){var e=this.props,t=e.data,n=e.keyWord,l=e.categories,o="";switch(n){case"showDetail":o="商品详情";break;case"editDetail":o="编辑详情";break;case"addGoods":o="添加商品"}var a=[d.default.createElement(u.RaisedButton,{label:"取消",keyboardFocused:!0,onClick:this.handleClose}),d.default.createElement(u.RaisedButton,{label:"确认",primary:!0,keyboardFocused:!0,onClick:this.handleClose})],r="showDetail"===n;return d.default.createElement(u.Dialog,{open:this.props.open,actions:a,autoScrollBodyContent:!0,title:o},d.default.createElement("input",{type:"file",accept:"image/gif,image/jpeg,image/png",onChange:this.fileSelect}),d.default.createElement(c.default,{image:this.state.fileUrl,width:250,height:250,border:50,color:[255,255,255,.6],scale:1.2,rotate:0}),d.default.createElement(u.TextField,{hintText:"请输入商品名",floatingLabelText:"商品名",underlineShow:!1,disabled:r,defaultValue:t.goods_name||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.SelectField,{hintText:"请选择商品类型",floatingLabelText:"商品类型",underlineShow:!1,disabled:r,value:t.category_id||1},l.map(function(e){return d.default.createElement(u.MenuItem,{value:e.id,primaryText:e.name})})),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入广告词",floatingLabelText:"广告词",underlineShow:!1,disabled:r,defaultValue:t.goods_jingle||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品价格",floatingLabelText:"商品价格",underlineShow:!1,disabled:r,defaultValue:t.goods_price||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品市场价",floatingLabelText:"市场价",underlineShow:!1,disabled:r,defaultValue:t.goods_marketprice||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品库存",floatingLabelText:"商品库存",underlineShow:!1,disabled:r,defaultValue:t.goods_storage||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品销量",floatingLabelText:"商品销量",underlineShow:!1,disabled:r,defaultValue:t.goods_salenum||0}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品访问量",floatingLabelText:"商品访问量",underlineShow:!1,disabled:r,defaultValue:t.goods_click||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品运费",floatingLabelText:"商品运费",underlineShow:!1,disabled:r,defaultValue:t.goods_freight||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入评价数",floatingLabelText:"商品评价数",underlineShow:!1,disabled:r,defaultValue:t.evaluation_count||""}),d.default.createElement(u.Divider,null),d.default.createElement(u.TextField,{hintText:"请输入商品星级",floatingLabelText:"商品星级",underlineShow:!1,disabled:r,defaultValue:t.evaluation_good_star||""}),d.default.createElement(u.Divider,null))}}]),t}(d.default.Component);t.default=p},function(e,t,n){e.exports=n(0)(575)},function(e,t,n){"use strict";e.exports.styles={smallColumn:{width:"20px",textAlign:"center",boxSizing:"border-box"},bigColumn:{width:"100px",textAlign:"center"},middleColumn:{width:"80px"}}},function(e,t,n){"use strict";function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),i=n(1),u=function(e){return e&&e.__esModule?e:{default:e}}(i),s=n(2),c=n(22),f=n(5),d=function(e){function t(e){l(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.inputChange=function(e){var t={};return function(l){t[e]=l.target.value,n.setState(t)}},n.clickLogin=function(){var e=n.state,t=e.username,l=e.password,o=n;(0,f.request)("admin/admin-info",{method:"POST",body:JSON.stringify({admin:t,password:l})}).then(function(e){0===e.retCode?(localStorage.setItem("token",e.token),o.props.history.push("/main/goodsList")):alert(e.msg)})},n.state={username:"",password:""},n}return a(t,e),r(t,[{key:"render",value:function(){return u.default.createElement("div",null,u.default.createElement("div",{style:c.styles.title},"小程序后台数据维护系统"),u.default.createElement(s.TextField,{style:c.styles.input,hintText:"请输入用户名",floatingLabelText:"用户名",value:this.state.username,onChange:this.inputChange("username")}),u.default.createElement(s.TextField,{style:c.styles.input,hintText:"请输入密码",floatingLabelText:"密码",value:this.state.password,type:"password",onChange:this.inputChange("password")}),u.default.createElement(s.RaisedButton,{style:c.styles.button,label:"确定登陆",primary:!0,onClick:this.clickLogin}),u.default.createElement("span",{style:c.styles.tips},"如果登陆有问题请联系技术人员。"))}}]),t}(u.default.Component);t.default=d},function(e,t,n){"use strict";e.exports.styles={title:{fontSize:30,textAlign:"center",marginTop:100,color:"#ccc"},input:{display:"block",margin:"10px auto"},button:{display:"block",margin:"30px auto",width:256,height:40},tips:{fontSize:14,display:"block",textAlign:"center",color:"#ccc"}}}]);