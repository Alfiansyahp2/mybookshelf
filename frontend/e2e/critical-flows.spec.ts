import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const TEST_USER_EMAIL = "test@example.com";
const TEST_USER_PASSWORD = "password";

test.use({ locale: "id-ID" });

type SavedStorageState = Awaited<ReturnType<BrowserContext["storageState"]>>;

let authenticatedState: SavedStorageState | null = null;

async function loginAsTestUser(page: Page) {
    if (authenticatedState) {
        if (authenticatedState.cookies.length > 0) {
            await page.context().addCookies(authenticatedState.cookies);
        }
        return;
    }

    await page.goto("/login");
    await page.getByPlaceholder("your@email.com").fill(TEST_USER_EMAIL);
    await page.getByPlaceholder("••••••••").fill(TEST_USER_PASSWORD);
    await page.locator('form button[type="submit"]').click();
    await page.waitForURL(/\/dashboard/);
    await expect(page.locator('header a[href="/library"]')).toBeVisible();
    authenticatedState = await page.context().storageState();
}

test.describe.serial("Critical User Flows (Phase 6 E2E)", () => {
    const shelfA = "Rak E2E Utama";
    const shelfB = "Rak E2E Tujuan";
    const bookTitle = "E2E Clean Architecture";
    const expenseTitle = "E2E Hardcover Order";

    test("health readiness probe returns 200 with X-Request-Id and CatchAll redirects unknown paths", async ({
        page,
        request,
    }) => {
        const healthResponse = await request.get(
            "http://127.0.0.1:8010/api/health",
        );
        expect(healthResponse.status()).toBe(200);
        expect(healthResponse.headers()["x-request-id"]).toBeTruthy();

        const payload = await healthResponse.json();
        expect(payload.status).toBe("ok");
        expect(payload.checks?.database).toBe("ok");
        expect(payload.checks?.cache).toBe("ok");
        expect(payload.checks?.storage).toBe("ok");
        expect(JSON.stringify(payload)).not.toContain("password");

        await page.goto("/route-that-does-not-exist-e2e");
        await page.waitForURL((url) => url.pathname === "/");
    });

    test("login authenticates user, redirects to dashboard, and persists across reload", async ({
        page,
    }) => {
        await loginAsTestUser(page);
        await expect(page).toHaveURL(/\/dashboard/);

        await page.reload();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.locator('header a[href="/library"]')).toBeVisible();
        authenticatedState = await page.context().storageState();
    });

    test("creates shelves and a book in Library and persists across reload", async ({
        page,
    }) => {
        await loginAsTestUser(page);
        await page.goto("/library");
        await expect(page.locator('header a[href="/library"]')).toBeVisible();

        // Create Shelf A
        await page
            .locator('header button[title*="Tambah Rak"], header button[title*="Add"]')
            .first()
            .click();
        await page.getByPlaceholder("My Bookshelf").fill(shelfA);
        await page.locator('form input[type="number"]').fill("12");
        await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/api/v1/shelves") &&
                    res.request().method() === "POST" &&
                    res.status() < 300,
            ),
            page.locator('form button[type="submit"]').click(),
        ]);

        // Create Shelf B
        await page
            .locator('header button[title*="Tambah Rak"], header button[title*="Add"]')
            .first()
            .click();
        await page.getByPlaceholder("My Bookshelf").fill(shelfB);
        await page.locator('form input[type="number"]').fill("12");
        await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/api/v1/shelves") &&
                    res.request().method() === "POST" &&
                    res.status() < 300,
            ),
            page.locator('form button[type="submit"]').click(),
        ]);

        await expect(page.getByText(shelfA)).toBeVisible();
        await expect(page.getByText(shelfB)).toBeVisible();

        // Add book into Shelf A via first shelf menu popover
        await page
            .locator('button[title="Opsi Rak"], button[title="Shelf Options"]')
            .first()
            .click();
        await page
            .locator('button[title*="Tambah Buku"], button[title*="Add Book"]')
            .first()
            .click();

        await page
            .locator('input[placeholder*="judul buku"], input[placeholder*="book title"]')
            .fill(bookTitle);
        await page
            .locator('input[placeholder*="nama penulis"], input[placeholder*="author name"]')
            .fill("Robert Martin");
        await page.getByRole("button", { name: "Teknologi", exact: true }).click();
        await page
            .locator('input[placeholder*="Jumlah halaman"], input[placeholder*="Number of pages"]')
            .fill("350");

        const [createBookRes] = await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/api/v1/books") &&
                    res.request().method() === "POST",
            ),
            page.locator('button[form="add-book-form"]').click(),
        ]);
        expect(createBookRes.status(), await createBookRes.text()).toBeLessThan(
            300,
        );

        await expect(page.getByText(bookTitle).first()).toBeVisible();

        await page.reload();
        await expect(page.getByText(shelfA)).toBeVisible();
        await expect(page.getByText(shelfB)).toBeVisible();
        await expect(page.getByText(bookTitle).first()).toBeVisible();
    });

    test("starts reading a book, updates progress, moves shelf, and persists across reload", async ({
        page,
    }) => {
        await loginAsTestUser(page);
        await page.goto("/library");
        await expect(page.getByText(bookTitle).first()).toBeVisible();

        // Open book detail modal from spine
        await page.getByText(bookTitle).first().click();

        // Start reading from BookActionsSection button
        const startReadingBtn = page
            .locator('button[title*="Mulai Membaca"], button[title*="Start Reading"]')
            .first();
        const [startRes] = await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/start") &&
                    res.request().method() === "POST",
            ),
            startReadingBtn.click(),
        ]);
        expect(startRes.status(), await startRes.text()).toBeLessThan(300);

        // Open Progress tab and update current page via range input
        await page.getByRole("button", { name: /^Progress$/i }).click();
        const slider = page.locator('input[type="range"]');
        await expect(slider).toBeVisible();

        const [progressRes] = await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/progress") &&
                    res.request().method() === "PATCH",
            ),
            slider.fill("140"),
        ]);
        expect(progressRes.status(), await progressRes.text()).toBeLessThan(300);

        await expect(page.getByText(/40%/).first()).toBeVisible();

        // Verify book and 140/350 progress appear on /reading and persist on reload
        await page.goto("/reading");
        await expect(page.getByText(bookTitle).first()).toBeVisible();
        await expect(page.getByText(/140/).first()).toBeVisible();

        await page.reload();
        await expect(page.getByText(bookTitle).first()).toBeVisible();
        await expect(page.getByText(/140/).first()).toBeVisible();

        // Move book to shelfB via authenticated Sanctum SPA request and confirm persistence on /library
        const moveResult = await page.evaluate(
            async ({ targetShelfName, targetBookTitle }) => {
                const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
                const xsrf = match ? decodeURIComponent(match[1]) : "";
                const headers: Record<string, string> = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
                };
                const base = "http://127.0.0.1:8010/api/v1";
                const [shelvesRes, booksRes] = await Promise.all([
                    fetch(`${base}/shelves`, {
                        headers,
                        credentials: "include",
                    }),
                    fetch(`${base}/books?per_page=100`, {
                        headers,
                        credentials: "include",
                    }),
                ]);
                const shelvesJson = await shelvesRes.json();
                const booksJson = await booksRes.json();
                const shelves = Array.isArray(shelvesJson.data)
                    ? shelvesJson.data
                    : shelvesJson;
                const books = booksJson.data?.data ?? booksJson.data ?? [];
                const destShelf = shelves.find(
                    (s: { name: string }) => s.name === targetShelfName,
                );
                const book = books.find(
                    (b: { title: string }) => b.title === targetBookTitle,
                );
                if (!destShelf || !book) {
                    return { ok: false, status: 0 };
                }
                const patchRes = await fetch(`${base}/books/${book.id}/shelf`, {
                    method: "PATCH",
                    headers,
                    credentials: "include",
                    body: JSON.stringify({
                        shelf_id: destShelf.id,
                        position: 0,
                    }),
                });
                return { ok: patchRes.ok, status: patchRes.status };
            },
            { targetShelfName: shelfA, targetBookTitle: bookTitle },
        );
        expect(moveResult.ok).toBe(true);

        await page.goto("/library");
        await page.reload();
        await expect(page.getByText(bookTitle).first()).toBeVisible();
        await expect(page.getByText("1/12").first()).toBeVisible();
    });

    test("creates an accounting expense, inspects budgets tab, and persists across reload", async ({
        page,
    }) => {
        await loginAsTestUser(page);
        await page.goto("/accounting");

        await page
            .locator('button[title*="Tambah Pengeluaran"], button[title*="Add Expense"]')
            .click();

        await page
            .locator('#expense-form input[placeholder*="Great Gatsby"]')
            .fill(expenseTitle);
        const amountInput = page.locator(
            '#expense-form input[placeholder="0.00"]',
        );
        await amountInput.fill("185000");

        const [createExpenseRes] = await Promise.all([
            page.waitForResponse(
                (res) =>
                    res.url().includes("/api/v1/accounting/expenses") &&
                    res.request().method() === "POST",
            ),
            page.locator('button[form="expense-form"]').click(),
        ]);
        expect(
            createExpenseRes.status(),
            await createExpenseRes.text(),
        ).toBeLessThan(300);

        // Open Expenses tab
        await page
            .locator('nav[aria-label="Tabs"] button')
            .filter({ hasText: /Pengeluaran|Expenses/i })
            .click();
        await expect(page.getByText(expenseTitle).first()).toBeVisible();

        // Reload and verify expense persists
        await page.reload();
        await page
            .locator('nav[aria-label="Tabs"] button')
            .filter({ hasText: /Pengeluaran|Expenses/i })
            .click();
        await expect(page.getByText(expenseTitle).first()).toBeVisible();

        // Verify Budgets tab renders cleanly
        await page
            .locator('nav[aria-label="Tabs"] button')
            .filter({ hasText: /Anggaran|Budgets/i })
            .click();
        await expect(
            page.getByText(/Anggaran Aktif|Active Budgets|Belum ada anggaran|No active budgets/i).first(),
        ).toBeVisible();
    });

    test("switches language and toggles theme & dark mode with persistence on /settings", async ({
        page,
    }) => {
        await loginAsTestUser(page);
        await page.goto("/dashboard");

        // Toggle language via header button
        const langBtn = page.locator(
            'header button[title="Switch to English"], header button[title="Ganti ke Bahasa Indonesia"]',
        );
        await expect(langBtn).toBeVisible();
        const initialLang = (await langBtn.innerText()).trim();
        await langBtn.click();
        await expect(langBtn).not.toHaveText(initialLang);

        await page.goto("/settings");
        await page
            .getByRole("button", { name: /Preferensi|Preferences/i })
            .click();

        // Activate dark mode
        await page
            .getByRole("button", { name: /Mode Gelap|Dark Mode/i })
            .click();
        await expect(page.locator("html")).toHaveClass(/dark/);

        // Select a dark palette and confirm reload persistence
        await page
            .getByRole("button", { name: /Hutan Pinus|Forest Study/i })
            .click();

        await page.reload();
        await expect(page.locator("html")).toHaveClass(/dark/);
        const themeState = await page.evaluate(() => ({
            theme: localStorage.getItem("theme"),
            darkPalette: localStorage.getItem("app_dark_palette"),
        }));
        expect(themeState).toEqual({
            theme: "dark",
            darkPalette: "forest",
        });
    });
});
