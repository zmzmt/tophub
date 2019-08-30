import Taro, {Component} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'

@inject('globalStore')
@observer
export default class Index extends Component {

  config = {
    navigationBarTitleText: '主页'
  };

  refresh = false;

  constructor(props) {
    super(props);
    this.state = {
      // list: []
    }
  }

  componentDidMount() {
    // this.getData(1);
  }

  render() {
    return (
      <View className='index'>
        index
        <AtButton>按钮文案</AtButton>
        <AtButton type='primary'>按钮文案</AtButton>
        <AtButton type='secondary'>按钮文案</AtButton>
      </View>
    )
  }
}

