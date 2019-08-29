import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './style.scss';
import topImg from '../../static/images/top.png';
// const defaultImg = require('@/assets/images/card-blue.png');

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  goDetail = () => {
    if (this.props.from === 'index') {
      // 首页点击卡片进入
      Taro.navigateTo({
        url: `/pages/index/detail/index?id=${this.props.aid}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/course/detail/index?id=${this.props.aid}`
      })
    }
  }

  render() {
    const { name, image, status, time, type, privat, top, reviewed } = this.props;
    return (
      <View className="card" onClick={this.goDetail}>
        <View className="img-wrapper" style={{backgroundImage: `url(${image})`, backgroundSize: 'cover'}}></View>
        <View className="type">{type}</View>
        <View className="text-wrapper">
          <View>
            <Text className="text-h4">{name}</Text>
            <Text className="text-p">{time}</Text>
          </View>
          <View className="right">
            <Text className="right-status" style={status === '已结束' ? { color: '#7A7F82' } : {}}>{status}</Text>
            {privat ? <Text className="right-private">私有</Text> : ''}
          </View>
          {top ? <View className="corner">
            <Image src={topImg}></Image>
          </View> : ''}
        </View>
        {reviewed ? <View className="mask">
          <Text className="mask-text">已下架</Text>
        </View> : ''}
      </View>
    );
  }
}

Card.defaultProps = {
  // image: defaultImg,
  status: '未开始',
  type: '其他',
  privat: false,
  top: false,
  reviewed: false
};