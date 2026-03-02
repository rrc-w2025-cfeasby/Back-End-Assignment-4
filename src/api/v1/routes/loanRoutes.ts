import { Router } from "express";
import {
    getLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
    approveLoan,
    denyLoan   
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = Router();

router.use(authenticate);

router.get("/loans", 
    isAuthorized({ hasRole: ["admin", "manager"]}),
    getLoans);
router.get("/loans/:id", 
    isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true}),
    getLoanById);
router.post("/loans", 
    isAuthorized({ hasRole: ["admin", "user"]}),
    createLoan);
router.put("/loans/:id", 
    isAuthorized({ hasRole: ["admin", "user"], allowSameUser: true}),
    updateLoan);
router.delete("/loans/:id", 
    isAuthorized({ hasRole: ["admin"]}),
    deleteLoan);
router.post("/:id/approve", 
    isAuthorized({ hasRole: ["admin", "manager"]}),
    approveLoan);
router.post("/:id/deny", 
    isAuthorized({ hasRole: ["admin", "manager"]}),
    denyLoan);

export default router;