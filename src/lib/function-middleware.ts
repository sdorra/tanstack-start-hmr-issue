import { createMiddleware } from "@tanstack/react-start";
import * as db from "./db";
import { getCookie } from "@tanstack/react-start/server";

export const dbMiddleware = createMiddleware({type: "function"}).server(({next}) => {
    return next({
        context: {
            db
        }
    });
});

export type Session = {
    isAuthenticated: boolean;
    user: db.User | null;
};

export const sessionMiddleware = createMiddleware({type: "function"}).middleware([dbMiddleware]).server(({next}) => {
    const userid = getCookie("userid");
    return next({
        context: {
            session: {
                isAuthenticated: !!userid,
                user: userid ? db.users[Number(userid)] : null,
            } as Session
        }
    });
});

export const requireAuthMiddleware = createMiddleware({type: "function"}).middleware([sessionMiddleware]).server(({context, next}) => {
    if (!context.session.isAuthenticated) {
        throw new Error("Unauthorized");
    }
    return next({
        context: {
            user: context.session.user,
        }
    });
});