import Fatura, { EnvUrl } from "./Fatura";

(async function name() {
  const fatura = Fatura.instance;

  fatura.currentMode = "TEST";
  fatura.currentUrl = EnvUrl.TEST;
  const userId = await fatura.suggestuser();
})();
