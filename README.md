# نظام إدارة الأجهزة والمعدات
## Asset Management System

تطبيق ويب متكامل لمتابعة وإدارة الأجهزة والمعدات مع إمكانية الجرد الفوري.

### المميزات 🎯

- ✅ عرض قائمة شاملة للأجهزة والمعدات
- ✅ إضافة أجهزة جديدة بسهولة
- ✅ تعديل بيانات الأجهزة الموجودة
- ✅ حذف الأجهزة غير المستخدمة
- ✅ جرد تلقائي مع إحصائيات فورية
- ✅ بحث وتصفية متقدمة
- ✅ تحديثات فورية من قاعدة البيانات (Real-time)
- ✅ واجهة مستخدم عربية احترافية

### المتطلبات 📋

- Node.js 18+ 
- npm أو yarn

### التثبيت والتشغيل 🚀

```bash
# تثبيت المتعلقات
npm install

# تشغيل بيئة التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة الإنتاج محلياً
npm run preview
```

### البنية الهندسية 🏗️

```
src/
├── components/        # مكونات React
│   ├── InventoryStats.tsx    # لوحة الإحصائيات
│   ├── DeviceList.tsx        # قائمة الأجهزة
│   └── DeviceForm.tsx        # نموذج الإضافة/التعديل
├── services/         # خدمات Firebase
│   └── deviceService.ts      # عمليات قاعدة البيانات
├── types/            # تعريفات TypeScript
│   └── device.ts             # نوع الجهاز
├── firebase.ts       # تكوين Firebase
├── App.tsx          # المكون الرئيسي
├── App.css          # أنماط التطبيق
└── main.tsx         # نقطة الدخول

```

### التقنيات المستخدمة 🛠️

- **React 19** - مكتبة واجهات المستخدم
- **TypeScript** - للكود آمن النوع
- **Firebase Realtime Database** - قاعدة البيانات السحابية
- **Tailwind CSS** - أطار العمل للتصميم
- **Vite** - أداة البناء والتطوير السريعة

### قاعدة البيانات 🗄️

التطبيق متصل بـ Firebase Realtime Database:
- `databaseURL`: https://assetsmanagement-b8a6f-default-rtdb.firebaseio.com
- المسار الرئيسي: `/devices`

كل جهاز يحتوي على:
```json
{
  "id": "device_id",
  "name": "اسم الجهاز",
  "serialNumber": "رقم المسلسل",
  "category": "الفئة",
  "status": "الحالة",
  "location": "الموقع",
  "description": "الوصف",
  "addedDate": "تاريخ الإضافة",
  "lastModified": "آخر تعديل"
}
```

### حالات الأجهزة

- `in-use` - قيد الاستخدام
- `available` - متاح
- `maintenance` - تحت الصيانة
- `retired` - متقاعد

### التطوير 💻

```bash
# تثبيت المتعلقات
npm install

# تشغيل سيرفر التطوير
npm run dev

# فحص الأخطاء (Linting)
npm run lint

# بناء للإنتاج
npm run build
```

### المساهمة 🤝

المشروع مفتوح للمساهمة والتحسينات.

### الترخيص 📝

MIT License
