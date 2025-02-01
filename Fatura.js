"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Fatura_instance;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvUrl = void 0;
var EnvUrl;
(function (EnvUrl) {
    EnvUrl["TEST"] = "https://earsivportaltest.efatura.gov.tr/earsiv-services";
    EnvUrl["PROD"] = "https://earsivportal.efatura.gov.tr/earsiv-services";
})(EnvUrl || (exports.EnvUrl = EnvUrl = {}));
class Fatura {
    constructor() {
        this.userId = null;
        this.password = null;
        this.token = null;
        this.mode = "TEST";
        this.url = null;
    }
    static get instance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _Fatura_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _Fatura_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _Fatura_instance);
    }
    set currentMode(mode) {
        this.mode = mode;
    }
    get currentMode() {
        return this.mode;
    }
    set currentUrl(url) {
        this.url = url;
    }
    get currentUrl() {
        return this.url;
    }
    suggestuser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode === "TEST") {
                const data = new URLSearchParams();
                data.append("assoscmd", "kullaniciOner");
                data.append("rtype", "json");
                return yield fetch(`${this.url}/esign`, {
                    method: "POST",
                    body: data,
                })
                    .then((res) => res.json())
                    .then((res) => res.userid);
            }
            else {
                return Promise.reject(new Error("It's available only in TEST mode!"));
            }
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new URLSearchParams();
        });
    }
}
_a = Fatura;
_Fatura_instance = { value: void 0 };
exports.default = Fatura;
