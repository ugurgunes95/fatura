> ⚠ ⚠ Aktif olarak kullanabileceğim bir ticari hesabım olmadığı için geliştirmeye devam edemiyorum. Hata vs. gibi durumlarda destek olurken yalnızca test modunda deneyip sonuç alabildiğim konular için yardımcı olabileceğim.
# Nedir?

- ## Bu paket Fatih Kadir Akın'ın [bu reposundan](https://github.com/f/fatura) esinlenilerek, aşağıdaki gibi SSL/TLS hatasının çözülmüş hali olarak geliştirilmiştir.
  ```console
  FetchError: request to https://earsivportal.efatura.gov.tr/earsiv-services/assos-login failed, reason: write EPROTO C057F8E7447F0000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled:../deps/openssl/openssl/ssl/statem/extensions.c:922:
  ```
- Vergiye tabi mali veri(fatura) oluştururken kullanabileceğiniz, birtakım araçlar sunar.

# Nasıl Kullanılır?

- npm.js üzerinde bir modül olarak paylaşılmadığı için aşağıda belirtilen adımları izleyerek kullanabilirsiniz.

1. `Fatura.js` dosyasını kopyalayıp projenizdeki istediğiniz bir yere yapıştırın.
2. ```javascript
   const Fatura = require("./Fatura");

   const fatura = new Fatura();
   ```

   şeklinde projenize dahil edin.

# Fonksiyonlar

- Aşağıdaki tabloda arka planı kırmızı olan fonksiyonlar şu anda çalışmamaktadır.
- Çalışmama sebebini ben de bilmiyorum, earsiv test sitesinden denediğimde orada da çalışmadıklarını gördüm, dolayısıyla yapabileceğim bir şey yok.
- Çözüm bulabilirsem editleyeceğim. :)
- <a href="https://earsivportaltest.efatura.gov.tr/earsiv-services">Test Adresi</a>
<table>
<thead>

<tr> <th>Fonksiyon Adı</th><th>Açıklama</th></tr>
</thead>
<tbody>
    <tr>
        <td>enableTestMode</td>
        <td>İşlemlerinizi e-arsiv portalının test sitesi üzerinde gerçekleştirir. <a href="https://earsivportaltest.efatura.gov.tr/earsiv-services">Test Adresi</a></td>
    </tr>
    <tr>
        <td>setCredentials</td>
        <td>e-arsic portalına giriş id'si ve parolanızı parametre olarak kabul eder ve işlemlerinizde onu kullanır. (Eğer test modunu kullanacaksanız bunu atlayabilirsiniz.)</td>
    </tr>
    <tr>
        <td>getCredentials</td>
        <td>Kullanılan kullanıcı bilgilerini döndürür. (Daha çok test modunda kullanacağınız bir fonksiyon.)</td>
    </tr>
    <tr>
        <td>setTestCredentials</td>
        <td>Test modunda işlem yaparken, sizin için o an müsait olan test hesaplarından bir userId ve Parola oluşturur.</td>
    </tr>
    <tr>
        <td>login</td>
        <td>Sisteme giriş yapılmasını ve token alınmasını sağlar.</td>
    </tr>
    <tr>
        <td>logout</td>
        <td>Sistemden çıkış yapılmasını sağlar.</td>
    </tr>
    <tr>
        <td>getUserData</td>
        <td>Kullanıcı bilgilerinizi döndürür.</td>
    </tr>
    <tr>
        <td>getAllDocuments</td>
        <td>01/01/2020 tarihinden itibaren oluşturulmuş bütün dükmanları getirir.</td>
    </tr>
    <tr style="background-color: #a00">
        <td>getAllIssuedToMe</td>
        <td>Başlangıç ve bitiş tarihlerini parametre olarak alır ve o tarihler arasında adınıza kesilen belgeleri döndürür. Varsayılan tarih aralığı: 01/01/2022 - 31/12/2023</td>
    </tr>
    <tr>
        <td>getHTML</td>
        <td>Fatura uuid'sini alıp, o faturanın HTML versiyonunu döndürür.</td>
    </tr>
    <tr>
        <td>createDraft</td>
        <td>Fatura ile ilgili bilgilerin olduğu bir obje alır ve fatura oluşturur.</td>
    </tr>

</tbody>
</table>

# ÖNEMLİ

> Bu paket [Fatih Kadir Akın'ın bu adresindeki](https://github.com/f/fatura) SSL sorununu çözmek için, aynı linkten esinlenilerek oluşturulmuştur.

---

> ⚠⚠⚠ NOT: BU PAKET VERGİYE TABİ OLAN MALİ VERİ OLUŞTURUR. BU PAKET NEDENİYLE OLUŞABİLECEK SORUNLARDAN BU PAKET SORUMLU TUTULAMAZ, RİSK KULLANANA AİTTİR. RİSKLİ GÖRÜYORSANIZ KULLANMAYINIZ.

---
