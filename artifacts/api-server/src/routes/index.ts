import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import eventsRouter from "./events";
import matchesRouter from "./matches";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(eventsRouter);
router.use(matchesRouter);

export default router;
