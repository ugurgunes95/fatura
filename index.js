const Fatura = require("./Fatura");

const fatura = new Fatura();

(async function () {
  fatura.enableTestMode();
  await fatura.setTestCredentials();

  await fatura.login();

  // Yapmak istediğiniz işlemler...
  const faturaBilgileri = await fatura.createInvoiceObject(1000, 0.18);
  const { faturaUuid } = await fatura.createInvoiceObject(faturaBilgileri);

  const htmlInvoice = await fatura.getHTML(faturaUuid);
  // ....
  await fatura.logout();
})();
