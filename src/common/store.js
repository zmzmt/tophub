import Taro from '@tarojs/taro'
// import { authToken } from '../services/user'

const TEMP_STATE_KEY = 'temp_state_key';
const TOKEN_KEY = 'token_key';

// 暂时将数据存在storage中
export function saveState(state, key = TEMP_STATE_KEY) {
  Taro.setStorageSync(key, JSON.stringify(state));
}

export function fetchState(key = TEMP_STATE_KEY) {
  const res = Taro.getStorageSync(key) ? JSON.parse(Taro.getStorageSync(key)) : '';
  return res;
}

export function removeState(key = TEMP_STATE_KEY) {
  Taro.removeStorageSync(key);
}

export function saveToken(token) {
  if (token) Taro.setStorageSync(TOKEN_KEY, JSON.stringify(token));
}

export function fetchToken() {
  const res = Taro.getStorageSync(TOKEN_KEY) ? JSON.parse(Taro.getStorageSync(TOKEN_KEY)) : '';
  return res;
  // if (Taro.getStorageSync(TOKEN_KEY)) {
  //   authToken(JSON.parse(Taro.getStorageSync(TOKEN_KEY)))
  //   .then(response => {
  //     if (response.code == 0) {
  //       console.log(Taro.getStorageSync(TOKEN_KEY))
  //       return JSON.parse(Taro.getStorageSync(TOKEN_KEY))
  //     } else {
  //       return ''
  //     }
  //   })
  // } else {
  //   return ''
  // }
}

export function removeToken() {
  Taro.removeStorageSync(TOKEN_KEY);
}

export function clearSession() {
  sessionStorage.clear();
}
