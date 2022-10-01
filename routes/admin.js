const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

//const staffsController = require('../controllers/admin/staffs');
const adminController = require('../controllers/admin/admin');

// /admin/add-staff => GET
router.get('/add-staff', auth.checkAdmin, adminController.getAddStaff);

// /admin/staffs => GET
router.get('/staffs', auth.checkAdmin, adminController.getStaffs);

// /admin/add-staff => POST
router.post('/add-staff', auth.checkAdmin, adminController.postAddStaff);

router.get('/edit-staff/:staffId', auth.checkAdmin, adminController.getEditStaff);

router.post( '/edit-staff', auth.checkAdmin,adminController.postEditStaff);

router.post('/delete-staff', auth.checkAdmin, adminController.postDeleteStaff);

module.exports = router;