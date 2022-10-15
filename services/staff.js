const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');

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

// const isAlreadyLeave = async (staff, date) => AnnualLeave.findOne({
//   staffId: staff._id,
//   startLeave <= date <= endLeave
// });

module.exports = {
  getCurrentTimeLog,
  isWorking,
  startWorking,
  stopWorking,
  todayTimeLog,
};
