import { Request, Response, NextFunction } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { AuthenticationError } from "../src/api/v1/errors/errors";
import { auth } from "../src/config/firebaseConfig";

// Mock Firebase Auth
jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("authenticate middleware", () => {
    let req: Partial<Request>;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = { headers: {} };

        res = {
            locals: {},
        } as unknown as Response;

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 when no token is provided", async () => {
        await authenticate(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));

        const err = (next as jest.Mock).mock.calls[0][0];

        expect(err.statusCode).toBe(401);
        expect(err.message).toContain("No token provided");
    });

    test("should return 401 when token is invalid", async () => {
        req.headers = {
            authorization: "Bearer invalid.token.here",
        };

        (auth.verifyIdToken as jest.Mock).mockRejectedValue(
            new Error("Decoding Firebase ID token failed")
        );

        await authenticate(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));

        const err = (next as jest.Mock).mock.calls[0][0];

        expect(err.statusCode).toBe(401);
        expect(err.message).toContain("Unauthorized");
    });

    test("should authenticate successfully with valid token", async () => {
        req.headers = {
            authorization: "Bearer valid.token",
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "USER_123",
            role: "user",
        });

        await authenticate(req as Request, res as Response, next);

        expect(res.locals.uid).toBe("USER_123");
        expect(res.locals.role).toBe("user");
        expect(next).toHaveBeenCalledWith();
    });
});