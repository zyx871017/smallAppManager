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
      that.setState({
        imgFieldOpen: true,
        fileUrl: e.target.result
      })
    };
  };

  secFileSelect = (e, key) => {
    const that = this;
    const image = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
      const obj = {};
      obj[key] = e.target.result;
      that.props.patchGoodDetail(obj);
    };
  };

  setEditorRef = editor => {
    if (editor) this.editor = editor;
  };

  handleSave = () => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    this.props.patchGoodDetail({goods_image: img});
    this.setState({imgFieldOpen: false});
  };

  render() {
    const editGood = this.props.goodsList.editGood;
    return (
      <div>
        <img
          src={editGood.goods_image || upload}
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
          style={{marginBottom: '12px', display: 'block'}}
        >请上传产品主图，主图会在产品列表和产品详情中呈现，尺寸建议为宽度为750像素，长度为635像素，图片大小建议小于1M</span>
        <div style={{height: 272}}>
          <div style={styles.secImageItem}>
            <img
              src={editGood.image1 || upload}
              style={styles.detailImage}
              alt={upload}
            />
            <RaisedButton
              label=""
              primary={true}
              style={styles.fileSelectContent}
            >
              上传图片1
              <input
                style={styles.fileSelect}
                type="file"
                accept="image/gif,image/jpeg,image/png"
                onChange={e => this.secFileSelect(e,'image1')}
              />
            </RaisedButton>
          </div>
          <div style={styles.secImageItem}>
            <img
              src={editGood.image2 || upload}
              style={styles.detailImage}
              alt={upload}
            />
            <RaisedButton
              label=""
              primary={true}
              style={styles.fileSelectContent}
            >
              上传图片2
              <input
                style={styles.fileSelect}
                type="file"
                accept="image/gif,image/jpeg,image/png"
                onChange={e => this.secFileSelect(e,'image2')}
              />
            </RaisedButton>
          </div>
          <div style={styles.secImageItem}>
            <img
              src={editGood.image3 || upload}
              style={styles.detailImage}
              alt={upload}
            />
            <RaisedButton
              label=""
              primary={true}
              style={styles.fileSelectContent}
            >
              上传图片3
              <input
                style={styles.fileSelect}
                type="file"
                accept="image/gif,image/jpeg,image/png"
                onChange={e => this.secFileSelect(e,'image3')}
              />
            </RaisedButton>
          </div>
        </div>
        <span
          style={{display: 'block',}}
        >请上传产品详情图片，建议宽度为750像素，长度不限，图片大小建议小于1M</span>
        <Dialog
          contentStyle={{width: '668px'}}
          open={this.state.imgFieldOpen}>
          <AvatarEditor
            ref={this.setEditorRef}
            onSave={this.handleSave}
            image={this.state.fileUrl}
            width={600}
            height={428}
            border={10}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
          <RaisedButton
            style={{display: 'block'}}
            primary={true}
            onClick={this.handleSave}
          >确认</RaisedButton>
        </Dialog>
      </div>
    )
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS()
  }),
  dispatch => ({
    patchGoodDetail: dataObj => dispatch(goodsList.patchGoodDetail(dataObj))
  })
)(AddImage);