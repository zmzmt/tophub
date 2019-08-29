import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import moment from 'moment';
import './index.scss'
import Card from '../../components/Card'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { queryActivitiesList } from '../../services/public'
// import { ACTIVITY_TYPE } from '../../common/enum'
// import { timeCompare } from '../../utils/date.js';
// import { fetchToken } from '../../common/store';
// import { removeToken } from '../../common/store';

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
      list: [],
      total: 1,
      currentIndex: 1,
      footer: ''
    }
  }

  componentWillMount() {
    // 点击分享卡片进入，则跳转到分享页面
    if (this.$router.params.share) {
      if (this.$router.params.q) {
       let id = decodeURIComponent(this.$router.params.q).split('=')[1]
       Taro.navigateTo({
        url: decodeURIComponent(this.$router.params.share) + '?id=' + id
       })
      } else {
        Taro.navigateTo({
          url: decodeURIComponent(this.$router.params.share)
        })
      }
    }
    // 启动动画
    // if (!this.props.globalStore.startup) {
    //   Taro.redirectTo({
    //     url: '/pages/start/index'
    //   });
    // }
  }

  componentDidMount() {
    this.getData(1);
  }

  onShareAppMessage = () => {
    return {
      title: '陌上寻师，印刻于链',
      path: '/pages/index/index'
    }
  }

  getData(index = 1, cb) {
    queryActivitiesList(index, 10)
      .then((res) => {
        if (res.code === 0) {
          if (index === 1) {
            this.setState({
              list: res.data.list,
              total: Math.ceil(res.data.total / 10),
              currentIndex: index
            }, cb);
          } else {
            this.setState({
              list: this.state.list.concat(res.data.list),
              total: Math.ceil(res.data.total / 10),
              currentIndex: index
            }, cb);
          }
        }
      });
  }

  handleToTop = () => {
    if (!this.refresh) {
      this.refresh = true;
      this.getData(1);
    }
  }

  handleToBottom = () => {
    if (!this.refresh) {
      // 判断是否超过最大页码
      this.refresh = true;
      if (this.state.currentIndex === this.state.total) {
        // 无更多数据
        this.setState({
          footer: 'nomore'
        });
      } else {
        this.getData(this.state.currentIndex + 1);
      }
    }
  }

  handleTouchEnd = () => {
    let timer
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.refresh = false;
    }, 1600);
  }

  render() {
    const { list, footer } = this.state;
    return (
      <View className='index'>
        <Header />
        <ScrollView
          className='scroll-view'
          scrollY
          scrollWithAnimation
          enableBackToTop
          upperThreshold='1'
          lowerThreshold='0'
          onScrollToUpper={this.handleToTop.bind(this)}
          onScrollToLower={this.handleToBottom.bind(this)}
          onTouchEnd={this.handleTouchEnd.bind(this)}
        >
          <View className='card-container'>
            {(list && list.length) && list.map(item => (
              <Card name={item.name} time={item.startDate} status={item.process == 1 ? '未开始' : (item.process == 2 ? '进行中' : '已结束')} type={item.typeName} image={item.cover} key={item.id} aid={item.id} top={item.priorityValue >= 50 && moment(Date.now()).isBefore(moment(item.endDate))} from="index" />
            ))}
          </View>
          <Footer status={footer} />
        </ScrollView>
      </View>
    )
  }
}

