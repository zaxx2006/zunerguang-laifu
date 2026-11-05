---
version: 3
name: LAIFU-design-analysis
description: |
  A calm questionnaire-aligned editorial system with warm white, neutral surfaces and restrained orange actions for people navigating family transitions. Noto Sans SC defines all titles, reading, interface and numeric surfaces. Every page declares its section count, source grouping, role, column count, density, tone and media decision before rendering. A shared 12-column grid and one gutter align the whole site; content rhythm comes from deliberate section compositions rather than global templates.

colors:
  # Brand
  primary: "#FF6B00"
  on-primary: "#1C1A16"
  on-primary-hover: "#FFFEFD"
  primary-dark: "#B94700"
  action: "#FF6B00"
  action-hover: "#B94700"
  primary-ink: "#1C1A16"
  secondary: "#FF6B00"
  secondary-dark: "#B94700"
  # Typography
  ink: "#1C1A16"
  body: "#3D3A33"
  mute: "#6E6960"
  stone: "#8C877E"
  ash: "#ADA89F"
  # Surfaces
  canvas: "#FFFEFD"
  surface-soft: "#F9F8F6"
  surface-dark: "#F6F2EB"
  surface-elevated: "#F5F2EC"
  hero-category: "#E0EEE6"
  hero-heading: "#F4F8F5"
  # Borders
  hairline: "#E0DBD2"
  hairline-strong: "#C5C0B5"
  # Dark mode text
  on-dark: "#FFFEFD"
  on-dark-mute: "#D5CFC5"
  # Links
  link-blue: "#3D3A33"
  blue-700: "#3D3A33"
  # Functional colors
  error: "#C94A3B"
  error-deep: "#72251C"
  warning: "#C87924"
  warning-bright: "#E59A42"
  success-deep: "#1C1A16"
  # Accent
  accent-yellow-pale: "#F6F2EB"
  accent-purple: "#8C877E"
  accent-purple-deep: "#3D3A33"
  accent-purple-pale: "#F5F2EC"
  accent-green-pale: "#F6F2EB"
  accent-sky-pale: "#F9F8F6"
  accent-coral: "#F6F2EB"
  # Back-to-top control, matching the GrowthMan reference.
  back-to-top-surface: "#FFFFFF"
  back-to-top-ink: "#999999"
  back-to-top-hover: "#243D35"
  back-to-top-hover-ink: "#FFFFFF"
  back-to-top-shadow: "rgba(0, 0, 0, 0.06)"

leading:
  heading: 1.2

typography:
  display-xl:
    fontFamily: Noto Sans SC
    fontSize: clamp(48px, 7vw, 96px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Noto Sans SC
    fontSize: clamp(36px, 5vw, 64px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.03em
  display-compact:
    fontFamily: Noto Sans SC
    fontSize: clamp(36px, 3.5vw, 44px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.03em
  display-editorial:
    fontFamily: Noto Sans SC
    fontSize: clamp(48px, 6vw, 88px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.04em
  section-editorial:
    fontFamily: Noto Sans SC
    fontSize: clamp(36px, 4.2vw, 60px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.03em
  heading-xl:
    fontFamily: Noto Sans SC
    fontSize: 30px
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  heading-lg:
    fontFamily: Noto Sans SC
    fontSize: 22px
    fontWeight: 400
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  heading-md:
    fontFamily: Noto Sans SC
    fontSize: 20px
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  heading-sm:
    fontFamily: Noto Sans SC
    fontSize: 18px
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  card-title:
    fontFamily: Noto Sans SC
    fontSize: 17px
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  body-md:
    fontFamily: Noto Sans SC
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  body-strong:
    fontFamily: Noto Sans SC
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Noto Sans SC
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  button-lg:
    fontFamily: Noto Sans SC
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  button-md:
    fontFamily: Noto Sans SC
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  button-primary:
    fontFamily: Noto Sans SC
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  home-entry:
    fontFamily: Noto Sans SC
    fontSize: clamp(22px, 2vw, 32px)
    fontWeight: 400
    lineHeight: var(--leading-heading)
    letterSpacing: 0
  button-sm:
    fontFamily: Noto Sans SC
    fontSize: 14.4px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.144px
  link-md:
    fontFamily: Noto Sans SC
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-md:
    fontFamily: Noto Sans SC
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
    textTransform: uppercase
  caption-sm:
    fontFamily: Noto Sans SC
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  caption-xs:
    fontFamily: Noto Sans SC
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  utility-xs:
    fontFamily: Noto Sans SC
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
    textTransform: uppercase
  body-xs:
    fontFamily: Noto Sans SC
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  hero-long:
    fontFamily: Noto Sans SC
    fontSize: clamp(42px, 7cqi, 80px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.04em
  editorial-heading:
    fontFamily: Noto Sans SC
    fontSize: clamp(28px, 2.8vw, 40px)
    fontWeight: 700
    lineHeight: var(--leading-heading)
    letterSpacing: -0.03em
  editorial-number:
    fontFamily: Noto Sans SC
    fontStack: 'var(--font-noto-sans-sc), "Noto Sans SC", Arial, Helvetica, sans-serif'
    fontSize: clamp(18px, 2vw, 24px)
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.04em
  editorial-body:
    fontFamily: Noto Sans SC
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  editorial-deck:
    fontFamily: Noto Sans SC
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  editorial-voice:
    fontFamily: Noto Sans SC
    fontStack: 'var(--font-noto-sans-sc), "Noto Sans SC", sans-serif'
    fontSize: clamp(28px, 3.2vw, 44px)
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.02em

rounded:
  none: 0px
  xs: 1px
  sm: 2px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
  section: 64px
  section-large: 96px

layout:
  columns: 12
  gutter: 48px
  column-gap: 32px
  viewport-width: 100vw
  canvas-max: 1440px
  content-inset: 'max(var(--layout-gutter), calc((100vw - var(--layout-canvas-max)) / 2 + var(--layout-gutter)))'
  section-link-min: 168px
  section-inset: 0px
  section-block: 64px
  section-feature-block: 80px
  reading-width: 800px
  editorial-reading-width: 800px
  faq-reading-width: 960px
  prose-width: 640px
  cover-height: clamp(560px, 54vw, 700px)
  panorama-height: clamp(240px, 32vw, 460px)
  hero-banner-height: clamp(240px, 33.333vw, 600px)
  home-entry-height: 144px
  portrait-height: clamp(320px, 38vw, 520px)
  cover-panel-width: 760px
  editorial-duration-width: 80px
  card-min: 256px
  step-card-compact-height: 160px
  pair-min: 304px
  table-min: 720px
  menu-width: 816px
  hero-copy-inset: 0px
  hero-image-inset: 0px
  hero-min-height: 656px
  hero-image-max: 600px
  editorial-art-width: 400px
  editorial-art-height: 320px
  anchor-offset: 92px

stroke:
  hairline: 1px
  emphasis: 2px
  marker: 3px
  icon: 2
  focus-offset: 4px

size:
  control: 44px
  control-large: 56px
  nav: 72px
  utility: 40px
  header: 72px
  subnavigation: 48px
  logo: 36px
  icon: 20px
  icon-small: 16px
  marker: 12px
  junction: 24px
  indicator: 32px
  hidden: 1px
  filter-label: 80px

tracking:
  normal: 0
  label: 0.04em

opacity:
  decoration: 0.4
  disabled: 0.6

layer:
  content: 1
  decoration: 0
  subnavigation: 90
  navigation: 100
  skip-link: 1000

breakpoints:
  mobile: 600px
  tablet: 960px
  navigation: 1200px

responsive:
  tablet:
    layout-gutter: 32px
    layout-section-inset: 0px
    layout-section-block: 64px
    layout-section-feature-block: 64px
    layout-hero-copy-inset: 0px
    layout-hero-image-inset: 40px
    layout-anchor-offset: 92px
  mobile:
    layout-home-entry-height: 144px
    layout-gutter: 24px
    layout-column-gap: 16px
    layout-section-inset: 0px
    layout-section-block: 48px
    layout-section-feature-block: 64px
    layout-hero-copy-inset: 0px
    layout-hero-image-inset: 20vw
    layout-anchor-offset: 92px

motion:
  back-to-top-color: 400ms
  back-to-top-fill: 600ms
  back-to-top-ease: "cubic-bezier(0.785, 0.135, 0.15, 0.86)"
  fast: 200ms
  base: 300ms
  slow: 500ms
  stagger: 60ms
  ease-standard: "ease-in-out"
  ease-precise: "ease-out"

---

# LAIFU 设计系统

当前首页已采用单独提取的[首页设计系统](home-system.md)，以确认后的摄影 Hero、深绿文字、毛线球叙事和五列服务为准。首页令牌与组件位于 `apps/website/src/components/home/`。本文 YAML 继续作为既有子页和问卷的令牌来源；下文涉及旧版首页的描述仅保留为历史背景，不覆盖当前首页规范。

YAML frontmatter 是官网与问卷共享视觉令牌的唯一数值来源；生成 CSS 不手工修改。本次以问卷原有阅读界面为基准，恢复米白底、深灰字、浅暖灰分区和细边框。原有照片、Logo、内容顺序和交互组件继续复用。

## 布局与排版

全站使用 12 栏、1440px 最大外框和 32px 列距；桌面 gutter 为 48px，平板为 32px，手机为 24px。正文最大行长 640px，开篇和组合叙事最大 800px，复杂集合使用完整网格。标题沿用 Noto Sans SC，正文、界面和数字沿用与问卷一致的 Noto Sans SC；通过字号、留白与字重表达层次。

首页保留场景摄影与米白标题面板，四个章节入口改为米白底、暖灰细分隔。子页保留栏目 / 标题、通栏照片、面包屑 / 导语的结构：栏目使用浅鼠尾草绿（hero-category），标题使用带绿调的近白色（hero-heading），960px 以下按阅读顺序堆叠。照片保留已有主体裁切，不添加滤镜或装饰占位。纯文字页面不补造图片。

章节只允许 canvas、sand、stone 三种中性表面，分别对应米白、浅灰与暖灰。章节清单不再以紫、蓝、黄、珊瑚等颜色命名或编码内容角色。嵌套模块在米白章节使用浅灰，在浅灰章节使用米白；边界通过 hairline 和内距建立。流程折叠项、资源模块、支持方式面板使用同一规则，取消按主题分配彩色背景。

主色橙 #FF6B00 仅用于主操作、选中指示及少量既有插图；按钮使用墨色字和深橙边框，悬停使用深橙 #B94700 与米白文字，保持文字对比度。次级操作使用透明底与暖灰边框，悬停加强边框。导航、分类、清单及整块章节不使用橙底。历史 accent 令牌仅作为问卷和报告的中性兼容别名，官网组件禁止再引用。

控件采用 2px 圆角；没有阴影和渐变。焦点环在浅色区使用墨色，在深色页尾使用米白。保留红色错误和警示色等有业务含义的反馈。正文固定 16px / 1.75，次正文 15px / 1.75，说明 14px / 1.5；间距采用 4px 基础节奏，2px 仅用于微调。主站、测评站和后台的所有标题行高统一为 1.2，复用共享 leading.heading 令牌；正文、说明和控件行高按各自用途保留。

顶栏为 72px，菜单三栏使用米白 / 浅暖灰并以细线区分；当前页使用暖灰选中状态。页内目录保留原位置和滚动行为，锚点偏移 92px；移动目录在原位展开。交互使用 200–300ms 轻量过渡，尊重减少动效设置。首页入口桌面四列、平板与手机两列，整块可点击且保留键盘焦点。

页尾行动区和页脚使用深灰色，与问卷的结尾结构衔接。CTAFrame、ActionButtons、六栏页脚、CardGrid、Steps、资源筛选和折叠组件全部复用；保留原有响应式排列、操作顺序和内容，不增加无业务意义的装饰、英文、数字或假链接。

## 工程边界

| 文件 | 唯一职责 |
| --- | --- |
| src/app/globals.css | 仅声明层顺序与导入，禁止追加补丁 |
| src/styles/foundation.css | 重置、元素默认排版、全局焦点与减少动效 |
| src/styles/layout.css | 容器、12 栏章节、内容宽度、CTA 框架 |
| src/styles/controls.css | 按钮、行动链接、跳转主内容 |
| src/styles/navigation.css | 品牌、桌面与移动导航、子菜单 |
| src/styles/hero.css | Hero 图文与面包屑 |
| src/styles/content.css | 正文、步骤文本、事实、提示、折叠内容 |
| src/styles/collections.css | 卡片、指标、表格、页内目录、资源筛选 |
| src/styles/testimonials.css | 横向评价轨道、切换控件与响应式反馈卡片 |
| src/styles/editorial.css | 长文跨栏、栏目导语、图文开篇与补充目录 |
| src/styles/forms.css | 自查与预约预览 |
| src/styles/footer.css | 页脚栏目和版权区 |

层顺序固定为 tokens → base → layout → components。组件的基础、状态和响应式规则放在同一个归属文件；允许明确的断点或状态变化，不允许同一上下文重复声明来覆盖历史规则。布局容器只能控制直接子项，不用宽泛的后代网格跨度。

已有 CardGrid、Steps、CTAFrame 继续复用；新增 SectionFrame 和 StatusNotice 作为唯一章节/提示结构，MDX 与结构化内容共用。StructuredContent 负责页面组合，ContentBlock 负责块类型派发，RichText 只负责无损拆分文本，content-types 负责数据契约。构建脚本生成内容，展示组件不重新解释工作簿事实。

全站 StructuredContent 与 MDX 复用既有章节组件。story 使用连续阅读栏，feature 使用明确的标题与正文主次，principles 表达并列原则，steps 使用真实的顺序编号，directory 使用内容目录，faq 使用章节标题与可展开的问题，testimonials 保留横向评价轨道和切换控件。非流程章节不再显示大号装饰编号；页内目录编号只用于定位。首页长标题按中文意群断行，不改写标题原文。每个 section 独立选择集合栏数，连续正文不通过字数阈值自动分栏；手机统一为顺序阅读。资源分类保持互斥展开及原始内容、锚点和操作。页面不增加辅助英文、虚构文案或伪链接。

“课程与工作坊”保留原地址，归在“线下活动”的桌面/移动子菜单、页脚栏目和面包屑中；活动总览提供对应入口。分类元数据写入生成脚本，重新同步工作簿不会撤销分类。

集合卡片使用共享行轨道对齐分类、标题、正文和底部状态/操作，正文容器填满剩余空间。文章分组标签延续至同组后续卡片，避免分类缺位导致标题上下错位；不通过固定高度、截断正文或扩大字间距实现对齐。所有原生下拉框复用统一的 SelectControl：文本左侧与下箭头右侧均保留 16px 间距，文字与箭头之间保留完整安全区，焦点环沿用墨黑；资源筛选使用两个有明确标签的下拉框和清除操作，结果保持固定顺序并显示为整行互斥展开卡片；展开的资源条目标题和正文共用一块完整的浅米底色，不在两侧留下暖白断层。折叠状态只显示形式、标题和阶段，展开后再显示摘要、元数据与操作，避免一次铺满全部正文。手机按同一信息层级自然换行。

全站带序号的 h2、h3、h4 与折叠标题均从来源标题中拆出独立编号标签，覆盖括号编号、序号点、两位章节号和层级编号；时长、页数等数值不作为标题编号。编号标签保留统一槽位并与标题上沿对齐，长标题自然换行，不再用 space-between 将三段文字挤成居中排列。同级编号集合中的无编号条目仅保留空槽位，不补造编号。明确标注的阶段标题与服务项分层：阶段占左侧四栏，所属服务以单列占右侧八栏，960px 以下阶段标题置顶；仅服务项可展开，不把空的阶段标题做成按钮。阶段关系只从原始明确标签提取，第一项服务从原先嵌入的标题行提升显示，保留原文、顺序、锚点与操作，并继续复用 CardGrid 和 ContentBlock。

步骤卡片的编号标签与标题从同一上沿开始，说明文字置于标题下方并与标题左边缘对齐；不再让“第三步”等中文序号持续占据正文列宽，避免资源页等窄卡片出现二次缩进后的一百余像素长文栏。

带推荐内容的卡片另设独立推荐区轨道，不能把简介和推荐列表塞在同一正文格中。推荐指南、近期主题和推荐课程共用紧凑列表，保留原文，不因书名号、项目符号或纯文本的来源差异使用不同装饰；场次说明单独作为备注显示。此类子章节复用 ContentGrid 并保留原锚点。

连续正文保持单栏，段落与列表按原始顺序阅读；不再强制三栏、不把完整句子拆到不同列。人物特写、横向空间和场景封面使用各自的裁切与焦点；未指定构图的图片保持原始比例。窄屏恢复流式图文结构，不固定文字高度。媒体页继续复用 CardGrid 与 ContentBlock，发布说明保留完整边界与锚点。

所有内容项目符号统一由 RichText 重新编排，不保留浏览器圆点或悬挂短线。名称与说明型清单使用语义定义列表；短要点使用紧凑分栏索引；情境长句保留原有分句，形成引句与说明的阅读层次；问题清单采用常规字重的衬线提问；书目、时长与题目、推荐内容分别使用目录行、双字段行和紧凑推荐区。优先复用原文标签并与清单绑定，不添加虚构标题、装饰编号、假复选框或卡片外框。每项完整保留在同一列，容器不足时自然恢复单列；少数带逗号的短项不应把整组短清单变成长句卡片。

CardGrid 的 modules 变体把标题、适用情境、推荐阅读和操作组成完整模块，复用既有浅色表面与内距、不加描边。模块、展开正文及支持方式面板中的要点清单保持单列完整句子，不在已有双栏卡片内再次碎分成三栏；去掉重复规则线和引句拆分，阅读清单也不逐条描边。可展开流程与不可展开的支持方式不混为同级网格：步骤并列呈现，后续支持方式作为独立的通栏补充模块。开篇只删除与页面导语完全相同的首段重复文本；源操作顺序与具体锚点保留，同类咨询入口不重复生成。

无配图的组合叙事章节将标题置顶，内容使用整行网格，避免两栏内容再次被挤进页面右侧。文字组始终向顶部排列，不因相邻清单较长而拉开段落。源内容与最终组合页面均逐项核对，覆盖 151 段含项目符号的文本、1,199 个条目；公开页面的展开状态另检查原生标记、窄列、溢出与清单文字对比度。首页服务目录的标题、照片和正文左边缘统一，导语行长放宽至 800px，不叠加额外网格缩进。页内导航只在桌面与平板吸附到顶栏下方，不占用预留固定视口空间，main、CTA 与页脚之间不插入避让留白。

本轮依 web-design-engineer 的构图、比例和语义层次原则复核，保留原有字体，配色统一使用问卷中性视觉基准。每处图片须有明确的内容关系，不用照片数量或占比作为审美质量指标。已有照片不替换，照片裁切只通过 CSS 完成。人物照片仍只表达一般场景，不冒充团队、客户或案例。交互沿用既有组件，无新增动画库或客户端脚本，下屏图片继续延迟加载。

## 严格校验

- audit:design 用 CSS 语法树检查所有样式模块：未定义/循环令牌、原始尺寸和色值、字重行距、未登记断点、!important、重复声明、跨文件归属、缺失层、掩盖横向溢出的规则。
- audit:structure 检查实际解析出的网格/提示规则及共享组件复用，主站检查不再读取问卷应用代码；问卷有自己的结构检查入口。
- audit:sections 检查所有来源章节完整且按顺序归类、每个 section 的角色/栏数/色调/密度、视觉判断、配图理由与插图适用场景，以及配图唯一性、来源记录、12 栏整除、统一 gutter、两种字体和七档行距；section-plan.md 必须与清单完全一致。
- 样式校验器附带失败样例测试，验证它确实能拦截错误。
- 浏览器检查 30 个页面，覆盖桌面、平板、手机和断点邻近宽度；除全页溢出，也检查组件内部截断、长中文段落可用宽度、实际 12 栏、标题意群断行、同排标题/正文/底部轨道、图片与零脚本。
- 预约提示正文必须纵向展开，不允许重新出现“一字一行”；课程归类、折叠、自查、资源筛选分别进行交互检查。
- 中文闭合标点的半字宽行末外伸只有在未裁切、仍处于卡片内距且不超过半字宽时才允许；不能用标点规则豁免整页溢出、正文过窄或越过组件边界。
- 工作簿内容由独立产物审计继续逐项核对，不能以精简排版为由丢失原文或附表内容。
