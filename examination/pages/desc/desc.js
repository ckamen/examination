// desc.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    examtime:0,//考试时间限制
    enrollInd: false, //考试活动是否已报名
    status: '',        //考试状态：ON,OFF
    enrollStatus: '', 
    enrollStatusTxt: { APPLY: '已申请', PENDING: '待审批', ADMITTED: '已确认报名', REJECTED: '已拒绝', WITHDRAWN: '已放弃' },
    activityId: '',          //考试活动ID
    title: '',       //考试标题
    resourceId: '',//资源ID
    activityEnrollmentId: '',//考试报名ID,报名成功后才有值
    examdata:{},//考试详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var activityId = options.activityId;
    that.setData({
      activityId: activityId
    });
    getDescData(that, activityId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 报名
   */
  enroll: function () {
    enroll(this);
  },

  /**
   * 进入考试
   */
  openExam: function () {
    intoAnswer(this);
  },

  //历史记录
  historylist: function () {
    var that = this;
    util.wxNavigateTo('/pages/historylist/historylist?activityId=' + that.data.activityId + '&enrollmentId=' + that.data.activityEnrollmentId + '&resourceId=' + that.data.resourceId);
  },

  /**
   获取某次考试的成绩排行榜
   */
  ranking: function (e) {
    var activityId = util.trim(e.currentTarget.id);
    wx.navigateTo({
      url: '/pages/ranking/ranking?activityId=' + activityId,
    })
  }

})

//报名
function enroll(that){
  var activityId = that.data.activityId;
  if (util.isLogined()) {
    var token = wx.getStorageSync(app.globalData.token);
    //2.发起请求
    wx.showLoading({
      title: '正在报名中...',
      mask: true
    });
    wx.request({
      url: app.globalData.commonURI + app.globalData.activityEnrollURI,
      data: {
        activityId: activityId
      },
      header: {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': 'bearer ' + token
      },
      success: function (res) {
        console.log(res.data);
        var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
        console.log("xxxx code=" + code);
        if (1 == code) {//报名成功
          //console.log(res.data.data.message)
          util.wxAlert(res.data.data.message);
          //刷新当前页面更新状态
          getDescData(that, activityId);
        } else if (-1 == code) {//token过期，重新登录
          wx.setStorageSync(app.globalData.nextPage, '/pages/desc/desc');//指示待登录成功后要实际跳转的页面
          wx.navigateTo({
            url: '/pages/login/login'
          });
        } else {//0:执行产生错误
          util.wxShowModal('访问失败', '获取考试详情失败:' + res.data.message);
        }
      },
      fail: function () {
        util.wxShowModal('访问失败', "访问系统失败，请稍后重试!");
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  } else {
    util.checkLogin(app, '/pages/desc/desc?id=' + id);//如果未登录，则跳转到登录页面，登录成功后返回本页
  }
}

//获取试卷详情
function getDescData(that, activityId) {
  if (util.isLogined()) {
    var token = wx.getStorageSync(app.globalData.token);
    //2.发起请求
    wx.showLoading({
      title: '正在加载中...',
      mask: true
    });
    wx.request({
      url: app.globalData.commonURI + app.globalData.activityDetailURI,
      data: {
        activityId: activityId
      },
      header: {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': 'bearer ' + token
      },
      success: function (res) {
        console.log(res.data);
        var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
        //console.log(res.data.data.extra.enrollment)
        console.log("extra=")
        console.log(res.data.data.extra)

        if (1 == code) {//获取考试详情成功
          var _enrollStatus = "";
          var _activityEnrollmentId = "";
          if (res.data.data.extra.enrollment == undefined) {
            _enrollStatus = ""
          } else {
            _enrollStatus = res.data.data.extra.enrollment.status;
            _activityEnrollmentId = res.data.data.extra.enrollment.id;
          }

          var _examtime = 0;
          if (res.data.data.resources[0].time != 0 && res.data.data.resources[0].time != null){
            _examtime = res.data.data.resources[0].time;
          }

          that.setData({
            examtime: _examtime,
            enrollInd: res.data.data.extra.enrollInd,
            status: res.data.data.status,
            title: res.data.data.title,
            resourceId: res.data.data.resources[0].id,
            enrollStatus: _enrollStatus,
            activityEnrollmentId: _activityEnrollmentId,
            examdata: res.data.data,
          });
          if (null != res.data.data.extra.enrollment) {
            that.setData({
              enrollStatus: res.data.data.extra.enrollment.status,
            });
          }
        } else if (-1 == code) {//token过期，重新登录
          wx.setStorageSync(app.globalData.nextPage, '/pages/desc/desc');//指示待登录成功后要实际跳转的页面
          wx.navigateTo({
            url: '/pages/login/login'
          });
        } else {//0:执行产生错误
          util.wxShowModal('访问失败', '获取考试详情失败:' + res.data.message);
        }
      },
      fail: function () {
        util.wxShowModal('访问失败', "访问系统失败，请稍后重试!");
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  } else {
    util.checkLogin(app, '/pages/desc/desc?id=' + id);//如果未登录，则跳转到登录页面，登录成功后返回本页
  }
}


//进入考试
function doIntoAnswer(that, learningSessionId, learningToken) {
  util.wxRedirectTo('/pages/exam/exam?resourceId=' + that.data.resourceId + '&activityId=' + that.data.activityId + '&activityEnrollmentId=' + that.data.activityEnrollmentId + '&learningSessionId=' + learningSessionId + '&learningToken=' + learningToken + '&mode=ANSWER&examtime=' + that.data.examtime);
}

//打开试卷（在获取试卷数据之前调用）
function intoAnswer(that) {
  if (util.isLogined()) {
    var token = wx.getStorageSync(app.globalData.token);
    //2.发起请求,打开试卷
    wx.showLoading({
      title: '正在打开试卷...',
      mask: true
    });
    console.log(app.globalData.commonURI + app.globalData.activityOpenURI + '/' + that.data.resourceId);
    wx.request({
      url: app.globalData.commonURI + app.globalData.activityOpenURI + '/' + that.data.resourceId,
      data: {
        activityId: that.data.activityId,
        activityEnrollmentId: that.data.activityEnrollmentId
      },
      header: {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': 'bearer ' + token
      },
      success: function (res) {
        console.log(res.data);
        var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
        if (1 == code) {
          var learningSessionId = res.data.data.learningSessionId;
          var learningToken = res.data.data.learningToken;
          //打开试卷
          doIntoAnswer(that, learningSessionId, learningToken);
        } else if (-1 == code) {//token过期，重新登录
          wx.setStorageSync(app.globalData.nextPage, '/pages/desc/desc');//指示待登录成功后要实际跳转的页面
          wx.navigateTo({
            url: '/pages/login/login'
          });
        } else {//0:执行产生错误
          util.wxShowModal('访问失败', '打开试卷失败:' + res.data.message);
        }
      },
      fail: function () {
        util.wxShowModal('访问失败', "访问系统失败，请稍后重试!");
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  } else {
    util.checkLogin(app, '/pages/desc/desc?id=' + id);//如果未登录，则跳转到登录页面，登录成功后返回本页
  }
}