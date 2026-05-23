import { Hono } from "hono";

const app = new Hono();

const profile = {
  name: "Carlos Guerrero",
  handle: "guerrerocarlos",
  role: "Builder of small cloud systems",
  location: "Asuncion, Paraguay",
  focus: ["W7S", "Cloudflare Workers", "product engineering", "automation"]
};

app.get("/api/profile", (c) =>
  c.json({
    ...profile,
    servedFrom: {
      org: c.req.header("x-w7s-org-slug") ?? null,
      repo: c.req.header("x-w7s-repo-slug") ?? null,
      originalPath: c.req.header("x-w7s-original-path") ?? null
    }
  })
);

app.get("/api/projects", (c) =>
  c.json({
    projects: [
      {
        name: "W7S",
        summary: "A lightweight deploy surface for Workers for Platforms.",
        status: "active"
      },
      {
        name: "Root app routing",
        summary: "Same-name GitHub repos can serve directly from the org host.",
        status: "testing"
      },
      {
        name: "Repo deploy action",
        summary: "GitHub Actions can build and upload complete repo archives.",
        status: "active"
      }
    ]
  })
);

app.get("/api/health", (c) =>
  c.json({
    service: "guerrerocarlos",
    status: "ok",
    checkedAt: new Date().toISOString()
  })
);

app.post("/api/message", async (c) => {
  let body: unknown = null;
  try {
    body = await c.req.json();
  } catch {
    body = await c.req.text();
  }

  return c.json({
    received: body,
    receivedAt: new Date().toISOString()
  });
});

app.notFound((c) =>
  c.json(
    {
      error: "Not found",
      method: c.req.method,
      path: new URL(c.req.url).pathname
    },
    404
  )
);

export default app;
