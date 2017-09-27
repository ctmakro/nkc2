

var moment = require('moment')
var path = require('path')
var fs = require('fs.extra')
var settings = require('../server_settings.js');
var helper_mod = require('../helper.js')();
var queryfunc = require('../query_functions')
var validation = require('../validation')
var AQL = queryfunc.AQL
var apifunc = require('../api_functions')
var cookie_signature = require('cookie-signature')
var layer = require('../layer')

var table = {};
module.exports = table;

function evaluateExam(params){
  var exam = params.exam;
  if(!exam)throw 'fuck you, man'

  var signature = ''; //generate signature, then check against submission
  for(i in exam.qarr){
    signature += exam.qarr[i].qid;
  }
  signature += exam.toc.toString();

  var unsigned_signature = cookie_signature.unsign(exam.signature,settings.cookie_secret);
  if(unsigned_signature===false)throw('signature invalid. consider re-attend the exam.');
  if(unsigned_signature!==signature)throw('signature problematic'); //sb's spoofing!!

  if(Date.now()-exam.toc > settings.exam.time_limit)throw('overtime. please refresh');

  // now things are valid, should check against answers.

  var sheet = params.sheet; //answersheet
  if(!sheet)throw('wtf you thinkin')
  if(sheet.length!=exam.qarr.length)throw('bitch')

  var qidlist = []
  for(i in exam.qarr)
  {
    qidlist.push(exam.qarr[i].qid)
  }

  var questions;
  var score = 0;
  var records = [];
  var isA = true;

  return apifunc.get_certain_questions(qidlist)
  .then(back=>{
    questions = back;
    for(i in questions){
      var correctness = false;
      if(isA == true && questions[i].category != 'mix'){
        isA = false;
      }

      if(sheet[i]===null||sheet[i]===undefined){ //null choices
        correctness = false;
      }else{
        switch (questions[i].type) {
          case 'ch4':
          correctness = (exam.qarr[i].choices[sheet[i]]==questions[i].answer[0])  //第一个是答案

          break;
          case 'ans':
          correctness = (sheet[i]==questions[i].answer);
          break;
          default:break;
        }
      }

      records.push({qid:qidlist[i],correct:correctness})
    }

    for(i in records){
      score += records[i].correct?1:0;
    }
    report(records);

    if(score<settings.exam.pass_score)throw('测试没有通过哦，别气馁，请继续努力！');
    //passed the test.

    return queryfunc.doc_answersheet_from_ip(params._req.iptrim)
  })
  .then(back=>{
    if(back.length>0)
    {
      /*if(Date.now() - back[0].tsm < settings.exam.succeed_interval)
      //if re-succeed an exam within given amount of time
      {
        throw '您之前测试通过的次数有点多哦，不应该再进行测试了！'
      }*/
      back[back.length - 1].isA = back[back.length - 1].isA ? back[back.length - 1].isA : false;
      if(!back[back.length - 1].isA){
        if(Date.now() - back[back.length - 1].tsm < settings.exam.succeed_interval) {
          throw '您之前测试通过的次数有点多哦，不应该再进行测试了！';
        }
      }
    }

    return {records,score,isA}
  })
}

table.submitExam = {
  requiredParams:{
    sheet:Object,
    exam:Object,
  },
  operation:function(params){
    //if(params.user)throw 'not logged out.'
    // allow registered user to take exams.

    return evaluateExam(params)
    .then(examResult=>{

      return layer.RegCode.generate()
      .then(token=>{

        var answersheet = {
          uid:params.user?params.user._key:null,
          records:examResult.records,
          ip:params._req.iptrim,
          score:examResult.score,
          toc:params.exam.toc,
          category:params.category,
          tsm:Date.now(),
          _key:token,
          isA: examResult.isA
        }

        if(params.user){
          queryfunc.addCertToUser(params.user._key,'examinated')
        }

        return queryfunc.doc_save(answersheet,'answersheets')
        .then(back=>{
          return {
            token:token,
            taken_by_user:params.user?true:false,
          }
        })
      })
    })
    //ends here
  },
}


table.deleteQuestion = {
  operation:function(params){
    var qid = params.qid

    var q = new layer.Question(qid)
    return q.remove()
  },
  requiredParams:{
    qid:String,
  }
}

table.addQuestion = {
  operation:function(params){
    if(params.qid){
      var question = {
        question:params.question,
        answer:params.answer,
        type:params.type,
        category:params.category,

        tlm:Date.now()
      }

      var q = new layer.Question(params.qid)

      return q.update(question)

    }else{

      var question = {
        question:params.question,
        answer:params.answer,
        type:params.type,
        category:params.category,

        uid:params.user._key,
        toc:Date.now(),
      }

      var q = layer.Question.create(question)
      return q.save()
    }
  },
  requiredParams:{
    question:String,
    answer:String,
    type:String,
  }
}

table.getQuestion = {
  operation:function(params){
    var qid = params.qid
    var q = new layer.Question(qid)
    return q.load()
    .then(q=>{
      return q.model
    })
  },
  requiredParams:{
    qid:String,
  }
}

table.listAllQuestions = {
  operation:function(params){
    return layer.Question.listAllQuestions(null)
  }
}
