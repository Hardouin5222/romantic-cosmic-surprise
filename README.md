# Romantic Cosmic Surprise

Tek sayfalık romantik, atmosferik, Rusça web deneyimi.

## Kurulum

```bash
npm install
npm run dev
```

## Yayınlama

Vercel için:

```bash
npm run build
```

Sonra projeyi Vercel'e yükle. WhatsApp önizlemesi için `index.html` içindeki OG etiketlerinde gerçek domain kullanman daha sağlıklı olur:

```html
<meta property="og:image" content="https://senin-domainin.com/og-cover.png" />
<meta property="og:url" content="https://senin-domainin.com" />
```

## Müzik

`public/music.mp3` dosyasını kendi telifsiz/yasal klasik müziğinle değiştir. Tarayıcı kuralı nedeniyle müzik, kullanıcı `Коснись моей души` butonuna basınca başlar.

## Kapak görseli

`public/og-cover.png` WhatsApp kapak görselidir. İstersen Midjourney/DALL-E ile daha ultra gerçekçi görsel üretip aynı isimle değiştir.

Önerilen prompt:

A deeply atmospheric and dark cinematic background, soft glowing stardust and slow-moving light beams, elegant color palette of midnight blue and subtle gold, mysterious, ethereal and romantic vibe, highly detailed, 8k resolution, unreal engine 5 render, volumetric lighting, vertical romantic composition
