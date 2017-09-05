
//去掉字符串左右空格;
function trim(s) {
  if (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  } else {
    return "";
  }
}


function wxAlert(_content) {
  wx.showModal({
    content: _content,
    showCancel: false,
    success: function (res) {
      return;
    }
  });
}

function wxAlertUrl(_content,_url) {
  wx.showModal({
    content: _content,
    showCancel: false,
    success: function (res) {
      wxRedirectTo(_url);
      return;
    }
  });
}


//显示提示信息
function wxShowModal(_title, _content) {
  wx.showModal({
    title: _title,
    content: _content,
    showCancel: false,
    success: function (res) {
      return;
    }
  });
}

//显示confirm信息
function wxShowConfirm(_title, _content, _confirmText, _cancelText, _url) {
  wx.showModal({
    title: _title,
    content: _content,
    confirmText: _confirmText,
    cancelText: _cancelText,
    success: function (res) {
      if (res.confirm) {
        wxNavigateTo(_url);
      }
    }
  });
}

//转跳
function wxRedirectTo(_url) {
  wx.redirectTo({
    url: _url,
    complete:function(res) {
      console.log(res)
    } 
  });
}

//转跳带返回
function wxNavigateTo(_url) {
  wx.navigateTo({
    url: _url
  });
}


/**
 * 检查用户是否已登录(token不过期即表示已登录；反之则否)
 * */
function isLogined() {
  var app = getApp();//获取应用实例
  var isLogin = false;
  try {
    var token = wx.getStorageSync(app.globalData.token);
    if (token) {
      isLogin = true;
    }
  } catch (e) {
    isLogin = false;
  }
  return isLogin;
}

/**
 *根据登录状态跳转到对应的目的页面
 */
function checkLogin(targetPage) {
  var app = getApp();//获取应用实例
  var _isLogined = isLogined();
  if (!_isLogined) {//未登录
    wx.setStorageSync(app.globalData.nextPage, targetPage);//指示待登录成功后要实际跳转的页面
    wxRedirectTo('/pages/login/login');
  }
}

module.exports = {
  wxAlert: wxAlert,
  wxAlertUrl: wxAlertUrl,
  wxShowModal: wxShowModal,
  wxShowConfirm: wxShowConfirm,
  wxRedirectTo: wxRedirectTo,
  wxNavigateTo: wxNavigateTo,
  isLogined: isLogined,
  checkLogin: checkLogin,
  trim: trim
}


