const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffsController = require('../controllers/admin/staffs');
const adminController = require('../controllers/admin/admin');


// /admin/add-staff => GET
router.get('admin/add-staff', auth.checkAdmin, adminController.getAddStaff);

// /admin/staffs => GET
router.get('/staffs', auth.checkAdmin, adminController.getStaffs);

// /admin/add-staff => POST
router.post('/admin/add-staff', auth.checkAdmin, adminController.postAddStaff);
  
router.get('/admin/edit-staff/:staffId', auth.checkAdmin, adminController.getEditStaff);
  
router.post('/admin/edit-staff', auth.checkAdmin, adminController.postEditStaff );

router.post('/admin/delete-staff',auth.checkAdmin, adminController.postDeleteStaff);

module.exports = router;


