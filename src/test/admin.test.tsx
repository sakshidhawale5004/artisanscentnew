import { describe, it } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "../routeTree.gen";

describe("Router /admin test", () => {
  it("navigates to /admin without throwing error", async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ["/admin"],
    });

    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      history: memoryHistory,
      context: { queryClient },
      defaultSsr: false,
    });

    await router.load();

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      const el = screen.queryByText("This page didn't load");
      if (el) {
        throw new Error("Found 'This page didn't load' error on /admin!");
      }
    });
  });
});
