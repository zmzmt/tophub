import Taro, { Component } from "@tarojs/taro";
import { Text, View, ScrollView, Image } from "@tarojs/components";
import { AtModal, AtModalContent, AtInput, AtIcon } from "taro-ui";
import "./style.scss";
import { removeToken } from "../../common/store";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      userInfo: {},
      editInfo: {},
      inputDisabled: false
    };
  }

  componentDidMount(){
    this.getData();
  }

  getData() {
    // queryUserInfo().then(res => {
    //   if (res.code === 0) {
    //     this.setState(
    //       {
    //         userInfo: {
    //           ...res.data
    //           // identityNumber: '321321454659'
    //         },
    //         editInfo:res.data
    //       },
    //       cb
    //     );
    //   }
    // });
  }
 
  showEdit = () => {
    // const { userInfo } = this.state;
    // const { verified } = userInfo;
    this.setState({
      showEdit: true
    });
  }
  
  handleChange = (key,value) => {
    const {editInfo} = this.state;

    this.setState({
      editInfo:{
        ...editInfo,
        [key]:value
      }
    })
  }

  editAvatar = () => {
    // 编辑头像
    this.props.userInfoStore.setInfo({
      ...this.state.userInfo
    });
    Taro.navigateTo({
      url: '/pages/authorize/info/index'
    })
  }

  quit = () => {
    removeToken();
    this.props.userInfoStore.setModal(false);
    Taro.navigateTo({
      url: '/pages/authorize/phone/index?from=back'
    });
    // Taro.redirectTo({
    //   url: '/pages/authorize/phone/index'
    // });
  }

  submit = () => {
    const {editInfo,userInfo} = this.state;
    const {onShowMessage,onCloseInfoModal} = this.props;
    if (name && name.length > 50) {
      onShowMessage('error','请填写正确的姓名')
      return;
    }
    // 身份证格式校验
    const userData = {
      ...userInfo,
      ...editInfo
    };
    this.updateInfo(userData)
      .then((res) => {
        if (res.code === 0) {
          onShowMessage('success','提交成功')
          this.setState({
            inputDisabled: true,
            showEdit: false
          }, () => {
            onCloseInfoModal();
          })
        } else {
          onShowMessage('success', res.message || '提交失败')
        }
      });
  }

  closeModal = () => {
    this.setState({
      inputDisabled: true,
      showEdit: false
    })
  }

  render() {
    const {userInfo, showEdit, inputDisabled } = this.state;
    const { onCloseInfoModal } =this.props;
    const { verified } = userInfo;
    // const verified = false;
    return (
        <View className="modal-wraper">
          <AtModal closeOnClickOverlay={false} isOpened onClose={this.closeModal}>
            <AtModalContent>
              <View className="close-button">
                <AtIcon
                  onClick={onCloseInfoModal}
                  value="close"
                  size="20"
                  color="#000000"
                />
              </View>
              <View className="info-title">
                <Image className="info-title-img" src={userInfo.image} />
                {showEdit && !userInfo.auth ? <Text className="info-title-text" onClick={this.editAvatar}>编辑头像</Text> : ''}
              </View>
              {showEdit ? (
                <View className='edit-info'>
                  <View className='input-wraper'>
                    <AtInput
                      name="name"
                      className='input'
                      type="text"
                      disabled={inputDisabled || verified}
                      placeholder={userInfo.name ? '' : '请填写姓名'}
                      value={userInfo.name}
                      onChange={this.handleChange.bind(this, "name")}
                    >
                      {userInfo.verified && userInfo.name ? <Text className="input-verified" style="color: #3ACEB1">已上链</Text> : ''}
                    </AtInput>
                  </View>
                  <View className='input-wraper'>
                    <AtInput
                      name="phone"
                      className={(verified || userInfo.idInChain) ? 'input' : 'input input-disabled'}
                      disabled
                      type="text"
                      placeholder={userInfo.phone ? '' : '请填写手机'}
                      value={userInfo.phone}
                      onChange={this.handleChange.bind(this, "phone")}
                    >
                      {(verified || userInfo.idInChain) ? <Text className="input-verified" style="color: #3ACEB1">已上链</Text> : ''}
                    </AtInput>
                  </View>
                  <View className='input-wraper'>
                    <AtInput
                      name="name"
                      disabled={inputDisabled}
                      className='input'
                      type="text"
                      placeholder={userInfo.email ? '' : '请填写邮箱'}
                      value={userInfo.email||''}
                      onChange={this.handleChange.bind(this, "email")}
                    />
                  </View>
                  <View className='input-wraper'>
                    <AtInput
                      name="name"
                      className='input'
                      type='idcard'
                      value={userInfo.identityNumber||''}
                      placeholder={userInfo.identityNumber ? '' : '请填写身份证号'}
                      disabled={inputDisabled || (!userInfo.identityNumber ? false : userInfo.idInChain)}
                      onChange={this.handleChange.bind(this, "identityNumber")}
                    >
                      {userInfo.idInChain && userInfo.identityNumber ? <Text className="input-verified" style="color: #3ACEB1">已上链</Text> : ''}
                    </AtInput>
                  </View>
                  <View className='input-wraper'>
                    <AtInput
                      name="name"
                      className='input'
                      type="text"
                      disabled={inputDisabled}
                      placeholder={userInfo.employer ? '' : '请填写工作单位'}
                      value={userInfo.employer||''}
                      onChange={this.handleChange.bind(this, "employer")}
                    />
                  </View>
                </View>
              ) : (
                <ScrollView scrollY className="user-info">
                  <View>
                    <Text>姓名</Text>
                    <Text>
                      {userInfo.name ? (
                        <Text>{userInfo.name}</Text>
                      ) : (
                        <Text className="empty">未填写</Text>
                      )}
                    </Text>
                  </View>
                  <View>
                    <Text>手机号</Text>
                    <Text>{userInfo.phone}</Text>
                  </View>
                  <View>
                    <Text>邮箱</Text>
                    {userInfo.email ? (
                      <Text>{userInfo.email}</Text>
                    ) : (
                      <Text className="empty">未填写</Text>
                    )}
                  </View>
                  <View>
                    <Text>身份证号</Text>
                    {userInfo.identityNumber ? (
                      <Text>{userInfo.identityNumber}</Text>
                    ) : (
                      <Text className="empty">未填写</Text>
                    )}
                  </View>
                  <View>
                    <Text>工作单位</Text>
                    {userInfo.employer ? (
                      <Text>{userInfo.employer}</Text>
                    ) : (
                      <Text className="empty">未填写</Text>
                    )}
                  </View>
                </ScrollView>
              )}
            </AtModalContent>
            {showEdit ? (
              <View onClick={this.submit} className="operate">
                <Text className="operate-submit">提交</Text>
                </View>
                ) : (
                  <View onClick={this.showEdit} className="operate first">
                  <Text className="operate-edit">编辑</Text>
                  <Text className="operate-quit" onClick={this.quit}>退出登录</Text>
              </View>
            )}
          </AtModal>
        </View>
    );
  }
}
