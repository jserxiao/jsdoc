const fs = require('fs');
const path = require('path');

const results = [];

function scanDir(dir, category) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath, category);
    } else if (item.endsWith('.md') && item !== 'index.md') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n').length;
      const words = content.length;

      results.push({
        category,
        file: fullPath.replace(/\\/g, '/'),
        name: item,
        lines,
        words,
        status: lines < 100 ? '❌ 简单' : lines < 300 ? '⚠️  中等' : '✅ 详细'
      });
    }
  });
}

scanDir('./docs/md/javascript', 'JS');
scanDir('./docs/md/typescript', 'TS');
scanDir('./docs/md/html', 'HTML');
scanDir('./docs/md/css', 'CSS');

// 按行数排序
results.sort((a, b) => a.lines - b.lines);

// 统计
const stats = {
  JS: { total: 0, simple: 0, medium: 0, detailed: 0 },
  TS: { total: 0, simple: 0, medium: 0, detailed: 0 },
  HTML: { total: 0, simple: 0, medium: 0, detailed: 0 },
  CSS: { total: 0, simple: 0, medium: 0, detailed: 0 }
};

results.forEach(r => {
  stats[r.category].total++;
  if (r.lines < 100) stats[r.category].simple++;
  else if (r.lines < 300) stats[r.category].medium++;
  else stats[r.category].detailed++;
});

console.log('='.repeat(80));
console.log('文档完整度扫描报告');
console.log('='.repeat(80));
console.log('\n📊 总体统计：\n');
console.log('类别 | 总数 | 简单(<100行) | 中等(100-300行) | 详细(>300行)');
console.log('-'.repeat(70));
Object.entries(stats).forEach(([cat, s]) => {
  console.log(` ${cat}  |  ${s.total}  |     ${s.simple}        |       ${s.medium}         |     ${s.detailed}`);
});

console.log('\n\n📄 需要完善的文件（按优先级排序）：\n');
console.log('优先级 | 行数 | 状态 | 文件路径');
console.log('-'.repeat(80));

results.filter(r => r.lines < 300).forEach(r => {
  const priority = r.lines < 100 ? '🔴 高' : '🟡 中';
  console.log(`${priority}   | ${String(r.lines).padStart(4)} | ${r.status} | ${r.file}`);
});

console.log('\n\n✅ 已经很详细的文件：\n');
results.filter(r => r.lines >= 300).forEach(r => {
  console.log(`${r.status} | ${String(r.lines).padStart(4)} 行 | ${r.file}`);
});
