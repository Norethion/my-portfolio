# 🔧 Kurulum Rehberi

> [🇹🇷 Türkçe](SETUP_TR.md) | [🇬🇧 Read in English](SETUP.md)

Portföy projesi için kapsamlı local development kurulum rehberi.

---

## 📋 İçindekiler

- [Gereksinimler](#gereksinimler)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Detaylı Kurulum](#detaylı-kurulum)
- [Veritabanı Yapılandırması](#veritabanı-yapılandırması)
- [Admin Panel Kurulumu](#admin-panel-kurulumu)
- [Doğrulama](#doğrulama)
- [Geliştirme Workflow'u](#geliştirme-workflowu)
- [Sorun Giderme](#sorun-giderme)
- [Ek Kaynaklar](#ek-kaynaklar)

---

## 📋 Gereksinimler

Başlamadan önce, yüklü olduğundan emin olun:

### **Gerekli Yazılım**

- [ ] **Node.js** 20.x veya üzeri (LTS önerilir)
  - İndir: [nodejs.org](https://nodejs.org/)
  - Doğrula: `node --version` (v20+ olmalı)
- [ ] **npm** veya **yarn** veya **pnpm** paket yöneticisi
  - Doğrula: `npm --version` veya `yarn --version`
- [ ] **PostgreSQL** 14+ veritabanı
  - İndir: [postgresql.org](https://www.postgresql.org/download/)
  - Alternatif: Docker kurulumu (aşağıya bakın)
- [ ] **Git** sürüm kontrolü
  - İndir: [git-scm.com](https://git-scm.com/)

### **Opsiyonel Araçlar**

- [ ] **VS Code** (önerilen kod editörü)
- [ ] **DBeaver** veya **pgAdmin** (veritabanı GUI)
- [ ] **GitHub CLI** (GitHub entegrasyonu için)

---

## ⚡ Hızlı Başlangıç

**5 dakikada çalışır hale getirin:**

```bash
# 1. Repository'yi klonlayın
git clone https://github.com/Norethion/my-portfolio.git
cd my-portfolio

# 2. Bağımlılıkları yükleyin
npm install

# 3. .env.local dosyası oluşturun
cp .env.example .env.local  # Varsa
# Veya manuel olarak aşağıdaki içerikle oluşturun

# 4. PostgreSQL'i başlatın (çalışmıyorsa)
# Windows: PostgreSQL servisini çalıştırın
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# 5. Veritabanı oluşturun
createdb portfolio

# 6. Migration'ları çalıştırın
npx drizzle-kit push

# 7. Dev sunucusunu başlatın
npm run dev

# 8. Tarayıcıyı açın
# http://localhost:3000 adresine gidin
```

---

## 📖 Detaylı Kurulum

### **Adım 1: Repository'yi Klonlama**

```bash
# HTTPS kullanarak
git clone https://github.com/Norethion/my-portfolio.git

# Veya SSH kullanarak
git clone git@github.com:Norethion/my-portfolio.git

# Projeye gidin
cd my-portfolio
```

### **Adım 2: Bağımlılıkları Yükleme**

```bash
# npm kullanarak
npm install

# Veya yarn kullanarak
yarn install

# Veya pnpm kullanarak
pnpm install
```

**Yükleme şunları içerir:**
- Next.js 16 framework
- React 19 UI kütüphanesi
- Veritabanı için Drizzle ORM
- shadcn/ui bileşenleri
- WebGL efektleri için Vanta.js
- Durum yönetimi için Zustand
- Ve daha fazlası...

### **Adım 3: Ortam Değişkenlerini Yapılandırma**

Root dizinde `.env.local` dosyası oluşturun:

```env
# ===========================================
# VERİTABANI YAPILANDIRMASI
# ===========================================

# Yerel PostgreSQL Veritabanı
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio

# ===========================================
# SUPABASE (Opsiyonel - production için)
# ===========================================

NEXT_PUBLIC_SUPABASE_URL=supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase-anon-key

# ===========================================
# GELİŞTİRME BAYRAKLARI
# ===========================================

# Debug modunu etkinleştir (opsiyonel)
DEBUG=true
```

### **Adım 4: Veritabanı ve Admin Kurulumu**

1. **Veritabanını oluşturun:**
```bash
createdb portfolio
```

2. **Tabloları oluşturun:**
```bash
npx drizzle-kit push
```

3. **Admin Şifresi ve GitHub Ayarları:**
Bu adımda admin şifrenizi ve GitHub kullanıcı adınızı veritabanına kaydedeceksiniz:
```bash
npm run setup
```
Terminaldeki yönergeleri izleyin.

### **Adım 4: PostgreSQL Kurulumu**

Eğer bilgisayarınızda PostgreSQL yüklü değilse:

#### **Seçenek A: Yerel Yükleme**

**Windows:**
1. [postgresql.org](https://www.postgresql.org/download/windows/) adresinden indirin
2. Installer'ı çalıştırın
3. Belirlediğiniz şifreyi hatırlayın
4. PostgreSQL servisini başlatın

**macOS:**
```bash
# Homebrew kullanarak
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Seçenek B: Docker** (Alternatif)

```bash
# Docker'da PostgreSQL çalıştırın
docker run --name portfolio-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:16-alpine

# Veritabanına erişin
docker exec -it portfolio-db psql -U postgres -d portfolio
```

### **Adım 5: Veritabanı ve Admin Kurulumu**

Veritabanı servisi çalıştıktan sonra sırasıyla:

1. **Veritabanını oluşturun:**
```bash
createdb portfolio
```

2. **Tabloları oluşturun:**
```bash
npx drizzle-kit push
```

3. **Admin Şifresi ve GitHub Ayarları:**
Bu adımda admin şifrenizi ve GitHub kullanıcı adınızı veritabanına kaydedeceksiniz:
```bash
npm run setup
```
Terminaldeki yönergeleri izleyin.

### **Adım 6: Geliştirme Sunucusunu Başlatma**

```bash
npm run dev

# Veya port belirtme ile
PORT=3000 npm run dev
```

**Beklenen Çıktı:**

```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
✓ Compiled / in 500ms
```

**Tarayıcıda Açın:**

[http://localhost:3000](http://localhost:3000) adresine gidin

---

## 🗄️ Veritabanı Yapılandırması

### **Connection String Formatı**

```
postgresql://username:password@host:port/database
```

**Örnekler:**

```env
# Yerel varsayılan
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio

# Özel kullanıcı ve port
DATABASE_URL=postgresql://kullanici:sifre@localhost:5433/portfolio

# Uzak veritabanı
DATABASE_URL=postgresql://user:pass@db.example.com:5432/portfolio
```

### **Drizzle Yapılandırması**

Proje `drizzle.config.ts` kullanır:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### **Veritabanı Şeması Genel Bakış**

**Tablolar:**

1. **personal_info** - Kullanıcı bio, iletişim, sosyal linkler
2. **projects** - GitHub ve manuel projeler
3. **cv_experiences** - İş deneyimi girişleri
4. **cv_education** - Eğitim geçmişi
5. **cv_skills** - Kategoriye göre yetenekler
6. **settings** - Uygulama ayarları

**İlişkiler:**
- Tüm tablolar otomatik artan `id`'ye sahip
- Sıralama için `order` alanı
- `created_at` zaman damgaları
- Soft delete yeteneği

---

## 🔐 Admin Panel Kurulumu

### **Admin Paneli'ne Erişim**

1. Geliştirme sunucusunu başlatın: `npm run dev`
2. Tarayıcıyı açın: http://localhost:3000
3. Herhangi bir yerde `Ctrl+K` (veya Mac'te `Cmd+K`) tuşlarına basın
4. Admin şifresini girin (`.env.local` dosyasından)
5. **"Login"** tıklayın

### **Admin Şifresi**

Admin şifresini **Adım 5**'te `npm run setup` komutu ile belirlediniz.

**Şifreyi Değiştirmek İsterseniz:**

Terminalden tekrar şu komutu çalıştırabilirsiniz:
```bash
npm run setup
```
VEYA veritabanındaki `settings` tablosundan `admin_password` değerini manuel olarak güncelleyebilirsiniz.

**Güvenlik Önerileri:**

- 16+ karakter kullanın
- Büyük harf, küçük harf, rakam, sembol içer
- Yaygın şifreler kullanmayın
- Parola yöneticisi kullanmayı düşünün

**Güçlü Şifre Örneği:**

```
Portfoyum2024$Guvenli!
```

### **Admin Paneli Özellikleri**

Giriş yaptıktan sonra şunları yapabilirsiniz:

#### **👤 Kişisel Bilgiler**
- İsim, iş unvanı, bio (TR/EN) düzenle
- İletişim bilgilerini güncelle (e-posta, telefon, konum)
- Sosyal linkleri yönet (GitHub, LinkedIn, Twitter, vs.)
- Avatar yükle veya bağla
- Dilleri ayarla

#### **💼 Projeler**
- GitHub'dan projeleri senkronize et
- Manuel projeler ekle
- Proje görünürlüğünü değiştir
- Sürükle-bırak ile yeniden sırala
- Proje metadata'sını yönet

#### **📄 CV Yönetimi**
- İş deneyimleri ekle/düzenle
- Eğitim geçmişini güncelle
- Yetenekleri kategoriye göre yönet
- LinkedIn'den içe aktar (JSON/CSV/ZIP)

---

## ✅ Doğrulama

### **Yüklemeyi Kontrol Et**

Her şeyin doğru kurulduğunu doğrulamak için bu komutları çalıştırın:

```bash
# Node.js sürümünü kontrol et
node --version  # v20+ olmalı

# PostgreSQL'i kontrol et
psql --version  # 14+ olmalı

# Yüklenen bağımlılıkları kontrol et
npm list --depth=0

# Veritabanı bağlantısını doğrula
psql -d portfolio -c "SELECT COUNT(*) FROM personal_info;"

# Geliştirme sunucusunu kontrol et
npm run dev  # Hata olmadan başlamalı
```

### **Web Sitesini Test Et**

1. **Ana Sayfa**
   - http://localhost:3000 adresine gidin
   - Hata olmadan yüklenmeli
   - Açık/Koyu mod değiştirme çalışmalı
   - Dil değiştirici çalışmalı (TR/EN)

2. **Admin Paneli**
   - `Ctrl+K` tuşlarına basın
   - Admin şifresi ile giriş yapın
   - Dashboard yüklenir
   - Tüm bölümlere erişilebilir

3. **Veritabanı Bağlantısı**
   - Kişisel bilgi eklemeyi deneyin
   - Değişiklikleri kaydedin
   - Kalıcılığı doğrulayın

4. **API Route'ları**
   - DevTools'da network sekmesini kontrol edin
   - API çağrıları 200 durum kodu döndürmeli
   - CORS hatası olmamalı

---

## 🔄 Geliştirme Workflow'u

### **Yaygın Komutlar**

```bash
# Geliştirme
npm run dev          # Hot reload ile dev sunucusunu başlat

# Production
npm run build        # Production için build
npm run start        # Production sunucusunu başlat

# Veritabanı
npx drizzle-kit push      # Schema değişikliklerini push et
npx drizzle-kit generate  # Migration'ları oluştur
npx drizzle-kit migrate   # Migration'ları çalıştır
npx drizzle-kit studio    # Drizzle Studio'yu aç

# Kod Kalitesi
npm run lint         # ESLint çalıştır
npm run type-check   # TypeScript tip kontrolü (varsa)
```

### **Veritabanı Geliştirme**

**Şema Değişiklikleri Yapma:**

1. `lib/db/schema.ts` dosyasını düzenleyin
2. Çalıştırın: `npx drizzle-kit push`
3. Değişiklikler hemen uygulanır

**Drizzle Studio Kullanma:**

```bash
npx drizzle-kit studio

# Görsel veritabanı editörünü açar:
# http://localhost:4983
```

**Veritabanını Yedekleme:**

```bash
# Veri dışa aktarma
pg_dump -d portfolio > backup.sql

# Veri içe aktarma
psql -d portfolio < backup.sql
```

### **Dosya Yapısı**

```
my-portfolio/
├── app/                    # Next.js app router sayfalar
│   ├── api/               # API route'ları
│   ├── admin/             # Admin sayfalar
│   ├── page.tsx           # Ana sayfa
│   └── layout.tsx         # Root layout
├── components/            # React bileşenleri
├── lib/                   # Yardımcı programlar
│   └── db/               # Veritabanı dosyaları
│       ├── schema.ts     # Drizzle schema
│       └── drizzle.ts    # DB client
├── public/               # Statik dosyalar
├── stores/               # Zustand store'ları
├── drizzle/              # Migration'lar
├── .env.local            # Ortam değişkenleri
└── package.json          # Bağımlılıklar
```

---

## 🔧 Sorun Giderme

### **Sorun: Port 3000 Kullanımda**

**Hata:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Çözüm:**
```bash
# 3000 portundaki süreci öldür
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Veya farklı port kullan
PORT=3001 npm run dev
```

### **Sorun: Veritabanı Bağlantı Başarısız**

**Hata:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Çözüm:**
1. PostgreSQL'in çalıştığını kontrol edin:
```bash
# Windows
sc query postgresql-x64-16

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

2. `.env.local` içindeki connection string'i doğrulayın
3. Veritabanının var olduğunu kontrol edin:
```bash
psql -l | grep portfolio
```

### **Sorun: Modül Bulunamadı**

**Hata:**
```
Module not found: Can't resolve 'xyz'
```

**Çözüm:**
```bash
# Bağımlılıkları yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Next.js önbelleğini temizle
rm -rf .next
npm run dev
```

### **Sorun: Migration Hataları**

**Hata:**
```
Failed to push migration
```

**Çözüm:**
```bash
# Veritabanını sil ve yeniden oluştur
dropdb portfolio
createdb portfolio
npx drizzle-kit push

# Veya belirli tabloyu sıfırla
psql -d portfolio -c "DROP TABLE IF EXISTS personal_info CASCADE;"
npx drizzle-kit push
```

### **Sorun: Admin Paneli Yüklenmiyor**

**Hata:**
```
Admin authentication failed
```

**Çözüm:**
1. `.env.local` içindeki `NEXT_PUBLIC_ADMIN_KEY`'i kontrol edin
2. Fazladan boşluk veya tırnak olmadığını doğrulayın
3. Dev sunucusunu yeniden başlatın: `npm run dev`
4. Tarayıcı localStorage'ını temizleyin:
```javascript
// Tarayıcı konsolunda
localStorage.clear()
```

---

## 📚 Ek Kaynaklar

### **Dokümantasyon**

- 📖 [Next.js Dokümanları](https://nextjs.org/docs)
- 📖 [React Dokümanları](https://react.dev)
- 📖 [Drizzle ORM Dokümanları](https://orm.drizzle.team/docs)
- 📖 [Tailwind CSS Dokümanları](https://tailwindcss.com/docs)
- 📖 [shadcn/ui Dokümanları](https://ui.shadcn.com)

### **Eğitimler**

- 🎥 Next.js Hızlandırılmış Kurs
- 🎥 PostgreSQL Temelleri
- 🎥 React için TypeScript
- 🎥 Tailwind CSS Eğitimi

### **Araçlar**

- 🔍 [Drizzle Studio](http://localhost:4983)
- 🔍 [PostgreSQL GUI Araçları](https://www.postgresql.org/download/)
- 🔍 [Next.js Dev Araçları](https://nextjs.org/docs)

### **Topluluk**

- 💬 GitHub Tartışmaları
- 💬 Discord Topluluğu
- 💬 Stack Overflow

---

## 🎉 Sıradaki Adımlar

Başarılı kurulumdan sonra:

1. ✅ Admin panelini keşfedin
2. ✅ Kişisel bilgilerinizi ekleyin
3. ✅ GitHub projelerini senkronize edin
4. ✅ LinkedIn'den CV verilerini içe aktarın
5. ✅ Temayı özelleştirin
6. ✅ Production'a dağıtın

**Dağıtıma hazır mısınız?** Bkz: [Dağıtım Rehberi](DEPLOYMENT_TR.md)

---

<div align="center">

**Kodlamanın Keyfini Çıkarın! 🚀**

Norethion tarafından ❤️ ile yapılmıştır

</div>

