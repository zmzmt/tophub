import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './style.scss';

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  goDetail = (url) => {
    console.log('card godetail', url), this.props;
  }

  render() {
    const { title, index, desc, url } = this.props;
    return (
      <View className="card" onClick={this.goDetail.bind(this, url)}>
        <Text className="card-title">{`${index}. ${title.trim()}`}</Text>
        <Text className="card-desc">{desc}</Text>
      </View>
    );
  }
}

Card.defaultProps = {
  title: '',
  index: 1,
  desc: '',
  url: ''
};