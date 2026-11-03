# 来福首页设计系统

基准：已确认并上线到本地预览的首页，来源为 `laifu-home-preview.html`。本次只提取和复用，不重新设计、不改写内容、不增加断点。拆分前后按同一视口核对视觉与交互。

## 版本与工程边界

- 首页组件：`apps/website/src/components/home/`。
- 首页令牌唯一来源：该目录的 `home-design-tokens.css`，可直接编辑，不经过旧版令牌生成器。
- 首页样式唯一来源：该目录的 `home.css`，通过 `HomeDesignSystem` 加载。
- `docs/design/system.md` 中的 YAML、`src/app/design-tokens.css` 和 `src/styles/` 继续用于现有子页。旧版首页描述不再作为首页依据。
- 作用域为 `.home-preview`，令牌使用 `--home-*` 前缀。组件必须放在 `HomeDesignSystem` 中；内部通过 `@scope` 隔离旧版默认样式。
- 主题只给自身以及包含它的 HTML 根节点提供变量；不会主动修改其他页面的颜色、字体或组件。
- 页面结构是 React 服务端组件，不再读取和注入整份 HTML，不引入额外组件库或客户端 React 状态。

## 颜色

| 令牌 | 已确定值 | 用途 |
| --- | --- | --- |
| `--home-color-canvas` | `#f3f5f1` | 页面底色、浅色导航 |
| `--home-color-surface` | `#f6f7f5` | 服务区、FAQ |
| `--home-color-support` | `#edf0e9` | 测评区、页脚 |
| `--home-color-white` | `#fff` | 白色按钮、深底文字、结尾区 |
| `--home-color-ink` | `#243d35` | 品牌与基础深绿文字 |
| `--home-color-heading` | `#29372f` | 内容区标题与正文基色 |
| `--home-color-muted` | `#526453` | 浅底说明文字 |
| `--home-color-primary` | `#294b3d` | 深绿主操作 |
| `--home-color-primary-hover` | `#3b5d4e` | 主操作悬停 |
| `--home-color-focus` | `#b96a54` | 键盘焦点、普通链接悬停 |
| `--home-color-border` | `#cbd4c8` | FAQ、卡片行动区分隔 |
| `--home-color-media` | `#e5e9e4` | 服务图片后备底色 |

导航透明/浅色/深色、搜索玻璃底、五种图片底色、悬停、选区、光标、阴影和场景文字的颜色也已登记在令牌文件中。保留摄影遮罩及搜索阴影，不套用旧版“无阴影”限制。

全站底部邀请区统一复用 `HomeInvitation`：使用用户提供的林间同行图片 `/home-preview/closing-invitation.webp`、Hero 深色遮罩和底部渐隐，文字与按钮为白色；共享同一套桌面和手机布局。

`--scene-ink`、`--scene-muted`、`--scene-border` 是滚动动画的运行时变量，仅作用于 `.scene`；脚本从黑底白线过渡至浅底深绿线。静态默认值也在首页令牌文件中。

## 字体与层级

| 角色 | 字体 / 字号 / 行高 |
| --- | --- |
| 基础文字 | Microsoft YaHei → PingFang SC → sans-serif；16px / normal |
| 衬线标题 | SimSun → Songti SC → serif；常规字重 400 |
| Hero 标题 | 54px / 1.4 |
| Hero 导语 | 16px / 1.9 |
| 滚动叙事标题 | 43px / 1.65；文档场景 34px |
| 服务区标题 | 30px / 1.7 |
| 服务卡片标题 | 21px / 1.7 |
| 测评区标题 | 40px / 1.6 |
| FAQ 标题 | 36px / 1.7 |
| 结尾邀请标题 | 52px / 1.65 |
| 小字 | 10、11、12、13、14、15px，分别对应说明、标签、正文及输入 |
| 邀请按钮 | JetBrains Mono → Microsoft YaHei → monospace；13px / 600 |

字体和字号使用 `--home-font-*`、`--home-type-*`；行高使用 `--home-leading-*`。字号令牌只用于排版，不借用为间距或图标尺寸。字距保持 0；字号不随视口宽度缩放。

## 间距与布局

- 公共节奏：`space-xs/sm/md/lg/xl` 分别为 8 / 12 / 20 / 32 / 60px，双栏内容间距 `space-section-gap` 为 100px。
- 页面主要内容左右留白 10%；服务网格及页脚内框 80%。
- 测评区与 FAQ 使用 10% 留白；Hero 文案最大 920px；搜索框宽 640px、最大 100%。
- 测评区上下留白 120px；FAQ 为上 120px、下 100px；结尾区上下 224px，最小高 768px。
- 顶栏固定高 82px，锚点滚动偏移 90px。
- Hero 与粘性场景高 `100svh`；叙事滚动距离 `480svh`；服务区最小高为 `max(780px, 100svh)`。
- 服务使用五个等宽网格列，列距 26px；测评区与 FAQ 均为双栏布局。
- 页脚六列比例为 `.7fr 1.35fr 1.1fr 1fr 1.25fr 1fr`，列距 32px；品牌区两列，间距 60px。
- 原有非等距细节（例如 Hero 按钮 14px × 22px 内距）保留在所属组件中，不为了统一数值改变已确认的画面。

## 可复用组件

| 组件 | API / 责任 |
| --- | --- |
| `HomeDesignSystem` | `children`；加载令牌、样式及主题隔离 |
| `HomeButton` | 原生链接属性；`variant="hero/navigation/invitation/primary/text"` |
| `HomeIcon` | `name="arrow-up-right/arrow-down/search"`；复用已确认 SVG 素材 |
| `ServiceCard` | `id?`、`href`、`title`、`description`、`image`；整项链接及真实服务图片 |
| `FAQList` | `items: { question, answer }[]`；原生 details/summary，可独立展开 |
| `HomeSplitSection` | `variant="support/faq"`、`id`、`title`、`children`；双栏内容区；首页当前只使用 FAQ 变体 |
| `HomeHeader` | `homeHref?`、`assessmentHref?`；品牌、完整主导航、测评入口 |
| `HomeFooter` | `columns?`、`statement?`；六栏目录与品牌版权区 |
| `ConcernSearch` | 当前首页搜索控件；与保留的服务匹配脚本协作 |

`HomeHero`、`HomeServices`、`HomeAssessment`、`HomeGuides`、`HomeInvitation` 和 `HomeJourney` 是页面组合模块，负责内容顺序和场景结构，不作为通用小组件扩展配置。

### 按钮与状态

- `hero`：白底深绿字、4px 圆角、右上箭头；悬停浅绿。
- `navigation`：默认细底线；Hero 顶栏状态下为白底按钮。
- `invitation`：透明底、无圆角，悬停或键盘焦点时上下两条线展开。
- `primary`：深绿底白字、3px 圆角，悬停加亮。
- `text`：透明底、白色底线，用于 Hero 深底。
- 搜索提交是独立语义按钮：42 × 42px，4px 圆角；输入行高 68px，外框 8px 圆角。
- 焦点环 2px；控件保持真实链接/按钮语义。外部新窗口链接保留 `rel="noopener"`。

### 服务卡片

真实服务图片比例 4:3，加载失败时显示后备底色。标题顶距 24px、最小高 72px；说明最小高 96px；底部行动区有 1px 分隔线。悬停时图片轻微放大，箭头向右上移动 3px。卡片本体无浮动外框、无圆角外容器，不嵌套卡片。

### 使用示例

```tsx
import { HomeDesignSystem, HomeButton, FAQList, HomeSplitSection } from "@/components/home/HomePrimitives";
import { HomeFooter } from "@/components/home/HomeNavigation";

export function Example() {
  return <HomeDesignSystem>
    <HomeSplitSection variant="faq" id="questions" title="常见问题">
      <FAQList items={[{ question: "还没决定是否离婚，可以咨询吗？", answer: "可以先梳理处境，不必提前做出决定。" }]} />
    </HomeSplitSection>
    <HomeButton variant="primary" href="/book-consultation/">预约咨询</HomeButton>
    <HomeFooter />
  </HomeDesignSystem>;
}
```

导航、页脚、搜索和滚动叙事是单实例页面结构，保留原有 ID；同一页面不要重复挂载。普通按钮、服务卡片、FAQ 和双栏区可重复使用。

## 响应式与动效

| 条件 | 当前已实现规则 |
| --- | --- |
| 任意宽度 | 百分比留白、max-width 内容约束、4:3 图片、`svh` 场景高度 |
| 高度 ≤ 700px 且宽度 ≥ 701px | 文档场景 top 从 22% 改为 18%；文档行内距改为 12px |
| 宽度 ≤ 900px | 测评区改为单栏，试卷堆限制最大宽度 680px |
| 宽度 ≤ 560px | 测评区收紧留白，并增高试卷以容纳双列选项 |
| prefers-reduced-motion: reduce | 关闭平滑滚动和搜索打字轮播；场景进度直接追随滚动；服务分支直接显示 |
| 普通动效 | 快速 200ms、常规 300ms、邀请按钮 400ms；邀请展开使用 `cubic-bezier(.22,1,.36,1)` |

除测评区外，五列服务、指南、FAQ 和六列页脚在窄屏仍保持参考结构，Hero 也保留原有裁切表现。这是当前复刻边界，不应写成“已完成移动端适配”。未来适配应作为独立设计变更确认后登记新断点。

## 维护与验证

内容数据位于 `home-content.ts`：五项服务、五个 FAQ 和页脚栏目。服务卡片与页脚核心服务共用数据，不再重复维护标题和地址。

交互脚本保留在 `public/home-preview/home.js`，翻页依赖同目录下的 PageFlip 浏览器构建；不要修改 `header`、`journey`、`yarn`、`concern-search`、`concern-input`、`search-results`、`services`、`core-service-0..4`、`assessment`、`guide-reader` 等选择器，除非同时更新脚本。生产导出继续通过 `data-home-preview` 标记保留这两个脚本。

首页采用自己的样式契约，不强制套用旧版 12 栏、橙色按钮和 Noto 字体。`auditHomeStyles` 校验令牌引用、循环、颜色归属、样式作用域和已登记响应式条件；原有样式契约继续校验子页。

常规验证：`node scripts/check-design.mjs`、`node scripts/check-structure.mjs`、`node --test scripts/style-contract.test.mjs`（在 `apps/website` 执行），以及根目录的 `node scripts/check-css.mjs`。页面级变更还需构建并对照截图、测试搜索/FAQ/滚动动画。
