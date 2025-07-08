const asyncHandler = require('express-async-handler');
const Project = require('../../Model/Admin/ProjectsModel');
const TimesheetWorklog = require('../../Model/Admin/TimesheetWorklogModel');
const InvoicingBilling = require('../../Model/Admin/InvoicingBillingModel');
const ReceivablePurchase = require('../../Model/Admin/ReceivablePurchaseModel');

const ReportsAnalyticsController = asyncHandler(async (req, res) => {
  // 1. Project Status
  const completedProjects = await Project.countDocuments({ status: 'Completed' });
  const inProgressProjects = await Project.countDocuments({ status: 'In Progress' });
  const onHoldProjects = await Project.countDocuments({ status: 'On Hold' });
  const delayedProjects = await Project.countDocuments({ status: 'Delayed' });

  // 2. Work Hours (This week, Mon-Fri)
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const workLogs = await TimesheetWorklog.aggregate([
    {
      $match: {
        date: { $gte: startOfWeek, $lte: endOfWeek }
      }
    },
    {
      $addFields: {
        day: { $dayOfWeek: "$date" },
        hoursNum: {
          $convert: {
            input: "$hours",
            to: "double",
            onError: 0,
            onNull: 0
          }
        }
      }
    },
    {
      $group: {
        _id: "$day",
        totalHours: { $sum: "$hoursNum" }
      }
    }
  ]);

  // Map MongoDB $dayOfWeek (1=Sunday, 2=Monday, ..., 7=Saturday) to Mon-Fri
  const dayMap = { 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri' };
  const workHours = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
    const log = workLogs.find(w => dayMap[w._id] === day);
    return { day, hours: log ? log.totalHours : 0 };
  });

  // 3. Financial Overview (Revenue & Expenses by Week)
  const invoices = await InvoicingBilling.aggregate([
    {
      $addFields: {
        week: { $isoWeek: "$date" }
      }
    },
    { $unwind: "$lineItems" },
    {
      $group: {
        _id: "$week",
        totalRevenue: { $sum: "$lineItems.amount" }
      }
    }
  ]);

  // Calculate current week number
  const currentWeekNumber = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10) % 52 || 1;

  const weeks = [
    `Week ${currentWeekNumber - 3}`,
    `Week ${currentWeekNumber - 2}`,
    `Week ${currentWeekNumber - 1}`,
    `Week ${currentWeekNumber}`
  ];

  const weekNumbers = [currentWeekNumber - 3, currentWeekNumber - 2, currentWeekNumber - 1, currentWeekNumber];

  const financialOverview = {
    weeks,
    revenue: weekNumbers.map(week => {
      const inv = invoices.find(i => i._id === week);
      return inv ? inv.totalRevenue : 0;
    }),
    expenses: [0, 0, 0, 0] // No Expense model
  };

  // 4. PO Status (ReceivablePurchase)
  const approvedPOs = await ReceivablePurchase.countDocuments({ POStatus: 'Approved' });
  const pendingPOs = await ReceivablePurchase.countDocuments({ POStatus: 'Pending' });
  const rejectedPOs = await ReceivablePurchase.countDocuments({ POStatus: 'Rejected' });

  // 5. Timesheet Compliance
  const filledTimesheets = await TimesheetWorklog.distinct('employeeId', {
    date: { $gte: startOfWeek, $lte: endOfWeek }
  });
  const totalTimesheets = await TimesheetWorklog.distinct('employeeId');

  const compliancePercent = totalTimesheets.length
    ? Math.round((filledTimesheets.length / totalTimesheets.length) * 100)
    : 0;

  // 6. Project Timeline (Static placeholder)
  const projectTimeline = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    activeProjects: [60, 70, 80, 90],
    completedProjects: [40, 50, 60, 80]
  };

  const data = {
    projectStatus: [
      { label: 'Completed', value: completedProjects },
      { label: 'In Progress', value: inProgressProjects },
      { label: 'On Hold', value: onHoldProjects },
      { label: 'Delayed', value: delayedProjects }
    ],
    workHours,
    financialOverview,
    poStatus: [
      { label: 'Approved', value: approvedPOs },
      { label: 'Pending', value: pendingPOs },
      { label: 'Rejected', value: rejectedPOs }
    ],
    timesheetCompliance: [
      { week: 'This Week', percent: compliancePercent }
    ],
    projectTimeline
  };

  res.status(200).json({ success: true, data });
});

module.exports = { ReportsAnalyticsController };
