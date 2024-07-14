const { clickElement, putText, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("https://qamid.tmweb.ru/client/index.php");
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Test suite of three test cases for booking tickets", () => {
  test("Booking one ticket", async () => {
    await clickElement(page, "a:nth-child(7)"); //Выбор даты бронирования"
    await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='190']"); // Выбор сеанса фильма
    await clickElement(page, "span[class='buying-scheme__chair buying-scheme__chair_standart']", { timeout: 10000 }); // Клик по селектору незабронированного места
    await page.click(".acceptin-button"); // Клик по кнопке "Забронировать"
    const movieTitle = await getText(page, ".ticket__details.ticket__title");
    expect(movieTitle).toContain("Унесенные ветром.");
  });

  test("Booking multiple tickets", async () => {
    await clickElement(page, "a:nth-child(5)"); // Выбор даты бронирования
    await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='198']"); // Выбор сеанса фильма
    await clickElement(page, "span[class='buying-scheme__chair buying-scheme__chair_standart']"); // Клик по селектору незабронированного места
    await clickElement(page, "span[class='buying-scheme__chair buying-scheme__chair_standart']"); // Клик по селектору незабронированного места
    await clickElement(page, "span[class='buying-scheme__chair buying-scheme__chair_standart']"); // Клик по селектору незабронированного места
    await page.click(".acceptin-button"); // Клик по кнопке "Забронировать"
    const movieTitle = await getText(page, ".ticket__details.ticket__title");
    expect(movieTitle).toContain("Микки маус");
  });

  test("Reservation of occupied seats", async () => {
    await clickElement(page, "a:nth-child(5)"); // Выбор даты бронирования
    await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='190']"); // Выбор сеанса фильма
    await clickElement(page, "span[class='buying-scheme__chair buying-scheme__chair_taken']"); // Клик по селектору забронированного места
    const acceptinButton = await page.$(".acceptin-button");
    const notAvailable = await acceptinButton.evaluate((btn) => btn.disabled);
    expect(notAvailable).toEqual(true);
  });
});
