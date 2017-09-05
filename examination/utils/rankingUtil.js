/**
 * 获取某次成绩排行列表
 * rankingPage(required):页面上下文
 */
function getRankingList(rankingPage) {
  //1.检查参数
  var page = rankingPage.data.page;
  var limit = rankingPage.data.limit;
  var activityId = rankingPage.data.activityId;
  var list;
  var app = getApp();//获取应用实例
  var token = wx.getStorageSync(app.globalData.token);
  //2.发起请求
  wx.showLoading({
    title: '正在加载中...',
    mask:true
  });
  wx.request({
    url: app.globalData.commonURI + app.globalData.findRankingListURI,
    data: {
      page: page,
      limit: limit,
      activityId: activityId
    },
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    success: function (res) {
      console.log(res);      
      var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
      if (1 == code) {//获取排行列表成功
        rankingPage.setData({
          list: rankingPage.data.list.concat(res.data.data.content),
          isLast: res.data.data.last,
          page: rankingPage.data.page+1
        });
      } else if (-1 == code) {//token过期，重新登录
        wx.setStorageSync(app.globalData.nextPage, '/pages/ranking/ranking');//指示待登录成功后要实际跳转的页面
        wx.navigateTo({
          url: '/pages/login/login'
        });
      } else {//0:执行产生错误
        //util.wxShowModal('访问失败', '获取考试列表失败:' + res.data.errMsg);
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
  getRankingList: getRankingList
}