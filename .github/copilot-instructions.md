# AI 开发协作指引 (MaiWeb-CN)

面向在本仓库中执行代码编辑/回答问题的 AI 代理。聚焦项目特有结构/约定，帮助快速切入并避免常见错误。

## 核心技术栈 & 运行
- Next.js 14 App Router（`src/app`），大量 `use client` 组件，注意 SSR/Hydration 区分。
- UI: TailwindCSS + 自定义动画 (`tailwind.config.ts` 中扩展的 `moveStar`, `moveDot`, `floatUpDown` 等)；类名合并工具 `cn()` 位于 `src/lib/utils.ts`。
- 动画/过渡：`framer-motion`（页面转场组件 `PageTransitionWrapper` + `FrozenRouter` 冻结路由上下文避免双渲染）。
- 数据请求：`src/utils/request.tsx` 封装 Axios（携带 token、业务 code 判断、401 重定向）。部分页面仍直接用 `axios` / `fetch`，保持兼容。
- 音频全局播放器：React Context (`PlayerContext.tsx`) 管理播放列表/状态/播放模式与本地持久化。

运行脚本（`package.json`）：
- 开发：`npm run dev`
- 构建：`npm run build`  → 生产启动：`npm start`
- 代码检查：`npm run lint`

## 目录速览
- `src/app/layout.tsx`：全局布局与背景层、星光动画、导航、Footer、`PlayerProvider` 注入。
- `src/app/components/`：复用组件。含 UI（`LoadingSpinner`,`NewsCard`）、交互（`SearchGameCenter*`）、导航（`Navigation`）、音频（`GlobalPlayer`），以及 HOC (`HOC/FrozenRouter.tsx`).
- `src/app/hooks/`：自定义 Hook。`useStateWithCallback` (setState + 回调)，`TokenChecker` (登录状态展示)。
- `src/app/context/PlayerContext.tsx`：音频播放核心逻辑；注意副作用/本地存储键名：`music_playlist`, `music_current_track`, `music_volume`, `music_play_mode`。
- `public/img/`：大量背景/装饰图；组件通过绝对路径引用 `/img/...`。

## 组件/模式约定
1. 客户端组件声明：凡使用浏览器 API、`useEffect`、localStorage、或 framer-motion，文件首行加 `'use client'`。
2. 页面过渡：将页面内容包入 `PageTransitionWrapper` 可获得淡入淡出 + 位移动画；避免直接在 SSR 端渲染 motion 产生 hydration mismatch。
3. 请求：优先使用 `http` (Axios 单例)；其响应包装期望 `response.data.code === 0` 才视为成功——新接口若返回纯数组，需在封装层兼容或在调用处判空处理。
4. Token 处理：浏览器侧从 `localStorage.getItem('token')` 读取；401 触发跳转 `/login`。新增需要鉴权的组件时避免在服务器组件中读取 token。
5. 播放器：使用 `usePlayer()` Hook（必须在 `PlayerProvider` 内），添加曲目前检查 `id` 唯一；变更播放模式通过 `togglePlayMode()`。
6. 动画：`AnimatePresence` 条件渲染时必须有稳定 `key`（参考 `PageTransitionWrapper` 的 `stableKey` 防抖 50ms 以防路由快速切换重复动画）。
7. CSS / Tailwind：自定义背景与动画 class 在 `tailwind.config.ts`；避免随意添加未在 content glob 中覆盖的路径。
8. 图片：使用 `<img>` 直接引用；若引入 Next Image 需同时评估是否需要优化（当前未配置域名策略）。

## 页面转场 & FrozenRouter 专用说明
`PageTransitionWrapper` + `FrozenRouter` 解决 Next.js App Router 与 `framer-motion` 在路由切换时出现的：
- 退出/进入动画被打断或执行两次
- Layout 层级复合导致的 Context 变化触发重复渲染
- Hydration / 快速连续导航时 key 抖动

核心机制：
- `stableKey`：基于 `usePathname()` + 50ms 防抖，只在路径稳定后才触发进入/退出动画，减少瞬时多次 push 导致的闪烁。
- `FrozenRouter`：冻结首次获取的 `LayoutRouterContext`，防止 App Router 在动画过渡中因内部刷新/预取导致 context 变更而触发二次 remount。
- SSR 防护：初始服务端阶段直接返回静态容器，客户端激活后再启用动画，避免 hydration mismatch。

使用场景：
1. 页面级转场（推荐在每个需要动画的 **page 组件最外层** 使用）。
2. 某些需要随路由完全替换的区块（而不是内部 tab 状态切换）。
3. 不要把它套在会频繁局部 state 更新的大组件外层（避免无意义重新装配 animation root）。

基本用法示例：
```tsx
'use client'
import PageTransitionWrapper from '@/src/app/components/PageTransitionWrapper'

export default function RegionPage() {
  return (
    <PageTransitionWrapper>
      <main className="px-6 py-10">/* 页面主体 */</main>
    </PageTransitionWrapper>
  )
}
```

自定义动画：修改 `PageTransitionWrapper` 中 `<motion.div>` 的 `initial / animate / exit / transition`；如需 per-page 自定义，可新增 props：`variant?: 'fade' | 'slide'` 并在内部切换 variant map（保持向后兼容）。

常见误用与规避：
- (误) 在 `layout.tsx` 全局包裹：会导致所有固定背景/播放器也参与重复 mount；应仅包裹实际需要转场的页面主体。
- (误) 在同一页面嵌套多个 `AnimatePresence` + `PageTransitionWrapper`：可能出现 exit 动画不触发或 stacking context 乱序。
- (误) 在服务器组件直接引入：缺少 `'use client'` 将报错 / 动画失效。
- (误) 使用 `random()` 生成 key：会让每次渲染都触发重新动画 → 改为依赖 pathname。

调试指引：
- 动画不执行：确认 `isClient` 已切换（可临时 console `isClient`）。
- 退出动画未播放：检查是否被更高层强制卸载（比如条件渲染直接移除父节点）。
- 快速双击导航闪烁：调高防抖时间（`PageTransitionWrapper` 中 `50ms` → 80~120ms 视 UX 调整）。

扩展建议（需要时再实现）：
- 将 `stableKey` 策略抽象为 hook：`useStableRouteKey(delay)`。
- 支持 `reducedMotion`（尊重用户系统偏好）。
- 将常用 transition 预设常量化，避免随意散落魔法数字。

## 常见注意事项
- Hydration：不要在服务端组件里直接访问 `localStorage` / `window`；如需条件渲染，参考 `PageTransitionWrapper` 的 `isClient` 模式。
- 事件泄漏/重复监听：`PlayerContext` 中使用的 `audio` 事件需在修改逻辑时保持添加/移除对称。
- 列表 key：新闻 / 动态列表使用 `id` 优于索引；现有 `NewsPage` 使用 `index`，可在未来改进。
- API 异构：`NewsPage` 直接 `axios.get` 返回数组，不走 `http` 封装；新增数据层可统一处理响应结构。
- 性能：大量绝对定位背景层与动画，添加新组件时注意 z-index（背景层使用负值：`-1`, `-2`, `-3`）。

## 扩展/新增功能建议格式
编写新组件：
```tsx
'use client'
import { cn } from '@/src/lib/utils'
export default function Example({ title }: { title: string }) {
  return <div className={cn('p-4 font-bold', 'text-white')}>{title}</div>
}
```
数据获取：
```ts
import http from '@/src/utils/request'
interface Foo { id: string; name: string }
const data = await http.get<Foo[]>('/foo/list')
```

## 何时新增上下文 / Hook
- 状态需跨路由（播放、登录信息缓存、主题）→ context
- 需要封装 setState 后回调 → `useStateWithCallback`

## 不要做的事
- 不要在服务端组件中访问本地存储
- 不要在同一组件中混用多个独立的路由过渡容器
- 不要直接修改 `audioRef.current` 之外的播放状态（使用暴露的方法）
- 不要新增未使用的动画 keyframe（会增加构建体积）

## 快速排错 Checklist
- 动画没播放：确认组件含 `'use client'` 且 `AnimatePresence` 子元素有稳定 key。
- 请求无数据：检查返回结构是否含 `code` 字段；若没有需绕过封装判定逻辑。
- 播放器不播放：确认 `currentTrack.audioUrl` 可访问、`isPlaying` 为 true、未被 `removeFromPlaylist` 移除。
- Hydration 警告：查是否在初始渲染阶段使用随机数/时间（如星星布局）→ 仅客户端渲染。

---
如需补充：测试策略 / 国际化 / 图片优化 尚未形成固定约定，可在确认后扩展本文件。
