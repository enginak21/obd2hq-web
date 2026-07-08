const fs = require('fs'); 
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')); 
en.BlogPostPage = { 
  home: 'Home', 
  blog: 'Blog', 
  affiliateDisclaimer: 'Affiliate Disclosure:', 
  affiliateText: 'Some of the links on this page are affiliate links. This means that, at zero cost to you, OBD2HQ will earn an affiliate commission if you click through the link and finalize a purchase. We only recommend products we personally test and believe will add value to our readers.' 
}; 
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2)); 

const tr = JSON.parse(fs.readFileSync('messages/tr.json', 'utf8')); 
tr.BlogPostPage = { 
  home: 'Anasayfa', 
  blog: 'Blog', 
  affiliateDisclaimer: 'Bağlı Kuruluş (Affiliate) Bildirimi:', 
  affiliateText: 'Bu sayfadaki bağlantıların bazıları satış ortaklığı linkleridir. Bu, size hiçbir ek maliyeti olmadan, linke tıklayıp satın alma işlemi yapmanız durumunda OBD2HQ\\'nun bir komisyon kazanacağı anlamına gelir. Yalnızca bizzat test ettiğimiz ve okuyucularımıza değer katacağına inandığımız ürünleri tavsiye ediyoruz.' 
}; 
fs.writeFileSync('messages/tr.json', JSON.stringify(tr, null, 2));
