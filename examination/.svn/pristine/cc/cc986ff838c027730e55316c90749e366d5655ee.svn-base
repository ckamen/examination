// exam.js

//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    examtime: 0,
    resourceId: 0,
    activityId: 0,
    activityEnrollmentId: 0,
    learningSessionId: 0,
    learningToken: "",
    exam_data: {},//考试数据
    exam_list: {},//考题顺序
    small_exam_css: {},//考题显示隐藏
    big_exam_css: {},//大题显示隐藏
    small_exam_pid: {},//考题对应的大题ID
    now_exam: 0,//当前题目
    max_exam: 0,//最大题目
    sumbutton_css: "v_hide",//交卷按钮CSS
    questionRecords: {},//考题答案返回json
    showJJbutton: true,//显示交卷按钮
    clock: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (util.isLogined()) {
      getExamData(that, options);
    }
    if (options.examtime > 0) {
      total_micro_second = options.examtime * 60 * 1000;
      count_down(this);
    } else {
      that.setData({
        clock: "时间不限"
      });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  perv_exam: function () {
    var that = this;
    var _now_exam = that.data.now_exam;
    _now_exam = _now_exam - 1;
    examPervNext(that, _now_exam);
  },

  next_exam: function () {
    var that = this;
    var _now_exam = that.data.now_exam;
    _now_exam = _now_exam + 1;
    examPervNext(that, _now_exam);
  },

  //输入值动态改变
  changedValue: function (e) {
    var that = this;
    changeValue(e, that);
  },

  //交卷
  postExam: function () {
    var that = this;
    postExam(that, false);
  },

})



function postExam(that, auto) {
  var _questionRecords = that.data.questionRecords;

  //非自动提交试卷，则需要验证答题情况
  if (auto == false) {
    //检查数据
    for (var i = 0; i < _questionRecords.length; i++) {
      var _questionRecord = _questionRecords[i];
      var _type = _questionRecord.type;
      var _index = _questionRecord.index + 1;
      //单选
      if (_type == "S") {
        if (_questionRecord.optionRecords.length != 1) {
          util.wxAlert("请回答第" + _index + "道题");
          return;
        }
      }
      //多选
      if (_type == "M") {
        if (_questionRecord.optionRecords.length <= 1) {
          util.wxAlert("请回答第" + _index + "道题");
          return;
        }
      }
      //不定项
      if (_type == "C") {
        if (_questionRecord.optionRecords.length <= 0) {
          util.wxAlert("请回答第" + _index + "道题");
          return;
        }
      }
      //判断题 问答题
      if (_type == "T" || _type == "A") {
        if (_questionRecord.answer == "") {
          util.wxAlert("请回答第" + _index + "道题");
          return;
        }
      }
      //填空题
      if (_type == "F") {
        for (var j = 0; j < _questionRecord.optionRecords.length; j++) {
          if (_questionRecord.optionRecords[j].answer == "") {
            util.wxAlert("请回答第" + _index + "道题");
            return;
          }
        }
      }
    }
  }
  //提交考题
  var resourceId = that.data.resourceId;
  var activityId = that.data.activityId;
  var activityEnrollmentId = that.data.activityEnrollmentId;
  var learningSessionId = that.data.learningSessionId;
  var learningToken = that.data.learningToken;

  var token = wx.getStorageSync(app.globalData.token);
  var _url = app.globalData.commonURI + app.globalData.activitySubmitnURI + "/" + resourceId;


  var _data = {
    "activityEnrollmentId": activityEnrollmentId,
    "learningSessionId": learningSessionId,
    "resourceId": resourceId,
    "autoInd": false,
    "questionRecords": _questionRecords
  };
  var jsonStr = JSON.stringify(_data);
  var _poostdata = {
    resourceId: resourceId,
    activityId: activityId,
    activityEnrollmentId: activityEnrollmentId,
    learningToken: learningToken,
    data: jsonStr,
  };

  console.log(_poostdata);

  wx.request({
    url: _url,
    data: _poostdata,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    method: "POST",
    success: function (res) {
      console.log(res);
      var code = res.data.code;
      if (code == 1) {
        that.setData({
          showJJbutton: false,
        });
        isend = true;
        util.wxAlertUrl('交卷成功', '/pages/desc/desc?activityId=' + activityId);
      } else {
        util.wxAlert('交卷失败');
      }
    },
    fail: function () {
      util.wxAlert('交卷失败');
    }
  });

}

function changeValue(e, that) {
  //console.log(e);
  var _id = e.currentTarget.id;
  var _opid = 0;
  //填空题
  if (_id.indexOf("F_") > -1) {
    var _ids = _id.split("_");
    _id = _ids[1];
    _opid = _ids[2];
    //console.log(_ids);
  }

  var _value = e.detail.value;
  var _questionRecords = that.data.questionRecords;
  for (var i = 0; i < _questionRecords.length; i++) {
    var _questionRecord = _questionRecords[i];
    var _type = _questionRecord.type;
    if (_id == _questionRecord.questionId) {
      //单选题
      if (_type == "S") {
        _questionRecords[i].optionRecords[0] = { "optionId": _value };
      }
      //判断题 问答题
      if (_type == "T" || _type == "A") {
        _questionRecords[i].answer = _value;
      }
      //多选和不定项选择题
      if (_type == "C" || _type == "M") {
        var _valeArry = []
        for (var j = 0; j < _value.length; j++) {
          _valeArry[j] = { "optionId": _value[j] };
        }
        _questionRecords[i].optionRecords = _valeArry;
      }
      //填空题
      if (_type == "F") {
        for (var j = 0; j < _questionRecords[i].optionRecords.length; j++) {
          if (_questionRecords[i].optionRecords[j].optionId == _opid) {
            _questionRecords[i].optionRecords[j].answer = _value;
          }
        }
      }
    }
  }

  //console.log(_questionRecords);
  that.setData({
    questionRecords: _questionRecords,
  });
}

//上一题、下一题
function examPervNext(that, _now_exam) {
  var _small_exam_css = that.data.small_exam_css;
  var _big_exam_css = that.data.big_exam_css;
  var _exam_list = that.data.exam_list;
  var _max_exam = that.data.max_exam;
  var _small_exam_pid = that.data.small_exam_pid;

  if (_now_exam >= _max_exam) {
    _now_exam = _max_exam;
  }

  if (_now_exam <= 1) {
    _now_exam = 1;
  }

  var _sumbutton_css = "v_hide";
  if (_max_exam == _now_exam) {
    _sumbutton_css = "v_show";
  }


  var _small_id = _exam_list[_now_exam - 1];
  //console.log(_small_id);
  for (var _key in _small_exam_css) {
    if (_key == _small_id) {
      _small_exam_css[_key] = "v_show";
    } else {
      _small_exam_css[_key] = "v_hide";
    }
  }

  var _big_id = _small_exam_pid[_small_id];
  for (var _key in _big_exam_css) {
    if (_key == _big_id) {
      _big_exam_css[_key] = "v_show";
    } else {
      _big_exam_css[_key] = "v_hide";
    }
  }

  that.setData({
    small_exam_css: _small_exam_css,
    big_exam_css: _big_exam_css,
    max_exam: _max_exam,
    now_exam: _now_exam,
    sumbutton_css: _sumbutton_css,
  });


}

//获取数据
function getExamData(that, options) {
  var resourceId = options.resourceId;
  var activityId = options.activityId;
  var activityEnrollmentId = options.activityEnrollmentId;
  var learningSessionId = options.learningSessionId;
  var learningToken = options.learningToken;
  var examtime = options.examtime;

  var mode = options.mode;

  that.setData({
    resourceId: resourceId,
    activityId: activityId,
    activityEnrollmentId: activityEnrollmentId,
    learningSessionId: learningSessionId,
    learningToken: learningToken,
  });

  //console.log(that);

  var token = wx.getStorageSync(app.globalData.token);
  var _url = app.globalData.commonURI + app.globalData.getDataURI;
  //console.log(_url);
  wx.request({
    url: _url,
    data: {
      resourceId: resourceId,
      activityId: activityId,
      mode: mode,
      learningSessionId: learningSessionId,
    },
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    success: function (res) {
      var _data = res.data;
      var _code = _data.code;//code:1:注册成功;其他:注册失败
      //console.log(_data);
      if (_code != 1) {
        util.wxAlert('获取试卷失败');
        return;
      }

      var _exam_data = _data.data;
      console.log(_exam_data);

      var _small_exam_css = {};
      var _big_exam_css = {};
      var _small_exam_pid = {};
      var _exam_list = [];

      var _questionRecords = [];
      var _index = 0;

      for (var i = 0; i < _exam_data.length; i++) {
        var _big_exam = _exam_data[i];
        var _big_exam_id = _big_exam.id;
        var _questionList = _big_exam.questionList;
        if (i == 0) {
          _big_exam_css[_big_exam.id] = "v_show";
        } else {
          _big_exam_css[_big_exam.id] = "v_hide";
        }

        for (var j = 0; j < _questionList.length; j++) {
          var _small_exam = _questionList[j];
          _small_exam_pid[_small_exam.id] = _big_exam_id;
          _exam_list[_exam_list.length] = _small_exam.id;
          if (i == 0 && j == 0) {
            _small_exam_css[_small_exam.id] = "v_show";
          } else {
            _small_exam_css[_small_exam.id] = "v_hide";
          }

          var _type = _small_exam.type;
          var _small_exam_answ = {};
          if (_type == "S" || _type == "M" || _type == "C" || _type == "F") {
            var _optionRecords = [];
            //填空题时候特殊处理
            if (_type == "F") {
              for (var k = 0; k < _small_exam.optionList.length; k++) {
                _optionRecords[k] = {
                  "optionId": _small_exam.optionList[k].id,
                  "answer": ""
                };
              }
            }
            _small_exam_answ = {
              questionId: _small_exam.id,
              type: _type,
              index: _index,
              optionRecords: _optionRecords,
            }
          }

          if (_type == "T" || _type == "A") {
            _small_exam_answ = {
              questionId: _small_exam.id,
              type: _type,
              index: _index,
              answer: "",
            }
          }

          _questionRecords[_questionRecords.length] = _small_exam_answ;
          _index++;

        }
      }

      //console.log(_questionRecords);
      /**
        console.log(_small_exam_css);
        console.log(_small_exam_pid);
        console.log(_big_exam_css);
        console.log(_exam_list);
      **/

      var _max_exam = _exam_list.length;
      var _now_exam = 0;
      if (_max_exam > 0) {
        _now_exam = 1;
      }
      var _sumbutton_css = "v_hide";
      if (_max_exam == _now_exam) {
        _sumbutton_css = "v_show";
      }

      that.setData({
        examtime: examtime,
        exam_data: _exam_data,
        small_exam_css: _small_exam_css,
        small_exam_pid: _small_exam_pid,
        big_exam_css: _big_exam_css,
        exam_list: _exam_list,
        max_exam: _max_exam,
        now_exam: _now_exam,
        sumbutton_css: _sumbutton_css,
        questionRecords: _questionRecords,
      });

      //console.log(that);

    },
    fail: function () {
      util.wxAlert('获取试卷失败');
    }
  });
}


/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 5 * 1000;
var isend = false;
/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "考试时间到，考试结束"
    });
    // timeout则跳出递归
    if (!isend) {
      isend = true;
      //util.wxAlert('考试结束');
      postExam(that, true);
    }
    return;
  }

  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that);
  }, 1000);
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + ":" + min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
