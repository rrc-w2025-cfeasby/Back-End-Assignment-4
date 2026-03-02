import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

// Mock loans array
jest.mock("../src/api/v1/controllers/loanController", () => ({
    loans: [
        { id: 1, userId: "USER_1" },
        { id: 2, userId: "USER_2" },
    ],
}));

describe("isAuthorized middleware", () => {
    let req: Partial<Request>;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = { params: {} };

        res = {
            locals: {},
        } as unknown as Response;

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 403 when no role exists", () => {
        res.locals = { uid: "USER_1" };

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));

        const err = (next as jest.Mock).mock.calls[0][0];
        expect(err.statusCode).toBe(403);
        expect(err.message).toContain("No role found");
    });

    test("should return 403 when role is insufficient", () => {
        res.locals = { uid: "USER_1", role: "user" };

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));

        const err = (next as jest.Mock).mock.calls[0][0];
        expect(err.statusCode).toBe(403);
        expect(err.message).toContain("Insufficient role");
    });

    test("should allow access when role matches", () => {
        res.locals = { uid: "USER_1", role: "admin" };

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });

    test("should allow same user when allowSameUser is true", () => {
        req.params = { id: "1" };
        res.locals = { uid: "USER_1", role: "user" };

        const middleware = isAuthorized({
            hasRole: ["admin", "user"],
            allowSameUser: true,
        });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });

    test("should allow access when allowSameUser is true but user does not own resource", () => {
        req.params = { id: "2" };
        res.locals = { uid: "USER_1", role: "user" };

        const middleware = isAuthorized({
            hasRole: ["admin", "user"],
            allowSameUser: true,
        });

        middleware(req as Request, res as Response, next);

        // Because role = "user" is allowed, access is granted
        expect(next).toHaveBeenCalledWith();
    });

    test("should allow admin even when allowSameUser fails", () => {
        req.params = { id: "2" };
        res.locals = { uid: "USER_1", role: "admin" };

        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true,
        });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });
});