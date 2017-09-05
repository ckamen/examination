
/**
 * 获取学员的考试列表
 * page(required):第几页
 * limit(required):每页包含多少数据
 * sort(optional):排序列名
 * order(optional):排序方向
 * q(optional):查询关键字
 * catalogId(optional):目录ID
 * compulsoryType(optional):必修–COMPULSORY; 选修–ELECTIVE
 */
function evaluationList(listPage, page, limit, sort, order, q, catalogId, compulsoryType) {
  //1.检查参数
  page = ("undefined" == typeof page) ? 1 : page;
  limit = ("undefined" == typeof limit) ? 10 : limit;
  sort = ("undefined" == typeof sort) ? '' : sort;
  order = ("undefined" == typeof order) ? '' : order;
  q = ("undefined" == typeof q) ? '' : q;
  catalogId = ("undefined" == typeof catalogId) ? '' : catalogId;
  compulsoryType = ("undefined" == typeof compulsoryType) ? '' : compulsoryType;
  var list;
  var app = getApp();//获取应用实例
  var token = wx.getStorageSync(app.globalData.token);
  //2.发起请求
  wx.showLoading({
    title: '正在加载中...',
    mask:true
  });
  wx.request({
    url: app.globalData.commonURI + app.globalData.evaluationListURI,
    data: {
      page: page,
      limit: limit,
      sort: sort,
      order: order,
      q: q,
      catalogId: catalogId,
      compulsoryType: compulsoryType
    },
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    success: function (res) {
      console.log(res.data);      
      var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
      if (1 == code) {//获取考试列表成功
        listPage.setData({
          list: listPage.data.list.concat(res.data.data.content),
          isLast: res.data.data.last,
          page: listPage.data.page+1
        });
      } else if (-1 == code) {//token过期，重新登录
        wx.setStorageSync(app.globalData.nextPage, '/pages/list/list');//指示待登录成功后要实际跳转的页面
        wx.navigateTo({
          url: '/pages/login/login'
        });
      } else {//0:执行产生错误
        util.wxShowModal('访问失败', '获取考试列表失败:' + res.data.message);
      }
    },
    fail: function () {
      util.wxShowModal('访问失败', "访问系统失败，请稍后重试!");
    },
    complete: function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }
  });
}

module.exports = {
  evaluationList: evaluationList
}