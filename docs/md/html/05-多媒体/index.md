# 五、多媒体

> 多媒体元素（图像、音频、视频）让网页更加生动丰富。掌握多媒体的正确使用方式，对于提升用户体验和 SEO 都至关重要。

## 学习要点

- 🖼️ 掌握图像的各种使用方式和优化技巧
- 🎵 理解音频和视频的嵌入方式
- 📱 学会响应式多媒体处理
- ⚡ 了解多媒体性能优化最佳实践

---

## 1. 图像（Images）

### 1.1 基本图像语法

```html
<!-- 基本图像 -->
<img src="image.jpg" alt="图片描述文字">

<!-- 指定尺寸 -->
<img 
    src="image.jpg" 
    alt="描述" 
    width="300" 
    height="200"
>

<!-- 懒加载（滚动到可视区域才加载） -->
<img src="image.jpg" alt="描述" loading="lazy">

<!-- 解码方式 -->
<img src="image.jpg" alt="描述" decoding="async">
```

### 1.2 alt 属性详解

`alt` 属性提供图片的替代文本，对 SEO 和可访问性都非常重要。

```html
<!-- ✅ 好的 alt 描述 -->
<img src="chart.png" alt="2024年销售增长趋势图，显示Q1增长15%">
<img src="team-photo.jpg" alt="公司团队合影，拍摄于2024年会">
<img src="product.png" alt="红色运动鞋产品图，侧面视角">

<!-- 装饰性图片（空 alt） -->
<img src="decorative-line.png" alt="">

<!-- ❌ 差的 alt 描述 -->
<img src="chart.png" alt="图片">
<img src="chart.png" alt="chart.png">
<img src="chart.png" alt="">
```

### 1.3 响应式图片

```html
<!-- srcset：提供不同分辨率的图片源 -->
<img 
    srcset="small.jpg 300w,
            medium.jpg 600w,
            large.jpg 900w,
            xlarge.jpg 1200w"
    sizes="(max-width: 600px) 300px,
           (max-width: 900px) 600px,
           (max-width: 1200px) 900px,
           1200px"
    src="medium.jpg"
    alt="响应式图片示例"
>

<!-- sizes 解释：
     - 屏幕宽度 ≤ 600px：使用 300px 宽的图片
     - 屏幕宽度 ≤ 900px：使用 600px 宽的图片
     - 屏幕宽度 ≤ 1200px：使用 900px 宽的图片
     - 其他情况：使用 1200px 宽的图片
-->

<!-- 高 DPI 屏幕支持 -->
<img 
    srcset="image-1x.jpg 1x,
            image-2x.jpg 2x,
            image-3x.jpg 3x"
    src="image-1x.jpg"
    alt="高分辨率图片"
>
```

### 1.4 picture 元素

`<picture>` 元素提供更灵活的图片选择方式。

```html
<!-- 现代格式优先 -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="回退到 JPEG">
</picture>

<!-- 响应式裁剪 -->
<picture>
    <!-- 大屏幕：横向图片 -->
    <source 
        media="(min-width: 1200px)"
        srcset="hero-desktop.jpg"
    >
    <!-- 中等屏幕：正方形图片 -->
    <source 
        media="(min-width: 768px)"
        srcset="hero-tablet.jpg"
    >
    <!-- 小屏幕：竖向图片 -->
    <img 
        src="hero-mobile.jpg" 
        alt="响应式裁剪图片"
        width="375"
        height="500"
    >
</picture>

<!-- 结合 art direction -->
<picture>
    <source 
        media="(min-width: 800px)"
        srcset="wide-crop.webp"
        type="image/webp"
    >
    <source 
        media="(min-width: 800px)"
        srcset="wide-crop.jpg"
    >
    <source srcset="narrow-crop.webp" type="image/webp">
    <img src="narrow-crop.jpg" alt="艺术裁剪示例">
</picture>
```

### 1.5 figure 与 figcaption

```html
<!-- 图片加说明 -->
<figure>
    <img src="chart.png" alt="销售增长图表">
    <figcaption>图1：2024年第一季度销售数据对比</figcaption>
</figure>

<!-- 多张图片 -->
<figure>
    <img src="photo1.jpg" alt="照片1">
    <img src="photo2.jpg" alt="照片2">
    <img src="photo3.jpg" alt="照片3">
    <figcaption>产品多角度展示图</figcaption>
</figure>

<!-- 代码示例 -->
<figure>
    <pre><code>function hello() {
    console.log('Hello World');
}</code></pre>
    <figcaption>示例代码：基础函数定义</figcaption>
</figure>
```

### 1.6 图像性能优化

```html
<!-- 懒加载 -->
<img src="image.jpg" loading="lazy" alt="懒加载图片">

<!-- 预加载关键图片 -->
<link rel="preload" as="image" href="hero-image.webp">

<!-- 占位符防止布局偏移 -->
<div style="aspect-ratio: 16/9; background: #f0f0f0;">
    <img 
        src="image.jpg" 
        alt="图片" 
        width="800" 
        height="450"
        loading="lazy"
        style="width: 100%; height: auto;"
    >
</div>

<!-- 低质量图片占位符 (LQIP) -->
<img 
    src="placeholder.jpg"
    data-src="full-size.jpg"
    alt="渐进加载图片"
    class="lazyload"
>

<!-- blur-up 技术 -->
<style>
    .blur-up {
        filter: blur(5px);
        transition: filter 0.3s;
    }
    .blur-up.loaded {
        filter: blur(0);
    }
</style>
```

---

## 2. 音频（Audio）

### 2.1 基本语法

```html
<!-- 基础音频播放器 -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    您的浏览器不支持音频播放。
</audio>

<!-- 简写形式 -->
<audio src="audio.mp3" controls></audio>
```

### 2.2 音频属性详解

```html
<audio 
    src="music.mp3"
    controls           <!-- 显示控制面板 -->
    autoplay           <!-- 自动播放（需要配合 muted） -->
    loop               <!-- 循环播放 -->
    muted              <!-- 静音 -->
    preload="auto"     <!-- 预加载策略 -->
>
</audio>

<!-- preload 值说明 -->
<!-- 
    auto: 预加载整个音频文件
    metadata: 只预加载元数据（时长、尺寸等）
    none: 不预加载
-->
```

### 2.3 JavaScript API

```html
<audio id="myAudio" src="music.mp3"></audio>
<button onclick="playAudio()">播放</button>
<button onclick="pauseAudio()">暂停</button>
<button onclick="setVolume(0.5)">音量50%</button>

<script>
const audio = document.getElementById('myAudio');

// 播放控制
function playAudio() {
    audio.play();
}

function pauseAudio() {
    audio.pause();
}

function setVolume(value) {
    audio.volume = value; // 0.0 到 1.0
}

// 属性
console.log(audio.duration);     // 总时长（秒）
console.log(audio.currentTime);  // 当前播放时间
console.log(audio.paused);       // 是否暂停
console.log(audio.ended);        // 是否播放完毕
console.log(audio.volume);       // 当前音量

// 事件监听
audio.addEventListener('play', () => console.log('开始播放'));
audio.addEventListener('pause', () => console.log('暂停'));
audio.addEventListener('ended', () => console.log('播放结束'));
audio.addEventListener('timeupdate', () => {
    console.log('当前时间:', audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
    console.log('元数据加载完成，总时长:', audio.duration);
});

// 跳转到指定时间
audio.currentTime = 30; // 跳转到 30 秒

// 播放速率
audio.playbackRate = 1.5; // 1.5倍速播放
</script>
```

### 2.4 自定义音频播放器

```html
<style>
.audio-player {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    max-width: 400px;
}

.audio-player button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #1890ff;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.audio-player button:hover {
    background: #40a9ff;
}

.progress-container {
    flex: 1;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    cursor: pointer;
}

.progress-bar {
    height: 100%;
    background: #1890ff;
    border-radius: 2px;
    width: 0%;
}

.time {
    font-size: 12px;
    color: #666;
    min-width: 80px;
    text-align: right;
}
</style>

<div class="audio-player">
    <button id="playBtn">▶</button>
    <div class="progress-container" id="progressContainer">
        <div class="progress-bar" id="progressBar"></div>
    </div>
    <span class="time" id="timeDisplay">0:00 / 0:00</span>
</div>

<audio id="audio" src="music.mp3"></audio>

<script>
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');

// 播放/暂停切换
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
});

// 更新进度条
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
    
    const current = formatTime(audio.currentTime);
    const total = formatTime(audio.duration);
    timeDisplay.textContent = `${current} / ${total}`;
});

// 点击进度条跳转
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 播放结束
audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    progressBar.style.width = '0%';
});
</script>
```

---

## 3. 视频（Video）

### 3.1 基本语法

```html
<!-- 基础视频播放器 -->
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    您的浏览器不支持视频播放。
</video>

<!-- 常用属性 -->
<video 
    src="video.mp4"
    controls           <!-- 显示控制面板 -->
    autoplay           <!-- 自动播放 -->
    muted              <!-- 静音（autoplay 需要此属性） -->
    loop               <!-- 循环播放 -->
    poster="cover.jpg" <!-- 封面图 -->
    preload="metadata" <!-- 预加载策略 -->
    playsinline        <!-- iOS 内联播放（不全屏） -->
    width="640"
    height="360"
>
</video>
```

### 3.2 视频属性详解

```html
<video 
    src="video.mp4"
    controls
    autoplay
    muted
    loop
    poster="poster.jpg"
    preload="auto"
    playsinline
    width="800"
    height="450"
>
</video>

<!--
属性说明：
- controls: 显示浏览器默认控件
- autoplay: 自动播放（必须配合 muted）
- muted: 静音
- loop: 循环播放
- poster: 视频封面图（播放前显示）
- preload: 预加载策略
  - none: 不预加载
  - metadata: 只预加载元数据
  - auto: 预加载整个视频
- playsinline: iOS 上内联播放（不全屏）
- width/height: 视频尺寸
-->
```

### 3.3 JavaScript API

```html
<video id="myVideo" src="video.mp4"></video>

<script>
const video = document.getElementById('myVideo');

// 播放控制
video.play();
video.pause();

// 属性
console.log(video.duration);        // 总时长
console.log(video.currentTime);     // 当前播放时间
console.log(video.paused);          // 是否暂停
console.log(video.volume);          // 音量 (0-1)
console.log(video.playbackRate);    // 播放速率
console.log(video.muted);           // 是否静音
console.log(video.videoWidth);      // 视频原始宽度
console.log(video.videoHeight);     // 视频原始高度

// 方法
video.load();                       // 重新加载视频
video.canPlayType('video/mp4');     // 检查格式支持

// 事件
video.addEventListener('play', () => {});
video.addEventListener('pause', () => {});
video.addEventListener('ended', () => {});
video.addEventListener('timeupdate', () => {});
video.addEventListener('loadedmetadata', () => {});
video.addEventListener('canplay', () => {});
video.addEventListener('waiting', () => {});  // 缓冲中
video.addEventListener('playing', () => {});  // 播放中

// 全屏控制
video.requestFullscreen();          // 进入全屏
document.exitFullscreen();          // 退出全屏
</script>
```

### 3.4 响应式视频

```html
<!-- 响应式视频容器 -->
<style>
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 比例 */
    background: #000;
}

.video-container video,
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

<div class="video-container">
    <video src="video.mp4" controls></video>
</div>
```

### 3.5 视频字幕

```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    
    <!-- 字幕轨道 -->
    <track 
        kind="subtitles" 
        src="subtitles-zh.vtt" 
        srclang="zh" 
        label="中文字幕"
        default
    >
    <track 
        kind="subtitles" 
        src="subtitles-en.vtt" 
        srclang="en" 
        label="English"
    >
    
    <!-- 章节标记 -->
    <track 
        kind="chapters" 
        src="chapters.vtt" 
        srclang="zh" 
        label="章节"
    >
</video>

<!-- VTT 字幕文件示例 -->
<!--
WEBVTT

00:00:00.000 --> 00:00:05.000
大家好，欢迎观看本教程

00:00:05.000 --> 00:00:10.000
今天我们将学习 HTML 视频

00:00:10.000 --> 00:00:15.000
让我们开始吧
-->
```

---

## 4. iframe 嵌入

### 4.1 基本 iframe

```html
<iframe 
    src="https://example.com" 
    width="600" 
    height="400"
    title="嵌入内容描述"
></iframe>
```

### 4.2 安全属性

```html
<!-- 安全的 iframe 配置 -->
<iframe 
    src="https://example.com"
    title="嵌入内容"
    width="600"
    height="400"
    sandbox="allow-scripts allow-same-origin allow-forms"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
></iframe>

<!--
sandbox 属性值：
- allow-scripts: 允许运行脚本
- allow-same-origin: 允许同源访问
- allow-forms: 允许表单提交
- allow-popups: 允许弹出窗口
- allow-top-navigation: 允许顶级窗口导航
- allow-downloads: 允许下载

referrerpolicy 值：
- no-referrer: 不发送 Referer
- no-referrer-when-downgrade: HTTPS 降级时不发送
- origin: 只发送源
- strict-origin-when-cross-origin: 跨域时只发送源
-->
```

### 4.3 嵌入 YouTube 视频

```html
<!-- YouTube 嵌入 -->
<iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="YouTube video player"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
></iframe>

<!-- 带参数的 YouTube 嵌入 -->
<iframe 
    src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&start=30&mute=1"
    allow="autoplay"
></iframe>
```

### 4.4 嵌入地图

```html
<!-- Google 地图 -->
<iframe 
    src="https://www.google.com/maps/embed?pb=..."
    width="600"
    height="450"
    style="border:0;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

---

## 5. embed 与 object

### 5.1 embed 元素

```html
<!-- 嵌入 PDF -->
<embed 
    src="document.pdf" 
    type="application/pdf"
    width="100%"
    height="600px"
>

<!-- 嵌入 Flash（已废弃） -->
<embed 
    src="animation.swf" 
    type="application/x-shockwave-flash"
>
```

### 5.2 object 元素

```html
<!-- 嵌入 PDF -->
<object 
    data="document.pdf" 
    type="application/pdf"
    width="100%"
    height="600px"
>
    <p>您的浏览器不支持 PDF 查看，请<a href="document.pdf">下载</a></p>
</object>

<!-- 嵌入 SVG -->
<object 
    data="image.svg" 
    type="image/svg+xml"
    width="200"
    height="200"
>
    <img src="fallback.png" alt="备用图片">
</object>
```

---

## 6. 多媒体性能优化

### 6.1 图像优化清单

| 优化项 | 方法 |
|--------|------|
| 格式选择 | 优先 WebP/AVIF，JPEG/PNG 回退 |
| 尺寸优化 | 使用 srcset/sizes 响应式图片 |
| 压缩优化 | 使用工具压缩（TinyPNG、ImageOptim） |
| 懒加载 | 使用 `loading="lazy"` |
| 占位符 | 使用 aspect-ratio 防止 CLS |
| CDN 加速 | 使用 CDN 分发图片资源 |

### 6.2 视频优化清单

| 优化项 | 方法 |
|--------|------|
| 格式选择 | MP4 (H.264) 兼容性最好，WebM 更小 |
| 封面图 | 设置 poster 属性 |
| 预加载 | 合理设置 preload |
| 懒加载 | 使用 loading="lazy" |
| 自适应码率 | 使用 HLS/DASH 流媒体协议 |
| CDN 加速 | 使用 CDN 分发视频资源 |

### 6.3 代码示例

```html
<!-- 最佳实践：综合优化 -->
<picture>
    <source 
        type="image/avif" 
        srcset="image.avif"
    >
    <source 
        type="image/webp" 
        srcset="image.webp"
    >
    <img 
        src="image.jpg"
        alt="优化后的图片"
        width="800"
        height="450"
        loading="lazy"
        decoding="async"
        style="width: 100%; height: auto;"
    >
</picture>

<!-- 最佳实践：视频 -->
<video 
    controls
    poster="poster.webp"
    preload="metadata"
    playsinline
    width="800"
    height="450"
>
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
    <track kind="subtitles" src="subtitles-zh.vtt" srclang="zh" label="中文字幕">
</video>
```

---

## 7. 浏览器支持检测

```javascript
// 检测视频格式支持
const video = document.createElement('video');
console.log('MP4:', video.canPlayType('video/mp4'));
console.log('WebM:', video.canPlayType('video/webm'));
console.log('OGG:', video.canPlayType('video/ogg'));

// 检测音频格式支持
const audio = document.createElement('audio');
console.log('MP3:', audio.canPlayType('audio/mpeg'));
console.log('OGG:', audio.canPlayType('audio/ogg'));
console.log('WAV:', audio.canPlayType('audio/wav'));

// canPlayType 返回值：
// "probably" - 很可能支持
// "maybe" - 可能支持
// "" (空字符串) - 不支持
```

---

## 小结

| 元素 | 用途 | 关键属性 |
|------|------|----------|
| `<img>` | 图像 | src, alt, srcset, sizes, loading |
| `<picture>` | 响应式图片 | 包含 source 和 img |
| `<figure>` | 图片容器 | 包含 img 和 figcaption |
| `<audio>` | 音频 | controls, autoplay, muted, loop |
| `<video>` | 视频 | controls, poster, preload, playsinline |
| `<iframe>` | 嵌入内容 | sandbox, loading, referrerpolicy |
| `<track>` | 字幕 | kind, src, srclang, label |

| 最佳实践 | 说明 |
|----------|------|
| 始终提供 alt | 可访问性和 SEO |
| 使用现代格式 | WebP、AVIF |
| 响应式图片 | srcset + sizes + picture |
| 懒加载 | loading="lazy" |
| 防止 CLS | 设置宽高或 aspect-ratio |

---

## 参考资源

- [MDN 图像指南](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding)
- [WebP 官方文档](https://developers.google.com/speed/webp)
- [视频格式兼容性](https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats)

---

[返回上级目录](../README.md)
