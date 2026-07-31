import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchesRouter from "./matches";
import statsRouter from "./stats";
import adminRouter from "./admin";
import playersRouter from "./players";

const router: IRouter = Router();

router.use(healthRouter);
router.use(matchesRouter);
router.use(statsRouter);
router.use(adminRouter);
router.use(playersRouter);

export default router;
