import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'

import globalStore from './store/global'

import './app.scss'
// import { saveState, removeState } from './common/store';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  globalStore
}

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    permission: {
      "scope.userLocation": {
        "desc": "申请的证书有位置限制"
      }
    },
    plugins: {
      "wxparserPlugin": {
        "version": "0.1.0",
        "provider": "wx9d4d4ffa781ff3ac"
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#F1F1F1',
      navigationBarTitleText: '陌印-区块链人才社区',
      navigationBarTextStyle: 'black'
      // enablePullDownRefresh: true
    },
    tabBar: {
      "backgroundColor": "black",
      "borderStyle": "black",
      "selectedColor": "#fff",
      "color": "#808080",
      "list": []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      store.globalStore.setStart(true);
    }, 500);
  }

  componentWillUnmount() {
    store.globalStore.setStart(false);
  }

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
