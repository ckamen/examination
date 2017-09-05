// historylist.js
const app = getApp();
var util = require('../../utils/util.js');


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
    getList(options,this);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //获取考试详情
  getDetail: function (e) {
    console.log(e);
    var that = this;
    var id = util.trim(e.currentTarget.id);
    var list = that.data.list;

    var resourceId="";
    var learningSessionId = "";
    var activityEnrollmentId = "";
    var activityId = "";

    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if(q.id==id){
        resourceId = q.resourceId;
        learningSessionId = q.learningSessionId;
        activityEnrollmentId = q.activityEnrollmentId;
        activityId = q.id;
        //console.log(q);
        //return;
        break;
      }
    }

    if (resourceId == "" || learningSessionId == "" || activityEnrollmentId == "" || activityId == ""){
      util.wxAlert('获取详情失败');
      return;
    }
   
    util.wxNavigateTo('/pages/answer/answer?resourceId=' + resourceId + '&learningSessionId=' + learningSessionId + '&activityEnrollmentId=' + activityEnrollmentId + '&activityId=' + activityId);

  }
})

//获取列表
function getList(options,that){
  var resourceId = options.resourceId;
  var activityId = options.activityId;
  var enrollmentId = options.enrollmentId;
  var token = wx.getStorageSync(app.globalData.token);
  
  wx.request({
    url: app.globalData.commonURI + app.globalData.findAttendanceHistoryURI,
    data: {
      resourceId: resourceId,
      activityId: activityId,
      enrollmentId, enrollmentId,
    },
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    success: function (res) {
      console.log(res);
      if (res.data.code==1){
        var list = res.data.data.paperRecordList;
        that.setData({
          list: list,
        });
      }else{
        util.wxAlert(res.data.message);
      }
    },
    fail: function () {
      util.wxAlert('获取列表失败');
    }
  });
}