require("dotenv").config();
const crypto = require("crypto");
const https = require("https");
const axios = require("axios");
const { v4: uuid } = require("uuid");

class Fatura {
  constructor() {
    this.userId = "";
    this.password = "";
    this.token = "";
    this.mode = "PROD";
    this.assoscmd = "anologin";
    this.urls = {
      TEST: "https://earsivportaltest.efatura.gov.tr/earsiv-services",
      PROD: "https://earsivportal.efatura.gov.tr/earsiv-services",
    };
  }

  enableTestMode() {
    this.mode = "TEST";
    this.assoscmd = "login";
    return this;
  }

  async setCredentials(userId, password) {
    this.userId = userId;
    this.password = password;
    return this;
  }

  getCredentials() {
    return `*********************************************************\n*\tUser ID: ${this.userId}, Password: ${this.password}\t\t\t*\n*********************************************************`;
  }

  async setTestCredentials() {
    this.userId = await this.suggestUser();
    this.password = 1;
    return this.getCredentials();
  }

  async suggestUser() {
    const res = await axios.post(
      `${this.urls[this.mode]}/esign?assoscmd=kullaniciOner&rtype=json`,
    );
    return res.data.userid;
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  getToken() {
    return this.token;
  }

  async login() {
    const response = await axios.post(
      `${this.urls[this.mode]}/assos-login`,
      {
        assoscmd: this.assoscmd,
        userid: this.userId,
        sifre: this.password,
        sifre2: this.password,
        parola: 1,
      },
      this.getHeaders(),
    );
    this.setToken(response.data.token);
    return this;
  }

  async logout() {
    await axios
      .post(
        `${this.urls[this.mode]}/assos-login`,
        {
          assoscmd: "logout",
          token: this.token,
        },
        this.getHeaders(),
      )
      .then(() => {
        this.userId = "";
        this.password = "";
        this.token = "";
      });
    return this;
  }

  async getUserData() {
    const response = await axios.post(
      `${this.urls[this.mode]}/dispatch`,
      {
        token: this.token,
        cmd: "EARSIV_PORTAL_KULLANICI_BILGILERI_GETIR",
        pageName: "RG_KULLANICI",
      },
      this.getHeaders(),
    );

    return response.data;
  }

  async getAllDocuments() {
    const response = await axios.post(
      `${this.urls[this.mode]}/dispatch`,
      {
        callid: this.getNewUuid(),
        token: this.token,
        cmd: "EARSIV_PORTAL_TASLAKLARI_GETIR",
        pageName: "RG_TASLAKLAR",
        jp: JSON.stringify(
          {
            baslangic: "01/01/2020",
            bitis: new Date().toLocaleDateString("tr-TR"),
            hangiTip: "Buyuk",
          } || {},
        ),
      },
      this.getHeaders(),
    );
    return response.data;
  }

  async getAllIssuedToMe(baslangic, bitis) {
    const response = await axios.post(
      `${this.urls[this.mode]}/dispatch`,
      {
        callid: this.getNewUuid(),
        token: this.token,
        cmd: "EARSIV_PORTAL_ADIMA_KESILEN_BELGELERI_GETIR",
        pageName: "RG_ALICI_TASLAKLAR",
        jp: JSON.stringify(
          {
            baslangic: baslangic || "01/01/2022",
            bitis: bitis || "31/12/2023",
            hangiTip: "5000/30000",
            table: [],
          } || {},
        ),
      },
      this.getHeaders(),
    );
    console.log(response);
    return response.data;
  }

  async getHTML(faturaUuid, onayDurumu = false) {
    const response = await axios.post(
      `${this.urls[this.mode]}/dispatch`,
      {
        token: this.token,
        cmd: "EARSIV_PORTAL_FATURA_GOSTER",
        pageName: "RG_TASLAKLAR",
        jp: JSON.stringify(
          {
            ettn: faturaUuid,
            onayDurumu: onayDurumu ? "Onaylandı" : "Onaylanmadı",
          } || {},
        ),
      },
      this.getHeaders(),
    );

    return response.data;
  }

  createInvoiceObject(fiyat, kdvOrani) {
    return {
      malHizmetTable: [
        {
          malHizmet: "X Ürünü",
          miktar: 1,
          birim: "C62",
          birimFiyat: fiyat,
          kdvOrani: kdvOrani,
          fiyat: fiyat,
          iskontoArttm: "Iskonto",
          iskontoOrani: 0,
          iskontoTutari: 0,
          iskontoNedeni: "",
          malHizmetTutari: fiyat,
          kdvTutari: fiyat * kdvOrani,
          tevkifatKodu: 0,
          ozelMatrahNedeni: 0,
          ozelMatrahTutari: 0,
          gtip: "",
        },
      ],
      faturaUuid: this.getNewUuid(),
      faturaTarihi: new Date().toLocaleDateString("tr-TR").replace(/\./g, "/"),
      saat: new Date().toLocaleTimeString("tr-TR"),
      vknTckn: "11111111111",
      aliciAdi: "Ugur",
      aliciSoyadi: "Gunes",
      mahalleSemtIlce: "Uskudar",
      sehir: "İstanbul",
      ulke: "Turkiye",
      hangiTip: "5000/30000",
      belgeNumarasi: "",
      paraBirimi: "TRY",
      dovzTLkur: "",
      faturaTipi: "SATIS",
      siparisNumarasi: "",
      siparisTarihi: "",
      irsaliyeNumarasi: "",
      irsaliyeTarihi: "",
      fisNo: "",
      fisTarihi: "",
      fisSaati: "",
      fisTipi: "",
      zRaporNo: "",
      okcSeriNo: "",
      aliciUnvan: "Y Insaat Malzemeleri San. Tic. Ltd. Sti.",
      bulvarcaddesokak: "Izmir Yolu Cd. No:212/B",
      binaAdi: "",
      binaNo: "",
      kapiNo: "",
      kasabaKoy: "",
      postaKodu: "",
      tel: "",
      fax: "",
      eposta: "",
      websitesi: "",
      vergiDairesi: "Cekirge VD",
      iadeTable: [],
      not: "",
      matrah: fiyat,
      malhizmetToplamTutari: fiyat,
      toplamIskonto: 0,
      hesaplanankdv: fiyat * 0.18,
      vergilerToplami: fiyat * 0.18,
      vergilerDahilToplamTutar: fiyat + fiyat * 0.18,
      toplamMasraflar: 0,
      odenecekTutar: fiyat + fiyat * 0.18,
    };
  }

  async createDraft(faturaBilgileri) {
    return await axios.post(
      `${this.urls[this.mode]}/dispatch`,
      {
        token: this.token,
        cmd: "EARSIV_PORTAL_FATURA_OLUSTUR",
        pageName: "RG_BASITFATURA",
        jp: JSON.stringify(faturaBilgileri || {}),
      },
      this.getHeaders(),
    );
  }

  getHeaders() {
    return {
      headers: {
        accept: "*/*",
        "accept-language": "tr,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        pragma: "no-cache",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        proxy: false,
      },
      httpsAgent: new https.Agent({
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      }),
    };
  }

  getNewUuid() {
    return uuid();
  }
}

module.exports = Fatura;
