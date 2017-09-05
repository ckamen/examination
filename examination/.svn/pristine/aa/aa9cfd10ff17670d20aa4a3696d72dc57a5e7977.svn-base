// login.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    hasError: false,
    errorMessage: '',
    usernameError: false,
    passwordError: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //删除token
    wx.removeStorageSync(app.globalData.token);
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

  /**
   * 用户名有输入时
   */
  userNameBindinput: function (e) {
    this.setData({
      usernameError: false,
      hasError: false
    });
  },

  /**
   * 用户名失去焦点时
   */
  userNameBindblur: function (e) {
    var username = util.trim(e.detail.value);
    if ("" != username) {
      this.setData({
        usernameError: false
      });
    } else {
      this.setData({
        errorMessage: '请输入您的用户名',
        usernameError: true,
        hasError: true
      });
      var that = this;
      setTimeout(function () {
        that.setData({
          hasError: false
        });
      }, 2000);
    }
  },

  /**
   * 密码有输入时
   */
  passwordBindinput: function (e) {
    this.setData({
      passwordError: false,
      hasError: false
    });
  },

  /**
   * 密码失去焦点时
   */
  passwordBindblur: function (e) {
    var password = util.trim(e.detail.value);
    if ("" != password) {
      this.setData({
        passwordError: false
      });
    } else {
      this.setData({
        errorMessage: '请输入您的密码',
        passwordError: true,
        hasError: true
      });
      var that = this;
      setTimeout(function () {
        that.setData({
          hasError: false
        });
      }, 2000);
    }
  },

  /**
   * 登录
   */
  login: function (e) {
    //1.检查输入参数
    var formValues = e.detail.value;
    var username = util.trim(formValues.username);
    var password = util.trim(formValues.password);
    if ("" == username) {
      this.setData({
        username: '',
        usernameError: true,
        errorMessage: '请输入您的用户名',
        hasError: true
      });
    } else if ("" == password) {
      this.setData({
        password: '',
        passwordError: true,
        errorMessage: '请输入您的密码',
        hasError: true
      });
    }
    if (this.data.hasError) {//显示出错信息
      var that = this;
      setTimeout(function () {
        that.setData({
          hasError: false
        });
      }, 3000);
    }
    if (!this.data.hasError) {
      //2.发起登录请求
      //console.log("url=" + app.globalData.commonURI + app.globalData.loginURI);
      wx.request({
        url: app.globalData.commonURI + app.globalData.loginURI,
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          var code = res.data.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
          if (1 == code) {//登录成功,跳转到考试页面(如果是二维码跳转的话，则另加判断)
            //保存token
            var token = res.data.data.token;
            wx.setStorageSync(app.globalData.token, token);
            //1.判断要跳转的页面      
            var nextPage = wx.getStorageSync(app.globalData.nextPage);//指示将跳转到哪个页面,//TODO:要判断是否是从其它页面因未注册被拒绝才跳过来的，如果是，跳到原无权限访问的页面；否则跳到考试列表页面
            if ('' == nextPage) {
              nextPage = '/pages/list/list';
            } else {//删除缓存中的key
              wx.removeStorageSync(app.globalData.nextPage);
            }
            //2.跳转到目的页面(判断是否是tarBar进行区别对待)
            if (nextPage.indexOf("pages/list/list") != -1
              || nextPage.indexOf("/pages/mylist/mylist") != -1) {
              wx.switchTab({
                url: nextPage,
              });
            } else {
              util.wxRedirectTo(nextPage);
            }
          } else {//登录失败
            util.wxShowModal('登录失败', '登录系统失败，请检查您的账号密码!');
          }
        },
        fail: function () {
          util.wxShowModal('登录失败', "访问系统失败，请稍后重试!");
        }
      });
    }
  },

  /**
   * 微信登录
   */
  wxLogin: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起登录请求
          wx.request({
            url: app.globalData.globalCommonURI + app.globalData.wxLoginURI,
            data: {
              code: code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var resultCode = res.data.resultCode;//resultCode: 0:登录成功;1:获取微信登录会话失败;2:未注册
              //console.log('wx:resultCode=' + resultCode);
              if (0 == resultCode) {
                var redirectURL = '/pages/list/list';//TODO:判断有没二维码保存在storage中
                util.wxRedirectTo(redirectURL);
              } else if (1 == resultCode) {
                util.wxShowModal('登录失败', "登录失败，请稍后重试!");
              } else if (2 == resultCode) {
                util.wxShowConfirm('提示', '您尚未注册本系统', '注册', '取消', '/pages/register/register');
              }
            }, error: function (res) {
              util.wxShowModal('登录失败', "登录失败，请稍后重试!");
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
          util.wxShowModal('登录失败', "获取您的登录态失败，请稍后重试!");
        }
      }
    });
  },

  /**
   * 跳转到注册页面
   */
  register: function () {
    util.wxRedirectTo('/pages/register/register');
  },

  /**
   * 跳转到找回密码页面
   */
  forgetPassword: function () {
    wx.navigateTo({
      url: '/pages/resetPassword/resetPassword',
    })
  }
})