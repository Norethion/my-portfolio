# 🚀 Portföyüm

> [🇹🇷 Türkçe](README_TR.md) | [🇬🇧 English](README.md)

**Next.js 16**, **TypeScript** ve **PostgreSQL** ile oluşturulmuş modern, full-stack bir kişisel portföy web sitesi. Gizli admin paneli, iki dilli destek (TR/EN) ve kesintisiz GitHub proje entegrasyonu içerir.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)

---

## ✨ Özellikler

### 🎨 **Kullanıcı Özellikleri**
- **Modern UI** - Temiz, minimal tasarım ve akıcı animasyonlar
- **Açık/Koyu Mod** - Sistem farkındası tema değiştirme
- **İki Dilli Destek** - Türkçe/İngilizce dil değiştirme
- **Responsive Tasarım** - Mobile-first, tüm cihazlarda çalışır
- **WebGL Efektleri** - Vanta.js ile interaktif akıcı arka plan
- **CV Görüntüleme** - Yazdırma desteği ile profesyonel özgeçmiş sayfası
- **İletişim Formu** - Ziyaretçilerle iletişime geçme
- **SEO Optimizasyonu** - Meta etiketleri, sitemap ve anlamsal HTML

### 🔐 **Admin Paneli Özellikleri**
- **Gizli Erişim** - Herhangi bir sayfada `Ctrl+K` basarak giriş
- **Kişisel Bilgi Yönetimi** - Bio, iletişim detayları, sosyal linkler düzenleme
- **GitHub Entegrasyonu** - GitHub profilinizden projeleri otomatik senkronize etme
- **Manuel Projeler** - Özel projeler ekleme/düzenleme/silme
- **CV Yönetimi** - Deneyimler, eğitim ve yetenekler
- **LinkedIn İçe Aktarma** - LinkedIn'den CV verilerini içe aktarma (JSON/CSV/ZIP)
- **Sürükle & Bırak** - Sezgisel arayüz ile yeniden sıralama
- **Önbellek Kontrolü** - GitHub API hız limitlerini yönetme

---

## 🛠️ Teknoloji Yığını

### **Temel**
- **Framework**: Next.js 16 (App Router) with React 19
- **Dil**: TypeScript 5.0
- **Stil**: Tailwind CSS 4.0
- **Veritabanı**: PostgreSQL with Drizzle ORM

### **UI & Bileşenler**
- **Bileşen Kütüphanesi**: Radix UI primitives
- **UI Araç Kutusu**: shadcn/ui bileşenleri
- **İkonlar**: Lucide React
- **Animasyonlar**: Framer Motion
- **WebGL**: Vanta.js (akıcı arka plan)

### **Durum & Veri**
- **Durum Yönetimi**: Zustand
- **Form İşleme**: React hooks + Zod validation
- **API**: Next.js Server Actions & Route Handlers

### **Yardımcı Araçlar**
- **Sürükle & Bırak**: @dnd-kit
- **Dosya İşleme**: JSZip (LinkedIn içe aktarma için)
- **Uluslararasılaştırma**: Özel Zustand store

---

## 📦 Veritabanı Şeması

Uygulama aşağıdaki ana tablolarla **PostgreSQL** kullanır:

### **Tablolar**
- `personal_info` - Bio, iletişim bilgileri, sosyal linkler
- `projects` - GitHub ve manuel projeler ile metadata
- `cv_experiences` - İş deneyimi girişleri
- `cv_education` - Eğitim geçmişi
- `cv_skills` - Kategori ve seviyeye göre yetenekler
- `settings` - Uygulama yapılandırması

### **Özellikler**
- Admin panel üzerinden tam CRUD işlemleri
- Sürükle-bırak ile sıralama yönetimi
- Projeler için görünürlük anahtarları
- Zaman damgası ile soft delete

---

## 🚀 Başlangıç

### **Gereksinimler**
- **Node.js** 20+ (LTS önerilir)
- **npm** veya **yarn** veya **pnpm**
- **PostgreSQL** 14+ (yerel veya uzak)

### **Kurulum**

1. **Depoyu klonlayın:**
```bash
git clone https://github.com/Norethion/my-portfolio.git
cd my-portfolio
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

3. **Ortam değişkenlerini ayarlayın:**
Root dizininde `.env.local` dosyası oluşturun:
```env
# Veritabanı (Yerel PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
# Migration'ları çalıştır
npx drizzle-kit push

# Veya migration oluştur ve çalıştır
npx drizzle-kit generate
npx drizzle-kit migrate
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

6. **Tarayıcınızı açın:**
[http://localhost:3000](http://localhost:3000) adresine gidin

---

## 🔑 Admin Paneli Erişimi

1. Sitede herhangi bir yerde **`Ctrl+K`** tuşlarına basın
2. **Admin şifrenizi** girin (`.env.local` dosyasından)
3. **"Login"** butonuna tıklayın

### **Admin Paneli Bölümleri**

#### **👤 Kişisel Bilgiler**
- İsim, iş unvanı, bio (TR/EN)
- İletişim detayları (e-posta, telefon, konum)
- Sosyal medya linkleri (GitHub, LinkedIn, Twitter, vs.)
- Avatar URL
- Konuşulan diller

#### **💼 Proje Yönetimi**
- **GitHub Senkronizasyonu**: GitHub profilinizden projeleri otomatik çekme
- **Manuel Projeler**: Açıklama ile özel projeler ekleme
- **Görünürlük Anahtarı**: Belirli projeleri göster/gizle
- **Yeniden Sıralama**: Projeleri sürükle-bırak ile sıralama
- **Önbellek Yönetimi**: GitHub API kullanımını kontrol etme

#### **📄 CV Yönetimi**
- **Deneyim**: İş deneyimi ekle/düzenle/sil
- **Eğitim**: Akademik geçmişi yönet
- **Yetenekler**: Yetenekleri kategorize et ve sırala
- **İçe Aktarma**: LinkedIn dışa aktarmalarından toplu içe aktarma

---

## 🌐 Dağıtım

### **Vercel'e Dağıtım** (Önerilen)

1. **GitHub'a gönderin:**
```bash
git add .
git commit -m "Dağıtıma hazır"
git push origin main
```

2. **Vercel'e import edin:**
- [vercel.com](https://vercel.com) adresine gidin
- **Add New Project** tıklayın
- GitHub repository'nizi import edin

3. **Ortam Değişkenlerini Ekleyin:**
Vercel dashboard → Settings → Environment Variables:
- `DATABASE_URL` - PostgreSQL bağlantı string'iniz
- `NEXT_PUBLIC_ADMIN_KEY` - Admin şifreniz
- `GITHUB_USERNAME` - GitHub kullanıcı adınız (opsiyonel)
- `GITHUB_TOKEN` - GitHub token'ınız (opsiyonel)

4. **Dağıtın!**
**Deploy** tıklayın ve build'in tamamlanmasını bekleyin.

**Detaylı dağıtım talimatları için:**
- 📘 [Dağıtım Rehberi (Türkçe)](docs/DEPLOYMENT_TR.md)
- 📘 [Deployment Guide (English)](docs/DEPLOYMENT.md)

### **Veritabanı Seçenekleri**

#### **Seçenek 1: Vercel Postgres**
- Vercel ile entegre
- Otomatik connection pooling
- Kolay kurulum

#### **Seçenek 2: Supabase** (Önerilen)
- Ücretsiz tier: 500MB veritabanı
- Real-time özellikler
- Yerleşik kimlik doğrulama
- **Bkz**: [Detaylı Supabase Kurulumu](docs/DEPLOYMENT_TR.md#supabase-kurulumu)

#### **Seçenek 3: Diğer Sağlayıcılar**
- Neon, Railway, AWS RDS veya herhangi bir PostgreSQL uyumlu veritabanı

---

## 📁 Proje Yapısı

```
my-portfolio/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel sayfaları
│   │   └── dashboard/            # Ana admin dashboard
│   ├── api/                      # API route'ları
│   │   ├── admin/                # Korumalı admin API'leri
│   │   ├── cv/                   # CV veri API'leri
│   │   ├── personal-info/        # Kişisel bilgi API'leri
│   │   └── projects/             # Projeler API'leri
│   ├── contact/                  # İletişim sayfası
│   ├── cv/                       # CV/özgeçmiş sayfası
│   ├── projects/                 # Projeler listeleme sayfası
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Ana sayfa
├── components/                   # React bileşenleri
│   ├── admin/                    # Admin bileşenleri
│   ├── effects/                  # WebGL ve animasyonlar
│   ├── layout/                   # Layout bileşenleri
│   └── ui/                       # shadcn/ui bileşenleri
├── lib/                          # Yardımcı programlar ve config
│   ├── db/                       # Veritabanı kurulumu
│   │   ├── drizzle.ts           # DB client
│   │   └── schema.ts            # Drizzle schema
│   └── utils/                    # Yardımcı fonksiyonlar
├── stores/                       # Zustand store'ları
│   ├── language.ts              # Dil değiştirici
│   └── theme.ts                 # Tema değiştirici
├── public/                       # Statik dosyalar
├── drizzle/                      # Veritabanı migration'ları
├── .env.local                    # Ortam değişkenleri
├── drizzle.config.ts             # Drizzle config
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── package.json                  # Bağımlılıklar
```

---

## 🎯 Temel Özellikler Açıklaması

### **GitHub Entegrasyonu**
GitHub repository'lerinizi otomatik olarak senkronize ederek çalışmalarınızı sergiler:

- Public repository'leri çeker
- Metadata'ları ayıklar (stars, topics, language)
- Önbellekleme ile hız sınırlamayı destekler
- Manuel override mevcut

### **LinkedIn İçe Aktarma**
Profesyonel verilerinizi birden fazla formatta içe aktarın:

- **JSON**: Tam profil dışa aktarma
- **CSV**: Elektronik tablo formatı
- **ZIP**: Tam dışa aktarma arşivi

Deneyimler, eğitim ve yetenekleri otomatik olarak eşler ve içe aktarır.

### **Responsive Tasarım**
Mobile-first yaklaşım mükemmel görüntülemeyi sağlar:
- 📱 Mobil telefonlar (320px+)
- 📱 Tabletler (768px+)
- 💻 Laptoplar (1024px+)
- 🖥️ Masaüstleri (1440px+)

---

## 🔧 Geliştirme

### **Mevcut Scriptler**

```bash
# Geliştirme
npm run dev          # localhost:3000'de dev sunucusu başlat

# Production
npm run build        # Production için build
npm run start        # Production sunucusunu başlat

# Veritabanı
npx drizzle-kit push              # Schema değişikliklerini push et
npx drizzle-kit generate          # Migration'ları oluştur
npx drizzle-kit migrate           # Migration'ları çalıştır
npx drizzle-kit studio            # Drizzle Studio'yu aç

# Linting
npm run lint         # ESLint çalıştır
```

### **Kod Stili**
- ESLint kod kalitesi için
- TypeScript tip güvenliği için
- Prettier hazır formatlama

---

## 📚 Dokümantasyon

### **Hızlı Bağlantılar**
- 📖 [Kurulum Rehberi (Türkçe)](docs/SETUP_TR.md)
- 📖 [Setup Guide (English)](docs/SETUP.md)
- 🚀 [Dağıtım Rehberi (Türkçe)](docs/DEPLOYMENT_TR.md)
- 🚀 [Deployment Guide (English)](docs/DEPLOYMENT.md)
- 🌐 [Çoklu Dil Rehberi](docs/MULTI_LANGUAGE.md)

---

## 🤝 Katkıda Bulunma

Bu kişisel bir portföy projesidir. Katkılar memnuniyetle karşılanır! Lütfen:

1. Repository'yi fork edin
2. Bir özellik branch'i oluşturun (`git checkout -b feature/harikulade-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harikulade özellik ekle'`)
4. Branch'e push edin (`git push origin feature/harikulade-ozellik`)
5. Bir Pull Request açın

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.

Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👤 Yazar

**Norethion**

- 🌐 [Portföy](https://your-portfolio.vercel.app)
- 💼 [LinkedIn](https://www.linkedin.com/in/yourprofile)
- 🐙 [GitHub](https://github.com/Norethion)

---

## 🙏 Teşekkürler

- **Next.js Ekibi** - Harika framework
- **shadcn** - Güzel UI bileşenleri
- **Vercel** - Hosting platformu
- **Supabase** - Veritabanı platformu
- **Drizzle ORM** - Tip-güvenli ORM
- **Tüm Katkıda Bulunanlar** - Desteğiniz için teşekkürler!

---

## 📈 Gelecek Geliştirmeler

- [ ] CV PDF dışa aktarma özelliği
- [ ] İletişim formu backend entegrasyonu (Resend/SendGrid)
- [ ] Gelişmiş analitik dashboard
- [ ] MDX ile blog bölümü
- [ ] Performans optimizasyonları
- [ ] WebRTC video çağrı entegrasyonu
- [ ] AI destekli proje önerileri

---

<div align="center">

**⭐ Bu repo'yu beğendiyseniz yıldızlayın!**

Next.js, TypeScript ve PostgreSQL ile ❤️ ile yapılmıştır

</div>
