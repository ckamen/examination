// mylist.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var myListUtil = require('../../utils/myListUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,  //当前页面码
    limit: 5,//每页记录数
    list: [], //考试列表
    isLast: false//是否最后一页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //登录成功则加载我的的考试列表
    if (util.isLogined()) {
      myListUtil.getMyExamList(this, this.data.page, this.data.limit);
    } else {
      util.checkLogin(app, '/pages/mylist/mylist');//如果未登录，则跳转到登录页面，登录成功后返回本页
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
      myListUtil.getMyExamList(this, this.data.page, this.data.limit);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
  获取考试详情
  */
  getDetail: function (e) {
    var activityId = util.trim(e.currentTarget.id);
    wx.navigateTo({
      url: '/pages/desc/desc?activityId=' + activityId,
    })
  }
})