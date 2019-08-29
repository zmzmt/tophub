import Taro, {Component} from "@tarojs/taro";
import {Text, View} from "@tarojs/components";
import './style.scss'

export default class Footer extends Component{
  render() {
    const { status } = this.props;
    return (
      <View className='footer'>
        {status === 'loading' ? <Text className='footer-text'>加载更多</Text> : (status === 'nomore' ? <Text className='footer-text'>没有更多了</Text> : '')}
      </View>
    )
  }
}
