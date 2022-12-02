const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');
const AnnualLeave = require('../models/annual-leave');

const getCurrentTimeLog = (staff) => TimeLog.findOne({
  staffId: staff._id,
  endedAt: null
});

const isWorking = async (staff) => {
  const current = await getCurrentTimeLog(staff);
  return !!current;
};

const startWorking = async (staff) => {
  const working = await isWorking(staff);
  if (working) {
    return null;
  }

  const log = new TimeLog({
    staffId: staff._id
  });

  await log.save();
  return log;
};

const stopWorking = async (staff) => {
  const current = await getCurrentTimeLog(staff);
  if (!current) {
    return null;
  }

  await current.end();
  return current;
};

const todayTimeLog = async (staff) => {
  const today = new Date().toISOString().slice(0, 10);
  return TimeLog.find({
    startedAt: {
      $gte: today
    }
  });
};

const timeLogOfMonth = async (staff, dateS, dateE) => {
  return TimeLog.find({
    staffID: staff._id,
    startedAt: {
      $lte: dateS,
    },
    endedAt: {
      $gte: dateE,
    }
  });
};

const timeLogOfDay = async (staff, date) => {
  return TimeLog.find({
    staffID: staff._id,
    startedAt: date,
  });
};

// const isAlreadyLeave = async (staff, date) => {
//   const alreadyLeave = AnnualLeave.find({
//     staffId: staff._id,
//     startLeave: {
//       $lte: date
//     },
//     endLeave: {
//       $gte: date
//     }
//   });
  
//   if (!alreadyLeave) {
//     return false;
//   }
//   else {
//     return true;
//   }
// };

const leaves = async (staff) => {
  return AnnualLeave.find({
   staffId: staff._id,
  });
};

const getLeaveOfDay = async (staff, date) => {
  const leave = AnnualLeave.find({
    staffId: staff._id,
    startLeave: date
  });
  return leave.duration;
};

const getLeaveOfMonth = async (staff, dateS, dateE) => {
  return AnnualLeave.find({
    staffId: staff._id,
    startLeave: {
      $gte: dateS,
      $lte: dateE,
    }
  });
};

module.exports = {
  getCurrentTimeLog,
  isWorking,
  startWorking,
  stopWorking,
  todayTimeLog,
  leaves,
  timeLogOfMonth,
  timeLogOfDay,
  getLeaveOfDay,
  getLeaveOfMonth,
};
