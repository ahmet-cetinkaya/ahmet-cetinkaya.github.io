export enum Locales {
  en = "en",
  tr = "tr",
}

//#region Enums
export enum TranslationKeys {
  //#region Apps
  apps_welcome_hello = "apps_welcome_hello",
  apps_welcome_technologies = "apps_welcome_technologies",
  apps_welcome_about_me = "apps_welcome_about_me",
  apps_welcome_about_me_confirm = "apps_welcome_about_me_confirm",
  apps_welcome_about_me_markdown = "apps_welcome_about_me_markdown",
  apps_welcome_about_me_short_text = "apps_welcome_about_me_short_text",
  apps_welcome_background = "apps_welcome_background",
  apps_welcome_certifications = "apps_welcome_certifications",
  apps_welcome_completed = "apps_welcome_completed",
  apps_welcome_completed_text = "apps_welcome_completed_text",
  apps_welcome_educations = "apps_welcome_educations",
  apps_welcome_experiences = "apps_welcome_experiences",
  apps_welcome_finish = "apps_welcome_finish",
  apps_welcome_if_you_want_to_contact_me = "apps_welcome_if_you_want_to_contact_me",
  apps_welcome_present = "apps_welcome_present",
  apps_welcome_welcome = "apps_welcome_welcome",
  //#endregion

  //#region Certifications
  certificates_1_description_markdown = "certificates_1_description_markdown",
  certificates_1_name = "certificates_1_name",
  certificates_2_description_markdown = "certificates_2_description_markdown",
  certificates_2_name = "certificates_2_name",
  certificates_3_description_markdown = "certificates_3_description_markdown",
  certificates_3_name = "certificates_3_name",
  certificates_4_description_markdown = "certificates_4_description_markdown",
  certificates_4_name = "certificates_4_name",
  certificates_5_description_markdown = "certificates_5_description_markdown",
  certificates_5_name = "certificates_5_name",
  certificates_6_description_markdown = "certificates_6_description_markdown",
  certificates_6_name = "certificates_6_name",
  certificates_7_description_markdown = "certificates_7_description_markdown",
  certificates_7_name = "certificates_7_name",
  certificates_8_description_markdown = "certificates_8_description_markdown",
  certificates_8_name = "certificates_8_name",
  certificates_9_description_markdown = "certificates_9_description_markdown",
  certificates_9_name = "certificates_9_name",
  certificates_10_description_markdown = "certificates_10_description_markdown",
  certificates_10_name = "certificates_10_name",
  //#endregion

  //#region Common
  common_apps = "common_apps",
  common_contact = "common_contact",
  common_email = "common_email",
  common_next = "common_next",
  common_prev = "common_prev",
  common_show_more = "common_show_more",
  common_system = "common_system",
  //#endregion

  //#region Curriculum Vitae
  curriculum_vitae_1_description_markdown = "curriculum_vitae_1_description_markdown",
  curriculum_vitae_2_description_markdown = "curriculum_vitae_2_description_markdown",
  curriculum_vitae_3_description_markdown = "curriculum_vitae_3_description_markdown",
  curriculum_vitae_computer_engineering = "curriculum_vitae_computer_engineering",
  curriculum_vitae_intern = "curriculum_vitae_intern",
  curriculum_vitae_software_developer = "curriculum_vitae_software_developer",
  curriculum_vitae_software_developer_and_instructor = "curriculum_vitae_software_developer_and_instructor",
  //#endregion

  //#region Educations
  educations_1_department = "educations_1_department",
  educations_2_department = "educations_2_department",
  educations_2_description_markdown = "educations_2_description_markdown",
  //#endregion

  //#region Links
  links_github = "links_github",
  links_instagram = "links_instagram",
  links_itchio = "links_itchio",
  links_linkedin = "links_linkedin",
  links_mastodon = "links_mastodon",
  links_x = "links_x",
  //#endregion

  //#region Organizations
  organizations_ahmet_cetinkaya = "organizations_ahmet_cetinkaya",
  organizations_amazon_web_service = "organizations_amazon_web_service",
  organizations_amazon_web_services = "organizations_amazon_web_services",
  organizations_antalya_karatay_anatolian_high_school = "organizations_antalya_karatay_anatolian_high_school",
  organizations_kodlamaio = "organizations_kodlamaio",
  organizations_meb = "organizations_meb",
  organizations_mehmet_akif_ersoy_university = "organizations_mehmet_akif_ersoy_university",
  organizations_mng_kargo = "organizations_mng_kargo",
  organizations_udemy = "organizations_udemy",
  //#endregion
}
//#endregion

//#region Data
export const Translations: Record<TranslationKeys, Record<Locales, string>> = {
  //#region Apps
  [TranslationKeys.apps_welcome_hello]: {
    en: "Hello",
    tr: "Merhaba",
  },
  [TranslationKeys.apps_welcome_technologies]: {
    en: "Technologies",
    tr: "Teknolojiler",
  },
  [TranslationKeys.apps_welcome_about_me]: {
    en: "About Me",
    tr: "Hakkımda",
  },
  [TranslationKeys.apps_welcome_about_me_confirm]: {
    en: "I have read and got to know you, nice to meet you.",
    tr: "Okudum ve sizi tanıdım, tanıştığımıza memnun oldum.",
  },
  [TranslationKeys.apps_welcome_about_me_markdown]: {
    en: `Hello, I’m **Ahmet Çetinkaya**. I was born and raised in [**Istanbul**](https://www.openstreetmap.org/node/1882099475#map=7/39.398/30.811) in 1999. My interest in technology started at a young age. I got my first computer when I was 6 years old, and since then, I’ve had a life deeply connected with computers. In my early years, I started creating mods for my favorite games using various technical programs, which were my first steps into the world of software.

After completing my primary education in Istanbul, I moved to [**Antalya**](https://www.openstreetmap.org/node/428039517#map=7/37.823/30.927) and continued my secondary education at **Antalya Karatay Anatolian High School**. During high school, alongside my focus on science subjects, I developed an interest in **web programming**. I created and managed several websites and also wrote **technology** news. This experience helped me gain expertise in both software and digital media.

In 2018, I began studying Computer Engineering at [**Mehmet Akif Ersoy University**](https://www.mehmetakif.edu.tr), starting with an English preparatory program followed by four years of dedicated education and self-improvement. These years not only enhanced my technical skills but also helped me develop important competencies such as problem-solving, analytical thinking, and teamwork.

In 2022, my internship at [**Kodlama.io**](https://github.com/kodlamaio-projects) marked a significant turning point in my career. During and after the internship, I took my first steps into the workforce while continuing my education. I worked with various public institutions and leading companies, managing and developing **projects**, providing **consulting** services, and teaching in various corporate training programs and boot camps. These roles helped solidify my software development skills and gave me the opportunity to guide the next generation of software developers by teaching them about technology and software. In 2023, I graduated as a **Computer Engineer** with a **3.70 GPA** out of 4, ranking second in my faculty, and continued my career as a computer engineer.

My approach to technology is driven by a constant **desire to learn**, inspiring me to discover new things every day. Sharing what I’ve learned on this journey, reaching more people, and contributing to the **software world** is my ultimate goal. Supporting the philosophy of [**GNU philosophy**](https://www.gnu.org/philosophy/philosophy.tr.html) and producing projects in this area, as well as being a conscious consumer in the digital world, are particularly important to me in contributing to the software world. In my software development process, I strive to embrace and apply various **software philosophies, principles**, and **quality criteria**, which form the foundation of my work. I believe that success in the software world is not only possible through technological knowledge but also through good software practices and quality awareness.`,
    tr: `Merhaba, ben **Ahmet Çetinkaya**. 1999 yılında [**İstanbul**](https://www.openstreetmap.org/node/1882099475#map=7/39.398/30.811)'da doğdum ve büyüdüm. Teknolojiye olan ilgim küçük yaşlarda başladı. 6 yaşında ilk bilgisayarıma sahip oldum ve o günden itibaren bilgisayarlarla içli dışlı bir yaşamım oldu. Küçük yaşlarda, farklı teknik programları kullanarak sevdiğim oyunlara modlar yapmaya başladım; bu da yazılım dünyasına attığım ilk adımlarım oldu.

İlköğretim yıllarımı İstanbul'da tamamladıktan sonra, [**Antalya**](https://www.openstreetmap.org/node/428039517#map=7/37.823/30.927)'da yaşamaya başlayarak ortaöğrenimimi **Antalya Karatay Anadolu Lisesi**'nde sürdürdüm. Lise yıllarımda, sayısal derslerin yanında aynı zamanda **web programlama** alanına da bir merak geliştirdim. Çeşitli web sayfaları oluşturarak yönettim, ayrıca **teknoloji** haberleri yazdım. Bu sayede hem yazılım hem de dijital medya alanında tecrübe kazandım.

2018 yılında, [**Mehmet Akif Ersoy Üniversitesi**](https://www.mehmetakif.edu.tr)'nde **Bilgisayar Mühendisliği** bölümüne başladım. İngilizce hazırlık programı ve ardından dört yıl süren eğitim ve kişisel gelişim sürecimle devam ettim. Bu yıllar, teknik becerilerimi geliştirmekle kalmayıp, aynı zamanda problem çözme, analitik düşünme ve takım çalışması gibi önemli yetkinlikler kazanmama da yardımcı oldu.

2022 yılında [**Kodlama.io**](https://github.com/kodlamaio-projects)'da başladığım staj, kariyerimde önemli bir dönüm noktasıydı. Staj döneminde ve sonrasında eğitimimle paralel olarak iş hayatına adım attım. Birçok resmi kurum ve önde gelen firmalar ile çalışarak; **projeler** yönettim ve geliştirdim, **danışmanlık** hizmeti verdim, aynı zamanda çeşitli kurumsal şirket eğitimlerinde ve hazırlık kamplarında **eğitmenlik** yaptım. Bu görevlerim, yazılım geliştirme becerilerimi pekiştirmemi sağladı ve başkalarına teknoloji ve yazılım konusunda eğitim vererek yeni nesil yazılımcılara rehberlik etme fırsatı sundu. 2023 yılında **bilgisayar mühendisi** olarak **4 üzerinden 3.70** not ortalamasıyla, **fakülte ikincisi** olarak mezun oldum ve iş hayatıma bilgisayar mühendisi olarak devam ettim.

Teknolojiye olan **tutumum**, sürekli olarak **öğrenme isteğim**le birleşiyor ve her gün yeni şeyler keşfetmek için bana ilham veriyor. Bu yolculukta öğrendiklerimi paylaşmak, daha fazla insana dokunmak ve **yazılım dünyasına katkı sağlamak** en büyük hedefim. [**Özgür yazılım (GNU)** felsefesi](https://www.gnu.org/philosophy/philosophy.tr.html)ni desteklemek ve bu alanda projeler üretmek, dijital alanda da bilinçli bir tüketici olmak yazılım dünyasına katkı sağlamak için benim adıma oldukça önemli. Yazılım geliştirme sürecimde, aynı zamanda çeşitli **yazılım felsefeleri, prensipleri** ve **kalite kriterlerini** benimseyip uygulamaya özen gösteriyorum. Bu, çalışmalarımın temel taşlarını oluşturuyor. Yazılım dünyasında başarılı olmanın, sadece teknolojik bilgiyle değil, aynı zamanda iyi bir yazılım pratiği ve kalite bilinciyle mümkün olduğuna inanıyorum.`,
  },
  [TranslationKeys.apps_welcome_about_me_short_text]: {
    en: "Hi, I'm a software developer and a computer engineer. I'm interested in web technologies, software development, and computer science.",
    tr: "Merhaba, bir yazılım geliştirici ve bilgisayar mühendisiyim. Web teknolojileri, yazılım geliştirme ve bilgisayar bilimleriyle ilgileniyorum.",
  },
  [TranslationKeys.apps_welcome_background]: {
    en: "Background",
    tr: "Geçmiş",
  },
  [TranslationKeys.apps_welcome_certifications]: {
    en: "Certifications",
    tr: "Sertifikalar",
  },
  [TranslationKeys.apps_welcome_completed]: {
    en: "Completed",
    tr: "Tamamlandı",
  },
  [TranslationKeys.apps_welcome_completed_text]: {
    en: "You have completed the welcome wizard.",
    tr: "Tanışma sihirbazını tamamladınız.",
  },
  [TranslationKeys.apps_welcome_educations]: {
    en: "Educations",
    tr: "Eğitimler",
  },
  [TranslationKeys.apps_welcome_experiences]: {
    en: "Experiences",
    tr: "Deneyimler",
  },
  [TranslationKeys.apps_welcome_finish]: {
    en: "Finish",
    tr: "Bitir",
  },
  [TranslationKeys.apps_welcome_if_you_want_to_contact_me]: {
    en: "If you want to contact me, you can send an e-mail to:",
    tr: "Benimle iletişime geçmek isterseniz, e-posta gönderebilirsiniz:",
  },
  [TranslationKeys.apps_welcome_present]: {
    en: "Present",
    tr: "Halen",
  },
  [TranslationKeys.apps_welcome_welcome]: {
    en: "Welcome",
    tr: "Hoş Geldin",
  },
  //#endregion

  //#region Certifications
  [TranslationKeys.certificates_1_description_markdown]: {
    en: `- **Web Development**: Modern techniques, principles
- **Frontend Technologies**: HTML5, CSS3, Flexbox, Bootstrap
- **JavaScript & TypeScript**: ES6+, React, Vue, Angular
- **Backend Technologies**: Node.js, NPM, MongoDB, ExpressJS, Rest API
- **React & Redux**: React intricacies, Redux, Hooks
- **Angular**: TypeScript, Dependency Injection
- **VueJS**: Frontend development
- **Backend Strength**: Strong backend techniques
- **ExpressJS**: Fundamentals, advanced backend coding
- **MongoDB**: Database modeling
- **JWT & Authentication**: JSON Web Token, authentication`,
    tr: `- **Web Geliştiriciliği**: Modern teknikler, prensipler
- **Frontend Teknolojileri**: HTML5, CSS3, Flexbox, Bootstrap
- **JavaScript & TypeScript**: ES6+, React, Vue, Angular
- **Backend Teknolojileri**: Node.js, NPM, MongoDB, ExpressJS, Rest API
- **React & Redux**: React incelikleri, Redux, Hooks
- **Angular**: TypeScript, Dependency Injection
- **VueJS**: Frontend geliştirme
- **Backend Gücü**: Güçlü backend teknikleri
- **ExpressJS**: Temeller, gelişmiş backend kodlama
- **MongoDB**: Veritabanı modelleme
- **JWT & Authentication**: JSON Web Token, kimlik doğrulama`,
  },
  [TranslationKeys.certificates_1_name]: {
    en: "Modern Web Development Course | Scratch to Advanced",
    tr: "Modern Web Geliştirme Kursu | Sıfırdan Sektörün Yükseklerine",
  },
  [TranslationKeys.certificates_2_description_markdown]: {
    en: `- **ReactJS Architecture**
- **React Router V4**
- **HTTP Requests**
- **State Management**: Context API, Dispatch, Reducer, Action
- **Forms**
- **CRUD Application**`,
    tr: `- **ReactJS Mimarisi**
- **React Router V4**
- **HTTP İstekleri**
- **State Management**: Context API, Dispatch, Reducer, Action
- **Formlar**
- **CRUD Uygulaması**`,
  },
  [TranslationKeys.certificates_2_name]: {
    en: "React and Context API From Scratch",
    tr: "Sıfırdan React ve Context Api",
  },
  [TranslationKeys.certificates_3_description_markdown]: {
    en: `- Unity Updates and Versions
- Scene and Game Screen Management
- Hierarchy, Project, and Inspector Panel
- Material, Shader, and Prefab Usage
- Terrain (Unity 2018.3) and Sea Creation
- User Interface (UI)
- Lighting System and SkyBox
- Script and Console Window
- Variables, If Else, and Loops
- Arrays, Methods, and Classes
- Prefab and Component Usage
- Trigger, Score, and Game Over
- Building and Publishing to Platforms (Windows, Mac, Android)
- Animations, Movement, and Camera Control
- AI and Mobile Integration
- Projects: Top Control, Camera Control, Obstacles, Random Rotation, Bullet Shooting, Asteroids and Explosion Effects, Score System, Game Over, Main Menu and Level Transitions, Save System, Google AdMob Ads, Enemy Creation, Health Recovery, Coin Collection, Mobile Joystick and Jumping, Level Design, Building and Publishing to Google Play Store.`,
    tr: `- Unity Güncellemeler ve Versiyonlar
- Sahne ve Oyun Ekranı Yönetimi
- Hierarchy, Project, ve Inspector Paneli
- Material, Shader, ve Prefab Kullanımı
- Terrain (Unity 2018.3) ve Deniz Yapımı
- Kullanıcı Arayüzü (UI)
- Işık Sistemi ve SkyBox
- Script ve Console Penceresi
- Değişkenler, If Else ve Döngüler
- Diziler, Metotlar, ve Sınıflar
- Prefab ve Component Kullanımı
- Trigger, Score, ve Oyun Sonu
- Build Etme ve Platforma Göre Yayınlama (Windows, Mac, Android)
- Animasyonlar, Hareket ve Kamera Kontrolü
- Yapay Zeka ve Mobil Entegrasyon
- Projeler: Top Kontrolü, Kamera Kontrolü, Engeller, Random Döndürme, Kurşun Ateş Etme, Asteroid ve Patlama Efektleri, Score Sistemi, Oyun Sonu, Ana Menü ve Level Geçişi, Kayıt Sistemi, Google AdMob ile Reklam, Düşman Oluşturma, Can Kazanma, Altın Toplama, Mobil Joystick ve Zıplama, Level Dizaynı, Build Etme (Google Play Store).`,
  },
  [TranslationKeys.certificates_3_name]: {
    en: "Unity C# | 2D & 3D Game Development From Scratch",
    tr: "Unity C# | Sıfırdan 2D & 3D Oyun Geliştirme Eğitimi",
  },
  [TranslationKeys.certificates_4_description_markdown]: {
    en: `- Python programming fundamentals, real-life application
- C# programming: variables, conditionals, loops, arrays
- Algorithm design and problem-solving techniques
- Object-oriented programming (OOP) concepts in C#: classes, objects, inheritance, polymorphism
- Database programming with SQL: basic queries, advanced querying techniques, joins, subqueries
- LINQ for querying collections in C#
- C# database programming with Entity Framework: ORM, data modeling, migrations
- Web API development: creating RESTful services, HTTP methods (GET, POST, PUT, DELETE), JSON
- Web frontend development: HTML5, CSS3, responsive design, Bootstrap framework
- Angular framework: components, services, routing, data binding, forms, directives, RxJS`,
    tr: `- Python programlamaya giriş: temel kavramlar, gerçek hayat uygulamaları
- C# programlama: değişkenler, şart blokları, döngüler, diziler
- Algoritma tasarımı ve problem çözme teknikleri
- Nesne Yönelimli Programlama (OOP) C#: sınıflar, nesneler, kalıtım, polimorfizm
- SQL ile veri tabanı programlaması: temel sorgular, ileri seviye sorgulama teknikleri, join'ler, alt sorgular
- LINQ ile koleksiyonları sorgulama (C#)
- C# ile veri tabanı programlama (Entity Framework): ORM, veri modelleme, migration'lar
- Web API geliştirme: RESTful servisler oluşturma, HTTP metodları (GET, POST, PUT, DELETE), JSON
- Web frontend geliştirme: HTML5, CSS3, duyarlı tasarım, Bootstrap framework
- Angular framework: bileşenler, servisler, yönlendirme, veri bağlama, formlar, direktifler, RxJS`,
  },
  [TranslationKeys.certificates_4_name]: {
    en: "Software Developer Training Camp - C# and Angular",
    tr: "Yazılım Geliştirici Yetiştirme Kampı - C# ve Angular",
  },
  [TranslationKeys.certificates_5_description_markdown]: {
    en: `- Data Integrity and Design Errors
- Design Evaluations
- Relationships and Data Loss
- Abstraction and Inheritance-Focused Design
- One-to-Many Relationships
- Primary and Foreign Key Rules
- Final Touches in Design
- Key Field Design
- Open-Closed Principle
- Query Redirection
- Denormalization
- Design Evaluation for Enterprise Architectures`,
    tr: `- Veri Bütünlüğü ve Tasarım Hataları
- Tasarımda Değerlendirmeler
- İlişkiler ve Veri Kaybı
- Soyutlama ve Miras Odaklı Tasarım
- Bire-Çok İlişkiler
- Primary ve Foreign Key Kuralları
- Tasarım Son Rötuşları
- Key Alanlarının Tasarımı
- Open-Closed Prensibi
- Sorgu Yönlendirme
- Denormalizasyon
- Kurumsal Mimarilerde Tasarım Değerlendirmesi`,
  },
  [TranslationKeys.certificates_5_name]: {
    en: "SQL Server Database Design for Enterprise Architectures",
    tr: "Kurumsal Mimariler İçin Sql Server Veri Tabanı Tasarımı ",
  },
  [TranslationKeys.certificates_6_description_markdown]: {
    en: `- Real-life programming introduction
- Java Basics
- Java Variables, conditionals, loops, arrays
- Object-Oriented Programming with Java
- Advanced Object-Oriented Programming with Java
- Multi-tier enterprise architectures
- Getting started with Spring Boot
- Spring JPA/Hibernate
- Spring AOP
- Spring Security
- JavaScript
- React Basics
- React Hooks
- React/Redux
- React Security`,
    tr: `- Gerçek hayatla ilişkilendirilmiş programlamaya giriş
- Java Temelleri
- Java Değişkenler, şart blokları, döngüler, diziler
- Java ile nesne yönelimli programlamaya giriş
- Java ile nesne yönelimli programlamada uzmanlaşma
- Çok katmanlı kurumsal mimariler
- Spring Boot ile çalışmaya başlamak
- Spring JPA/Hibernate
- Spring AOP
- Spring Security
- JavaScript
- React Temelleri
- React Hooks
- React/Redux
- React Security`,
  },
  [TranslationKeys.certificates_6_name]: {
    en: "Software Developer Training Camp - JAVA and React",
    tr: "Yazılım Geliştirici Yetiştirme Kampı - JAVA ve React",
  },
  [TranslationKeys.certificates_7_description_markdown]: {
    en: `- JavaScript Basics
- JavaScript OOP with JavaScript Internals
- Promises & Async Programming
- Reflect API, Proxy API`,
    tr: `- JavaScript Temelleri
- JavaScript OOP ve JavaScript İç Yapıları
- Promiseler ve Asenkron Programlama
- Reflect API, Proxy API`,
  },
  [TranslationKeys.certificates_7_name]: {
    en: "Software Developer Training Camp - JavaScript",
    tr: "Yazılım Geliştirici Yetiştirme Kampı - JavaScript",
  },
  [TranslationKeys.certificates_8_description_markdown]: {
    en: `- **Data Types and Working with Variables**
- Working with Data Types (int, long, short, byte, bool, char, double, decimal, enum)
- Working with **var** and Type Safety
- Variable Scoping
- Default Parameter and Ref/Out Parameter Methods
- **Control Structures and Loops**
- If-Else, Else If, Switch, Nested If Blocks
- And/Or Operations, While, For, Do-While, ForEach Loops
- **Functions and Methods**
- Functions, Parameters, Method Overloading
- Static Methods and Classes
- Parameterized and Default Parameter Methods
- Delegates (Action, Func), Events
- **Arrays and Collections**
- One-dimensional and Multi-dimensional Arrays
- ArrayList and Collections (Type-Safe Collections, Dictionary)
- Generic Classes and Methods, Constraints
- LINQ Filtering
- **Object-Oriented Programming (OOP) Basics**
- Classes and Property Definitions
- Encapsulation, Virtual and Abstract Methods
- Interfaces, Inheritance, Polymorphism
- Constructors, Constructor Injection
- Private, Protected, Internal, Public Access Modifiers
- **Exception Handling and Error Management**
- Error Management and Exception Handling
- Creating Custom Exception Classes
- Error Handling with Delegates and Action
- **Database Management and Entity Framework**
- ADO.NET and Database Creation
- Entity Framework: Context, Listing, Adding, Updating, Deleting
- LINQ, Repository and Generic Repository Pattern
- Validation: FluentValidation
- **Design Patterns**
- Singleton, Factory, Abstract Factory, Prototype, Builder
- Observer, Strategy, Composite, Proxy, Decorator, Command
- Dependency Injection, IoC Container
- **Test Development**
- Unit Testing, Test Driven Development (TDD)
- Assert, CollectionAssert, StringAssert, Data Driven Tests
- Mocking, Test Lifecycle, ExpectedException
- **Multi-layer Architectures and Dependency Injection**
- Creating Layers: Data Access, Business Layer, API
- Repository Pattern, Using IoC Container
- Implementing NHibernate and Entity Framework
- **Reflection, Attributes, and Advanced Concepts**
- Working with Reflection (MethodInfo, Invoke)
- Attributes, Reflection, and Dependency Injection
- Delegates, Func, Action, and Events`,
    tr: `- **Veri Tipleri ve Değişkenlerle Çalışma**
- Veri Tipleriyle Çalışma (int, long, short, byte, bool, char, double, decimal, enum)
- **var** ve Tip Güvenliği
- Değişken Kapsamı
- Varsayılan Parametre ve Ref/Out Parametreli Metotlar
- **Kontrol Yapıları ve Döngüler**
- If-Else, Else If, Switch, İç İçe If Blokları
- And/Or İşlemleri, While, For, Do-While, ForEach Döngüleri
- **Fonksiyonlar ve Metotlar**
- Fonksiyonlar, Parametreler, Metot Overloading
- Static Metotlar ve Sınıflar
- Parametreli ve Varsayılan Parametreli Metotlar
- Delegeler (Action, Func), Events
- **Diziler ve Koleksiyonlar**
- Tek boyutlu ve Çok boyutlu Diziler
- ArrayList ve Koleksiyonlar (Tip Güvenli Koleksiyonlar, Dictionary)
- Generic Sınıflar ve Metotlar, Kısıtlar
- LINQ ile Filtreleme
- **Nesne Yönelimli Programlama (OOP) Temelleri**
- Sınıflar ve Özellik Tanımlamaları
- Encapsulation, Virtual ve Abstract Metodlar
- Interface, Kalıtım, Polimorfizm
- Yapıcılar, Yapıcı Enjeksiyonu
- Private, Protected, Internal, Public Erişim Modifikasyonları
- **Hata Yönetimi ve İstisna İşleme**
- Hata Yönetimi ve İstisna İşleme
- Kendi Hata Sınıflarımızı Yazmak
- Delegeler ve Action ile Hata Yönetimi
- **Veritabanı Yönetimi ve Entity Framework**
- ADO.NET ve Veritabanı Oluşturma
- Entity Framework: Context, Listeleme, Ekleme, Güncelleme, Silme
- LINQ, Repository ve Generic Repository Pattern
- Doğrulama: FluentValidation
- **Tasarım Desenleri**
- Singleton, Factory, Abstract Factory, Prototype, Builder
- Observer, Strategy, Composite, Proxy, Decorator, Command
- Dependency Injection, IoC Container
- **Test Geliştirme**
- Unit Testing, Test Driven Development (TDD)
- Assert, CollectionAssert, StringAssert, Veri Tabanlı Testler
- Mocking, Test Yaşam Döngüsü, ExpectedException
- **Çok Katmanlı Mimariler ve Bağımlılık Enjeksiyonu**
- Katmanların Oluşturulması: Veri Erişimi, İş Katmanı, API
- Repository Deseni, IoC Container Kullanımı
- NHibernate ve Entity Framework Uygulamaları
- **Reflection, Attribute ve İleri Düzey Konular**
- Reflection ile Çalışma (MethodInfo, Invoke)
- Attribute, Reflection ve Dependency Injection
- Delegeler, Func, Action ve Events`,
  },
  [TranslationKeys.certificates_8_name]: {
    en: "45+ Hour C# Course From Scratch to Advanced",
    tr: "Sıfırdan İleri Seviyeye 45+ Saat C# Kursu",
  },
  [TranslationKeys.certificates_9_description_markdown]: {
    en: `- **C# Programming Fundamentals**: Variables, data types, control structures (if-else, switch), loops (for, while), arrays
- **Algorithm Design and Problem-Solving Techniques**: Developing efficient algorithms, complexity analysis, problem-solving strategies
- **Object-Oriented Programming (OOP)**: Classes, objects, inheritance, polymorphism, encapsulation, abstraction, interfaces in C#
- **Database Programming with SQL**: Basic queries, relational databases, joins, subqueries, data integrity
- **LINQ (Language Integrated Query)**: Querying, filtering, sorting, and grouping data in collections
- **Entity Framework and ORM**: Data modeling, migrations, database connections in C#, repository pattern for data access layer
- **Web API Development**: Creating RESTful APIs, HTTP methods (GET, POST, PUT, DELETE), data exchange with JSON
- **Frontend Web Development**: HTML5, CSS3, responsive design, user-friendly interfaces, Bootstrap framework
- **Angular Framework**: Components, services, routing, data binding, forms, RxJS for reactive programming
- **Clean Architecture**: Layered architecture, dependency management, separating business logic, testability
- **CQRS (Command Query Responsibility Segregation)**: Separating command and query operations, optimizing data management, reducing system complexity
- **Search and Data Management (ElasticSearch)**: Data searching, fast querying in large datasets, real-time search engines
- **Dependency Injection**: Providing dependencies externally, achieving testability and loose coupling
- **Database Performance Optimization and Advanced SQL**: Query optimization, index usage, stored procedures, data analysis techniques
- **Test-Driven Development (TDD)**: Writing unit tests, developing with tests, debugging, using mock objects
- **Software Design Patterns**: Singleton, Factory, Strategy, Observer, Command, Repository, Dependency Injection patterns`,
    tr: `- **C# Programlama Temelleri**: Değişkenler, veri türleri, kontrol yapıları (if-else, switch), döngüler (for, while), diziler
- **Algoritma Tasarımı ve Problem Çözme Yöntemleri**: Verimli algoritmalar geliştirme, karmaşıklık analizi, problem çözme stratejileri
- **Nesne Yönelimli Programlama (OOP)**: C# ile sınıflar, nesneler, kalıtım, polimorfizm, encapsulation, abstraction, interface'ler
- **Veritabanı Programlaması**: SQL ile temel sorgulamalar, ilişkisel veritabanları, join'ler, alt sorgular, veri bütünlüğü
- **LINQ (Language Integrated Query)**: Koleksiyonlarda veri sorgulama, filtreleme, sıralama, gruplama
- **Entity Framework ve ORM**: Veri modelleme, migration işlemleri, C# ile veritabanı bağlantıları, veri erişim katmanı (repository pattern)
- **Web API Geliştirme**: RESTful API’ler oluşturma, HTTP metotları (GET, POST, PUT, DELETE), JSON ile veri iletimi
- **Frontend Web Geliştirme**: HTML5, CSS3, responsive tasarım, kullanıcı dostu arayüzler, Bootstrap framework
- **Angular Framework**: Bileşenler (components), servisler (services), yönlendirme (routing), veri bağlama (data binding), formlar, RxJS ile reaktif programlama
- **Temiz Mimari (Clean Architecture)**: Katmanlı mimari, bağımlılık yönetimi, iş mantığının ayrı tutulması, test edilebilirlik
- **CQRS (Command Query Responsibility Segregation)**: Komut ve sorgu işlemlerini ayırarak veri yönetimi ve optimizasyonu, sistemdeki karmaşıklığı azaltma
- **Arama ve Veri Yönetimi (ElasticSearch)**: Veri arama, büyük veri kümelerinde hızlı sorgulama, gerçek zamanlı arama motorları
- **Bağımlılık Enjeksiyonu (Dependency Injection)**: Nesne bağımlılıklarını dışarıdan sağlamak, test edilebilirlik ve gevşek bağlama sağlama
- **Veritabanı Performans İyileştirme ve İleri Düzey SQL**: İleri seviye sorgu optimizasyonu, index kullanımı, stored procedures, veri analizi teknikleri
- **Test Odaklı Geliştirme (TDD)**: Birim testleri yazma, testler ile geliştirme, hata ayıklama, mock nesneleri kullanımı
- **Yazılım Tasarım Desenleri**: Singleton, Factory, Strategy, Observer, Command, Repository, Dependency Injection desenleri`,
  },
  [TranslationKeys.certificates_9_name]: {
    en: ".NET Core and Angular Bootcamp",
    tr: ".NET Core ve Angular Bootcamp",
  },
  [TranslationKeys.certificates_10_description_markdown]: {
    en: `- AWS Cloud Global Infrastructure (Regions, Availability Zones, Edge Locations)
- Benefits of AWS Cloud (Scalability, High Availability, Performance, Security, Cost-Effectiveness, Global Reach)
- Core AWS Services: Compute (EC2, Lambda, Lightsail), Network (VPC, Route 53, Direct Connect), Databases (RDS, DynamoDB, Redshift), Storage (S3, EBS, Glacier)
- AWS Well-Architected Framework (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization)
- Shared Responsibility Model (AWS: Security of the Cloud, Customer: Security in the Cloud)
- Core Security Services (IAM, AWS Shield, AWS WAF, KMS)
- AWS Cloud Migration Tools (AWS Migration Hub, DMS, SMS)
- Financial Benefits and Cost Management (Pay-as-you-go, Reserved Instances, EC2 Spot Instances, AWS Pricing Calculator, AWS Budgets, AWS Organizations)`,
    tr: `- AWS Cloud Küresel Altyapısı (Bölgeler, Erişilebilirlik Bölgeleri, Edge Lokasyonları)
- AWS Cloud’un Faydaları (Ölçeklenebilirlik, Yüksek Erişilebilirlik, Performans, Güvenlik, Maliyet Etkinliği, Küresel Ulaşılabilirlik)
- AWS Temel Servisleri: Hesaplama (EC2, Lambda, Lightsail), Ağ (VPC, Route 53, Direct Connect), Veritabanları (RDS, DynamoDB, Redshift), Depolama (S3, EBS, Glacier)
- AWS İyi Tasarlanmış Altyapı Çerçevesi (Operasyonel Mükemmeliyet, Güvenlik, Güvenilirlik, Performans Verimliliği, Maliyet Optimizasyonu)
- Paylaşılan Sorumluluk Modeli (AWS: Cloud Güvenliği, Müşteri: Cloud İçindeki Güvenlik)
- Temel Güvenlik Servisleri (IAM, AWS Shield, AWS WAF, KMS)
- AWS Cloud Göç Araçları (AWS Migration Hub, DMS, SMS)
- Finansal Faydalar ve Maliyet Yönetimi (Kullandıkça Öde, Rezervli Durumlar, EC2 Spot Instance'ları, AWS Fiyatlandırma Hesaplayıcısı, AWS Bütçeleri, AWS Organizasyonları)`,
  },
  [TranslationKeys.certificates_10_name]: {
    en: "AWS Cloud Practitioner Essentials",
    tr: "AWS Bulut Uygulayıcı Temelleri",
  },
  //#endregion

  //#region Common
  [TranslationKeys.common_apps]: {
    en: "Apps",
    tr: "Uygulamalar",
  },
  [TranslationKeys.common_contact]: {
    en: "Contact",
    tr: "İletişim",
  },
  [TranslationKeys.common_email]: {
    en: "E-mail",
    tr: "E-posta",
  },
  [TranslationKeys.common_next]: {
    en: "Next",
    tr: "İleri",
  },
  [TranslationKeys.common_prev]: {
    en: "Previous",
    tr: "Geri",
  },
  [TranslationKeys.common_show_more]: {
    en: "Show More",
    tr: "Daha Fazla Göster",
  },
  [TranslationKeys.common_system]: {
    en: "System",
    tr: "Sistem",
  },
  //#endregion

  //#region Curriculum Vitae
  [TranslationKeys.curriculum_vitae_1_description_markdown]: {
    en: `- Various software projects analysis and development`,
    tr: `- Çeşitli yazılım projeleri analizi ve geliştirme`,
  },
  [TranslationKeys.curriculum_vitae_2_description_markdown]: {
    en: `- Instructor in ETIYA Academy In-House Training Program
- Software Development on the DevArchitecture Framework`,
    tr: `- ETIYA Akademi Şirket İçi Eğitim Programında Eğitmenlik
- DevArchitecture Framework Üzerinde Yazılım Geliştirme`,
  },
  [TranslationKeys.curriculum_vitae_3_description_markdown]: {
    en: `- Software Development and Consulting for State Hydraulic Works (DSI)
- Software Development and Consulting for BOSCH
- Instructor in ESBAŞ In-house Training Program
- Software Development on the NArchitecture Framework
- Instructor in TÜBİSAD Training Program
- Instructor in ETİYA-TÜBİSAD Training Program
- Instructor in BOSCH Training Program`,
    tr: `- Devlet Su İşleri (DSİ) için Yazılım Geliştirme ve Danışmanlık
- BOSCH için Yazılım Geliştirme ve Danışmanlık
- ESBAŞ Şirket İçi Eğitim Programında Eğitmenlik
- NArchitecture Framework Üzerinde Yazılım Geliştirme
- TÜBİSAD Eğitim Programında Eğitmenlik
- ETİYA-TÜBİSAD Eğitim Programında Eğitmenlik
- BOSCH Eğitim Programında Eğitmenlik`,
  },
  [TranslationKeys.curriculum_vitae_computer_engineering]: {
    en: "Computer Engineering",
    tr: "Bilgisayar Mühendisliği",
  },
  [TranslationKeys.curriculum_vitae_intern]: {
    en: "Intern",
    tr: "Stajyer",
  },
  [TranslationKeys.curriculum_vitae_software_developer]: {
    en: "Software Developer",
    tr: "Yazılım Geliştirici",
  },
  [TranslationKeys.curriculum_vitae_software_developer_and_instructor]: {
    en: "Software Developer and Instructor",
    tr: "Yazılım Geliştirici ve Eğitmen",
  },
  //#endregion

  //#region Educations
  [TranslationKeys.educations_1_department]: {
    en: "STEM (Science, Technology, Engineering, Mathematics)",
    tr: "Sayısal",
  },
  [TranslationKeys.educations_2_department]: {
    en: "Faculty of Architecture and Engineering - Computer Engineering",
    tr: "Mimarlık ve Mühendislik Fakültesi - Bilgisayar Mühendisliği",
  },
  [TranslationKeys.educations_2_description_markdown]: {
    en: `- Bachelor's thesis titled "Software Framework Implementing Microservice Architecture"
- Drone simulation for TÜBİTAK competition
- Development of hospital software for Mehmet Akif Ersoy University Faculty of Veterinary Medicine, Pathology Department, for use on web and mobile
- Various other projects...`,
    tr: `- "- "Mikroservis Mimarisini Gerçekleştiren Yazılım Çerçevesi" başlıklı lisans tezi
- Tubitak yarışması için drone simülasyonu
- Mehmet Akif Ersoy Veterinerlik Fakültesi Patoloji Bölümü için web ve mobil'de kullanılmak üzere hastane yazılımı geliştirme
- Çeşitli birçok proje...`,
  },
  //#endregion

  //#region Links
  [TranslationKeys.links_github]: {
    en: "Github",
    tr: "Github",
  },
  [TranslationKeys.links_instagram]: {
    en: "Instagram",
    tr: "Instagram",
  },
  [TranslationKeys.links_itchio]: {
    en: "Itch.io",
    tr: "Itch.io",
  },
  [TranslationKeys.links_linkedin]: {
    en: "LinkedIn",
    tr: "LinkedIn",
  },
  [TranslationKeys.links_mastodon]: {
    en: "Mastodon",
    tr: "Mastodon",
  },
  [TranslationKeys.links_x]: {
    en: "X",
    tr: "X",
  },
  //#endregion

  //#region Organizations
  [TranslationKeys.organizations_ahmet_cetinkaya]: {
    en: "Ahmet Çetinkaya (Freelance)",
    tr: "Ahmet Çetinkaya (Serbest Çalışan)",
  },
  [TranslationKeys.organizations_amazon_web_service]: {
    en: "Amazon Web Services",
    tr: "Amazon Web Servisleri",
  },
  [TranslationKeys.organizations_amazon_web_services]: {
    en: "Amazon Web Services",
    tr: "Amazon Web Servisleri",
  },
  [TranslationKeys.organizations_antalya_karatay_anatolian_high_school]: {
    en: "Antalya Karatay Anatolian High School",
    tr: "Antalya Karatay Anadolu Lisesi",
  },
  [TranslationKeys.organizations_kodlamaio]: {
    en: "Kodlama.io",
    tr: "Kodlama.io",
  },
  [TranslationKeys.organizations_meb]: {
    en: "Ministry of National Education",
    tr: "Milli Eğitim Bakanlığı",
  },
  [TranslationKeys.organizations_mehmet_akif_ersoy_university]: {
    en: "Mehmet Akif Ersoy University",
    tr: "Mehmet Akif Ersoy Üniversitesi",
  },
  [TranslationKeys.organizations_mng_kargo]: {
    en: "MNG Kargo",
    tr: "MNG Kargo",
  },
  [TranslationKeys.organizations_udemy]: {
    en: "Udemy",
    tr: "Udemy",
  },
  //#endregion
};
//#endregion

export type TranslationKey = keyof typeof Translations;
export const locales = Object.keys(Locales) as Locales[];
