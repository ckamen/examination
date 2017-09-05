// resetPassword.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    email: '',
    hasError: false,
    errorMessage: '',
    usernameError: false,
    emailError: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 邮箱有输入时
   */
  emailBindinput: function (e) {
    this.setData({
      emailError: false,
      hasError: false
    });
  },

  /**
   * 用邮箱失去焦点时
   */
  emailBindblur: function (e) {
    var email = util.trim(e.detail.value);
    if ("" != email) {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!reg.test(email)) {
        this.setData({
          errorMessage: '您的邮箱格式不正确',
          emailError: true,
          hasError: true
        });
        var that = this;
        setTimeout(function () {
          that.setData({
            hasError: false
          });
        }, 2000);
      }
    } else {
      this.setData({
        errorMessage: '请输入您的邮箱',
        emailError: true,
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
   * 找回密码
   */
  resetPassword: function (e) {
    //1.检查输入参数
    var formValues = e.detail.value;
    var formValues = e.detail.value;
    var username = util.trim(formValues.username);
    var email = util.trim(formValues.email);
    if ("" == username) {
      this.setData({
        errorMessage: '请输入您的用户名',
        usernameError: true,
        hasError: true
      });
    } else {
      if ("" != email) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(email)) {
          this.setData({
            errorMessage: '您的邮箱格式不正确',
            emailError: true,
            hasError: true
          });
        }
      } else {
        this.setData({
          errorMessage: '请输入您的邮件',
          emailError: true,
          hasError: true
        });
      }
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
      //2.发起重置密码请求
      wx.request({
        url: app.globalData.commonURI + + app.globalData.resetPasswordURI,
        data: {
          username: username,
          email: email
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var code = res.code;//code:1:发送邮件成功;其他:失败
          console.log('code=' + code);
          if (0 == code) {//成功
            util.wxShowModal('发送邮件成功', '请打开您的邮箱重置密码!');
          } else {
            util.wxShowModal('发送邮件成功', res.message);

          }
        },
        fail: function () {
          util.wxShowModal('发送邮件成功', '发送邮件成功失败，请稍后重试!');
        }
      });
    }
  },

  doreturn: function () {
    util.wxRedirectTo('/pages/login/login');
  },

})