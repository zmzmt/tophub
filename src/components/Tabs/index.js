import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './style.scss';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { current, tabList } = this.props;
    return (
      <View className="tabs">
        <Text className="tabs-title">{`${index}. ${title}`}</Text>
        <Text className="tabs-desc">{desc}</Text>
      </View>
    );
  }
}

Tabs.defaultProps = {
  current: 1,
  tabList: [{title: ''}]
};