// var knex = require('../db/schema.js').knex
var router = require('express').Router()
var helper = require('./helper.js')

router.get('/', function (req, res) {
  var schoolname = req.headers.schoolname
  console.log('this is schoolname is req.header', schoolname)
  helper.showAllSchools().then(function (response) {
    res.json({
      success: true,
      response: response,
      message: 'school data attached'
    })
  })
})

router.get('/:school/students', function (req, res) {
  var schoolname = req.params.school
  var schoolid
  // var studentid
  console.log('students hiiii')
  helper.getSchools(schoolname).then(function (response) {
    response.forEach(function (currentEl) {
      schoolid = (currentEl.ID)
    })
    console.log('*****', schoolid)
    return schoolid
  }).then(function (resp) {
    helper.showAllStudents(resp).then(function (response) {
      res.json({
        success: true,
        response: response,
        message: 'students data attached'
      })
    })
  })
})

router.get('/:school/emergencies', function (req, res) {
  var schoolname = req.params.school
  var schoolid
  var studentid = []
  var eventsid = []
  var studentsid = []

  helper.getSchools(schoolname).then(function (response) {
    console.log('this is schoolids', response)
    response.forEach(function (currentEl) {
      schoolid = currentEl.ID
    })
    return schoolid
  }).then(function (resp) {
    helper.getStudentsId(resp).then(function (response) {
      response.forEach(function (currentEl) {
        studentid.push(currentEl.ID)
      })
      console.log('this is studentids in this school', studentid)
      return studentid
    }).then(function (resp) {
      helper.getStudentsEvents(resp).then(function (response) {
        response.forEach(function (currentEl) {
          eventsid.push(currentEl.eid)
        })
        console.log('events associated with these students', eventsid)
        return eventsid
      }).then(function (resp) {
        helper.showStudentsForEvents(resp).then(function (response) {
          console.log('this is studentids for events', response)
          response.forEach(function (currentEl) {
            studentsid.push(currentEl.created_by)
          })
          return studentsid
        }).then(function () {
          helper.joinStudentEvent(studentsid, eventsid).then(function (response) {
            console.log('response', response)
            res.json({
              response})
          })
        })
      })
    })
  })
})

module.exports = router
