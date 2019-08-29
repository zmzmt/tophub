import Taro, { Component } from "@tarojs/taro";
import { Text, View, Image } from "@tarojs/components";
import { observer, inject } from '@tarojs/mobx'
import UserInfo from '../UserInfo/index'
import "./style.scss";

import Logo from "../../static/images/logo.png";
import qcz from "../../static/images/qcz.png";
import { fetchToken } from "../../common/store";

@inject('userInfoStore')
@observer
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showInfoModal: false
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.userInfoStore.info.image && this.props.userInfoStore.info.image !== nextProps.userInfoStore.info.image) {
      this.props.userInfoStore.setModal(false);
    }
    // this.setState({
    //   showInfoModal:false
    // })
  }
  
  componentWillUnmount() {
    this.props.userInfoStore.setModal(false);
  }
  
  showInfo = () => {
    if (fetchToken()) {
      this.props.userInfoStore.setModal(true);
    } else {
      Taro.navigateTo({
        url: '/pages/authorize/phone/index?from=back'
      })
    }
    // this.setState({
    //   showInfoModal: true
    // });
  }

  hiddenInfo = () => {
    this.props.userInfoStore.setModal(false);
    // this.setState({
    //   showInfoModal: false
    // });
  }

  goHome = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    });
  }

  goQcz = () => {
    const url = encodeURIComponent(`https://www.moreink.net/qucunzheng`)
    // const url = encodeURIComponent(`http://172.16.0.4:33334/qucunzheng`)
    Taro.navigateTo({
      url: `/pages/webview/index?url=${url}`
    });
  }

  showMessage (type, message) {
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  render() {
    // const { showInfoModal } = this.state;
    const modal = this.props.userInfoStore.modal;
    return (
      <View className="header">
        <Image className="logo" src={Logo} onClick={this.goHome.bind(this)} />
        {this.props.showUser ? <View className="info">
        <Image className="qcz-img" src={qcz} onClick={this.goQcz} />
        <Text onClick={this.showInfo}>个人</Text>
      </View> : ''}

        {
          modal && <UserInfo onShowMessage={this.showMessage} onCloseInfoModal={this.hiddenInfo}  showInfoModal={modal} /> 
        }
        
      </View>
    );
  }
}
Header.defaultProps = {
  isCurrent:true,
  showUser: true
};