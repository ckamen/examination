// register.js

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
    email: '',
    rePassword: '',
    hasError: false,
    errorMessage: '',
    usernameError: false,
    passwordError: false,
    emailError: false,
    rePasswordError: false,

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
        emailError: false,
        hasError: false
      });
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
   * 重复密码有输入时
   */
  rePasswordBindinput: function (e) {
    this.setData({
      rePasswordError: false,
      hasError: false
    });
  },

  /**
   * 重复密码失去焦点时
   */
  rePasswordBindblur: function (e) {
    var rePassword = util.trim(e.detail.value);
    if ("" != rePassword) {
      this.setData({
        rePasswordError: false
      });
    } else {
      this.setData({
        errorMessage: '请再次密码',
        rePasswordError: true,
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
   * 注册
   */
  register: function (e) {
    //1.检查输入参数
    var formValues = e.detail.value;
    var formValues = e.detail.value;
    var username = util.trim(formValues.username);
    var email = util.trim(formValues.email);
    var password = util.trim(formValues.password);
    var rePassword = util.trim(formValues.rePassword);
    if ("" == username) {
      this.setData({
        errorMessage: '请输入您的用户名',
        usernameError: true,
        hasError: true
      });
    } else if ("" == password) {
      this.setData({
        errorMessage: '请输入您的密码',
        passwordError: true,
        hasError: true
      });
    } else if (password != rePassword) {
      this.setData({
        errorMessage: '两次密码不一致',
        rePasswordError: true,
        hasError: true
      });
    } else if ("" != email) {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!reg.test(email)) {
        this.setData({
          errorMessage: '您的邮箱格式不正确',
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
    //console.log("username=" + username + ",email=" + email + ",password=" + password + rePassword + ",rePassword=" + ",this.data.hasError=" + this.data.hasError);
    if (!this.data.hasError) {
      //2.发起注册请求
      wx.request({
        url: app.globalData.commonURI + + app.globalData.registerURI,
        data: {
          username: username,
          email: email,
          password: password
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var code = res.code;//code:返回代码, 1: 成功执行, 0: 执行产生错误, -1: TOKEN失效
          console.log('code=' + code);
          if (0 == code) {//注册成功
            util.wxShowModal('注册成功', '恭喜您注册成功!');
            //1.判断要跳转的页面      
            var nextPage = wx.getStorageSync(appInUtil.globalData.nextPage);//指示将跳转到哪个页面,//TODO:要判断是否是从其它页面因未注册被拒绝才跳过来的，如果是，跳到原无权限访问的页面；否则跳到考试列表页面
            if ('' == nextPage) {
              nextPage = 'pages/desc/desc';
            } else {//删除缓存中的key
              wx.removeStorageSync(appInUtil.globalData.nextPage);
            }
            //2.跳转到目的页面
            util.wxRedirectTo(nextPage);
          } else {
            util.wxShowModal('注册失败', res.message);

          }
        },
        fail: function () {
          util.wxShowModal('注册失败', '注册失败，请稍后重试!');
        }
      });
    }
  },

  doreturn: function () {
    util.wxRedirectTo('/pages/login/login');
  },


})