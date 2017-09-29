//this is a template for mailSecrets.js

//copy, rename to 'mailSecrets.js' then tweak the settings

var alidayu = require('alidayu-node');

module.exports = {
  smtpConfig:{
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'it@kc.ac.cn',
      pass: 'ccD711q'
    }
  },

  sendSMS: function(phone, code, fn, callback){\
    var period = 15*60*1000;
    if(fn === 'register'){
      //注册用户走这里
      new alidayu('23632480', 'e264a8555d0ef54a9e881969572ed4d2').smsSend({
        sms_free_sign_name: '科新社',  //短信签名
        sms_param: {"code": code, "period": period},
        rec_num: phone,
        sms_template_code: 'SMS_100865101',//注册模板
        sms_type: 'normal'
      }, callback)
    }
    else if(fn === 'reset'){
      //修改密码走这里
      new alidayu('23632480', 'e264a8555d0ef54a9e881969572ed4d2').smsSend({
        sms_free_sign_name: '科新社',  //短信签名
        sms_param: {"code": code, "period": period},
        rec_num: phone,
        sms_template_code: 'SMS_100810088',//大于平台手机找回密码模板号
        sms_type: 'normal'
      }, callback)
    }
    else if(fn === 'bindMobile'){
      //现有账号实名认证 绑定手机号
      new alidayu('23632480', 'e264a8555d0ef54a9e881969572ed4d2').smsSend({
        sms_free_sign_name: '科新社',  //短信签名
        sms_param: {"code": code, "period": period},
        rec_num: phone,
        sms_template_code: 'SMS_100755081',
        sms_type: 'normal'
      }, callback)
    }
    else throw '错误的sms调用方式'
  },

  senderString:'"中国科创联互联网中心" <it@kc.ac.cn>'
}
