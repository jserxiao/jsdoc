# 五、多媒体

## 图像

```html
<!-- 基本图像 -->
<img src="image.jpg" alt="图片描述">

<!-- 指定尺寸 -->
<img src="image.jpg" alt="描述" width="300" height="200">

<!-- 懒加载 -->
<img src="image.jpg" alt="描述" loading="lazy">

<!-- 响应式图片 -->
<img 
    srcset="small.jpg 300w, medium.jpg 600w, large.jpg 900w"
    sizes="(max-width: 600px) 300px, 600px"
    src="medium.jpg"
    alt="响应式图片"
>

<!-- picture 元素 -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="回退图片">
</picture>
```

---

## 音频

```html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    您的浏览器不支持音频元素。
</audio>

<!-- 属性 -->
<audio 
    src="audio.mp3" 
    controls    <!-- 显示控件 -->
    autoplay    <!-- 自动播放 -->
    loop        <!-- 循环播放 -->
    muted       <!-- 静音 -->
    preload="auto"  <!-- 预加载 -->
>
```

---

## 视频

```html
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    您的浏览器不支持视频元素。
</video>

<!-- 带封面图 -->
<video 
    src="video.mp4" 
    controls 
    poster="cover.jpg"
    preload="metadata"
>
```

---

## iframe

```html
<iframe 
    src="https://example.com" 
    width="600" 
    height="400"
    title="嵌入内容"
    sandbox="allow-scripts allow-same-origin"
    loading="lazy"
></iframe>
```

---

[返回上级目录](../README.md)
