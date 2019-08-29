import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { memberList } from '../../../services/user.js'
import Footer from '../../../components/Footer'
import noImg from '../../../static/images/no-user.png';
import './index.scss'

class List extends Component {

  config = {
    navigationBarTitleText: '报名人员列表'
  }

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 1,
      currentIndex: 1,
      footer: ''
    }
  }

  componentDidMount () {
    this.getData(1);
  }

  getData(index = 1, cb) {
    memberList(this.$router.params.id, 20, index)
      .then((res) => {
        if (res.code === 0) {
          if (index === 1) {
            this.setState({
              list: res.data.list,
              total: Math.ceil(res.data.total / 20),
              currentIndex: index
            }, cb);
          } else {
            this.setState({
              list: this.state.list.concat(res.data.list),
              total: Math.ceil(res.data.total / 20),
              currentIndex: index
            }, cb);
          }
        }
      });
  }

  handleToBottom = () => {
    // 判断是否超过最大页码
    if (this.state.currentIndex === this.state.total) {
      // 无更多数据
      this.setState({
        footer: 'nomore'
      });
    } else {
      this.getData(this.state.currentIndex + 1);
    }
  }

  render () {
    const { list, footer } = this.state;
    return (
      <View className="index-list">
        {list && list.length ?
        <ScrollView
          className='scroll-view'
          scrollY
          scrollWithAnimation
          enableBackToTop
          lowerThreshold='0'
          onScrollToLower={this.handleToBottom.bind(this)}
        >
          <View className="list-container">
            {list.map((item) => <View className="index-list-item" key={item.image}><Image src={item.image} /><Text>{item.appliedTime}</Text></View>)}
          </View>
          <Footer status={footer} />
        </ScrollView>
          :
        <View className='no-content'>
          <Image src={noImg} alt="no content" className="no-img"></Image>
          <Text className="no-p">当前暂无人报名该活动</Text>
        </View>
        }
      </View>
    )
  }
}

export default List 
