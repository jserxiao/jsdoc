# File API 与 Blob

> File API 允许 JavaScript 访问用户选择的文件内容，Blob 是表示二进制数据的对象。它们是处理文件上传、图片预览等功能的核心技术。

## 学习要点

- 🔍 理解 Blob 和 File 的概念
- 📝 掌握 FileReader 的使用
- 🔄 学会文件上传和预览
- 🎯 掌握大文件分片上传

---

## 1. Blob 对象

### 创建 Blob

```javascript
// Blob 构造函数
const blob1 = new Blob(['Hello World'], { type: 'text/plain' });

// 从多个部分创建
const blob2 = new Blob(
    ['Hello, ', 'World', '!'],
    { type: 'text/plain' }
);

// 从 ArrayBuffer 创建
const buffer = new ArrayBuffer(8);
const view = new Uint8Array(buffer);
view.set([72, 101, 108, 108, 111]); // "Hello"
const blob3 = new Blob([buffer], { type: 'text/plain' });

// Blob 属性
console.log(blob1.size); // 11（字节大小）
console.log(blob1.type); // 'text/plain'（MIME 类型）
```

### Blob 方法

```javascript
const blob = new Blob(['Hello World'], { type: 'text/plain' });

// slice() - 分割 Blob
const sliced = blob.slice(0, 5); // "Hello"
console.log(sliced.size); // 5

// 指定类型
const slicedWithType = blob.slice(0, 5, 'text/html');

// text() - 读取为文本（返回 Promise）
blob.text().then(text => {
    console.log(text); // "Hello World"
});

// arrayBuffer() - 读取为 ArrayBuffer
blob.arrayBuffer().then(buffer => {
    console.log(buffer); // ArrayBuffer
});

// stream() - 返回 ReadableStream
const stream = blob.stream();
```

### Blob 用途

```javascript
// 1. 下载文件
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url); // 释放内存
}

const blob = new Blob(['Hello World'], { type: 'text/plain' });
downloadBlob(blob, 'hello.txt');

// 2. 图片处理
const canvas = document.getElementById('canvas');
canvas.toBlob((blob) => {
    // 处理 Blob
    const img = new Image();
    img.src = URL.createObjectURL(blob);
}, 'image/png');

// 3. 发送到服务器
fetch('/upload', {
    method: 'POST',
    body: blob
});
```

---

## 2. File 对象

### File 继承自 Blob

```javascript
// File 构造函数
const file = new File(
    ['Hello World'],
    'hello.txt',
    {
        type: 'text/plain',
        lastModified: Date.now()
    }
);

// File 特有属性
console.log(file.name);          // 'hello.txt'
console.log(file.lastModified);  // 时间戳
console.log(file.size);          // 11（继承自 Blob）
console.log(file.type);          // 'text/plain'（继承自 Blob）
```

### 从 input 获取文件

```html
<input type="file" id="fileInput" multiple>

<script>
const input = document.getElementById('fileInput');

input.addEventListener('change', (e) => {
    const files = e.target.files; // FileList 对象
    
    // 遍历文件
    for (const file of files) {
        console.log('文件名:', file.name);
        console.log('类型:', file.type);
        console.log('大小:', file.size, 'bytes');
        console.log('最后修改:', new Date(file.lastModified));
    }
});
</script>
```

### 文件类型限制

```html
<!-- 只接受图片 -->
<input type="file" accept="image/*">

<!-- 只接受特定类型 -->
<input type="file" accept=".jpg,.png,.gif">
<input type="file" accept="image/jpeg,image/png">

<!-- 允许多选 -->
<input type="file" multiple>

<script>
// JavaScript 验证
function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型');
    }
    
    if (file.size > maxSize) {
        throw new Error('文件大小超过限制');
    }
    
    return true;
}
</script>
```

---

## 3. FileReader

### 读取文件

```javascript
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    // 读取完成
    reader.onload = (e) => {
        console.log('读取结果:', e.target.result);
    };
    
    // 读取错误
    reader.onerror = (e) => {
        console.error('读取错误:', e.target.error);
    };
    
    // 读取进度
    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            console.log(`进度: ${percent.toFixed(2)}%`);
        }
    };
    
    // 开始读取
    reader.readAsText(file); // 读取为文本
});
```

### 读取方法

```javascript
const file = /* File 对象 */;
const reader = new FileReader();

reader.onload = (e) => {
    console.log(e.target.result);
};

// 1. readAsText - 读取为文本
reader.readAsText(file);
reader.readAsText(file, 'UTF-8'); // 指定编码

// 2. readAsDataURL - 读取为 Data URL
reader.readAsDataURL(file); // base64 编码

// 3. readAsArrayBuffer - 读取为 ArrayBuffer
reader.readAsArrayBuffer(file);

// 4. readAsBinaryString - 读取为二进制字符串（已废弃）
reader.readAsBinaryString(file);

// 中止读取
reader.abort();
```

### 图片预览

```html
<input type="file" id="fileInput" accept="image/*">
<img id="preview" src="" alt="预览">

<script>
const input = document.getElementById('fileInput');
const preview = document.getElementById('preview');

input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        previewImage(file);
    }
});

// 方式1：FileReader
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 方式2：URL.createObjectURL（更高效）
function previewImageFast(file) {
    preview.src = URL.createObjectURL(file);
    
    // 不需要时释放
    preview.onload = () => {
        URL.revokeObjectURL(preview.src);
    };
}
</script>
```

---

## 4. 文件上传

### FormData 上传

```javascript
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', '123');
    
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
        // 不要手动设置 Content-Type，浏览器会自动设置
    });
    
    return response.json();
}
```

### 带进度上传

```javascript
function uploadWithProgress(file, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                onProgress(percent);
            }
        };
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(new Error('上传失败'));
            }
        };
        
        xhr.onerror = () => reject(new Error('网络错误'));
        
        const formData = new FormData();
        formData.append('file', file);
        
        xhr.open('POST', '/upload');
        xhr.send(formData);
    });
}

// 使用
uploadWithProgress(file, (percent) => {
    console.log(`上传进度: ${percent.toFixed(2)}%`);
}).then(result => {
    console.log('上传成功:', result);
});
```

### 多文件上传

```javascript
async function uploadMultipleFiles(files) {
    const formData = new FormData();
    
    // 添加多个文件
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    
    // 或使用 append 添加不同字段
    // formData.append('avatar', files[0]);
    // formData.append('document', files[1]);
    
    const response = await fetch('/upload/multiple', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}
```

---

## 5. 大文件分片上传

### 分片上传实现

```javascript
class FileUploader {
    constructor(options) {
        this.chunkSize = options.chunkSize || 5 * 1024 * 1024; // 默认 5MB
        this.url = options.url;
        this.onProgress = options.onProgress || (() => {});
    }
    
    async upload(file) {
        const chunks = this.createChunks(file);
        const total = chunks.length;
        let uploaded = 0;
        
        for (let i = 0; i < chunks.length; i++) {
            await this.uploadChunk(chunks[i], i, file.name, chunks.length);
            uploaded++;
            this.onProgress((uploaded / total) * 100);
        }
        
        // 合并分片
        await this.mergeChunks(file.name, chunks.length);
    }
    
    createChunks(file) {
        const chunks = [];
        let start = 0;
        
        while (start < file.size) {
            const end = Math.min(start + this.chunkSize, file.size);
            chunks.push(file.slice(start, end));
            start = end;
        }
        
        return chunks;
    }
    
    async uploadChunk(chunk, index, filename, total) {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('index', index);
        formData.append('filename', filename);
        formData.append('total', total);
        
        const response = await fetch(this.url + '/chunk', {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }
    
    async mergeChunks(filename, total) {
        const response = await fetch(this.url + '/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, total })
        });
        
        return response.json();
    }
}

// 使用
const uploader = new FileUploader({
    url: '/upload',
    chunkSize: 2 * 1024 * 1024, // 2MB
    onProgress: (percent) => {
        console.log(`进度: ${percent.toFixed(2)}%`);
    }
});

uploader.upload(largeFile);
```

### 断点续传

```javascript
class ResumableUploader {
    constructor(options) {
        this.chunkSize = options.chunkSize || 5 * 1024 * 1024;
        this.url = options.url;
        this.fileId = null;
        this.uploadedChunks = new Set();
    }
    
    async upload(file) {
        // 生成文件唯一标识
        this.fileId = await this.generateFileId(file);
        
        // 获取已上传的分片
        await this.getUploadedChunks();
        
        // 上传未完成的分片
        const chunks = this.createChunks(file);
        
        for (let i = 0; i < chunks.length; i++) {
            if (!this.uploadedChunks.has(i)) {
                await this.uploadChunk(chunks[i], i);
                this.uploadedChunks.add(i);
            }
        }
        
        // 合并
        await this.mergeChunks(file.name, chunks.length);
    }
    
    async generateFileId(file) {
        // 使用文件名+大小+修改时间生成 ID
        const data = `${file.name}-${file.size}-${file.lastModified}`;
        const buffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('MD5', buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    async getUploadedChunks() {
        const response = await fetch(`${this.url}/progress?fileId=${this.fileId}`);
        const data = await response.json();
        this.uploadedChunks = new Set(data.chunks || []);
    }
    
    createChunks(file) {
        const chunks = [];
        let start = 0;
        while (start < file.size) {
            const end = Math.min(start + this.chunkSize, file.size);
            chunks.push(file.slice(start, end));
            start = end;
        }
        return chunks;
    }
    
    async uploadChunk(chunk, index) {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('index', index);
        formData.append('fileId', this.fileId);
        
        await fetch(`${this.url}/chunk`, {
            method: 'POST',
            body: formData
        });
    }
    
    async mergeChunks(filename, total) {
        await fetch(`${this.url}/merge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                fileId: this.fileId, 
                filename, 
                total 
            })
        });
    }
}
```

---

## 小结

| 对象/方法 | 说明 |
|----------|------|
| **Blob** | 表示二进制大对象 |
| **File** | 继承 Blob，表示用户选择的文件 |
| **FileReader** | 读取文件内容 |
| **FormData** | 构造表单数据用于上传 |
| **URL.createObjectURL** | 创建 Blob URL |
| **blob.slice()** | 分割 Blob/File |
| **reader.readAsDataURL** | 读取为 base64 |
| **reader.readAsArrayBuffer** | 读取为 ArrayBuffer |

---

[返回模块目录](./README.md)
