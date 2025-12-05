# 🚀 Dağıtım Rehberi

> [🇹🇷 Türkçe](DEPLOYMENT_TR.md) | [🇬🇧 Read in English](DEPLOYMENT.md)

**Vercel** ve **Supabase** kullanarak portföyünüzü production'a dağıtma için kapsamlı rehber.

---

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Gereksinimler](#gereksinimler)
- [Hızlı Başlangıç (2 Dakika)](#hızlı-başlangıç-2-dakika)
- [Detaylı Kurulum](#detaylı-kurulum)
- [Veritabanı Migration](#veritabanı-migration)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Vercel'e Dağıtım](#vercele-dağıtım)
- [Dağıtım Sonrası](#dağıtım-sonrası)
- [Sorun Giderme](#sorun-giderme)
- [İleri Seviye Konular](#ileri-seviye-konular)

---

## 🎯 Genel Bakış

Bu rehber kapsar:

- ✅ **Vercel** - Frontend hosting ve dağıtım
- ✅ **Supabase** - PostgreSQL veritabanı hosting
- ✅ **Veritabanı Migration** - Şema kurulumu
- ✅ **Ortam Değişkenleri** - Yapılandırma
- ✅ **Production Kontrol Listesi** - Doğrulama adımları

### **Neden Vercel + Supabase?**

| Özellik | Fayda |
|---------|-------|
| 🚀 **Hızlı Dağıtım** | GitHub'dan tek tıkla dağıtım |
| 💰 **Ücretsiz Seviye** | Hobi projeleri için cömert limitler |
| 🔒 **Yerleşik Güvenlik** | HTTPS, ortam değişkenleri |
| 📊 **Analitik** | Yerleşik performans izleme |
| 🔗 **Kolay Entegrasyon** | Vercel ↔ Supabase kesintisiz bağlantı |
| 🌐 **Global CDN** | Dünya çapında hızlı yükleme |
| 🔄 **Otomatik Ölçekleme** | Trafik artışlarını yönetir |
| 💾 **Otomatik Yedeklemeler** | Günlük veritabanı yedeklemeleri |

---

## 📋 Gereksinimler

Başlamadan önce, sahip olduğunuzdan emin olun:

- [x] GitHub hesabı ve repository
- [x] Vercel hesabı ([vercel.com](https://vercel.com)'da ücretsiz kayıt)
- [x] Supabase hesabı ([supabase.com](https://supabase.com)'da ücretsiz kayıt)
- [x] Local proje kurulumu tamamlandı
- [x] `.env.local` local'de yapılandırıldı

---

## ⚡ Hızlı Başlangıç (2 Dakika)

**Portföyünüzü canlıya almanın en hızlı yolu:**

### **1. Supabase Veritabanı Oluşturun**

1. [supabase.com](https://supabase.com) adresine gidin
2. **"New Project"** tıklayın
3. Detayları doldurun:
   - **Name:** `my-portfolio`
   - **Database Password:** Güçlü bir şifre oluşturun (kaydedin!)
   - **Region:** Size en yakın olanı seçin
4. **"Create new project"** tıklayın
5. Kurulum için ~2 dakika bekleyin

### **2. Connection String'i Alın**

1. Supabase dashboard → **Settings** → **Database**
2. **"Connection string"** bölümüne gidin
3. **"Connection pooling"** sekmesine tıklayın
4. **"Transaction"** modunu seçin
5. Connection string'i kopyalayın

**Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### **3. Migration'ı Çalıştırın**

İki seçenek:

#### **Seçenek A: Supabase SQL Editor** (Önerilen)

1. Supabase Dashboard → **SQL Editor**
2. **"New Query"** tıklayın
3. Aşağıdaki SQL'i yapıştırın
4. **"Run"** tıklayın (veya CTRL+Enter)

**Migration SQL:**
```sql
-- Enum Types (Varsa hata vermez)
DO $$ BEGIN
    CREATE TYPE "public"."skill_category" AS ENUM('Frontend', 'Backend', 'Mobile', 'Desktop', 'DevOps', 'Database', 'Tools', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."skill_level" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tablolar
CREATE TABLE IF NOT EXISTS "personal_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"job_title" varchar(255),
	"bio_tr" text,
	"bio_en" text,
	"email" varchar(255),
	"phone" varchar(50),
	"github" varchar(255),
	"linkedin" varchar(255),
	"twitter" varchar(255),
	"instagram" varchar(255),
	"facebook" varchar(255),
	"location" varchar(255),
	"avatar" text,
	"languages" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" integer UNIQUE,
	"name" varchar(255) NOT NULL,
	"description" text,
	"custom_description" text,
	"url" text NOT NULL,
	"homepage" text,
	"language" varchar(50),
	"stars" integer DEFAULT 0 NOT NULL,
	"topics" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_manual" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"current" boolean DEFAULT false NOT NULL,
	"description" text,
	"location" varchar(255),
	"employment_type" varchar(50),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"field" varchar(255),
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"description" text,
	"grade" varchar(50),
	"activities" text,
	"location" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"level" varchar(50) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) UNIQUE NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- YENİ EKLENEN TABLOLAR
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "visitor_stats" (
	"date" varchar(15) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
```

✅ **Migration tamamlandı!**

#### **Seçenek B: Local Terminal**

1. Geçici olarak production `DATABASE_URL`'yi `.env.local`'e ekleyin
2. Çalıştırın: `npx drizzle-kit push`
3. `.env.local`'den production URL'yi kaldırın

### **4. Vercel'e Dağıtın**

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Add New Project"** tıklayın
3. GitHub repository'nizi import edin
4. Ortam değişkenlerini ekleyin (aşağıya bakın)
5. **"Deploy"** tıklayın

**Tamamlandı! 🎉** Site artık canlı!

---

## 📖 Detaylı Kurulum

### **Adım 1: Supabase Projesi Oluşturma**

#### **Yöntem A: Supabase'den Doğrudan**

1. [supabase.com](https://supabase.com) adresini ziyaret edin
2. Kaydolun veya giriş yapın
3. **"New Project"** tıklayın
4. Doldurun:
   - **Organization:** Seçin veya oluşturun
   - **Name:** `my-portfolio` (veya seçiminiz)
   - **Database Password:** Güçlü şifre
   - **Region:** Kullanıcılarınıza en yakın
5. **"Create new project"** tıklayın
6. ~2 dakika bekleyin

#### **Yöntem B: Vercel Üzerinden** (Alternatif)

1. Vercel Dashboard → Projeniz → **Storage**
2. **"Create Database"** tıklayın
3. **Supabase**'i seçin
4. İstemleri takip edin

### **Adım 2: Connection String Kurulumu**

**Önemli:** Production'da her zaman **connection pooling** kullanın!

1. Supabase Dashboard → **Settings** → **Database**
2. **"Connection string"** bölümüne gidin
3. **"Connection pooling"** sekmesine tıklayın
4. **"Transaction"** modunu seçin (önerilen)
5. Tam connection string'i kopyalayın

**Connection String Formatı:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Neden Transaction Modu?**

| Mod | Kullanım Durumu |
|------|----------------|
| **Transaction** | Varsayılan, çoğu uygulama için en iyi (önerilen) |
| **Session** | Uzun süreli bağlantılar |
| **Statement** | Salt okunur sorgular |

**⚠️ Önemli Notlar:**

- Şifrenizi asla kodda göstermeyin
- Sadece ortam değişkenlerini kullanın
- Connection string'leri güvende tutun

### **Adım 3: Veritabanı Migration**

Sizin için en uygun yöntemi seçin:

#### **Yöntem A: Supabase SQL Editor** (En Kolay)

1. Supabase Dashboard → **SQL Editor**
2. **"New Query"** butonuna tıklayın
3. Migration SQL'ini yapıştırın (Hızlı Başlangıç bölümünden)
4. **"Run"** tıklayın veya `CTRL+Enter` basın
5. Başarı mesajını görün: "Success. No rows returned"

**Alternatif:** Local dosyanızdan okuyun:
```bash
# Local terminal'inizde
cat drizzle/0000_redundant_naoko.sql | pbcopy  # Mac
cat drizzle/0000_redundant_naoko.sql | clip    # Windows
# Sonra SQL Editor'a yapıştırın
```

#### **Yöntem B: Drizzle CLI** (Geliştiriciler için)

1. **Geçici olarak** production URL'yi `.env.local`'e ekleyin:
```env
# Geçici - migration sonrası kaldırın!
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

2. Migration'ı çalıştırın:
```bash
npx drizzle-kit push
```

3. **ÖNEMLİ:** Production URL'yi `.env.local`'den kaldırın:
```env
# Sadece local veritabanınızı tutun
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
```

#### **Doğrulama**

Tablolarınızın oluşturulduğunu kontrol edin:

1. Supabase Dashboard → **Table Editor**
2. Görmelisiniz:
   - ✅ `personal_info`
   - ✅ `projects`
   - ✅ `cv_experiences`
   - ✅ `cv_education`
   - ✅ `cv_skills`
   - ✅ `settings`

---

## 🔐 Ortam Değişkenleri

### **Gerekli Değişkenler**

Bunları Vercel'e ekleyin:

#### **1. DATABASE_URL**

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Ortamlar:** Production ✅, Preview ✅, Development ✅

#### **2. NEXT_PUBLIC_ADMIN_KEY**

```env
NEXT_PUBLIC_ADMIN_KEY=güvenli-admin-sifreniz-buraya
```

**Ortamlar:** Production ✅, Preview ✅, Development ✅

**⚠️ Güvenlik İpuçları:**
- Güçlü bir şifre kullanın (16+ karakter)
- Parola yöneticisi kullanmayı düşünün
- Farklı ortamlar için farklı şifreler

### **Opsiyonel Değişkenler**

#### **3. GITHUB_USERNAME** (proje senkronizasyonu için)

```env
GITHUB_USERNAME=github-kullanici-adiniz
```

#### **4. GITHUB_TOKEN** (hız limitlerinden kaçınmak için)

```env
GITHUB_TOKEN=ghp_personal_access_token
```

**GitHub Token Nasıl Alınır:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Scope seçin: `public_repo`
5. Token'i kopyalayın (sadece bir kez gösterilir!)

### **Vercel'e Ekleme**

1. Vercel Dashboard → Projeniz → **Settings**
2. **Environment Variables** (sol kenar çubuğu)
3. **"Add New"** tıklayın
4. Doldurun:
   - **Name:** Değişken adı (örn: `DATABASE_URL`)
   - **Value:** Değişken değeri
   - **Environments:** Üçünü de seçin (Production, Preview, Development)
5. **"Save"** tıklayın

### **Önemli:** Değişken Eklendikten Sonra Yeniden Başlatın

Ortam değişkenlerini ekledikten sonra:
1. **Deployments**'a gidin
2. **"⋯"** → **"Redeploy"** tıklayın
3. Dağıtımın tamamlanmasını bekleyin

---

## 🚀 Vercel'e Dağıtım

### **Yöntem A: GitHub Entegrasyonu** (Önerilen)

#### **1. GitHub'a Push Edin**

```bash
# Local terminal'inizde
git add .
git commit -m "Dağıtıma hazır"
git push origin main
```

#### **2. Vercel'e Import Edin**

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Add New Project"** veya **"Import"** tıklayın
3. GitHub hesabınızı seçin
4. Repository'nizi seçin
5. **"Import"** tıklayın

#### **3. Projeyi Yapılandırın**

**Build Ayarları** (genellikle otomatik algılanır):
- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`

**Dağıtım**

1. Yapılandırmayı gözden geçirin
2. **"Deploy"** tıklayın
3. ~2-3 dakika bekleyin

🎉 **Siteniz canlı!**

### **Yöntem B: Vercel CLI**

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Giriş yapın
vercel login

# Dağıtın
vercel

# Production dağıtımı
vercel --prod
```

### **Yöntem C: Git Push Otomatik Dağıtım**

İlk kurulumdan sonra, `main`'e her push otomatik dağıtımı tetikler!

1. `main` branch'e push edin
2. Vercel değişiklikleri algılar
3. Production'a otomatik dağıtır

**Preview dağıtımları** her branch/PR için oluşturulur.

---

## ✅ Dağıtım Sonrası

### **1. Site Canlı Olduğunu Doğrulayın**

1. Vercel URL'nize gidin: `https://your-project.vercel.app`
2. Ana sayfanın yüklendiğini kontrol edin
3. Navigasyonu test edin

### **2. Admin Paneli'ni Test Edin**

1. Herhangi bir yerde `Ctrl+K` tuşlarına basın
2. Admin şifresini girin
3. Dashboard'un yüklendiğini doğrulayın
4. Tüm bölümleri kontrol edin (Kişisel Bilgiler, Projeler, CV)

### **3. Veritabanı Bağlantısını Test Edin**

Admin Panelinde:
1. **Kişisel Bilgiler**'e gidin
2. Bio'nuzu düzenlemeyi deneyin
3. Değişiklikleri kaydedin
4. Değişikliklerin ana sayfada görünüp görünmediğini kontrol edin

### **4. GitHub Entegrasyonunu Test Edin** (etkinse)

1. Admin Panel → **Projeler**
2. **"Sync from GitHub"** tıklayın
3. Projelerin göründüğünü doğrulayın

### **5. Build Loglarını Kontrol Edin**

Vercel Dashboard → **Deployments** → Sonuncuya tıklayın → **Logs**

**Bakın:**
- ✅ Build başarılı
- ✅ Hata yok
- ✅ Tüm sayfalar oluşturuldu

---

## 🔧 Sorun Giderme

### **Sorun: "DATABASE_URL is not set"**

**Belirtiler:**
- Build başarılı ama site hata gösteriyor
- Ortam değişkeni eksik

**Çözüm:**
1. Vercel → Settings → Environment Variables
2. `DATABASE_URL` var olduğunu doğrulayın
3. Tüm ortamların seçili olduğunu kontrol edin (Prod, Preview, Dev)
4. Ekledikten sonra yeniden dağıtın

### **Sorun: Connection Timeout**

**Belirtiler:**
- Admin paneli yüklenmiyor
- Loglarda veritabanı hataları

**Çözüm:**
1. Connection string'de `?pgbouncer=true` içerdiğini doğrulayın
2. **Transaction** modunu kullandığınızı kontrol edin
3. Supabase Dashboard → Settings → Database → Connection pooling etkin olmalı
4. Gerekirse şifreyi sıfırlayıp tekrar deneyin

### **Sorun: "Relation does not exist"**

**Belirtiler:**
- Tablo bulunamadı hataları
- Veri kaydedilmiyor

**Çözüm:**
- Migration tamamlanmamış
- Migration'ı tekrar çalıştırın (SQL Editor veya Drizzle)
- Supabase Table Editor'da tabloların var olduğunu doğrulayın

### **Sorun: Password Authentication Failed**

**Belirtiler:**
- Veritabanına bağlanılamıyor
- Yanlış şifre hataları

**Çözüm:**
1. Supabase Dashboard → Settings → Database
2. **Reset Database Password**
3. Yeni şifreyle connection string'i güncelleyin
4. Vercel ortam değişkenini güncelleyin
5. Yeniden dağıtın

### **Sorun: Build Başarısız**

**Belirtiler:**
- Dağıtım başarısız
- Loglarda build hataları

**Çözüm:**
1. Belirli hatayı görmek için logları kontrol edin
2. Yaygın sorunlar:
   - TypeScript hataları → Önce local'de düzeltin
   - Eksik bağımlılıklar → `package.json`'ı kontrol edin
   - Ortam değişkenleri ayarlanmamış → Vercel'e ekleyin
3. Local'de build'i test edin: `npm run build`

### **Sorun: Yavaş Yükleme**

**Belirtiler:**
- Site yükleniyor ama çok yavaş
- API çağrıları zaman aşımı

**Çözüm:**
1. Supabase region'ın Vercel ile eşleştiğini kontrol edin
2. Connection pooling'i etkinleştirin
3. Veritabanı boyutunu kontrol edin (ücretsiz tier: 500MB)
4. Görselleri ve varlıkları optimize edin
5. Vercel Analytics'i etkinleştirin

---

## 🎓 İleri Seviye Konular

### **Özel Domain**

1. Vercel → Project → **Settings** → **Domains**
2. Domain'inizi ekleyin
3. DNS kayıtlarını güncelleyin (Vercel'de gösterilir)
4. Yayılmasını bekleyin (~24 saat)

### **Ortama Özel Değişkenler**

Farklı ortamlar için farklı veritabanları kullanın:

**Production:**
```
DATABASE_URL=postgresql://...production-db
```

**Preview:**
```
DATABASE_URL=postgresql://...preview-db
```

### **Veritabanı Yedeklemeleri**

**Supabase otomatik yedeklemeleri:**
- Günlük otomatik yedeklemeler
- 7 gün boyunca kullanılabilir
- Settings → Database → Backups

**Manuel yedekleme:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Geri yükleme:**
```bash
psql $DATABASE_URL < backup.sql
```

### **İzleme**

**Vercel Analytics:**
- Yerleşik performans izleme
- Gerçek zamanlı metrikler
- Kullanıcı analitiği

**Supabase İzleme:**
- Veritabanı performansı
- Sorgu analitiği
- Connection pool istatistikleri

### **Ölçekleme**

**Ücretsiz Seviye Limitleri:**

| Servis | Limit |
|---------|-------|
| Vercel | 100GB bant genişliği |
| Supabase | 500MB veritabanı, 2GB bant genişliği |

**Ne Zaman Yükseltme:**
- Bant genişliği limitlerini aşarken
- Veritabanı depolama alanını aşarken
- Daha fazla özellik ihtiyacı

---

## 📊 Production Kontrol Listesi

Canlıya çıkmadan önce doğrulayın:

- [ ] Supabase projesi oluşturuldu
- [ ] Pooling ile connection string alındı
- [ ] Migration başarıyla tamamlandı
- [ ] Ortam değişkenleri Vercel'e eklendi
- [ ] Admin şifresi ayarlandı (güçlü)
- [ ] GitHub kimlik bilgileri eklendi (kullanıyorsanız)
- [ ] Site Vercel'e dağıtıldı
- [ ] Ana sayfa doğru yükleniyor
- [ ] Admin panel erişilebilir (`Ctrl+K`)
- [ ] Veritabanı yazma işlemleri çalışıyor
- [ ] Build loglarında hata yok
- [ ] HTTPS etkin (otomatik)
- [ ] Özel domain yapılandırıldı (opsiyonel)

---

## 🎉 Başarılı!

Portföyünüz artık canlı! 🚀

**Sıradaki Adımlar:**
1. Kişisel bilgilerinizi ekleyin
2. Projeleri içe aktarın veya ekleyin
3. CV'nizi doldurun
4. Portföyünüzü paylaşın!

**Yardım mı Lazım?**

- 📖 [Kurulum Rehberi](../docs/SETUP_TR.md)
- 📖 [Sorun Giderme](#sorun-giderme)
- 🐛 [Sorun Bildir](https://github.com/Norethion/my-portfolio/issues)

---

## 📚 Ek Kaynaklar

- [Vercel Dokümantasyonu](https://vercel.com/docs)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Drizzle ORM Dokümanları](https://orm.drizzle.team/docs/overview)
- [Next.js Dağıtım](https://nextjs.org/docs/deployment)

---

<div align="center">

**Norethion tarafından ❤️ ile yapılmıştır**

</div>

