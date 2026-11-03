import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getMarketplaceSkills,
  getMarketplaceSkillBySlug,
  getMarketplaceStats,
  getMarketplaceCategories,
} from "./marketplace.service.js";

/**
 * Get published skills for public discovery (browse/search/filter/sort/pagination).
 *
 * GET /api/marketplace/skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  const result = await getMarketplaceSkills(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Skills fetched successfully."
      )
    );
});

/**
 * Get public skill detail view of a published skill by slug.
 *
 * GET /api/marketplace/skills/:slug
 */
export const getSkillBySlug = asyncHandler(async (req, res) => {
  const skill = await getMarketplaceSkillBySlug(req.params.slug);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { skill },
        "Skill fetched successfully."
      )
    );
});

/**
 * Get real-time public marketplace statistics directly from database.
 *
 * GET /api/marketplace/stats
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await getMarketplaceStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats,
        "Marketplace stats fetched successfully."
      )
    );
});

/**
 * Get categories with live skill counts.
 *
 * GET /api/marketplace/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const result = await getMarketplaceCategories();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Categories fetched successfully."
      )
    );
});
