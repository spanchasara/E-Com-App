import catchAsync from "../utils/catch-async.js";
import * as analyticsService from "../services/analytics.service.js";

const getSellerAnalytics = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const filterQuery = {sellerId};
  const resp = await analyticsService.getAnalytics(filterQuery);
  res.send(resp);
});

const getSellerPeriodicAnalysis = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const filterQuery = {sellerId};
  const monthResp = await analyticsService.getMonthAnalysis(filterQuery);
  const yearResp = await analyticsService.getYearAnalysis(filterQuery);

  res.send({ monthAnalysis: monthResp, yearAnalysis: yearResp });
});

const getAdminAnalytics = catchAsync(async (req, res) => {
  const resp = await analyticsService.getAnalytics({});
  res.send(resp);
});

const getAdminPeriodicAnalysis = catchAsync(async (req, res) => {
  const monthResp = await analyticsService.getMonthAnalysis({});
  const yearResp = await analyticsService.getYearAnalysis({});

  res.send({ monthAnalysis: monthResp, yearAnalysis: yearResp });
});


export { getSellerAnalytics, getSellerPeriodicAnalysis, getAdminAnalytics, getAdminPeriodicAnalysis };
