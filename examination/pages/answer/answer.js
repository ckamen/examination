// answer.js

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
    answers: {},
    optionRecords: {},
    scores:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (util.isLogined()) {
      getExamData(that, options);
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
})


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
  var examtime = options.examtime;

  var mode = "POST_ANSWER";

  that.setData({
    resourceId: resourceId,
    activityId: activityId,
    activityEnrollmentId: activityEnrollmentId,
    learningSessionId: learningSessionId,
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
      activityEnrollmentId: activityEnrollmentId,
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
      //获取我的答题数据
      getAnswerData(that, options);
    },
    fail: function () {
      util.wxAlert('获取试卷失败');
    }
  });
}

function getAnswerData(that, options){
  var resourceId = options.resourceId;
  var activityId = options.activityId;
  var activityEnrollmentId = options.activityEnrollmentId;
  var learningSessionId = options.learningSessionId;
  var examtime = options.examtime;

  var token = wx.getStorageSync(app.globalData.token);
  var _url = app.globalData.commonURI + app.globalData.getAnswerDataURI;

  //console.log(_url);
  wx.request({
    url: _url,
    data: {
      resourceId: resourceId,
      activityEnrollmentId: activityEnrollmentId,
      learningSessionId: learningSessionId,
      autoInd: false,
    },
    header: {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': 'bearer ' + token
    },
    success: function (res) { 
      console.log("getAnswerData=");
      //console.log(res);
      if(res.data.code!=1){
        util.wxAlert('获取答案错误');
        return;
      }

      var answers={};
      var optionRecords={};
      var scores={};

      var questionRecords = res.data.data.questionRecords;
      console.log(questionRecords);
      for (var i = 0; i < questionRecords.length;i++){
        var questionRecord = questionRecords[i];
        var qid = questionRecord.questionId;

        answers[qid]={};
        optionRecords[qid] = {};
        scores[qid] = questionRecord.score;
        if (questionRecord.answer != null) {
          answers[qid][0] = questionRecord.answer;
        }
        for (var j = 0; j < questionRecord.optionRecords.length;j++){
          var optionRecord = questionRecord.optionRecords[j];
          var oid = optionRecord.optionId;
          console.log(optionRecord.id);
          if (optionRecord.answer!=null){
            answers[qid][oid] = optionRecord.answer;
          }
          optionRecords[qid][oid] =true;
        }
      }

      console.log(scores);

      that.setData({
        answers: answers,
        optionRecords: optionRecords,
        scores: scores,
      });
    },
    fail: function () {
      util.wxAlert('获取试卷失败');
    }
  });


}