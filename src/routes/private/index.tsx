import { UserId } from "#/components/UserId";
import { requireAuthMiddleware } from "#/lib/function-middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const retriveUserFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])  
  .handler(async ({ context }) => {
    return context.user;
  });

export const Route = createFileRoute("/private/")({
  component: RouteComponent,
  loader: async () => {
    const user = await retriveUserFn();
    return { user };
  },
});

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Private Route</h1>
      <p className="mt-4 text-lg">
        This route is protected and requires authentication.
      </p>
      <UserId />
    </div>
  );
}
