import {
  test,
  expect,
  type Page,
  type Response,
  type Locator,
} from "@playwright/test";

// -------------------------------------------
// Utility functions
async function waitForResponse(
  page: Page,
  url: string,
  status: number
): Promise<Response> {
  try {
    return await page.waitForResponse(
      (response) =>
        response.url().includes(url) && response.status() === status,
      { timeout: 5000 }
    );
  } catch (error) {
    console.error(
      `Failed to receive response from ${url} with status ${status}:`,
      error
    );
    throw error;
  }
}

async function awaitPeople(page: Page): Promise<Locator> {
  const people = page.getByRole("listitem");
  await expect(people).not.toHaveCount(0);
  return people;
}
// -------------------------------------------

// -------------------------------------------
// Before each
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
// -------------------------------------------

test("homepage has expected title and description", async ({ page }) => {
  await expect(page).toHaveTitle(/SWAPI Example/);
  await expect(page.locator("meta[name='description']")).toHaveAttribute(
    "content",
    /Generated by create next app/
  );
});

test("homepage renders title", async ({ page }) => {
  const title = page.getByText("SWAPI Example");
  await expect(title).toHaveText("SWAPI Example");
});

test("homepage renders list of people", async ({ page }) => {
  await waitForResponse(page, "/api/people", 200);

  await awaitPeople(page);
  const people = page.getByRole("listitem");
  await expect(people).toHaveCount(10);
});

test("homepage list items contain character details", async ({ page }) => {
  await waitForResponse(page, "/api/people", 200);
  await waitForResponse(page, "/api/planets/1", 200);
  const planetName = "Tatooine";

  const people = await awaitPeople(page);
  const person = people.filter({ hasText: /Luke Skywalker/ });
  await expect(person).toBeVisible();

  await expect(page.getByText(planetName)).toBeVisible();
});

test("homepage list items navigate to person details page", async ({
  page,
}) => {
  await waitForResponse(page, "/api/people", 200);
  await waitForResponse(page, "/api/planets/1", 200);

  const people = await awaitPeople(page);

  await people.first().click();
  await expect(page).toHaveURL(/people\/1/);
});

test("homepage renders loading message while fetching people", async ({
  page,
}) => {
  const loadingMessage = page.getByText("Loading...");
  await expect(loadingMessage).toBeVisible();
});

test("homepage renders error message when fetching people fails", async ({
  page,
}) => {
  await page.route("/api/people", (route) => {
    route.fulfill({
      status: 500,
      body: "Internal Server Error",
    });
  });

  await page.goto("/");

  const errorMessage = page.getByText("Failed to load people");
  await expect(errorMessage).toBeVisible();
});
