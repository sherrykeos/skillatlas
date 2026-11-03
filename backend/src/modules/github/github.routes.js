import { Router } from "express";

import authenticate from "../auth/src/auth.middleware.js";
import validate from "../../middlewares/validate.js";

import {
  inspectRepositorySchema,
  repositoryTreeSchema,
  importRepositorySchema,
} from "./github.schema.js";

import {
  inspect,
  getRepositoryTree,
  importRepo,
} from "./github.controller.js";

const router = Router();

/**
 * POST /api/github/inspect
 * Inspect public repository details and branches (Public, no auth required).
 */
router.post(
  "/inspect",
  validate(inspectRepositorySchema),
  inspect,
);

/**
 * GET /api/github/tree
 * Browse repository tree files for selection UI (Public, no auth required).
 */
router.get(
  "/tree",
  validate(repositoryTreeSchema, "query"),
  getRepositoryTree,
);

/**
 * POST /api/github/import
 * Import selected files into a new DRAFT SkillAtlas skill (Requires user authentication).
 */
router.post(
  "/import",
  authenticate,
  validate(importRepositorySchema),
  importRepo,
);

export default router;
