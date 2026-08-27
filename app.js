// ===== HELPERS =====
// XSS protection — escape HTML entities in user-supplied content
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ===== DATA =====
const PRODUCTS = {
  mobiles: [
    { id: 'm1', brand: 'Samsung', name: 'Galaxy Z Fold 6', desc: '7.6" Dynamic AMOLED 2X · Armor Aluminum · Snapdragon 8 Gen 4 · 12GB RAM', price: 219999, old: 239999, badge: 'Hot', emoji: '📱', bg: 'linear-gradient(135deg,#0f2027,#203a43)', rating: 4.8, reviews: 1102 },
    { id: 'm2', brand: 'Apple', name: 'iPhone 17 Pro Max', desc: 'A19 Pro · 48MP Tetraprism · Titanium · ProMotion 120Hz · Apple AI', price: 199999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#2c2c2c,#1a1a1a)', rating: 4.9, reviews: 4120 },
    { id: 'm3', brand: 'Apple', name: 'iPhone 17 Pro', desc: 'A19 Pro · 48MP Fusion Camera · ProMotion · Ceramic Shield · Apple AI', price: 174999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#3a3a3a,#1c1c1c)', rating: 4.9, reviews: 3450 },
    { id: 'm4', brand: 'Apple', name: 'iPhone 16 Pro Max', desc: 'A18 Pro Bionic · 48MP Pro Camera System · Titanium · Action Button', price: 169999, old: 179999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#434343,#000000)', rating: 4.9, reviews: 5120 },
    { id: 'm5', brand: 'Apple', name: 'iPhone 17', desc: 'A19 Chip · 48MP Camera · Dynamic Island · USB-C · Aluminum Design', price: 139999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#b0bec5,#78909c)', rating: 4.8, reviews: 2890 },
    { id: 'm6', brand: 'Samsung', name: 'Galaxy S26 Ultra', desc: '200MP ProVisual Camera · Snapdragon 8 Elite · S Pen · AI Galaxy Features', price: 134999, old: 149999, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#0d0d2b,#1a1a4e)', rating: 4.9, reviews: 6230 },
    { id: 'm7', brand: 'Apple', name: 'iPhone 16', desc: 'A18 Chip · 48MP · Dynamic Island · USB-C · Action Button', price: 129999, old: 139999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#b0bec5,#607d8b)', rating: 4.8, reviews: 3980 },
    { id: 'm8', brand: 'Google', name: 'Pixel 9 Pro XL', desc: 'Gemini Nano Built-in · Advanced AI Night Sight · Tensor G4 Chip', price: 119999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#E0EAFC,#CFDEF3)', rating: 4.7, reviews: 1205 },
    { id: 'm9', brand: 'Samsung', name: 'Galaxy S25 Ultra', desc: '200MP Camera · AI Features · Snapdragon 8 Gen 4 · Titanium Frame', price: 109999, old: 129999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', rating: 4.8, reviews: 2341 },
    { id: 'm10', brand: 'Xiaomi', name: '15 Ultra', desc: '1" Leica Summilux Quad Camera · Snapdragon 8 Elite · 120W HyperCharge', price: 99999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#ff4e50,#f9d423)', rating: 4.8, reviews: 1540 },
    { id: 'm11', brand: 'Vivo', name: 'X200 Pro', desc: '50MP Zeiss Telephoto · 6000mAh · 90W FlashCharge · Dimensity 9400', price: 89999, old: 94999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#1CB5E0,#000851)', rating: 4.6, reviews: 845 },
    { id: 'm12', brand: 'OPPO', name: 'Find X8 Pro', desc: 'Hasselblad Quad Camera · MediaTek Dimensity 9400 · 80W SuperVOOC', price: 79999, old: 89999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#a8ff78,#78ffd6)', rating: 4.6, reviews: 720 },
    { id: 'm13', brand: 'Xiaomi', name: '15', desc: 'Leica Optics · Snapdragon 8 Elite · 90W HyperCharge · 6.36" LTPO AMOLED', price: 69999, old: 74999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#c33764,#1d2671)', rating: 4.7, reviews: 1230 },
    { id: 'm14', brand: 'Realme', name: 'GT 7 Pro', desc: 'Sony IMX890 · 6.78" 144Hz AMOLED · 5500mAh Massive Battery', price: 54999, old: null, badge: 'Hot', emoji: '📱', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.5, reviews: 678 },
    { id: 'm15', brand: 'OnePlus', name: '13R 5G', desc: 'Hasselblad Camera · Snapdragon 8s Gen 3 · 100W SuperVOOC', price: 49999, old: 54999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', rating: 4.7, reviews: 934 },
    { id: 'm16', brand: 'Samsung', name: 'Galaxy A56 5G', desc: '50MP OIS · IP67 · 6.7" SuperAMOLED 120Hz · Exynos 1580 · 5000mAh', price: 44999, old: 49999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', rating: 4.6, reviews: 2450 },
    { id: 'm17', brand: 'iQOO', name: 'Z10 Turbo Pro', desc: 'Dimensity 9300 · 144Hz AMOLED · 6000mAh · 80W FlashCharge · OIS Camera', price: 39999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#e44d26,#f16529)', rating: 4.6, reviews: 1890 },
    { id: 'm18', brand: 'Xiaomi', name: 'Redmi Note 14 Pro', desc: '108MP OIS · 120Hz AMOLED · 5000mAh · 67W Turbo Charge', price: 32999, old: null, badge: 'New', emoji: '📱', bg: 'linear-gradient(135deg,#ff6b6b,#ee0979)', rating: 4.6, reviews: 1876 },
    { id: 'm19', brand: 'Poco', name: 'X7 Pro 5G', desc: 'Dimensity 8400 Ultra · 120Hz Flow AMOLED · 6000mAh · 90W Turbo', price: 29999, old: 34999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', rating: 4.5, reviews: 3450 },
    { id: 'm20', brand: 'Realme', name: 'C75 5G', desc: '50MP AI Camera · 6.72" 90Hz · 5000mAh · IP69 Rating · ArmorShell', price: 14999, old: 16999, badge: 'Sale', emoji: '📱', bg: 'linear-gradient(135deg,#43cea2,#185a9d)', rating: 4.3, reviews: 5670 },
    { id: 'm21', brand: 'Tecno', name: 'Spark 30 Pro', desc: '108MP Triple Camera · 6.78" 120Hz · 5000mAh · 33W Fast Charge', price: 13999, old: null, badge: 'Hot', emoji: '📱', bg: 'linear-gradient(135deg,#0575E6,#021B79)', rating: 4.2, reviews: 2340 },
  ],
  laptops: [
    { id: 'l1', brand: 'Razer', name: 'Blade 16', desc: 'RTX 4090 16GB · Mini-LED Dual-Mode · CNC Aluminum', price: 459999, old: 489999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.8, reviews: 450 },
    { id: 'l2', brand: 'Apple', name: 'MacBook Pro 16" M3 Max', desc: 'M3 Max 16-core · 40-core GPU · 48GB · Liquid Retina XDR', price: 420999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#232526,#414345)', rating: 5.0, reviews: 1120 },
    { id: 'l3', brand: 'MSI', name: 'Titan GT77 HX', desc: 'RTX 4090 · i9 · 64GB · 4K 144Hz', price: 379999, old: 399999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', rating: 4.8, reviews: 310 },
    { id: 'l4', brand: 'Dell', name: 'Alienware m18', desc: 'RTX 4090 · i9 · 18" QHD+ 480Hz', price: 349999, old: 379999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#2980B9,#6DD5FA)', rating: 4.8, reviews: 440 },
    { id: 'l5', brand: 'Acer', name: 'Predator Helios 18', desc: 'RTX 4080 · Mini-LED 250Hz · i9-14900HX · RGB', price: 319999, old: null, badge: 'Hot', emoji: '💻', bg: 'linear-gradient(135deg,#141e30,#243b55)', rating: 4.8, reviews: 215 },
    { id: 'l6', brand: 'ASUS', name: 'ROG Strix G18 2026', desc: 'RTX 5080 · i9-15900HX · 32GB DDR5 · 18" 2K 300Hz', price: 289999, old: 319999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#200122,#6f0000)', rating: 4.8, reviews: 520 },
    { id: 'l7', brand: 'MSI', name: 'Creator Z16 HX', desc: 'RTX 4070 · i9 · 16" QHD+ · Creator Pro', price: 254999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#56ab2f,#a8e063)', rating: 4.7, reviews: 290 },
    { id: 'l8', brand: 'Apple', name: 'MacBook Pro 14" M4 Pro', desc: 'M4 Pro · 24GB · 512GB · Liquid Retina XDR', price: 229999, old: 249999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#b0bec5,#607d8b)', rating: 4.9, reviews: 2780 },
    { id: 'l9', brand: 'ASUS', name: 'ROG Zephyrus G16', desc: 'RTX 4070 · i9-14900H · 32GB · 2K 240Hz', price: 219999, old: 249999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#0f0c29,#302b63)', rating: 4.9, reviews: 412 },
    { id: 'l10', brand: 'ASUS', name: 'Zenbook Duo', desc: 'Dual 14" 3K OLED · Intel Core Ultra 9 · Detachable KB', price: 199999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#BBD2C5,#536976)', rating: 4.9, reviews: 180 },
    { id: 'l11', brand: 'Lenovo', name: 'Yoga Book 9i Gen 2', desc: 'Dual 13.3" 2.8K OLED · Intel Core Ultra 7 · 16GB', price: 179999, old: 199999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#4e54c8,#8f94fb)', rating: 4.7, reviews: 380 },
    { id: 'l12', brand: 'Dell', name: 'XPS 15 OLED', desc: 'Intel i7-13700H · 16GB RAM · 512GB · OLED Touch', price: 174999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', rating: 4.7, reviews: 890 },
    { id: 'l13', brand: 'HP', name: 'OMEN 16', desc: 'RTX 4070 · i7 · 16GB · 165Hz · OMEN Tempest', price: 164999, old: null, badge: 'Hot', emoji: '💻', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', rating: 4.6, reviews: 760 },
    { id: 'l14', brand: 'HP', name: 'Spectre x360', desc: 'Touch · OLED · 360° Hinge · Intel Evo i7', price: 159999, old: null, badge: 'Hot', emoji: '💻', bg: 'linear-gradient(135deg,#667eea,#764ba2)', rating: 4.8, reviews: 734 },
    { id: 'l15', brand: 'Apple', name: 'MacBook Air M5', desc: 'M5 Chip · 24GB · 512GB SSD · 22hr Battery · Liquid Retina', price: 149999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#c9d6ff,#e2e2e2)', rating: 4.9, reviews: 4280 },
    { id: 'l16', brand: 'Lenovo', name: 'ThinkPad X1 Carbon', desc: 'Ultra-light · 12th Gen · 14" 2K IPS · 24hr Battery', price: 149999, old: 169999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', rating: 4.6, reviews: 562 },
    { id: 'l17', brand: 'HP', name: 'Pavilion Plus 14', desc: 'Intel Core Ultra 7 · 2.8K OLED · 16GB · 512GB SSD', price: 134999, old: 149999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#ee9ca7,#ffdde1)', rating: 4.6, reviews: 890 },
    { id: 'l18', brand: 'Lenovo', name: 'Legion 5 Pro', desc: 'RTX 4060 · Ryzen 7 · 16" 2560x1600 165Hz', price: 134999, old: 149999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#FC5C7D,#6A3093)', rating: 4.7, reviews: 1240 },
    { id: 'l19', brand: 'Microsoft', name: 'Surface Pro 11', desc: 'Snapdragon X Elite · OLED PixelSense · Copilot+ AI', price: 129999, old: 139999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#3A1C71,#D76D77)', rating: 4.7, reviews: 320 },
    { id: 'l20', brand: 'Apple', name: 'MacBook Air M4', desc: 'M4 Chip · 16GB RAM · 256GB SSD · 18hr Battery', price: 124999, old: null, badge: 'New', emoji: '💻', bg: 'linear-gradient(135deg,#e0e0e0,#9e9e9e)', rating: 4.9, reviews: 3120 },
    { id: 'l21', brand: 'Acer', name: 'Nitro V 15', desc: 'RTX 4060 · i7-14650HX · 16GB DDR5 · 165Hz · Wi-Fi 7', price: 119999, old: 134999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#000428,#004e92)', rating: 4.6, reviews: 1450 },
    { id: 'l22', brand: 'ASUS', name: 'ZenBook 14 OLED', desc: 'Intel Evo · i7 · OLED 2.8K · Ultra-portable', price: 99999, old: 114999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.7, reviews: 980 },
    { id: 'l23', brand: 'Lenovo', name: 'IdeaPad Slim 5', desc: 'Snapdragon X Plus · 14" 2.8K OLED · 16GB · 512GB', price: 89999, old: 99999, badge: 'Sale', emoji: '💻', bg: 'linear-gradient(135deg,#c9d6ff,#e2e2e2)', rating: 4.5, reviews: 2340 },
  ],
  chargers: [
    { id: 'c1', brand: 'UGREEN', name: 'Nexode 300W GaN Desktop', desc: '5 Ports · 300W Total · PD3.1 · Smart Display · Cooling Fan', price: 14999, old: 17999, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#0cebeb,#20e3b2)', rating: 4.8, reviews: 1120 },
    { id: 'c2', brand: 'Belkin', name: 'BoostCharge Pro 3-in-1', desc: '15W MagSafe · Charges iPhone, Watch & AirPods Simultaneously', price: 12999, old: 14999, badge: 'Hot', emoji: '🔋', bg: 'linear-gradient(135deg,#bdc3c7,#2c3e50)', rating: 4.8, reviews: 1205 },
    { id: 'c3', brand: 'Anker', name: 'Prime 250W Desktop', desc: '6 Ports · 250W Total · AI Smart Power Distribution · LED Display', price: 11999, old: 13999, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#ff512f,#dd2476)', rating: 4.9, reviews: 2340 },
    { id: 'c4', brand: 'Anker', name: 'Prime 200W Desktop Charger', desc: '6 Ports · 200W Total · AI Power Distribution', price: 8999, old: 10999, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', rating: 4.9, reviews: 1890 },
    { id: 'c5', brand: 'Baseus', name: '100W USB-C Car Charger', desc: 'Dual USB-C · PD 100W + 30W · LED Display · Car Fast Charge', price: 5999, old: 7499, badge: 'Sale', emoji: '🔌', bg: 'linear-gradient(135deg,#0f2027,#203a43)', rating: 4.7, reviews: 1560 },
    { id: 'c6', brand: 'Anker', name: 'Prime 67W GaN', desc: 'Ultra-Compact · 3 Ports · ActiveShield 2.0 Temperature Control', price: 5499, old: null, badge: 'New', emoji: '🔌', bg: 'linear-gradient(135deg,#7F00FF,#E100FF)', rating: 4.7, reviews: 890 },
    { id: 'c7', brand: 'UGREEN', name: '100W USB-C Hub Charger', desc: 'PD 100W · 4-Port Hub · Data + Power', price: 5499, old: 6499, badge: 'Sale', emoji: '🔌', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.6, reviews: 980 },
    { id: 'c8', brand: 'Anker', name: '140W USB-C GaN Charger', desc: '3 Ports · GaN III · Compact Design', price: 4999, old: 6499, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', rating: 4.9, reviews: 5234 },
    { id: 'c9', brand: 'Apple', name: 'MagSafe Charger 2m', desc: '15W · USB-C to MagSafe 3 · 2m Cable', price: 4499, old: null, badge: 'New', emoji: '🔌', bg: 'linear-gradient(135deg,#b0bec5,#607d8b)', rating: 4.6, reviews: 4120 },
    { id: 'c10', brand: 'Apple', name: '35W Dual USB-C Charger', desc: '35W · Dual USB-C · Compact · MFi Certified', price: 3999, old: null, badge: 'New', emoji: '🔌', bg: 'linear-gradient(135deg,#e0e0e0,#9e9e9e)', rating: 4.7, reviews: 2310 },
    { id: 'c11', brand: 'Xiaomi', name: 'HyperCharge 120W GaN', desc: 'Single USB-C · 120W Max · PD3.1 · Foldable Plug', price: 3499, old: null, badge: 'New', emoji: '⚡', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', rating: 4.7, reviews: 1890 },
    { id: 'c12', brand: 'Anker', name: 'MagGo 15W Wireless Stand', desc: 'MagSafe Compatible · 15W · Adjustable Stand', price: 3499, old: 3999, badge: 'Sale', emoji: '🔋', bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', rating: 4.8, reviews: 2670 },
    { id: 'c13', brand: 'Xiaomi', name: '67W GaN Turbo Charger', desc: 'Single USB-C · GaN Tech · PD3.0 · Xiaomi/Redmi/Poco', price: 3499, old: 3999, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', rating: 4.6, reviews: 4560 },
    { id: 'c14', brand: 'UGREEN', name: '65W Nexode Pro', desc: '4 Ports · Fast Charge · PD3.0', price: 3299, old: null, badge: 'New', emoji: '🔌', bg: 'linear-gradient(135deg,#10b981,#059669)', rating: 4.7, reviews: 3120 },
    { id: 'c15', brand: 'Baseus', name: '30W MagSafe Wireless', desc: 'MagSafe · Qi2 · 15W Wireless · Stand', price: 2999, old: 3999, badge: 'Sale', emoji: '🔋', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', rating: 4.6, reviews: 2089 },
    { id: 'c16', brand: 'Samsung', name: '45W Super Fast Charger', desc: 'USB-C · PPS · Compatible with Galaxy Series', price: 2499, old: null, badge: 'Hot', emoji: '⚡', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', rating: 4.8, reviews: 4567 },
    { id: 'c17', brand: 'Baseus', name: '65W GaN Mini Charger', desc: 'Single USB-C · GaN · Ultra-compact · PD3.0', price: 1999, old: 2499, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#FC5C7D,#6A3093)', rating: 4.7, reviews: 3450 },
    { id: 'c18', brand: 'Apple', name: '20W USB-C Power Adapter', desc: 'Official Apple Charger · Fast Charge for iPhone & iPad', price: 1999, old: 2499, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#E0EAFC,#CFDEF3)', rating: 4.9, reviews: 9876 },
    { id: 'c19', brand: 'Samsung', name: '15W Wireless Charger Pad', desc: 'Qi2 Wireless · LED Indicator · Anti-slip Pad', price: 1999, old: null, badge: 'Hot', emoji: '🔋', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', rating: 4.5, reviews: 6780 },
    { id: 'c20', brand: 'Realme', name: '33W SuperDart Charger', desc: 'USB-C · 33W VOOC · Compatible with Realme/OPPO Devices', price: 1499, old: 1799, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', rating: 4.5, reviews: 3890 },
    { id: 'c21', brand: 'UGREEN', name: '25W Samsung Fast Charger', desc: '25W USB-C · AFC · Compatible Galaxy & More', price: 1499, old: 1799, badge: 'Sale', emoji: '⚡', bg: 'linear-gradient(135deg,#56ab2f,#a8e063)', rating: 4.7, reviews: 5890 },
  ],
  accessories: [
    { id: 'a1', brand: 'Apple', name: 'Vision Pro 2', desc: 'M5 Chip · Micro-OLED · Spatial Computing · EyeSight · 3D Video', price: 499999, old: null, badge: 'New', emoji: '🥽', bg: 'linear-gradient(135deg,#ece9e6,#ffffff)', rating: 4.8, reviews: 890 },
    { id: 'a2', brand: 'Apple', name: 'Apple Watch Series 10', desc: '46mm · Always-On Retina · ECG · Crash Detection', price: 49999, old: null, badge: 'New', emoji: '⌚', bg: 'linear-gradient(135deg,#b0bec5,#607d8b)', rating: 4.8, reviews: 9870 },
    { id: 'a3', brand: 'Sony', name: 'WH-1000XM6', desc: 'Industry-leading ANC · 40hr Battery · Hi-Res Audio · Multi-point', price: 34999, old: 39999, badge: 'Sale', emoji: '🎧', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', rating: 4.9, reviews: 8901 },
    { id: 'a4', brand: 'Samsung', name: 'Galaxy Ring 2', desc: 'Titanium Body · Sleep & Health Tracking · 7-Day Battery · IP68', price: 34999, old: null, badge: 'New', emoji: '💍', bg: 'linear-gradient(135deg,#c33764,#1d2671)', rating: 4.7, reviews: 1890 },
    { id: 'a5', brand: 'Samsung', name: 'Galaxy Watch 7', desc: 'Health Tracking · BioActive Sensor · 40mm Sapphire Crystal', price: 29999, old: null, badge: 'New', emoji: '⌚', bg: 'linear-gradient(135deg,#FC5C7D,#6A3093)', rating: 4.7, reviews: 3456 },
    { id: 'a6', brand: 'Apple', name: 'AirPods Pro 2', desc: 'Active ANC · H2 Chip · USB-C · 30hr Total Battery', price: 29999, old: 32999, badge: 'Sale', emoji: '🎧', bg: 'linear-gradient(135deg,#e0e0e0,#9e9e9e)', rating: 4.9, reviews: 12400 },
    { id: 'a7', brand: 'Sony', name: 'WF-1000XM5', desc: 'Truly Wireless ANC · 8hr · Hi-Res · Speak-to-Chat', price: 24999, old: 28999, badge: 'Sale', emoji: '🎵', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', rating: 4.8, reviews: 6230 },
    { id: 'a8', brand: 'Apple', name: 'Apple Watch Ultra 2', desc: '49mm Titanium · Dual-frequency GPS · 36hr Battery · S9 SiP · 100m Water', price: 24999, old: null, badge: 'Hot', emoji: '⌚', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', rating: 4.9, reviews: 4560 },
    { id: 'a9', brand: 'Samsung', name: 'Galaxy Buds 3 Pro', desc: 'ANC · 360° Audio · IPX7 · 30hr Total Battery', price: 19999, old: 22999, badge: 'Sale', emoji: '🎧', bg: 'linear-gradient(135deg,#2980B9,#6DD5FA)', rating: 4.6, reviews: 4560 },
    { id: 'a10', brand: 'DJI', name: 'Osmo Mobile 6', desc: '3-Axis Gimbal · ActiveTrack 6.0 · Built-in Extension Rod', price: 16999, old: 18999, badge: 'Sale', emoji: '📹', bg: 'linear-gradient(135deg,#4CA1AF,#C4E0E5)', rating: 4.8, reviews: 2150 },
    { id: 'a11', brand: 'Anker', name: 'PowerCore 24K', desc: '140W Two-Way Fast Charge · 24000mAh · Smart Display', price: 14999, old: null, badge: 'Hot', emoji: '🔋', bg: 'linear-gradient(135deg,#f12711,#f5af19)', rating: 4.8, reviews: 3210 },
    { id: 'a12', brand: 'Nothing', name: 'Ear (3)', desc: 'Hi-Res ANC · ChatGPT Integration · 42dB Noise Cancellation · LHDC 5.0', price: 12999, old: 14999, badge: 'Sale', emoji: '🎧', bg: 'linear-gradient(135deg,#000000,#434343)', rating: 4.6, reviews: 3210 },
    { id: 'a13', brand: 'Logitech', name: 'MX Keys S', desc: 'Backlit · Bluetooth · Multi-device · Smart Actions', price: 12999, old: null, badge: 'New', emoji: '⌨️', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.7, reviews: 3210 },
    { id: 'a14', brand: 'Xiaomi', name: 'Watch S4', desc: '1.43" AMOLED · SpO2 · GPS · Bluetooth Call · 15-Day Battery · 150+ Modes', price: 12999, old: 14999, badge: 'Sale', emoji: '⌚', bg: 'linear-gradient(135deg,#c33764,#1d2671)', rating: 4.6, reviews: 3450 },
    { id: 'a15', brand: 'Apple', name: 'AirTag (4 Pack)', desc: 'Precision Finding · Ultra Wideband · IP67 Water Resistant', price: 10999, old: 11999, badge: 'Hot', emoji: '🏷️', bg: 'linear-gradient(135deg,#d7d2cc,#304352)', rating: 4.9, reviews: 22300 },
    { id: 'a16', brand: 'Logitech', name: 'MX Master 3S', desc: '8K DPI · Silent Clicks · Bluetooth · Ergonomic', price: 9999, old: null, badge: 'Hot', emoji: '🖱️', bg: 'linear-gradient(135deg,#56ab2f,#a8e063)', rating: 4.8, reviews: 7123 },
    { id: 'a17', brand: 'JBL', name: 'Live Pro 2 TWS', desc: 'True ANC · 10hr · IPX5 · Smart Ambient', price: 8999, old: 12999, badge: 'Sale', emoji: '🎵', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', rating: 4.6, reviews: 5670 },
    { id: 'a18', brand: 'Anker', name: 'Soundcore Q45', desc: '50mm Drivers · LDAC Hi-Res · 50hr Battery · ANC · Multi-point BT', price: 7999, old: 9999, badge: 'Sale', emoji: '🎧', bg: 'linear-gradient(135deg,#000428,#004e92)', rating: 4.7, reviews: 5670 },
    { id: 'a19', brand: 'JBL', name: 'Clip 5 Portable Speaker', desc: 'IP67 · 12hr Battery · Carabiner · Bold Sound', price: 5999, old: 6999, badge: 'Sale', emoji: '🔊', bg: 'linear-gradient(135deg,#FC5C7D,#6A3093)', rating: 4.6, reviews: 4320 },
    { id: 'a20', brand: 'Xiaomi', name: 'Smart Band 9 Pro', desc: '1.74" AMOLED · SpO2 · 21-Day Battery · GPS', price: 4999, old: 5999, badge: 'Sale', emoji: '⌚', bg: 'linear-gradient(135deg,#f953c6,#b91d73)', rating: 4.5, reviews: 8920 },
    { id: 'a21', brand: 'Xiaomi', name: 'Redmi Buds 6 Pro', desc: 'ANC 55dB · 38hr Total · LDAC · Dual Driver', price: 3999, old: 4999, badge: 'Sale', emoji: '🎵', bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', rating: 4.5, reviews: 7890 },
  ],
  drones: [
    { id: 'd1', brand: 'DJI', name: 'Mavic 3 Pro', desc: 'Triple-Camera System · 4/3 CMOS Hasselblad Camera · 43-Min Flight Time · 15km O3+ HD Video', price: 249999, old: 269999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#1f1c2c,#928dab)', rating: 4.9, reviews: 1240 },
    { id: 'd2', brand: 'DJI', name: 'Air 3S', desc: 'Dual 1" CMOS Primary Camera · 48MP HDR · 45-Min Flight · Omnidirectional Obstacle Sensing', price: 134999, old: 149999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#3a6186,#89253e)', rating: 4.8, reviews: 920 },
    { id: 'd3', brand: 'DJI', name: 'Avata 2', desc: 'FPV Drone · 1/1.3" CMOS Super-Wide 4K/60fps · 23-Min Flight · ACRO Tricks & Motion Controller', price: 119999, old: null, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#2C3E50,#FD746C)', rating: 4.8, reviews: 645 },
    { id: 'd4', brand: 'DJI', name: 'Mini 4 Pro', desc: 'Under 249g Ultra-Light · Omnidirectional Sensing · 4K/60fps HDR True Vertical Shooting', price: 99999, old: null, badge: 'New', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#FFAF7B,#D76D77)', rating: 4.8, reviews: 890 },
    { id: 'd5', brand: 'Autel', name: 'EVO Nano+', desc: '249g · 1/1.28" CMOS 50MP RYYB Color Array · PDAF+CDAF Autofocus · 28-Min Flight', price: 84999, old: 94999, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#eb3349,#f45c43)', rating: 4.7, reviews: 512 },
    { id: 'd6', brand: 'DJI', name: 'Inspire 3', desc: 'Full-Frame 8K Cinema Drone · ProRes RAW / CinemaDNG · RTK Centimeter-level Positioning', price: 999999, old: 1050000, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#000000,#434343)', rating: 5.0, reviews: 180 },
    { id: 'd7', brand: 'Autel', name: 'EVO Lite+', desc: '6K 30fps Video · 1" CMOS Sensor · 40-Min Flight · Dynamic Track 2.1 · 12km Transmission', price: 149999, old: 164999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#f857a6,#ff5858)', rating: 4.7, reviews: 340 },
    { id: 'd8', brand: 'Autel', name: 'EVO II Pro V3', desc: '6K 1" Sony Sensor · 12-bit A-Log · 360° Obstacle Avoidance · 42-Min Flight', price: 219999, old: 239999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#4e54c8,#8f94fb)', rating: 4.8, reviews: 420 },
    { id: 'd9', brand: 'Skydio', name: 'Skydio 2+ Cinema Kit', desc: 'Autonomous 360° AI Tracking & Follow-Me · 4K60 HDR · KeyFrame Flight Paths', price: 189999, old: null, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#0f2027,#203a43)', rating: 4.8, reviews: 290 },
    { id: 'd10', brand: 'DJI', name: 'Mini 3 Fly More Combo', desc: 'Under 249g · 4K HDR · 38-Min Battery · True Vertical Shooting · Level 5 Wind Resistance', price: 69999, old: 79999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', rating: 4.7, reviews: 1450 },
    { id: 'd11', brand: 'DJI', name: 'Neo Compact Drone', desc: '135g Palm Takeoff & Landing · AI Subject Tracking · 4K Ultra-Stabilized Video', price: 27999, old: 32999, badge: 'New', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#fc4a1a,#f7b733)', rating: 4.6, reviews: 830 },
    { id: 'd12', brand: 'Holy Stone', name: 'HS720G 2-Axis Gimbal', desc: '4K EIS Camera · 2-Axis Gimbal · Brushless Motor · GPS Auto Return · 26-Min Flight', price: 39999, old: 45999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#2980b9,#2c3e50)', rating: 4.4, reviews: 920 },
    { id: 'd13', brand: 'Holy Stone', name: 'HS175D 4K GPS Drone', desc: '4K Ultra HD Camera · GPS Assisted Flight · Optical Flow Positioning · 46-Min (2 Batteries)', price: 24999, old: 29999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#373b44,#4286f4)', rating: 4.3, reviews: 1120 },
    { id: 'd14', brand: 'Holy Stone', name: 'HS440 Foldable FPV', desc: '1080P HD Auto-Adjustable Camera · 20-Min Flight · Gravity Sensor · Voice Control', price: 14999, old: 17999, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#8e2de2,#4a00e0)', rating: 4.3, reviews: 750 },
    { id: 'd15', brand: 'BetaFPV', name: 'Cetus Pro FPV Kit', desc: 'Ready to Fly FPV Drone · Includes VR02 FPV Goggles + LiteRadio 2 SE Transmitter', price: 34999, old: 39999, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#ff416c,#ff4b2b)', rating: 4.7, reviews: 580 },
    { id: 'd16', brand: 'BetaFPV', name: 'Pavo20 Whoop Quadcopter', desc: 'HD Digital VTX Support · Pocket-Sized Cinematic Cinewhoop · Carbon Fiber Frame', price: 21999, old: null, badge: 'New', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#134e5e,#71b280)', rating: 4.6, reviews: 310 },
    { id: 'd17', brand: 'DJI', name: 'Mavic 3 Classic', desc: '4/3 CMOS Hasselblad 5.1K HD · 46-Min Flight Time · Omnidirectional Obstacle Sensing', price: 169999, old: 184999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#005aa7,#fffde4)', rating: 4.9, reviews: 840 },
    { id: 'd18', brand: 'DJI', name: 'Matrice 350 RTK', desc: 'Commercial Enterprise Grade · 55-Min Flight · IP55 Weatherproof · 2.7kg Payload Support', price: 849999, old: null, badge: 'Hot', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#141e30,#243b55)', rating: 5.0, reviews: 95 },
    { id: 'd19', brand: 'Autel', name: 'EVO Max 4T', desc: 'Triple Optical + Thermal + Night Vision Zoom · Autonomous Obstacle Avoidance · A-Mesh 1.0', price: 699999, old: null, badge: 'New', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#e65c00,#F9D423)', rating: 4.9, reviews: 110 },
    { id: 'd20', brand: 'DJI', name: 'FPV Combo 4K', desc: '140km/h High-Speed Racing Drone · 150° Super-Wide FOV 4K/60fps · Emergency Brake & Hover', price: 109999, old: 124999, badge: 'Sale', emoji: '🚁', img: 'drone.png', bg: 'linear-gradient(135deg,#cc2b5e,#753a88)', rating: 4.7, reviews: 740 },
  ]
};

// ===== CART (IndexedDB-powered via db.js) =====
// Legacy compat — cart array kept in-memory for fast UI rendering
let cart = [];

async function loadCart() {
  try {
    cart = await dbGetCart();
  } catch(e) {
    cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
  }
  updateCartUI();
}

async function addToCart(nameOrId, price, emoji = '🛍️') {
  try {
    let productId = nameOrId;
    let productName = nameOrId;
    let productPrice = price;
    let productEmoji = emoji;

    if (typeof PRODUCTS !== 'undefined') {
      for (const [cat, items] of Object.entries(PRODUCTS)) {
        const found = items.find(p => p.id === nameOrId || p.name === nameOrId);
        if (found) {
          productId = found.id;
          productName = found.name;
          productPrice = found.price;
          productEmoji = found.emoji || emoji;
          break;
        }
      }
    }
    await dbAddToCart(productId, productName, productPrice, productEmoji);
    await loadCart();
    showToast('Added to cart ✓');
  } catch(e) {
    console.error('Add to cart error:', e);
  }
}

async function removeFromCart(id) {
  try {
    await dbRemoveFromCart(id);
    await loadCart();
  } catch(e) {
    console.error('Remove from cart error:', e);
  }
}

async function changeQty(id, delta) {
  try {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    await dbUpdateCartQty(id, item.qty + delta);
    await loadCart();
  } catch(e) {
    console.error('Change qty error:', e);
  }
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
  renderCartBody();
}

// Fixed: createEmptyEl now properly defined as fallback
function createEmptyEl() {
  const div = document.createElement('div');
  div.className = 'cart-empty';
  div.innerHTML = '<div class="empty-icon">🛍️</div><p>Your cart is empty</p>';
  return div;
}

function renderCartBody() {
  const body = document.getElementById('cartBody');
  const empty = document.getElementById('cartEmpty');
  const footer = document.getElementById('cartFooter');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '';
    body.appendChild(empty || createEmptyEl());
    if (footer) footer.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';

  let subtotal = 0, savings = 0;
  let html = '';
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    if (item.oldPrice) savings += (item.oldPrice - item.price) * item.qty;

    const safeName = escapeHtml(item.name);
    const safeBrand = escapeHtml(item.brand);
    const safeDesc = escapeHtml(item.desc);
    const safeId = escapeHtml(item.id);
    const iconContent = item.img
      ? `<img src="${escapeHtml(item.img)}" alt="${safeName}" />`
      : (item.emoji || '🛍️');

    html += `<div class="cart-item">
      <div class="cart-item-icon" style="background:${item.bg ? item.bg.replace(/["'<>]/g,'') : 'rgba(99,102,241,.1)'}">${iconContent}</div>
      <div class="cart-item-info">
        ${safeBrand ? `<div class="cart-item-brand">${safeBrand}</div>` : ''}
        <div class="cart-item-name">${safeName}</div>
        ${safeDesc ? `<div class="cart-item-desc">${safeDesc}</div>` : ''}
        <div class="cart-item-bottom">
          <div>
            <span class="cart-item-price">৳ ${itemTotal.toLocaleString()}</span>
            ${item.oldPrice ? `<span class="cart-item-old">৳ ${(item.oldPrice * item.qty).toLocaleString()}</span>` : ''}
          </div>
          <div class="cart-qty-wrap">
            <button class="cart-qty-btn" onclick="changeQty('${safeId}',-1)">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" onclick="changeQty('${safeId}',1)">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${safeId}')" title="Remove">×</button>
    </div>`;
  });

  // Summary
  const shipping = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;
  html += `<div class="cart-summary">
    <div class="cart-summary-row"><span>Subtotal</span><span>৳ ${subtotal.toLocaleString()}</span></div>
    ${savings > 0 ? `<div class="cart-summary-row savings"><span>You save</span><span>−৳ ${savings.toLocaleString()}</span></div>` : ''}
    <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free ✓' : '৳ ' + shipping}</span></div>
    <div class="cart-summary-row total"><span>Total</span><span>৳ ${total.toLocaleString()}</span></div>
  </div>`;

  body.innerHTML = html;
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = '৳ ' + total.toLocaleString();
  if (footer) footer.style.display = 'block';
}

function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }

// ===== CHECKOUT MODAL =====
let checkoutStep = 1;
let selectedPayment = 'cod';
let checkoutCustomerData = { name: '', phone: '', email: '', address: '', city: '', note: '' };
let lastPlacedOrder = null;

function openCheckout() {
  closeCart();
  if (cart.length === 0) { showToast('Cart is empty!'); return; }
  checkoutStep = 1;
  selectedPayment = 'cod';
  renderCheckoutStep();
  document.getElementById('checkoutOverlay')?.classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutOverlay')?.classList.remove('open');
}

function nextStep() {
  if (checkoutStep === 2 && !validateCustomerForm()) return;
  if (checkoutStep === 4) { closeCheckout(); loadCart(); return; }
  if (checkoutStep === 3) { placeOrder(); return; }
  checkoutStep++;
  renderCheckoutStep();
}

function prevStep() {
  if (checkoutStep <= 1) return;
  checkoutStep--;
  renderCheckoutStep();
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.method === method);
  });
  renderPaymentDetails();
}

function validateCustomerForm() {
  const name = document.getElementById('custName')?.value.trim() || '';
  const phone = document.getElementById('custPhone')?.value.trim() || '';
  const email = document.getElementById('custEmail')?.value.trim() || '';
  const address = document.getElementById('custAddress')?.value.trim() || '';
  const city = document.getElementById('custCity')?.value.trim() || '';
  const note = document.getElementById('custNote')?.value.trim() || '';

  if (!name || !phone || !address) {
    showToast('Please fill in Name, Phone & Address');
    return false;
  }
  if (phone.length < 10) {
    showToast('Please enter a valid phone number');
    return false;
  }

  // Preserve customer data in memory so it's not lost when DOM changes
  checkoutCustomerData = { name, phone, email, address, city, note };
  return true;
}

function renderPaymentDetails() {
  const el = document.getElementById('paymentDetailsArea');
  if (!el) return;
  // TODO: Replace with real merchant/personal payment account numbers if different
  const details = {
    cod: `<p>💵 Pay when your order arrives at your doorstep.</p><p style="font-size:12px;color:var(--fg2);margin-top:4px">Our delivery agent will collect the payment.</p>`,
    bkash: `<p>Send Money to Merchant / Personal Number:</p><div class="pay-number">01905-857651</div><p style="margin-top:6px;font-size:11px;color:var(--fg2)">Use your Phone Number or Name as payment reference.</p>`,
    nagad: `<p>Send Money to Merchant / Personal Number:</p><div class="pay-number">01905-857651</div><p style="margin-top:6px;font-size:11px;color:var(--fg2)">Use your Phone Number or Name as payment reference.</p>`,
    card: `<p>💳 Card payment will be processed securely.</p><p style="font-size:12px;color:var(--fg2);margin-top:4px">Visa, MasterCard, and Amex accepted. Secure gateway link sent on placement.</p>`
  };
  el.innerHTML = `<div class="payment-details">${details[selectedPayment] || ''}</div>`;
}

async function renderCheckoutStep() {
  const body = document.getElementById('checkoutBody');
  const stepLabel = document.getElementById('stepLabel');
  const stepDots = document.querySelectorAll('.step-dot');
  const backBtn = document.getElementById('checkoutBack');
  const nextBtn = document.getElementById('checkoutNext');
  if (!body) return;

  // Update dots
  stepDots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === checkoutStep) dot.classList.add('active');
    else if (i + 1 < checkoutStep) dot.classList.add('done');
  });

  const labels = ['Review Order', 'Your Details', 'Payment', 'Confirmed!'];
  if (stepLabel) stepLabel.textContent = labels[checkoutStep - 1];
  if (backBtn) backBtn.style.display = checkoutStep <= 1 || checkoutStep === 4 ? 'none' : 'flex';
  if (nextBtn) nextBtn.textContent = checkoutStep === 3 ? '✓ Place Order' : checkoutStep === 4 ? 'Done' : 'Continue';

  if (checkoutStep === 1) {
    // Review order
    let subtotal = 0, savings = 0;
    let items = '';
    cart.forEach(item => {
      const t = item.price * item.qty;
      subtotal += t;
      if (item.oldPrice) savings += (item.oldPrice - item.price) * item.qty;
      const iconEl = item.img
        ? `<img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" />`
        : (item.emoji || '🛍️');
      items += `<div class="review-item">
        <div class="review-icon">${iconEl}</div>
        <div class="review-info">
          <div class="review-brand">${escapeHtml(item.brand || '')}</div>
          <div class="review-name">${escapeHtml(item.name)}</div>
        </div>
        <div class="review-right">
          <div class="review-price">৳ ${t.toLocaleString()}</div>
          <div class="review-qty">Qty: ${item.qty}</div>
        </div>
      </div>`;
    });
    const shipping = subtotal >= 5000 ? 0 : 99;
    body.innerHTML = `<div class="checkout-step active">
      ${items}
      <div class="review-totals">
        <div class="cart-summary-row"><span>Subtotal</span><span>৳ ${subtotal.toLocaleString()}</span></div>
        ${savings > 0 ? `<div class="cart-summary-row savings"><span>You save</span><span>−৳ ${savings.toLocaleString()}</span></div>` : ''}
        <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free ✓' : '৳ ' + shipping}</span></div>
        <div class="cart-summary-row total"><span>Total</span><span>৳ ${(subtotal + shipping).toLocaleString()}</span></div>
      </div>
    </div>`;
  } else if (checkoutStep === 2) {
    let customer = null;
    const loggedInUser = (typeof API !== 'undefined' && API.isLoggedIn()) ? API.getUser() : null;
    if (!checkoutCustomerData.name && !checkoutCustomerData.phone) {
      if (loggedInUser) {
        customer = {
          name: loggedInUser.name || '',
          phone: loggedInUser.phone || '',
          email: loggedInUser.email || '',
          address: loggedInUser.address || '',
          city: loggedInUser.city || 'Dhaka'
        };
      } else {
        try { customer = await dbGetLastCustomer(); } catch(e) {}
      }
    }
    const initialName = checkoutCustomerData.name || customer?.name || '';
    const initialPhone = checkoutCustomerData.phone || customer?.phone || '';
    const initialEmail = checkoutCustomerData.email || customer?.email || '';
    const initialAddress = checkoutCustomerData.address || customer?.address || '';
    const initialCity = checkoutCustomerData.city || customer?.city || 'Dhaka';
    const initialNote = checkoutCustomerData.note || '';

    body.innerHTML = `<div class="checkout-step active">
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="custName" placeholder="Your full name" value="${initialName}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Phone Number *</label>
          <input type="tel" id="custPhone" placeholder="01XXXXXXXXX" value="${initialPhone}" required>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="custEmail" placeholder="you@email.com" value="${initialEmail}">
        </div>
      </div>
      <div class="form-group">
        <label>Delivery Address *</label>
        <input type="text" id="custAddress" placeholder="House, Road, Area, Ward" value="${initialAddress}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" id="custCity" placeholder="Dhaka" value="${initialCity}">
        </div>
        <div class="form-group">
          <label>Delivery Note</label>
          <input type="text" id="custNote" placeholder="Special delivery instructions..." value="${initialNote}">
        </div>
      </div>
      ${customer && !checkoutCustomerData.name ? '<p class="form-hint" style="color:#10b981">✓ Auto-filled from your previous order</p>' : ''}
    </div>`;
  } else if (checkoutStep === 3) {
    // Payment
    body.innerHTML = `<div class="checkout-step active">
      <div class="payment-methods">
        <div class="payment-option ${selectedPayment === 'cod' ? 'selected' : ''}" data-method="cod" onclick="selectPayment('cod')">
          <div class="payment-icon">💵</div>
          <div class="payment-label">Cash on Delivery</div>
          <div class="payment-sub">Pay at doorstep</div>
        </div>
        <div class="payment-option ${selectedPayment === 'bkash' ? 'selected' : ''}" data-method="bkash" onclick="selectPayment('bkash')">
          <div class="payment-icon">📱</div>
          <div class="payment-label">bKash</div>
          <div class="payment-sub">Send Money</div>
        </div>
        <div class="payment-option ${selectedPayment === 'nagad' ? 'selected' : ''}" data-method="nagad" onclick="selectPayment('nagad')">
          <div class="payment-icon">📲</div>
          <div class="payment-label">Nagad</div>
          <div class="payment-sub">Send Money</div>
        </div>
        <div class="payment-option ${selectedPayment === 'card' ? 'selected' : ''}" data-method="card" onclick="selectPayment('card')">
          <div class="payment-icon">💳</div>
          <div class="payment-label">Credit / Debit Card</div>
          <div class="payment-sub">Visa · Mastercard</div>
        </div>
      </div>
      <div id="paymentDetailsArea"></div>
    </div>`;
    renderPaymentDetails();
  }
}

async function placeOrder() {
  try {
    const order = await dbCreateOrder(
      checkoutCustomerData,
      selectedPayment
    );

    lastPlacedOrder = order;
    checkoutStep = 4;

    const body = document.getElementById('checkoutBody');
    const stepDots = document.querySelectorAll('.step-dot');
    const stepLabel = document.getElementById('stepLabel');
    const backBtn = document.getElementById('checkoutBack');
    const nextBtn = document.getElementById('checkoutNext');

    stepDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === 4) dot.classList.add('active');
      else dot.classList.add('done');
    });
    if (stepLabel) stepLabel.textContent = 'Confirmed!';
    if (backBtn) backBtn.style.display = 'none';
    if (nextBtn) nextBtn.textContent = 'Done';

    const payNames = { cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Credit/Debit Card' };

    let itemsSummaryHtml = '';
    order.items.forEach(it => {
      itemsSummaryHtml += `
        <div class="success-item-line">
          <span>${it.name} <span style="color:var(--fg2)">× ${it.qty}</span></span>
          <strong>৳ ${(it.price * it.qty).toLocaleString()}</strong>
        </div>
      `;
    });

    const safeCustName = escapeHtml(order.customer.name);
    const safeCustPhone = escapeHtml(order.customer.phone);
    const safeCustAddr = escapeHtml(order.customer.address);
    const safeCustCity = escapeHtml(order.customer.city);
    const safeOrderId = escapeHtml(order.orderId);

    body.innerHTML = `
      <div class="checkout-step active">
        <div class="order-success">
          <div class="success-icon-wrap">
            <div class="success-badge-pulse"></div>
            <div class="success-icon">🎉</div>
          </div>
          <div class="success-title">Order Confirmed!</div>
          <div class="success-sub">Thank you, <strong>${safeCustName}</strong>! Your order has been saved.</div>

          <div class="order-id-box">
            <div>
              <div class="order-id-label">Order ID</div>
              <div class="order-id-value">${safeOrderId}</div>
            </div>
            <button class="copy-id-btn" onclick="copyOrderId('${safeOrderId}')" title="Copy Order ID">📋 Copy</button>
          </div>

          <div class="success-actions">
            <button class="btn-receipt" onclick="printOrderReceipt('${safeOrderId}')">🖨️ Print Invoice</button>
            <button class="btn-receipt" onclick="shareOrderReceipt('${safeOrderId}')">📤 Share Receipt</button>
            <a href="orders.html" class="btn-receipt" style="text-decoration:none">📦 View in Orders</a>
          </div>

          <div class="success-details">
            <h4>
              <span>🧾 Order Receipt</span>
              <span style="font-size:11px;color:#10b981;font-weight:600">● Payment: ${payNames[order.paymentMethod] || escapeHtml(order.paymentMethod)}</span>
            </h4>
            <div class="success-details-row"><span>Customer:</span><strong>${safeCustName} (${safeCustPhone})</strong></div>
            <div class="success-details-row"><span>Delivery Address:</span><strong>${safeCustAddr}${safeCustCity ? ', ' + safeCustCity : ''}</strong></div>
            <div class="success-details-row"><span>Payment Method:</span><strong>${payNames[order.paymentMethod] || escapeHtml(order.paymentMethod)}</strong></div>

            <div class="success-items-list">
              ${itemsSummaryHtml}
            </div>

            <div class="success-details-row"><span>Subtotal:</span><span>৳ ${order.subtotal.toLocaleString()}</span></div>
            ${order.savings > 0 ? `<div class="success-details-row" style="color:#10b981"><span>Savings:</span><span>−৳ ${order.savings.toLocaleString()}</span></div>` : ''}
            <div class="success-details-row"><span>Shipping:</span><span>${order.shipping === 0 ? 'Free ✓' : '৳ ' + order.shipping}</span></div>
            <div class="success-details-row" style="font-size:14px;font-weight:700;color:var(--fg);margin-top:6px;padding-top:6px;border-top:1px solid var(--border-color)">
              <span>Grand Total:</span><strong style="color:var(--accent)">৳ ${order.total.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    // Immediately reload & clear the in-memory and UI cart
    await loadCart();
    showToast('🎉 Order ' + order.orderId + ' placed successfully!');
  } catch(e) {
    showToast('Error placing order: ' + e.message);
    console.error('Order error:', e);
  }
}

// ===== PRINT INVOICE & RECEIPT =====
async function printOrderReceipt(orderId) {
  let order = lastPlacedOrder;
  if (!order || order.orderId !== orderId) {
    try { order = await dbGetOrder(orderId); } catch(e) {}
  }
  if (!order) { showToast('Order not found'); return; }

  const payNames = { cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Credit/Debit Card' };
  const dateStr = new Date(order.createdAt).toLocaleString();

  let itemRows = '';
  order.items.forEach((it, i) => {
    itemRows += `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px 8px;">${i+1}</td>
        <td style="padding:10px 8px;"><strong>${escapeHtml(it.name)}</strong><br><small style="color:#666">${escapeHtml(it.brand || '')}</small></td>
        <td style="padding:10px 8px;text-align:center;">${it.qty}</td>
        <td style="padding:10px 8px;text-align:right;">৳ ${it.price.toLocaleString()}</td>
        <td style="padding:10px 8px;text-align:right;">৳ ${(it.price * it.qty).toLocaleString()}</td>
      </tr>
    `;
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) { window.print(); return; }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice – ${order.orderId} – SOHAN TECH</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;margin:0;padding:30px;color:#222;}
        .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #6366f1;padding-bottom:16px;margin-bottom:24px;}
        .brand{font-size:26px;font-weight:900;color:#1d1d1f;letter-spacing:-1px;}
        .brand span{color:#6366f1;}
        .order-title{font-size:18px;font-weight:700;color:#6366f1;margin-bottom:4px;}
        .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;font-size:14px;line-height:1.6;}
        table{width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;}
        th{background:#f5f5f7;padding:10px 8px;text-align:left;font-weight:700;}
        .totals{width:280px;margin-left:auto;font-size:14px;line-height:1.8;}
        .totals-row{display:flex;justify-content:space-between;}
        .grand-total{font-size:17px;font-weight:800;color:#6366f1;border-top:2px solid #222;padding-top:6px;margin-top:6px;}
        .footer{text-align:center;font-size:12px;color:#888;margin-top:40px;border-top:1px solid #eee;padding-top:16px;}
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">SOHAN <span>TECH</span></div>
        <div style="text-align:right">
          <div class="order-title">INVOICE &amp; RECEIPT</div>
          <div style="font-size:13px;color:#555">Order: <strong>${order.orderId}</strong></div>
          <div style="font-size:12px;color:#888">${dateStr}</div>
        </div>
      </div>
      <div class="info-grid">
        <div>
          <strong>Billed &amp; Shipped To:</strong><br>
          ${order.customer.name}<br>
          Phone: ${order.customer.phone}<br>
          ${escapeHtml(order.customer.email ? 'Email: ' + order.customer.email : '')}
          ${escapeHtml(order.customer.address)}${order.customer.city ? ', ' + escapeHtml(order.customer.city) : ''}
        </div>
        <div style="text-align:right">
          <strong>Order Details:</strong><br>
          Payment: <strong>${payNames[order.paymentMethod] || escapeHtml(order.paymentMethod)}</strong><br>
          ${order.customer.note ? 'Note: ' + escapeHtml(order.customer.note) : ''}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:40px;">#</th>
            <th>Item Description</th>
            <th style="text-align:center;width:60px;">Qty</th>
            <th style="text-align:right;width:100px;">Unit Price</th>
            <th style="text-align:right;width:110px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <div class="totals">
        <div class="totals-row"><span>Subtotal:</span><span>৳ ${order.subtotal.toLocaleString()}</span></div>
        ${order.savings > 0 ? `<div class="totals-row" style="color:#10b981"><span>Savings:</span><span>−৳ ${order.savings.toLocaleString()}</span></div>` : ''}
        <div class="totals-row"><span>Shipping:</span><span>${order.shipping === 0 ? 'FREE' : '৳ ' + order.shipping}</span></div>
        <div class="totals-row grand-total"><span>Grand Total:</span><span>৳ ${order.total.toLocaleString()}</span></div>
      </div>
      <div class="footer">
        Thank you for purchasing with SOHAN TECH • sohanahamed884@gmail.com • +880 1905-857651
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ===== SHARE / COPY RECEIPT =====
async function shareOrderReceipt(orderId) {
  let order = lastPlacedOrder;
  if (!order || order.orderId !== orderId) {
    try { order = await dbGetOrder(orderId); } catch(e) {}
  }
  if (!order) { showToast('Order not found'); return; }

  const payLabel = { bkash: 'bKash', nagad: 'Nagad', card: 'Card', cod: 'Cash on Delivery' }[order.paymentMethod] || order.paymentMethod;
  const textSummary = `🛍️ SOHAN TECH Order Receipt\nOrder ID: ${order.orderId}\nCustomer: ${order.customer.name}\nTotal: ৳ ${order.total.toLocaleString()}\nItems: ${order.items.map(i => i.name + ' (x' + i.qty + ')').join(', ')}\nDelivery: ${order.customer.address}\nPayment: ${payLabel}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `SOHAN TECH Order ${order.orderId}`,
        text: textSummary
      });
      showToast('Receipt shared ✓');
      return;
    } catch(err) {
      // fallback to clipboard
    }
  }

  navigator.clipboard.writeText(textSummary).then(() => {
    showToast('Receipt copied to clipboard ✓');
  }).catch(() => {
    showToast('Order ID: ' + order.orderId);
  });
}

function copyOrderId(orderId) {
  navigator.clipboard.writeText(orderId).then(() => {
    showToast('Order ID copied to clipboard ✓');
  });
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== WISHLIST (Globally accessible across all pages) =====
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('st_wishlist') || '[]');
  } catch (e) {
    return [];
  }
}

function saveWishlistData(list) {
  try {
    localStorage.setItem('st_wishlist', JSON.stringify(list));
  } catch (e) {}
}

function addToWishlist(productId) {
  let product = null;
  if (typeof PRODUCTS !== 'undefined') {
    for (const [cat, items] of Object.entries(PRODUCTS)) {
      const found = items.find(p => p.id === productId || p.name === productId);
      if (found) { product = found; break; }
    }
  }
  if (!product) return;
  const wishlist = getWishlist();
  if (wishlist.find(w => w.id === product.id)) {
    showToast('Already in wishlist ❤️');
    return;
  }
  wishlist.push({
    id: product.id,
    name: product.name,
    price: product.price,
    emoji: product.emoji || '🛍️',
    brand: product.brand || '',
    addedAt: new Date().toISOString()
  });
  saveWishlistData(wishlist);
  if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
  if (typeof addActivity === 'function') addActivity('cart', `Added ${product.name} to wishlist`);
  showToast('Added to wishlist ❤️');
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter(w => w.id !== productId);
  saveWishlistData(wishlist);
  if (typeof renderWishlist === 'function') renderWishlist();
  if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
  showToast('Removed from wishlist');
}

function toggleWishlist(productId, btn) {
  const wishlist = getWishlist();
  const exists = wishlist.some(w => w.id === productId);
  if (exists) {
    removeFromWishlist(productId);
    if (btn) {
      btn.textContent = '♡ Wishlist';
      btn.classList.remove('active');
    }
  } else {
    addToWishlist(productId);
    if (btn) {
      btn.textContent = '❤️ In Wishlist';
      btn.classList.add('active');
    }
  }
}

// ===== RENDER PRODUCTS =====
// Fixed: Star rating now shows half stars for fractional ratings
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = (rating % 1) >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return '★'.repeat(fullStars) + (hasHalf ? '⯨' : '') + '☆'.repeat(Math.max(0, emptyStars));
}

function renderProducts(data, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.map(p => `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img">
        <div class="prod-bg" style="position:absolute;inset:0;background:${p.bg};opacity:.12"></div>
        ${p.badge ? `<div class="product-badge ${p.badge === 'Sale' ? 'sale' : p.badge === 'New' ? 'new' : ''}">${p.badge}</div>` : ''}
        ${p.img ? `<img src="${p.img}" alt="${escapeHtml(p.name)}" style="max-height:90px;max-width:90px;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,.25));" />` : `<div class="prod-icon" style="font-size:72px;line-height:1">${p.emoji}</div>`}
      </div>
      <div class="product-info">
        <div class="product-brand">${escapeHtml(p.brand)}</div>
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-desc">${escapeHtml(p.desc)}</div>
        <div class="product-footer">
          <div class="product-prices">
            <div class="product-price">৳ ${p.price.toLocaleString()}</div>
            ${p.old ? `<div class="product-old-price">৳ ${p.old.toLocaleString()}</div>` : ''}
          </div>
          <button class="add-btn" onclick="addToCart('${p.id}',${p.price},'${p.emoji}')" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== COUNTDOWN TIMER =====
// Fixed: Timer end time is now persisted in localStorage so it doesn't reset on page reload.
// Timer also pauses when tab is hidden to avoid wasted computation.
function startTimer() {
  const TIMER_KEY = 'st_deal_end';
  const TIMER_DURATION = (5 * 3600 + 47 * 60 + 30) * 1000; // 5h 47m 30s in ms

  let storedEnd = localStorage.getItem(TIMER_KEY);
  let end;

  if (storedEnd) {
    end = new Date(parseInt(storedEnd, 10));
    // If stored timer already expired, reset it
    if (end <= new Date()) {
      end = new Date(Date.now() + TIMER_DURATION);
      localStorage.setItem(TIMER_KEY, String(end.getTime()));
    }
  } else {
    end = new Date(Date.now() + TIMER_DURATION);
    localStorage.setItem(TIMER_KEY, String(end.getTime()));
  }

  let timerId = null;

  function tick() {
    const now = new Date();
    let diff = Math.max(0, Math.floor((end - now) / 1000));
    if (diff === 0) {
      // Deal expired — reset timer for next cycle
      end = new Date(Date.now() + TIMER_DURATION);
      localStorage.setItem(TIMER_KEY, String(end.getTime()));
    }
    const h = Math.floor(diff / 3600); diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    const pad = n => String(n).padStart(2, '0');
    const th = document.getElementById('th'), tm = document.getElementById('tm'), ts = document.getElementById('ts');
    if (th) th.textContent = pad(h);
    if (tm) tm.textContent = pad(m);
    if (ts) ts.textContent = pad(s);
  }

  function startTicking() {
    if (timerId) return;
    tick();
    timerId = setInterval(tick, 1000);
  }

  function stopTicking() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  // Pause timer when tab is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTicking();
    else startTicking();
  });

  startTicking();
}

// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', scrollY > 50);
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('visible', scrollY > 400);
});

// ===== HAMBURGER =====
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// ===== LIVE SEARCH ENGINE =====
const CATEGORY_LABELS = { mobiles: '📱 Mobiles', laptops: '💻 Laptops', chargers: '⚡ Chargers', accessories: '🎧 Accessories', drones: '🚁 Drones' };
const CATEGORY_SECTIONS = { mobiles: 'mobiles', laptops: 'laptops', chargers: 'chargers', accessories: 'accessories', drones: 'drones' };

let searchActiveIdx = -1;

function getAllProducts() {
  const all = [];
  Object.entries(PRODUCTS).forEach(([cat, items]) => {
    items.forEach(p => all.push({ ...p, category: cat }));
  });
  return all;
}

function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function getBadgeClass(badge) { return (badge || '').toLowerCase(); }

function renderSearchResults(query) {
  const panel = document.getElementById('searchResultsPanel');
  const inner = document.getElementById('searchResultsInner');
  const clearBtn = document.getElementById('searchClear');
  if (!panel || !inner) return;

  clearBtn.style.display = query ? 'block' : 'none';

  if (!query.trim()) {
    panel.classList.remove('open');
    searchActiveIdx = -1;
    return;
  }

  const q = query.trim().toLowerCase();
  const all = getAllProducts();
  const matches = all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 8);

  searchActiveIdx = -1;

  if (matches.length === 0) {
    inner.innerHTML = `
      <div class="srp-empty">
        <div class="srp-empty-icon">🔍</div>
        <h4>No results for <mark>${escapeHtml(query)}</mark></h4>
        <p>Try searching for mobiles, laptops, chargers or accessories.</p>
      </div>`;
    panel.classList.add('open');
    return;
  }

  // Group by category
  const grouped = {};
  matches.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  let html = `<div class="srp-header"><span class="srp-count">${matches.length} result${matches.length !== 1 ? 's' : ''} for "${query}"</span><span class="srp-hint">↑↓ navigate · Enter to go · Esc to close</span></div>`;

  Object.entries(grouped).forEach(([cat, items]) => {
    html += `<div class="srp-cat-label">${CATEGORY_LABELS[cat] || cat}</div>`;
    items.forEach(p => {
      const badgeClass = getBadgeClass(p.badge);
      const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
      const oldPrice = p.old ? `<div class="srp-item-old">৳ ${p.old.toLocaleString()}</div>` : '';
      html += `
        <div class="srp-item" data-cat="${cat}" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-emoji="${p.emoji}"
             onclick="handleSearchClick('${cat}','${p.id}','${p.name}',${p.price},'${p.emoji}')">
          <div class="srp-item-icon" style="background:${p.bg};opacity:.9">
            <span style="filter:brightness(2)">${p.emoji}</span>
            ${p.badge ? `<span class="srp-item-badge ${badgeClass}">${p.badge}</span>` : ''}
          </div>
          <div class="srp-item-body">
            <div class="srp-item-top">
              <span class="srp-item-brand">${escapeHtml(p.brand)}</span>
              <span class="srp-item-cat">${escapeHtml(cat)}</span>
            </div>
            <div class="srp-item-name">${highlight(escapeHtml(p.name), query)}</div>
            <div class="srp-item-desc">${highlight(escapeHtml(p.desc), query)}</div>
          </div>
          <div class="srp-item-right">
            ${oldPrice}
            <div class="srp-item-price">৳ ${p.price.toLocaleString()}</div>
            <div class="srp-item-stars">${stars}</div>
          </div>
          <button class="srp-add-btn" onclick="event.stopPropagation();addToCart('${p.id}',${p.price},'${p.emoji}')" title="Add to cart">+</button>
        </div>`;
    });
  });

  inner.innerHTML = html;
  panel.classList.add('open');
}

function handleSearchClick(cat, id, name, price, emoji) {
  closeSearch();
  const section = document.getElementById(CATEGORY_SECTIONS[cat] || cat);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // highlight the card immediately
  const card = document.getElementById('card-' + id);
  if (card) {
    card.style.boxShadow = '0 0 0 3px var(--accent), 0 20px 60px rgba(99,102,241,.35)';
    card.style.transform = 'translateY(-8px)';
    setTimeout(() => { card.style.boxShadow = ''; card.style.transform = ''; }, 1600);
  }
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchResultsPanel').classList.remove('open');
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
  document.getElementById('searchClear').style.display = 'none';
  searchActiveIdx = -1;
}

// Open search
document.getElementById('searchBtn')?.addEventListener('click', () => {
  document.getElementById('searchOverlay').classList.add('open');
  document.getElementById('searchInput')?.focus();
  document.getElementById('mobileMenu').classList.remove('open');
});

// Close button
document.getElementById('closeSearch')?.addEventListener('click', closeSearch);

// Clear button
document.getElementById('searchClear')?.addEventListener('click', () => {
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  renderSearchResults('');
});

// Live search on input (debounced 150ms)
let searchTimer;
document.getElementById('searchInput')?.addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderSearchResults(e.target.value), 150);
});

// Keyboard navigation
document.getElementById('searchInput')?.addEventListener('keydown', e => {
  const items = document.querySelectorAll('.srp-item');
  if (!items.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    searchActiveIdx = Math.min(searchActiveIdx + 1, items.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    searchActiveIdx = Math.max(searchActiveIdx - 1, 0);
  } else if (e.key === 'Enter' && searchActiveIdx >= 0) {
    e.preventDefault();
    items[searchActiveIdx]?.click();
    return;
  } else if (e.key === 'Escape') {
    closeSearch(); return;
  } else { return; }
  items.forEach((el, i) => el.classList.toggle('active', i === searchActiveIdx));
  items[searchActiveIdx]?.scrollIntoView({ block: 'nearest' });
});

// Close results when clicking outside
document.addEventListener('click', e => {
  const panel = document.getElementById('searchResultsPanel');
  const overlay = document.getElementById('searchOverlay');
  if (panel && overlay && !panel.contains(e.target) && !overlay.contains(e.target) && !document.getElementById('searchBtn').contains(e.target)) {
    panel.classList.remove('open');
  }
});

// ===== CART TOGGLE =====
document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

// ===== SCROLL TOP =====
document.getElementById('scrollTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== NEWSLETTER (Stay in the Loop - MySQL Database Storage) =====
async function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const note = document.getElementById('nlNote');
  const email = input ? input.value.trim() : '';
  const form = e.target;
  const btn = form ? form.querySelector('button[type="submit"]') : null;

  if (!email) return;

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
  }

  try {
    if (typeof API !== 'undefined' && typeof API.subscribeNewsletter === 'function') {
      const res = await API.subscribeNewsletter(email, 'homepage_stay_in_the_loop');
      if (note) {
        note.textContent = res.message || '🎉 Thank you for subscribing! Check your inbox for exclusive deals.';
        note.style.color = '#10b981';
      }
      showToast('🎉 Subscribed to newsletter successfully!');
    } else {
      if (note) {
        note.textContent = '🎉 You\'re subscribed! Check your inbox for exclusive deals.';
        note.style.color = '#10b981';
      }
    }
    if (input) input.value = '';
    setTimeout(() => { if (note) note.textContent = ''; }, 6000);
  } catch (err) {
    if (note) {
      note.textContent = err.message || 'Could not subscribe. Please try again.';
      note.style.color = '#ef4444';
    }
    showToast(err.message || 'Subscription failed');
    // Fixed: Auto-clear error message too (was only clearing success before)
    setTimeout(() => { if (note) note.textContent = ''; }, 8000);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    }
  }
}

// ===== INTERSECTION OBSERVER (fade in) =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// ===== THEME MANAGER (Light / Dark Mode) =====
function getPreferredTheme() {
  const saved = localStorage.getItem('st_theme');
  if (saved) return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('st_theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  if (typeof showToast === 'function') {
    showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  }
}

// ===== BANNER SLIDER =====
function initBannerSlider() {
  const track = document.getElementById('bannerTrack');
  const slides = document.querySelectorAll('.banner-slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoSlide();
  });

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
        startAutoSlide();
      });
    });
  }

  const sliderElem = document.getElementById('bannerSlider');
  if (sliderElem) {
    sliderElem.addEventListener('mouseenter', stopAutoSlide);
    sliderElem.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();
}

// ===== CATEGORY SIDEBAR DRAWER =====
function initCatSidebar() {
  const openBtn = document.getElementById('catMenuBtn');
  const closeBtn = document.getElementById('catSidebarClose');
  const overlay = document.getElementById('catSidebarOverlay');
  const sidebar = document.getElementById('catSidebar');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
      closeSidebar();
    }
  });
}

// Initial theme application
applyTheme(getPreferredTheme());


// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Setup theme button listener
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  // Initialize banner slider & category sidebar
  initBannerSlider();
  initCatSidebar();

  // Render index products if grids exist (max 3 rows = 12 products per section)
  if (document.getElementById('mobileGrid')) {
    const MAX_PER_SECTION = 12; // 3 rows × 4 columns
    renderProducts(PRODUCTS.mobiles.slice(0, MAX_PER_SECTION), 'mobileGrid');
    renderProducts(PRODUCTS.laptops.slice(0, MAX_PER_SECTION), 'laptopGrid');
    renderProducts(PRODUCTS.chargers.slice(0, MAX_PER_SECTION), 'chargerGrid');
    renderProducts(PRODUCTS.accessories.slice(0, MAX_PER_SECTION), 'accessoryGrid');
    renderProducts(PRODUCTS.drones.slice(0, MAX_PER_SECTION), 'droneGrid');
    startTimer();
  }

  loadCart();

  // Initialize wishlist button state for New Arrivals
  const naWishlistBtn = document.getElementById('naWishlistBtn');
  if (naWishlistBtn) {
    const wishlist = getWishlist();
    if (wishlist.some(w => w.id === 'm6')) {
      naWishlistBtn.textContent = '❤️ In Wishlist';
      naWishlistBtn.classList.add('active');
    }
  }
});


