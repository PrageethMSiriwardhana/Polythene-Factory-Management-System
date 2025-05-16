const express = require('express');
const attendanceController = require('../controllers/attendance.controller');

const router = express.Router();

// router.post('/addattendance', attendanceController.save);
router.get('/showattendance', attendanceController.attendanceShow);
// router.post('/showattendance/:userId', attendanceController.showId);
// //add to attendance

// router.get('/showattendance/:userId', attendanceController.showId);
// router.get('/countpresent/:userId', attendanceController.countPresent);
router.put('/updateattendance/:attendanceId', attendanceController.updateTimeInAndOut);
// router.delete('/deleteattendance/:attendanceId', attendanceController.destroy);
router.get('/generatereport', attendanceController.generateReport);
// router.post('/archived', attendanceController.archiveAttendance);
router.get('/totalMonthlyAttendance', attendanceController.getTotalMonthlyAttendance);
router.get('/totaldailyattendance', attendanceController.getTotalDailyAttendance);
router.get('/average-archived-attendance', attendanceController.getAverageArchivedAttendance);
// router.get('/archive-attendance', attendanceController.archiveAttendance);
router.get('/get-attendance', attendanceController.getArchivedAttendance);


module.exports = router;
