import React from 'react';
import {connect} from 'react-redux';
import {goodsList} from './../../actions';
import {RaisedButton, Dialog} from 'material-ui';
import AvatarEditor from 'react-avatar-editor';
import {styles} from './GoodsListStyles';
import upload from './../../common/image/upload.png';

class AddImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      imgFieldOpen: false
    }
  }

  singleFileSelect = e => {
    const that = this;
    const image = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
      console.log(e.target.result);
      that.setState({
        imgFieldOpen: true,
        fileUrl: e.target.result
      })
    };
  };

  multiFileSelect = e => {
    const that = this;
    const image = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
      that.setState({
        fileUrl: e.target.result
      })
    };
  };

  render() {
    return (
      <div>
        <img
          src={upload}
          style={styles.mainImage}
          alt={upload}
        />
        <RaisedButton
          label=""
          primary={true}
          style={styles.fileSelectContent}
        >
          上传图片
          <input
            style={styles.fileSelect}
            type="file"
            accept="image/gif,image/jpeg,image/png"
            onChange={this.singleFileSelect}
          />
        </RaisedButton>
        <span
          style={{marginBottom: '12px'}}
        >请上传产品主图，主图会在产品列表和产品详情中呈现，尺寸建议为宽度为750像素，长度为635像素，图片大小建议小于1M</span>
        <div style={{height: 200, marginTop: '12px'}}>
          <img
            src={upload}
            style={styles.detailImage}
            alt={upload}
          />
          <img
            src={upload}
            style={styles.detailImage}
            alt={upload}
          />
          <img
            src={upload}
            style={styles.detailImage}
            alt={upload}
          />
        </div>
        <RaisedButton
          label=""
          primary={true}
          style={styles.fileSelectContent}
        >
          上传图片
          <input
            style={styles.fileSelect}
            type="file"
            accept="image/gif,image/jpeg,image/png"
            onChange={this.multiFileSelect}
          />
        </RaisedButton>
        <span>请上传产品详情图片，建议宽度为750像素，长度不限，图片大小建议小于1M</span>
        <Dialog open={this.state.imgFieldOpen}>
          <AvatarEditor
            image={this.state.fileUrl}
            width={600}
            height={428}
            border={10}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
        </Dialog>
      </div>
    )
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS(),
    categoriesList: state.categoriesList.toJS()
  }),
  dispatch => ({
    patchGoodDetail: dataObj => dispatch(goodsList.patchGoodDetail(dataObj))
  })
)(AddImage);