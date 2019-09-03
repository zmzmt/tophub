import Api from '../utils/api'

// 获取所有榜单类型
export function queryAllType() {
  return Api.request('/GetType');
}

// 获取榜单详情
export function queryTypeInfo(id) {
  return Api.request(`/GetTypeInfo?id=${id}`);
}

// 分享证书
export function shareCert(hash) {
  return Api.request('/user/public/share', {
    query: {
      hash
    }
  });
}
