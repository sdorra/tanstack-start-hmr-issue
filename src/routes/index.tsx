import * as db from "#/lib/db";
import { sessionMiddleware } from "#/lib/function-middleware";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { useState } from "react";

const getSessionFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => {
    return context.session;
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const session = await getSessionFn();
    return { session };
  },
});

const authenticateFn = createServerFn({ method: "POST" })
  .inputValidator((data) => data as string)
  .handler(async ({ data }) => {
    const user = Object.values(db.users).find((user) => {
      if (user.name === data) {
        return user;
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    setCookie("userid", String(user.id), { path: "/" });
  });

const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  setCookie("userid", "", { path: "/", expires: new Date(0) });
});

function Home() {
  const { session } = Route.useLoaderData();
  const [isAuthenticated, setIsAuthenticated] = useState(
    session.isAuthenticated,
  );
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      {isAuthenticated ? (
        <div className="mt-4 text-lg">
          <Link to="/private">Go to private route</Link>
          <button
            className="block"
            onClick={() => {
              logoutFn().then(() => setIsAuthenticated(false));
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name");
            if (typeof name === "string") {
              authenticateFn({ data: name })
                .then(() => setIsAuthenticated(true))
                .catch((err) => {
                  console.error(err);
                });
            }
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="border p-2 rounded"
          />
          <button>Authenticate</button>
        </form>
      )}
    </div>
  );
}
