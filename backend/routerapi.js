const express = require('express');

const routerapi = express.Router()

// Projects
routerapi.use('/api/projects', require('./Router/Admin/ProjectsRouter'));
// Jobs
routerapi.use('/api/jobs', require('./Router/Admin/JobsRouter'));
// Client
routerapi.use('/api/client', require('./Router/Admin/ClientManagementRouter'));
// User
routerapi.use('/api/user', require('./Router/userRouter'));
// CostEstimates
routerapi.use('/api/costEstimates', require('./Router/Admin/CostEstimatesRouter'));
// TimeLogs
routerapi.use('/api/timeLogs', require('./Router/Admin/TimeLogsRouter'));
// ReceivablePurchase
routerapi.use('/api/receivablePurchase', require('./Router/Admin/ReceivablePurchaseRouter'));
// TimesheetWorklog
routerapi.use('/api/timesheetWorklog', require('./Router/Admin/TimesheetWorklogRouter'));
// InvoicingBilling
routerapi.use('/api/invoicingBilling', require('./Router/Admin/InvoicingBillingRouter'));
// AssignmentJob
routerapi.use('/api/AssignmentJob', require('./Router/Admin/AssignmentJobControllerRouter'));
// ReportsAnalyticsController
routerapi.use('/api/ReportsAnalytics', require('./Router/Admin/ReportsAnalyticsrRouter'));
// Remove Assign Job
routerapi.use('/api/Remove', require('./Router/Admin/removeAssignRouter'));
// PDFCreate
routerapi.use('/api/pdf', require('./Router/Admin/PDF_EstimatesRouter'));
// DailyLog
routerapi.use('/api/DailyLog',require('./Router/Admin/DailyLogRouter'))
// Comments
routerapi.use('/api/comments', require('./Router/Admin/CommentsRouter'));
// SendEmail
routerapi.use('/api/email', require('./Router/Admin/SendEmailRouter'));

// /////Employee
routerapi.use('/api/employee/dashboard',require('./Router/Employee/DashboardRouter'));

// send Email 
routerapi.use("/api",require("./Router/SendProposalRouter"));
routerapi.use("/api",require("./Router/LogEnvelopeRouter"));
routerapi.use("/api",require("./Router/SendEmailRouter"));

module.exports = routerapi