import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import '@tarojs/async-await'
import './index.scss'
import { queryAllType } from '../../services/public'
import { saveState, fetchState } from '../../common/store';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '主页'
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      current: 0
    }
  }

  async componentDidMount() {
    const list = await fetchState('tab-list');
    if (list) {
      this.setState({
        list
      })
    } else {
      this.getData();
    }
  }

  onShareAppMessage = () => {
    // return {
    //   title: '陌上寻师，印刻于链',
    //   path: '/pages/index/index'
    // }
  }

  getData() {
    queryAllType()
      .then((res) => {
        saveState('tab-list', res.Data);
        this.setState({
          list: res.Data
        })
      });
  }

  handleClick(index) {
    this.setState({
      current: index
    })
  }

  render() {
    const { list, current } = this.state;
    return (
      <View className='index'>
        <AtTabs
          current={current}
          animated={false}
          scroll
          tabList={list}
          onClick={this.handleClick.bind(this)}
        >
          {list.map((item, key) => (
            <AtTabsPane index={key} key={item.id}>
              <View>{JSON.stringify(item)}</View>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    )
  }
}

