/* eslint-disable react/forbid-elements */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtModal, AtModalContent, AtIcon, AtInput } from 'taro-ui'
import { queryActivity } from '../../../services/public.js'
import { signInfo, userApply } from '../../../services/user.js'
import {checkEmail} from '../../../utils/check'
import pdf from '../../../static/images/pdf.png';
import audit from '../../../static/images/audit.png';
import apply from '../../../static/images/apply.png';
import noImg from '../../../static/images/nocourse.png';
import artboard from '../../../static/images/artboard.png';
import { timeCompare } from '../../../utils/date.js';
import { fetchToken } from '../../../common/store';
import './index.scss'

class Detail extends Component {

  config = {
    navigationBarTitleText: '活动详情',
    usingComponents: {
      "wxparser": "plugin://wxparserPlugin/wxparser" // 第三方wxParser插件
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      auditModal: false,
      signedModal: false,
      successModal: false,
      applyModal: false,
      loading: false,
      sInfo: {},
      editInfo: {},
      id: 0,
      hint: ''
    }
  }
  
  componentDidMount () {
    let id;
    if (this.$router.params.id) {
      id = this.$router.params.id
    } else {
      id = decodeURIComponent(this.$router.params.q).split('=')[1]
    }
    this.setState({
      id: id
    })
    this.getData(id)
  }
  
  getData(id) {
    queryActivity(id)
    .then(res => {
      if (res.code === 0) {
        this.setState({
          data: res.data
        });
      }
    })
  }

  onShareAppMessage = () => {
    const url = encodeURIComponent(`/pages/index/detail/index?id=${this.state.id}`)
    return {
      title: this.state.data.name || '陌印-区块链人才社区',
      path: `/pages/index/index?share=${url}`
    }
  }

  openResource = (url, name) => {
    Taro.navigateTo({
      url: `/pages/download/index?url=${encodeURIComponent(url)}&name=${name}`
    })
  }

  goList = () => {
     Taro.navigateTo({
       url: `/pages/index/list/index?id=${this.state.id}`
     })
  }

  onApply = () => {
    if (fetchToken()) {
      // 已登录
      signInfo(this.state.id)
      .then(res => {
        if (res.code === 0) {
          // 可以报名
          // 判断个人信息授权
          Taro.getSetting({
            success: (resSucc) => {
              const statu = resSucc.authSetting;
              if (statu['scope.userInfo']) {
                this.setState({
                  editInfo: res.data,
                  sInfo: res.data,
                  applyModal: true
                });
              } else {
                // 跳转至个人信息授权页面
                this.setState({
                  editInfo: res.data,
                  sInfo: res.data,
                  applyModal: true
                }, () => {
                  Taro.navigateTo({
                    url: '/pages/authorize/info/index'
                  })
                });
              }
            }
          });
        } else if (res.code === 4002) {
          // 报名审核中
          this.setState({
            auditModal: true,
            hint: res.message
          })
        } else {
          // 报名成功或报名驳回
          this.setState({
            signedModal: true,
            hint: res.message
          })
        }
      })
    } else {
      // 未登录，跳转至登录页面
      // const url = encodeURIComponent(`pages/index/detail/index?id=${this.state.id}`);
      // Taro.redirectTo({
      //   url: `/pages/authorize/phone/index?from=${url}`
      // });
      Taro.navigateTo({
        url: `/pages/authorize/phone/index?from=back&needInfo=1`
      })
    }
  }

  onApplyEnd = () => {
    Taro.showToast({
      title: '该活动报名已结束',
      icon: 'none',
      duration: 2000
    });
  }

  onCloseApplyModal = () => {
    this.setState({
      applyModal: false,
      sInfo: {},
      editInfo: {}
    });
  }

  onCloseAuditModal = () => {
    this.setState({
      auditModal: false
    });
  }

  onCloseSignedModal = () => {
    this.setState({
      signedModal: false
    });
  }

  onCloseSuccessModal = () => {
    this.setState({
      successModal: false
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

  submit = () => {
    const { sInfo, editInfo } = this.state;
    // 表单验证
    if (!sInfo.nameInChain && (!editInfo.name || editInfo.name.length > 50)) {
      Taro.showToast({
        title: '请输入正确的姓名',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (sInfo.needEmail && (!editInfo.email || !checkEmail(editInfo.email))) {
      Taro.showToast({
        title: '请输入正确的邮箱',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (sInfo.needEmployer && (!editInfo.employer || editInfo.employer.length > 140)) {
      Taro.showToast({
        title: '请输入正确的工作单位',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (sInfo.needProfession && (!editInfo.profession || editInfo.profession.length > 50)) {
      Taro.showToast({
        title: '请输入正确的职位',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    const params = [{
      aId: +this.state.id,
      phone: editInfo.phone,
      name: editInfo.name,
      email: editInfo.email,
      employer: editInfo.employer,
      profession: editInfo.profession
    }]
    this.setState({
      loading: true
    })
    userApply(params)
    .then(res => {
      if (res.code === 0) {
        // 报名成功，更新活动详情
        this.setState({
          applyModal: false,
          successModal: true
        }, () => {
          this.getData(this.state.id)
          this.setState({
            loading: false
          });
        })
      } else {
        Taro.showToast({
          title: res.message || '报名失败，请重试',
          icon: 'none',
          duration: 2000,
          complete: () => {
            this.setState({
              loading: false
            })
          }
        });
      }
    })
  }

  goWeb = (e) => {
    console.log('e', e);
    // wx.navigateTo({
    //   url: e.detail.href
    // })
  }

  render () {
    const { data, auditModal, applyModal, sInfo, signedModal, successModal, hint, loading } = this.state;
    return (
      <View className="course-detail">
        {data && data.id ? (data.reviewedState == 2 || data.reviewedState == 0 ?
          <View className='no-content'>
            <Image src={noImg} alt="no content" className="no-img"></Image>
            <Text className="no-p">{data.reviewedState == 2 ? '活动已下架' : '活动暂未发布'}</Text>
            <Text className="no-span">{data.reviewedState == 2 ? data.specialFields[0]['value'] : ''}</Text>
          </View> :
          <View className="middle" style={data.needApplied ? { paddingBottom: '45Px' } : ''}>
            <Image src={data.cover} alt="活动图片" className="course-img"></Image>
            <View className="info">
              <Text className="info-h3">{data.name}</Text>
              <Text className="info-status">{timeCompare(data.startDate, data.endDate)}</Text>
              <Text className="info-p">{data.startDate}</Text>
              <View className="info-span-wrapper"><Text className="info-span info-span-first">活动地点</Text><Text className="info-span info-span-last">{data.address}</Text></View>
              <View className="info-span-wrapper"><Text className="info-span info-span-first">主办方</Text><Text className="info-span info-span-last">{data.organizer}</Text></View>
              {data.specialFields && data.specialFields.length ? data.specialFields.map(item => (<View className="info-span-wrapper" key={item.fieldName}><Text className="info-span info-span-first">{item.fieldName}</Text><Text className="info-span info-span-last">{item.value}</Text></View>)) : ''}
            </View>
            {data.needApplied ? <View className="enroll">
            <View className="enroll-header"><Text className="enroll-h5">报名信息</Text><AtIcon value='chevron-right' size='20' color='#999' onClick={this.goList}></AtIcon></View>
            <View className="enroll-avatars">
              {data.imageUrls && data.imageUrls.length ? data.imageUrls.map(item => {
                return item ? <Image src={item} className="enroll-avatars-img" key={item} /> : ''
              }) : ''}
            </View>
            <Text className="enroll-text">已报名{data.appliedNumber}人</Text> 
          </View> : ''}
            <View className="detail ql-editor">
              <Text className="detail-h5">活动介绍</Text>
              <View className="detail-div">
                <wxparser rich-text="{{data.details}}" bind:tapLink="goWeb" />
              </View>
            </View>
            {data.files && data.files.length ? <View className="resource">
              <Text className="detail-h5">活动资料</Text>
              <Text className="resource-hint">参与活动后，可以在「我的活动」中查看此活动资料。</Text>
              {data.files.map(item => (<View className="resource-item disabled" key={item.fileId}><Image src={pdf} className="resource-img" /><Text className="resource-title">{item.alias}</Text></View>))}
            </View> : ''}
            <View className="organ">
              <View className="organ-header">
                <Text className="organ-line"></Text>
                <Text className="organ-text">活动发布机构</Text>
                <Text className="organ-line"></Text>
              </View>
              <Image src={data.logo} alt="logo" className="organ-logo" />
            </View>
            <official-account></official-account>
            {data.needGroup ? <View className="wechat">
              <View className="wechat-wrapper">
                <Image className="wechat-img" src={artboard} />
                <Text className="wechat-keyword">请关注陌印公众号，并回复【****】，获取进入现场活动群二维码</Text>
              </View>
            </View> : ''}
            {data.needApplied && !data.appliedVO.stopApplied ? <View className="apply" onClick={this.onApply}>
              <Text>立即参与</Text>
            </View> : ''}
            {data.needApplied && data.appliedVO.stopApplied ? <View className="apply apply-end" onClick={this.onApplyEnd}>
              <Text>活动报名已结束</Text>
            </View> : ''}
          </View>) : ''}
        <AtModal isOpened={auditModal} className="sign-modal">
          <AtModalContent>
            <Image src={audit} alt="报名审核中" />
            <Text className="modal-h4">报名审核中</Text>
            <Text className="modal-p">{hint || '该活动需要报名审核，可以在我的活动中查看审核结果。'}</Text>
            <AtButton className="modal-btn" type="primary" onClick={this.onCloseAuditModal}>确认</AtButton>
          </AtModalContent>
        </AtModal>
        <AtModal isOpened={successModal} className="sign-modal">
          <AtModalContent>
            <Image src={apply} alt="报名成功" />
            <Text className="modal-h4">报名成功</Text>
            <Text className="modal-p">{hint || '可以在我的活动中查看该活动。'}</Text>
            <AtButton className="modal-btn" type="primary" onClick={this.onCloseSuccessModal}>确认</AtButton>
          </AtModalContent>
        </AtModal>
        <AtModal isOpened={signedModal} className="sign-modal">
          <AtModalContent>
            <Image src={apply} alt="已报名" />
            <Text className="modal-h4">已报名</Text>
            <Text className="modal-p">{hint || '您已报名此活动，无需重复报名。可以在我的活动进行查看。'}</Text>
            <AtButton className="modal-btn" type="primary" onClick={this.onCloseSignedModal}>确认</AtButton>
          </AtModalContent>
        </AtModal>
        <AtModal closeOnClickOverlay={false} isOpened={applyModal} className="apply-modal">
            <AtModalContent>
              <View className="close-button">
                <AtIcon
                  onClick={this.onCloseApplyModal}
                  value="close"
                  size="20"
                  color="#000000"
                />
              </View>
              <View className="info-title">
                <Text>报名信息</Text>
              </View>
              <View className='edit-info'>
                <View className='input-wraper'>
                  <AtInput
                    name="phone"
                    className='input input-disabled'
                    disabled
                    type="text"
                    placeholder="请填写手机"
                    value={sInfo.phone}
                    onChange={this.handleChange.bind(this, "phone")}
                  />
                </View>
                <View className='input-wraper'>
                  <AtInput
                    name="name"
                    className={sInfo.nameInChain ? 'input input-disabled' : 'input'}
                    type="text"
                    disabled={sInfo.nameInChain}
                    placeholder="请填写姓名"
                    value={sInfo.name || ''}
                    onChange={this.handleChange.bind(this, "name")}
                  />
                </View>
                {sInfo.needEmail ? <View className='input-wraper'>
                  <AtInput
                    name="email"
                    className='input'
                    type="text"
                    placeholder="请填写邮箱"
                    value={sInfo.email || ''}
                    onChange={this.handleChange.bind(this, "email")}
                  />
                </View> : ''}
                {sInfo.needEmployer ? <View className='input-wraper'>
                  <AtInput
                    name="employer"
                    className='input'
                    type="text"
                    placeholder="请填写工作单位"
                    value={sInfo.employer || ''}
                    onChange={this.handleChange.bind(this, "employer")}
                  />
                </View> : ''}
                {sInfo.needProfession ? <View className='input-wraper'>
                  <AtInput
                    name="profession"
                    className='input'
                    type='text'
                    value={sInfo.profession || ''}
                    placeholder="请填写职位"
                    onChange={this.handleChange.bind(this, "profession")}
                  >
                  </AtInput>
                </View> : ''}
              </View>
            </AtModalContent>
            <View className="operate">
              <AtButton onClick={this.submit} className="operate-submit" disabled={loading}>提交</AtButton>
            </View>
          </AtModal>
      </View>
    )
  }
}

export default Detail 
