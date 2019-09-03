import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'

import globalStore from './store/global'

import './app.scss'

const store = {
  globalStore
}

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    plugins: {
      // "wxparserPlugin": {
      //   "version": "0.1.0",
      //   "provider": "wx9d4d4ffa781ff3ac"
      // }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#FFF',
      navigationBarTitleText: '今日热榜',
      navigationBarTextStyle: 'black'
      // enablePullDownRefresh: true
    }
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
