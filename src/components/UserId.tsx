import { requireAuthMiddleware } from "#/lib/function-middleware";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

const getUserIdFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    return context.session.user?.id || null;
  });

export function UserId() {
  const [userId, setUserId] = useState<number | null>(null);
  const getUserId = useServerFn(getUserIdFn);

  useEffect(() => {
    getUserId().then((id) => {
      setUserId(id);
    });
  }, [getUserId]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">User ID Component</h1>
      <p className="mt-4 text-lg">
        This component can be used to display the authenticated user's ID: {userId}
      </p>
    </div>
  );
}
