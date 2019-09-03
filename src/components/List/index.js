import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import '@tarojs/async-await'
import { queryTypeInfo } from '../../services/public';
import Card from '../../components/Card';
import './style.scss';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    this.getData(this.props.tid);
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive', nextProps, this.props);
    if (this.props.tid !== nextProps.tid) {
      this.getData(nextProps.tid);
    }
  }

  async getData(id) {
    Taro.showLoading({
      title: '加载中'
    })
    const data = await queryTypeInfo(id);
    this.setState({
      list: data.Data
    }, () => {
      Taro.hideLoading();
    });
  }

  goDetail = (url) => {
    // 查看详情
    console.log('jjjj', url);
  }

  render() {
    const { list } = this.state;
    return (
      <View className="list">
        {list.map((item, index) => (
          <Card key={item.url} index={index+1} title={item.title} url={item.url} desc={item.desc} />
        ))}
      </View>
    );
  }
}

List.defaultProps = {
  tid: '1',
  title: '知乎'
};