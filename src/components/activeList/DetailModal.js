import {
  Dialog,
  RaisedButton,
  Step,
  Stepper,
  StepButton
} from 'material-ui';
import React from 'react';
import AddActiveDetail from './AddActiveDetail';
import AddActiveImage from './AddActiveImage';
import AddActiveGoods from './AddActiveGoods';
import EditGoodsCount from './EditGoodsCount';
import {request} from './../../common/request';
import {connect} from 'react-redux';

class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      fileUrl: ''
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  getStepContent = (stepIndex) => {
    const {keyWord} = this.props;
    switch (stepIndex) {
      case 0:
        return <AddActiveDetail keyWord={keyWord}/>;
      case 1:
        return <AddActiveImage keyWord={keyWord}/>;
      case 2:
        return <AddActiveGoods keyWord={keyWord}/>;
      case 3:
        return <EditGoodsCount keyWord={keyWord}/>;
      default:
        break;
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 3) {
      this.handleConfirm();
    }
    this.setState({
      stepIndex: stepIndex === 3 ? stepIndex : stepIndex + 1
    });
  };

  handleConfirm = () => {
    const queryData = this.props.activeList.editActive;
    queryData.sort = this.props.activeList.activeList.length + 1;
    const keyWord = this.props.keyWord;
    let url = '';
    switch (keyWord) {
      case 'showDetail':
        return;
      case 'editDetail':
        url = 'admin/activity/edit';
        break;
      case 'addActive':
        url = 'admin/activity/add';
        break;
      default:
        return;
    }

    // 数据校验
    const {
      title,
      active_type,
      discount,
      start_time,
      end_time,
      goods_list,
      image_url
    } = queryData;

    if (!title) {
      alert('活动名不能为空！');
      return;
    }
    if (!active_type || typeof parseInt(active_type) !== 'number') {
      alert('活动类型输入有误或未输入！');
      return;
    }
    if (!discount || isNaN(parseInt(discount))) {
      alert('优惠力度输入有误或未输入');
      return;
    }
    if (!image_url) {
      alert('活动主图为必填项目');
      return;
    }
    if (!start_time) {
      alert('活动开始时间不能为空！');
      return;
    }
    if (!end_time) {
      alert('活动结束时间不能为空！');
      return;
    }
    if (!goods_list) {
      alert('活动必须有参加活动的商品');
    }

    queryData.active_type = parseInt(queryData.active_type);
    queryData.discount = parseInt(queryData.discount);

    const that = this;
    request(url, {
      method: 'POST',
      body: JSON.stringify(queryData)
    })
      .then(function (res) {
        if (res.retCode === 0) {
          alert('提交成功');
          that.props.handleClose();
        }
      });
  };

  render() {
    const {keyWord} = this.props;
    const {stepIndex} = this.state;

    let modalTitle = '';
    switch (keyWord) {
      case 'showDetail':
        modalTitle = '活动详情';
        break;
      case 'editDetail':
        modalTitle = '编辑详情';
        break;
      case 'addActive':
        modalTitle = '添加活动';
        break;
      default:
        break;
    }

    const actions = [
      <div style={{marginTop: 12}}>
        <RaisedButton
          label="取消"
          onClick={this.handleClose}
          style={{marginRight: 12}}
        />
        <RaisedButton
          label="上一步"
          disabled={stepIndex === 0}
          onClick={this.handlePrev}
          style={{marginRight: 12}}
        />
        <RaisedButton
          label={stepIndex === 3 ? '确认提交' : '下一步'}
          primary={true}
          onClick={this.handleNext}
        />
      </div>
    ];
    const contentStyle = {margin: '0 16px'};

    return (
      <Dialog
        open={this.props.open}
        actions={actions}
        autoScrollBodyContent={true}
        title={modalTitle}
      >
        <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
          <Stepper linear={false} activeStep={stepIndex}>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 0
                });
              }}>基本信息</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 1
                });
              }}>图片上传</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 2
                });
              }}>选定商品</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 3
                });
              }}>设定数量</StepButton>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            <div>
              {this.getStepContent(stepIndex)}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default connect(
  state => ({
    activeList: state.activeList.toJS(),
    categoriesList: state.categoriesList.toJS()
  })
)(DetailModal);