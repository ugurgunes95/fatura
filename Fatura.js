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
    const userid = await this.suggestUser();
    this.userId = userid;
    this.password = 1;
  }

  async suggestUser() {
    const res = await axios.post(
      `${this.urls[this.mode]}/esign?assoscmd=kullaniciOner&rtype=json`
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
      this.getHeaders()
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
        this.getHeaders()
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
      this.getHeaders()
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
          } || {}
        ),
      },
      this.getHeaders()
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
          } || {}
        ),
      },
      this.getHeaders()
    );
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
          } || {}
        ),
      },
      this.getHeaders()
    );

    return response.data;
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
      this.getHeaders()
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
