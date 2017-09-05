// ranking.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var rankingUtil = require('../../utils/rankingUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',//考试活动ID
    myScore: "未知", //我的分数
    myRanking: '未知',        //我的名次
    page: 1,  //当前页面码
    limit: 5,//每页记录数
    list: [], //排行榜列表
    isLast: false //是否最后一页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activityId = options.activityId;
    this.setData({
      activityId: activityId
    });
    if (util.isLogined()) {
      var token = wx.getStorageSync(app.globalData.token);
      //2.发起请求,获取我的成绩及名次
      var that = this;//在wx.request中避免歧义
      wx.showLoading({
        title: '正在加载中...',
        mask: true
      });
      wx.request({
        url: app.globalData.commonURI + app.globalData.findUserRankingURI,
        data: {
          activityId: activityId
        },
        header: {
          'content-type': 'application/json',
          'X-AUTH-TOKEN': 'bearer ' + token
        },
        success: function (res) {
          console.log(res.data.data);
          var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
          if (1 == code) {//获取我的成绩名次成功
            that.setData({
              myScore: res.data.data.score,
              myRanking: res.data.data.ranking
            });
            //3.发起请求,获取成绩排行榜
            rankingUtil.getRankingList(that);
          } else if (-1 == code) {//token过期，重新登录
            wx.setStorageSync(app.globalData.nextPage, '/pages/ranking/ranking');//指示待登录成功后要实际跳转的页面
            wx.navigateTo({
              url: '/pages/login/login'
            });
          } else {//0:执行产生错误
            //util.wxShowModal('访问失败', '尚未有成绩排行' + res.data.message);
            rankingUtil.getRankingList(that, that.data.page, that.data.limit, that.activityId);
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
    } else {
      util.checkLogin(app, '/pages/ranking/ranking?activityId=' + activityId);//如果未登录，则跳转到登录页面，登录成功后返回本页
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLast) {
      wx.showToast({
        title: '没有更多数据加载',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      //发起请求,获取成绩排行榜
      rankingUtil.getRankingList(this, this.data.page, this.data.limit, this.activityId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})