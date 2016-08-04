module.paths.push(__projectroot + 'nkc_modules'); //enable require-ment for this path

var moment = require('moment')
var path = require('path')
var fs = require('fs.extra')
var settings = require('server_settings.js');
var helper_mod = require('helper.js')();
var queryfunc = require('query_functions')
var validation = require('validation')
var AQL = queryfunc.AQL
var apifunc = require('api_functions')

var layer = require('layer')

var permissions = require('permissions')

var table = {};
module.exports = table;

var api = (apiName,op,rp)=>{
  table[apiName] = {
    operation:op,
    requiredParams:rp
  }
}

var getCountFromDayRanges = (dayranges)=>{
  return AQL(`
    for r in @dayranges
    let count = (
    for p in posts
    filter p.toc>r.start && p.toc<r.end
    collect with count into k return k)[0]

    let count_disabled = (
    for p in posts
    filter p.toc>r.start && p.toc<r.end && p.disabled
    collect with count into k return k)[0]

    let user_registered = (
      for u in users
      filter u.toc>r.start && u.toc<r.end
      collect with count into k return k
    )[0]

    return {start:r.start,user_registered,count,count_disabled}

    `,{dayranges}
  )
}

var getRangesFromTimeStamps = (timestamps)=>{
  var dayranges = []
  for(i=0;i<timestamps.length-1;i++){
    dayranges.push({
      start:timestamps[i],
      end:timestamps[i+1]
    })
  }
  return dayranges
}

var getCountFromTimeStamps = (timestamps)=>{
  return getCountFromDayRanges(getRangesFromTimeStamps(timestamps.sort((i1,i2)=>i1-i2)))
}

queryfunc.createIndex('users',{
  fields:['toc'],
  type:'skiplist',
  unique:'false',
  sparse:'false',
})

api('getStatDaily',params=>{
  var daystamps = []
  var today = Date.now()
  daystamps.push(today)

  today = today - today%86400000 //zero moment of today
  for(i=0;i<240;i++){
    daystamps.push(today-i*86400000)
  }

  return getCountFromTimeStamps(daystamps)
})