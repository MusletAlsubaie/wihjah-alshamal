# وِجهة الشمال — Prototype

نموذج ويب تصوري بسيط لمشروع **وِجهة الشمال**، مخصص كرابط داعم لفكرة المشاركة في إنباثون إمارة منطقة الحدود الشمالية.

> هذا المشروع **Prototype فقط**: لا يتصل بأنظمة حكومية فعلية، ولا يستخدم بيانات شخصية أو سرية، ويعتمد على بيانات وقواعد تجريبية داخل المتصفح.

## الوظائف الموجودة

- الصفحة الرئيسية.
- تقديم طلب جديد.
- تصنيف تجريبي حسب كلمات مفتاحية.
- اقتراح فئة وأولوية ومسار.
- إرسال طلب تجريبي.
- متابعة حالة الطلب.
- لوحة موظف ببيانات اصطناعية.

## التشغيل في Cursor

افتح المجلد في Cursor، ثم افتح Terminal ونفّذ:

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## رفع المشروع إلى GitHub

أنشئ مستودعًا عامًا باسم:

```text
wihjah-alshamal
```

ثم من Terminal داخل المشروع:

```bash
git init
git add .
git commit -m "Add Wihjah Al-Shamal concept prototype"
git branch -M main
git remote add origin https://github.com/MusletAlsubaie/wihjah-alshamal.git
git push -u origin main
```

رابط المستودع: https://github.com/MusletAlsubaie/wihjah-alshamal

## نشر رابط حي اختياري

بعد رفع المشروع إلى GitHub يمكنك نشره عبر Vercel ليصبح لديك رابط تطبيق حي بالإضافة إلى رابط GitHub.

## الهوية البصرية (Branding)

ملفات الهوية موجودة في `public/branding/`:

| الملف | الاستخدام |
|------|-----------|
| `logo-horizontal.png` | شعار الهيدر (خلفية شفافة) |
| `logo-primary.png` | أقسام التعريف والعرض الكبير |
| `logo-icon.png` | أيقونة صغيرة / الفوتر / Apple icon |
| `favicon-16.png` / `favicon-32.png` | أيقونة المتصفح |
| `hero-bg.png` | خلفية قسم Hero |
| `pattern-bg.png` | نمط زخرفي خفيف (أقسام ثانوية / فوتر) |
| `og-cover.png` | صورة Open Graph / المشاركة |
| `social-square.png` | معاينة مربعة للسوشال (1:1) |
| `social-story.png` | نسخة طولية للقصص (Stories) |

نسخ الشعارات الأصلية قبل إزالة الخلفية محفوظة كـ `*.original.png` داخل نفس المجلد.
لإعادة توليد النسخ الشفافة:

```bash
node scripts/make-logos-transparent.cjs
```

مسارات جاهزة للاستخدام في المشاركة:

```text
/branding/social-square.png
/branding/social-story.png
/branding/og-cover.png
```

## إعداد رابط الموقع (Open Graph)

عند النشر، عرّف الرابط العام حتى تصبح صور المشاركة مطلقة:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

الافتراضي محليًا: `http://localhost:3000`.

لتفعيل النقر المباشر على خريطة جوجل داخل نموذج الطلب/البلاغ أضف:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

بدون المفتاح تعمل الخريطة عبر عرض Google Maps Embed مع زر «موقعي الحالي» والبحث بالعنوان.

## ملاحظة المشاركة

المشروع الحالي يمثل واجهة ونموذجًا تصوريًا داعمًا للفكرة، وليس التنفيذ الإنتاجي أو التكامل الحكومي الكامل. احرص على الإفصاح عن أي مكونات سابقة أو أدوات خارجية وفق متطلبات الفعالية.
