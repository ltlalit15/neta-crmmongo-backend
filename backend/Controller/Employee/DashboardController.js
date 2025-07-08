const asyncHandler = require('express-async-handler');
const Assignment = require('../../Model/Admin/AssignmentJobControllerModel');
const TimesheetWorklogs = require('../../Model/Admin/TimesheetWorklogModel');
const mongoose = require("mongoose");

const getDateRange = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return { today, startOfWeek };
};

const parseHourString = (hourStr) => {
  if (!hourStr) return 0;
  const [h, m] = hourStr.split(':').map(Number);
  return h + (m / 60);
};

const formatDecimalHours = (hours) => `${parseFloat(hours.toFixed(2))}h`;

const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ success: false, message: "Invalid Employee ID" });
  }

  const { today, startOfWeek } = getDateRange();

  try {
    const assignments = await Assignment.find({ employeeId }).populate("jobId");

    let activeTasks = 0;
    let completedTasks = 0;

    assignments.forEach(assign => {
      assign.jobId.forEach(job => {
        const status = job.Status?.toLowerCase();
        if (status === 'active') activeTasks++;
        else if (status === 'completed') completedTasks++;
      });
    });

    const weeklyLogs = await TimesheetWorklogs.find({
      employeeId,
      date: { $gte: startOfWeek, $lte: today }
    });

    let totalWeeklyHours = 0;
    let todayHours = 0;

    weeklyLogs.forEach(log => {
      const parsed = parseHourString(log.hours);
      totalWeeklyHours += parsed;
      if (new Date(log.date).toDateString() === today.toDateString()) {
        todayHours += parsed;
      }
    });

    const weeklyTarget = 40;
    const goalPercent = Math.floor((totalWeeklyHours / weeklyTarget) * 100);
    const remainingHours = Math.max(weeklyTarget - totalWeeklyHours, 0);

    const dashboardData = {
      summary: {
        activeTasks,
        hoursLogged: formatDecimalHours(totalWeeklyHours),
        completedTasks,
        performance: 95
      },
      weeklyPerformance: {
        tasksCompleted: completedTasks,
        hoursLogged: formatDecimalHours(totalWeeklyHours),
        goalProgress: goalPercent,
        dueThisWeek: activeTasks,
        compare: {
          tasksCompleted: "↑ 12% vs last week",
          hoursLogged: "↑ 8% vs target",
          dueTasks: "↑ 3 from yesterday"
        }
      },
      todaysPerformance: {
        date: today.toISOString().split("T")[0],
        hoursToday: formatDecimalHours(todayHours),
        weeklyHours: {
          logged: formatDecimalHours(totalWeeklyHours),
          target: `${weeklyTarget}h`
        },
        goalProgress: {
          percent: goalPercent,
          status: goalPercent >= 100 ? "Achieved" : goalPercent >= 75 ? "On Track" : "Behind",
          remainingHours: formatDecimalHours(remainingHours)
        },
        compare: {
          hoursToday: "↑ 2h vs. yesterday"
        }
      }
    };

    res.status(200).json({ success: true, data: dashboardData });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee dashboard",
      error: error.message
    });
  }
});

module.exports = { getEmployeeDashboard };
