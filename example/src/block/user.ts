const api = {
  getUserInfo: [
    'get',
    '/api/getUserInfo',
    { expect: () => false, initialVal: 123 },
  ],
  getRootInfo: [
    'get',
    '/api/getRootInfo',
    { expect: (data: any) => true, initialVal: undefined },
  ],
};

const request = {
  success(req) {
    return req;
  },

  error(err) {},
};

const response = {
  success(res) {
    return res.data.data;
  },

  error(err) {},
};

const config = {
  baseURL: 'http://mock.domain.org/mock/199',
};

export default {
  api,
  request,
  response,
  config,
};
