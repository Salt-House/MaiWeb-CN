# MaiWeb-CN 性能与访问速度优化分析

> 目标：提升首屏加载速度 (LCP)、交互准备时间 (TTI/TBT)、滚动与动画流畅度、以及数据请求效率。以下根据当前 Next.js 14 + App Router + TailwindCSS + 依赖结构提出多层次优化建议，并按优先级分类。文末附实施清单与参考代码片段。

---
## 一、关键性能现状推测与风险点
基于当前仓库结构与依赖：
- 使用大量静态图片 (public/img 及子目录)；若未做体积优化与按需加载，首屏传输开销大。✅ (部分已处理：2025-09-18 首屏 `SearchGameCenter` 中 logo 与 handpink 已替换为 `next/image`，后续需继续压缩与批量替换其余图片)
- 未看到对图片使用 `<Image />` 组件（`SearchGameCenter.tsx` 用的是 `<img />`），失去内建优化（自适应尺寸 / lazy / AVIF/WebP）。
- 未启用 `reactStrictMode: true`（虽不直接影响线上性能，但会降低开发期发现问题能力）。
- 依赖里包含 `echarts`, `framer-motion`, `react-joyride`, `react-zoom-pan-pinch` 等较大包，如果在首屏同步引入，会显著增加 JS 体积与解析时间。✅ (2025-09-18 进度：`SearchGameCenter` 结果区分离并 dynamic；`react-zoom-pan-pinch` 在 `tool/best/page.tsx` 动态导入；`echarts` 改为组件内部按需动态加载；`react-joyride` 待确认是否需要进一步拆分，如后续不在首屏可延迟)。
- 没看到代码分割策略（dynamic import），存在潜在“所有组件打到同一 bundle”风险。
- API 请求直接用 fetch + 完整对象展开（`search_gamecenter`），未加缓存与防抖，可能在交互中触发多次。
- 地理定位失败时的回退仅弹 `alert`，阻塞 UI 线程且体验差。
- Tailwind 已按需扫描 `content` 目录，但 `public` 下静态资源没有指纹策略说明（若未来接入 CDN 需考虑 hash 与缓存头）。
- 没看到针对 PWA / HTTP 缓存 / CDN 的配置（如 `next-pwa`、`Cache-Control` headers）。

---
## 二、指标与目标值建议
| 指标 | 当前潜在问题 | 目标值 |
|------|--------------|--------|
| LCP (Largest Contentful Paint) | 大图 + 同步 JS | < 2.5s (4G 真实设备) |
| CLS (布局偏移) | `<img>` 未声明尺寸 | < 0.05 |
| TBT / TTI | 大型依赖同步加载 | TBT < 200ms |
| 初始 JS 传输体积 | 可能 > 300KB gzip | < 180KB gzip 首屏 |
| 图片体积 | PNG/JPG 未压缩 | 减少 40%+ |
| API 响应缓存 | 全部实时请求 | 缓存命中 60%+ |

---
## 三、首屏与资源加载优化
### 1. 图片优化
- 将所有 `<img src="/img/..." />` 替换为 `next/image`：
  - 自动响应式 / lazy / 优先级控制。
  - 为首屏主视觉图加 `priority`。
- 批量无损压缩：使用 `imagemin`, `squoosh-cli` 或在线工具。
- 若背景纹理类图片可用 CSS 渐变或 SVG 替代，移除位图资源。
- 雪碧图不再推荐；使用 HTTP/2 + `next/image` 足够。
- 对非关键首屏图片使用 `loading="lazy"`（`next/image` 默认为懒加载）。

### 2. 静态资源缓存与 CDN
- 在生产部署（如 Vercel）默认静态文件有良好缓存；若自托管需配置：
  - `Cache-Control: public, max-age=31536000, immutable` （对 `/_next/static/*` 与 hashed 资源）。
  - 普通图片：`max-age=604800`（一周）并通过文件名 hash 控制失效。
- 若流量大，考虑接入 CDN（Cloudflare / 阿里云 OSS + CDN）。

### 3. 关键 CSS 与 Tailwind
- Tailwind 产物已 tree-shake，但：
  - 避免使用大量动态 class 拼接导致无法被扫描（目前看还好）。
  - 可启用 `@tailwindcss/typography` 仅在需要时引入，避免不必要插件。
  - 若最终构建 CSS 仍偏大，可分析：`ANALYZE=1 next build` + 使用 `next-bundle-analyzer`。

### 4. 字体优化
- 自定义字体 `DouyinSansBold`：
  - 确保使用 woff2 格式。
  - 通过 `next/font/local` 声明（减少 FOUT/FOIT）：
```ts
// example in layout.tsx
import localFont from 'next/font/local';
const douyin = localFont({
  src: './fonts/DouyinSansBold.woff2',
  display: 'swap',
  weight: '700',
});
```
  - 仅在需要的组件层使用该 class，避免全局覆盖。

### 5. 预加载 / 预获取
- 对首屏“最核心的主视觉/Logo”图片 `<Image priority />`。
- 在用户可能点击的路由上使用 `prefetch`（Next Link 默认行为，确保未禁用）。
- 若搜索接口域名稳定且后续几乎必请求，可在空闲时 `navigator.connection?.saveData !== true` 下预热 DNS：
```html
<link rel="preconnect" href="https://dev.maimai.moe" />
```

---
## 四、JavaScript 体积与交互优化
### 1. 动态加载大依赖（进度标记：✅ 已部分实施 / ⏳ 待实施）
| 包 | 优化策略 |
|----|----------|
| echarts | ✅ 改为组件内部 `import('echarts')` 动态加载 + 初始化后再 setOption；可继续做子模块按需 (⏳) |
| framer-motion | ✅ 结果列表抽离动态组件；其余简单动效后续可用 CSS 替换 (⏳) |
| react-joyride | ⏳ 当前在使用引导页面，视是否影响首屏决定是否延迟加载或拆分更多步骤 |
| react-zoom-pan-pinch | ✅ 在 `tool/best/page.tsx` 动态导入 TransformWrapper/Component |

示例：
```tsx
import dynamic from 'next/dynamic';
const ECharts = dynamic(() => import('./EChartsWrapper'), { ssr: false, loading: () => <div>图表加载中...</div> });
```

### 2. 组件拆分与优先级
- `SearchGameCenter` 中动画、结果面板、导航逻辑可拆分：
  - 搜索表单（首屏）
  - 结果列表（动态 import，首次点击搜索时才加载）
  - 地理导航模块（dynamic + `ssr:false`，避免 `navigator` 访问在 SSR 阶段报错）

### 3. 事件节流 / 防抖
- 地址输入时若计划做实时提示，需要 `debounce` （lodash.debounce 或自写）。
- 当前 `getLocationFromAdress` 只有显式点击触发，尚可。

### 4. 避免阻塞交互
- 替换 `alert` 为非阻塞 Toast（如 headless ui + Portal 或自建组件）。
- Geolocation 回调中仅 setState，避免同步 heavy 逻辑。

### 5. 减少对象扩展复制风险
- 构建查询 URL 替换手动 for-in：
```ts
const qs = new URLSearchParams();
Object.entries(searchParams).forEach(([k, v]) => {
  if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
});
fetch(`${base}?${qs.toString()}`)
```

### 6. 使用 Edge Runtime / Route Handlers（可选）
- 若后端接口允许代理，可在 Next 内创建 `/app/api/search-gamecenter/route.ts`，通过 Edge Runtime（`export const runtime = 'edge'`）减少 RTT 与 CORS 开销，并可添加缓存策略。

---
## 五、数据获取与缓存策略
### 1. HTTP 层缓存
- 对不频繁变化的数据（如地图基础元数据、榜单静态信息）使用 `fetch(url, { next: { revalidate: 3600 } })`（App Router 特性）。
- 搜索结果因用户定位与参数强相关，不缓存或使用短期缓存（60s）以抵御重复查询。

### 2. 客户端缓存
- 利用 SWR / React Query 管理：
  - 避免重复请求同一参数。
  - 内置重试、失焦重新验证。
```ts
import useSWR from 'swr';
const { data, error, isLoading } = useSWR(['search', params], () => fetcher(params), { keepPreviousData: true });
```

### 3. 预取下一页
- 若未来分页，首屏加载第 1 页后可空闲预取第 2 页，提升滚动体验。

---
## 六、可观测性与度量
- 添加 bundle 分析：
```bash
npm i -D @next/bundle-analyzer
```
`next.config.mjs`：
```js
import bundleAnalyzer from '@next/bundle-analyzer';
const withAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default withAnalyzer({ /* existing config */ });
```
运行：`ANALYZE=true npm run build`。

- 使用 Web Vitals：在 `app` 目录创建 `vitals.ts`：
```ts
export function reportWebVitals(metric) {
  if (metric.name === 'LCP' || metric.name === 'FID') {
    // 发送到自建埋点或 analytics
    navigator.sendBeacon('/analytics', JSON.stringify(metric));
  }
}
```
在 `next.config.mjs` 中无需额外配置（App Router 自动支持）。

---
## 七、地理定位与导航体验优化
| 问题 | 改进 |
|------|------|
| 使用 alert 阻塞 | 改 Toast / 非模态提示 |
| 失败未提供重试策略 | 显示“重新定位”按钮并记录错误类型 |
| 未区分权限拒绝与其他 | 提示开启浏览器定位权限步骤 |
| 导航链接固定高德 | 根据 UA 与地域提供多方案（百度/腾讯/Google） |

示例（简化 Toast Hook）：
```ts
const [toast, setToast] = useState(null);
setToast({ type: 'error', message: '定位失败，请手动输入地址' });
```

---
## 八、SEO 与感知性能
- 利用骨架屏：结果列表加载中可显示占位条（当前只有 spinner，可补充 skeleton）。
- 预渲染：若首页主要是静态介绍 + 搜索交互，保持 SSR + 轻 JS。
- `<meta name="theme-color" />` 提升移动端地址栏配色；利用 `<link rel="manifest" />` 可进一步做 PWA。

---
## 九、渐进式增强与离线（可选）
- 使用 `next-pwa`：缓存静态资源 + 最近一次搜索结果（IndexedDB）。
- 离线时显示“离线模式：显示上次搜索缓存”。

---
## 十、实施优先级清单
### P0（立即）
1. 图片改用 `next/image`（首屏 Logo / 主背景）
2. 动态引入大体积依赖（echarts / joyride / zoom）
3. 替换阻塞式 `alert` 为 Toast
4. 添加 bundle analyzer 评估当前 JS 体积

### P1（1~2 周）
5. 压缩所有静态图片（无损/有损 WebP）
6. 引入字体管理（`next/font`）与预连接外域
7. API 层抽象 + URLSearchParams + 错误重试
8. 结果列表组件拆分 + dynamic import
9. 添加 Skeleton 占位

### P2（后续迭代）
10. SWR/React Query 集成
11. Edge Runtime 路由代理与缓存
12. PWA 支持 + 离线缓存
13. Web Vitals 上报埋点
14. 分页预取优化

---
## 十一、示例代码片段集合
### 动态加载结果列表
```tsx
// SearchGameCenterResult.tsx
'use client';
export default function SearchGameCenterResult({ results, onNavigate }) {
  return (<div>{/* 渲染列表 */}</div>);
}
```
```tsx
const ResultList = dynamic(() => import('./SearchGameCenterResult'), { ssr:false, loading:() => <div>加载中...</div> });
{showResults && <ResultList results={arcadeResults} onNavigate={handleNavigation} />}
```

### Toast 简易实现
```tsx
// Toast.tsx
export function Toast({ type='info', message, onClose }) {
  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-sm bg-white border-l-4 ${type==='error'?'border-red-500':'border-blue-500'}`}>{message}</div>
  );
}
```

### 使用 URLSearchParams
```ts
function buildSearchUrl(base, params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if(v!==undefined && v!==null && v!=='') usp.append(k, String(v)); });
  return `${base}?${usp.toString()}`;
}
```

### SWR 搜索 Hook（后续）
```ts
import useSWR from 'swr';
const fetcher = (url:string) => fetch(url).then(r=>r.json());
export function useArcadeSearch(params) {
  const url = params.lat && params.lng ? buildSearchUrl('/api/search-gamecenter', params) : null;
  return useSWR(url, fetcher, { keepPreviousData:true, revalidateOnFocus:false });
}
```

---
## 十二、风险与回滚策略
| 优化项 | 风险 | 回滚方式 |
|--------|------|----------|
| 动态导入 | 首次交互显示延迟 | 预加载 `prefetch` or 还原同步导入 |
| `next/image` 替换 | 样式偏移 (需设定 width/height) | 临时退回 `<img>` |
| 图片压缩 | 质量过低 | 保留原图备份目录 raw/ |
| PWA 缓存 | 旧资源不更新 | 调整 manifest / sw 版本号 |

---
## 十三、成功验收标准
- `ANALYZE=true` 构建后首屏 JS < 180KB gzip
- WebPageTest（4G 模拟）LCP < 2.5s，Speed Index 明显下降
- 首屏无 Layout Shift > 0.01
- 重复搜索同参数 2 次，用时降低 >30%
- 地理定位失败时不再出现阻塞弹窗

---
## 十四、后续建议
- 持续用 Lighthouse + Web Vitals 监测；
- 加入 CI 构建体积守卫（检测超过阈值报警）；
- 若访问集中在国内，静态资源与 API 域名同源并接入国内 CDN。

---
如需我直接帮你改造首屏组件（图片替换、dynamic import、Toast 抽象等），继续告诉我即可。✅
