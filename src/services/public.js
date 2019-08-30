import Api from '../utils/api'

// 查询所有活动
export function queryActivitiesList(pageIndex = 1, pageSize = 10) {
  return Api.request('/user/public/activities/all', {
    query: {
      pageSize,
      pageIndex
    }
  });
}

// 查询活动详情
export function queryActivity(id) {
  return Api.request(`/user/public/activity/${id}`);
}

// 查询证书名称
export function queryCertName(id) {
  return Api.request(`/user/public/certification/${id}`);
}

// 获取手机验证码
export function querySms(phone) {
  return Api.request(`/user/public/sms/${phone}`);
}

// 获取证书
export function gainCert(cId, lat, lng) {
  if (lng) {
    return Api.request(`/user/info?cId=${cId}&longitude=${lng}&latitude=${lat}`);
  } else {
    return Api.request(`/user/info?cId=${cId}`);
  }
}

// 分享证书
export function shareCert(hash) {
  return Api.request('/user/public/share', {
    query: {
      hash
    }
  });
}

// 验证短信验证码
export function verifySms(phone, code) {
  return Api.request('/user/public/sms/verify', {
    method: 'POST',
    query: {
      phone,
      code
    }
  });
}

// 微信登录
export function weLogin(params) {
  return Api.request('/user/public/wechat', {
    method: 'POST',
    body: params,
    type: 'JSON'
  });
}

// // 修改默认银行账号
// export function modifyBankNo(params) {
//   return Api.request(`/v1/bank/account/${params.bankAccountNo}`, {
//     method: 'PUT',
//     body: params
//   });
// }
