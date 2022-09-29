const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffsController = require('../controllers/admin/staffs');
const adminController = require('../controllers/admin/admin');

router.get('/staffs', auth.checkAdmin, staffsController.getStaffs);


// /admin/add-staff => POST
router.post('/admin/add-staff', auth.checkAdmin, adminController.postAddStaff);
  
router.get('/edit-staff/:staffId', auth.checkAdmin, adminController.getEditStaff);
  
router.post('/admin/edit-staff',auth.checkAdmin, adminController.postEditStaff );

module.exports = router;
