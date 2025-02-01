export enum EnvUrl {
  TEST = "https://earsivportaltest.efatura.gov.tr/earsiv-services",
  PROD = "https://earsivportal.efatura.gov.tr/earsiv-services",
}

class Fatura {
  static #instance: Fatura;
  userId: string | null = null;
  password: string | null = null;
  token: string | null = null;
  mode: "TEST" | "PROD" = "TEST";
  url: EnvUrl | null = null;

  private constructor() {}

  public static get instance(): Fatura {
    if (!Fatura.#instance) {
      Fatura.#instance = new Fatura();
    }
    return Fatura.#instance;
  }

  public set currentMode(mode: "TEST" | "PROD") {
    this.mode = mode;
  }

  public get currentMode(): "TEST" | "PROD" {
    return this.mode;
  }

  public set currentUrl(url: EnvUrl) {
    this.url = url;
  }

  public get currentUrl(): EnvUrl | null {
    return this.url;
  }

  public async suggestuser(): Promise<{ userid: string }> {
    if (this.currentMode === "TEST") {
      const data = new URLSearchParams();
      data.append("assoscmd", "kullaniciOner");
      data.append("rtype", "json");

      return await fetch(`${this.url}/esign`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => res.userid);
    } else {
      return Promise.reject(new Error("It's available only in TEST mode!"));
    }
  }

  public async login() {
    const data = new URLSearchParams();
  }
}

export default Fatura;
