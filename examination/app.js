//app.js

var util = require('./utils/util.js');

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    //TODO:临时用于页面调通，测试登录时注释掉这行
    //util.wxRedirectTo('pages/list/list');
    //return;

    /**
     * 1.判断来源，如果是通过二维码(1011:扫描二维码,1012:长按图片识别二维码,1013:手机相册选取二维码)
     * 或通过一维码(1025:扫描一维码,1031:长按图片识别一维码,1032:手机相册选取一维码)
     * 或通过小程序码(1047:扫描小程序码,1048:长按图片识别小程序码,1049:手机相册选取小程序码)
    *进入则跳转到对应页面
    **/
    var scene = options.scene;
    var nextPage = "";//指示将跳转到哪个页面（可能是二维码指向的页面，也可能是首页）
    if (1011 == scene || 1012 == scene || 1013 == scene
      || 1025 == scene || 1031 == scene || 1032 == scene
      || 1047 == scene || 1048 == scene || 1049 == scene) {
      nextPage = options.path;//二维码指定页面
    } else {
      nextPage = 'pages/list/list'; //默认首页
    }

    //2.判断登录跳转到目的页面
    var isLogin = false;
    try {
      var token = wx.getStorageSync(this.globalData.token);
      if (token) {
        isLogin = true;
      }
    } catch (e) {
      isLogin = false;
    }
    if (isLogin) {
      wx.navigateTo({
        url: nextPage,
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return;
    }
    
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

  /**
   * 全局数据
   */
  globalData: {
    commonURI: 'http://39.108.130.153',//请求URL的域名部分
    loginURI: '/api/login',//登录接口URI
    registerURI: '/api/user/register',//注册接口URI
    resetPasswordURI: '/api/forgot-password',//忘记密码URI
    wxLoginURI: '/api/wxLlogin',//微信登录接口URI
    evaluationListURI: '/api/activity/evaluation-list',//获取学员的考试列表接口URI
    activityDetailURI: '/api/activity/activity-detail',//获取考试详情信息URI
    activityEnrollURI: '/api/activity-enrollment/enroll',//报名考试URI
    activityOpenURI: '/api/activity-resource/open',//打开试卷URI
    activitySubmitnURI: '/api/activity-resource/submit',//提交考试数据URI
    getDataURI: '/api/paper/get-data',//获取试卷数据URI
    myExamListURI: '/api/activity/my-exam-list',//获取我的考试列表URI
    findUserRankingURI: '/api/activity-attendance/find-user-ranking',//获取登录用户某考试活动的成绩和排名URI
    findRankingListURI: '/api/activity-attendance/find-ranking-list',//获取某次考试用户的成绩排行榜URI
    findAttendanceHistoryURI: '/api/activity-attendance/find-attendance-history',//获取用户某考试活动的考试记录URI
    getAnswerDataURI: '/api/paper/get-answer-data',//获取答题数据和评分
    token: 'token',
    nextPage: ''
  }
})

