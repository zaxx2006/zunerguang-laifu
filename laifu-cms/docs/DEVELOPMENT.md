# AceVec CMS

独立的 Payload CMS 后端。它复用 `zunerguang-web` 的 Payload 3 + Next.js + PostgreSQL 架构能力，但不复用其法律业务模型、前端组件或视觉样式。

当前管理完整首页、208 个受控页面的呈现内容、主导航、页脚和已复核媒体。AceVec 官网的 Route、Claim、Evidence、Entity、SEO、机器合同与 Release Registry 仍是唯一事实权威；CMS 只能覆盖已注册页面上的文字、章节显示、表格和图注，不能新增路径、改变结构化事实或覆盖这些注册表。

完整复用边界见 [Payload CMS 复用边界](./INTEGRATION.md)。

## 本地启动

1. 复制 `.env.example` 为 `.env`，配置 PostgreSQL 与随机 `PAYLOAD_SECRET`；本地可先运行 `docker compose up -d postgres`，生产环境不得使用示例密码。
2. 运行 `pnpm install`。
3. 运行 `pnpm payload:migrate:create`，复核并提交初始迁移，然后运行 `pnpm payload:migrate`。
4. 运行 `pnpm dev`，在 `http://127.0.0.1:5158/admin` 创建首个管理员。
5. 首个账号会自动成为管理员，再运行 `pnpm seed` 创建已发布的完整首页、208 个页面呈现、主导航与页脚。

公开投影端点为 `/api/public/v1/acevec/home-presentation`、`/api/public/v1/acevec/page-presentations` 和 `/api/public/v1/acevec/navigation`。只有已发布文档会返回；缺失时返回 404，不降级到草稿。

公开端点目录和 DTO 统一定义于官网 `src/contracts/cms-presentation.ts`，本应用 `src/services/cms-presentations.ts` 从 Payload 生成类型投影到该合同。完整接口责任表与联调入口见上方复用边界文档；根目录运行 `pnpm check:cms-contract`，已启动本地 CMS 时可追加 `--live` 做只读联调。

## 管理体验

- 后台使用完整预设 `b1ZhgOUbI`（Base UI、`base-lyra`、Zinc、Noto Sans、直角、蓝色图表、Lucide、subtle 菜单）：管理台直接引用 `src/components/ui/` 中的 shadcn 组件，不另建一套近似组件；Payload 继续承担权限、版本、草稿和发布流程。
- CMS 组件外观以该预设为准，保留原生的细描边和浮层层级；官网、内容预览和内部看板的无阴影规则不随 CMS 预设恢复而改变。
- 完整首页、每个页面呈现、导航和页脚均提供“预览”与“实时预览”。编辑表单会自动打开预览面板，并可切换桌面、平板和手机尺寸。
- 实时预览先载入当前草稿，再合并 Payload 的表单消息；未保存的标题、段落、表格、图注、按钮、导航组与页脚会立即同步。
- `components.json` 是 shadcn 配置入口；新增管理台组件使用 `pnpm dlx shadcn@latest add <component>`，不要直接修改 Payload 的生成代码。
- 桌面折叠侧栏保留 Logo 和可点击图标；Logo 头部与右侧文档状态栏共用 56px 高度，图形标识与两行品牌文字的视觉高度一致；选中态只用底色与字重。`AdminNav` 复用 Payload 的 `useNav`、`navRef` 与 `useWindowInfo`，只适配外壳的 `inert` 条件：桌面图标栏仍可操作，1024px 及以下关闭的抽屉才禁用交互。原生 `NavWrapper` 不支持这个区别，不能直接替回或用 CSS 假装解除 `inert`。

### 预设与主题接入合同

- 在 `apps/cms` 中运行 `pnpm dlx shadcn@latest preset decode b1ZhgOUbI` 核对配置；恢复使用 `pnpm dlx shadcn@latest apply b1ZhgOUbI`，不要重新创建 Next 应用。更新后核对差异并保留下面的布局与 Payload 适配合同。
- Noto Sans 由 `(payload)/layout.tsx` 的 `next/font` 加载，通过 Payload `RootLayout.htmlProps` 挂到根节点；字体别名最终指向 `--font-noto-sans`，不得出现 `--font-sans: var(--font-sans)` 自引用。CLI 对 Payload 路由组的字体识别可能回退，以字体加载源码和浏览器计算样式核验实际接入。
- `admin.css` 只维护一份浅色和一份深色预设值；深色同时支持 `.dark` 与 Payload 的 `data-theme="dark"`。通用边框在 Tailwind base 层统一使用 `border-border`，避免 `border-b` 等工具类退回文字颜色而出现黑线。
- Card、Table、Field 等外观由安装的组件负责，不在页面 CSS 重写卡片标题字体或额外添加 CardHeader 分隔线；共享布局只补全宽、内容弹性填充及不压缩页头/页脚。Payload 原生单行控件和顶栏使用与 Lyra `h-8` 相同的 32px 控制高度。
- 嵌套卡片和投递状态区使用 `--card` 表面，不用页面 `--background` 制造深色模式中的黑色凹块；成功、失败等语义色只用于状态表达。Logo 直接切换原有 `mark-ink.svg`／`mark-paper.svg`，不加底板、悬停底色或 `invert()` 滤镜。
- 发布状态复用共享 Badge：已发布用 `success` 绿色，草稿用 `warning` 琥珀色，保留文字，不仅靠颜色区分。变体从现有 `--admin-success`／`--admin-warning` 与前景、卡片 token 混合生成文字、浅底和描边，兼容明暗主题；不在页面 CSS 覆盖默认黑灰变体。两种主题的标签文字对比度最低为 4.5:1，由 `check:layout` 回归检查。
- 根目录运行 `pnpm check:layout` 锁定预设、字体、边框与布局合同，再运行 CMS 类型检查和构建；浏览器需覆盖仪表盘、列表、表单与响应式尺寸。

### 菜单与展开动效合同

- DropdownMenu（含子菜单）、Select 与 Payload 原生 Popup、ReactSelect 复用 `admin.css` 的 `acevec-menu-motion`；浮层统一淡入，不各自加入上滑、下滑或缩放。继续使用组件自身的定位、键盘导航和关闭生命周期。
- Select 默认 `alignItemWithTrigger={false}`，优先在按钮下方打开，不把选中项覆盖到触发按钮上；保留底部空间不足时由原组件自动向上避让，禁止用 CSS 强制浮层坐标。
- 原生 AnimateHeight 与浮层共用已有的 120ms 时长和缓动；覆盖行内 transition 的优先级仅用于接入这个合同，原组件仍负责高度测量和生命周期清理。
- “列／过滤条件／分组”切换时，已关闭面板立即隐藏并释放占位，避免新面板在旧面板下面随之上移；单独展开与收起仍保留高度过渡。规则作用于共用 `.list-controls`，覆盖集合、文件夹和关系抽屉。
- `prefers-reduced-motion` 缩短同一个时长变量；验证运行 `pnpm check:layout`，并在浏览器检查双向切换、快速重复开关、键盘关闭、底部避让和窄屏。

### 卡片布局合同

- 容器负责分栏与同排拉伸；卡片填满分配的单元格，不使用 `align-items: start`、`h-fit` 或固定高度制造卡片下方空洞。
- 复用 `Card` 的全宽、`CardContent` 的弹性填充和不压缩的页头/页脚；链接包装层使用 Grid 继续传递拉伸，不逐卡补 `height: 100%`。
- 外层面板只通过直接子选择器调整自己的标题区，禁止把高度、字体和间距规则传播给嵌套卡片。
- 单列按内容自然增高；图标、按钮、文字标签仍保持自身合理尺寸，不对所有元素一刀切加全高。
- 根目录运行 `pnpm check:layout` 检查 CMS、隔离预览、官网与内部看板的卡片网格合同；改动后还要在浏览器检查桌面、平板、手机的同排底边、内容溢出和页脚位置。

### 列表与表单对齐合同

- 工作台填满侧栏之外的剩余宽度，与顶栏共用一层页面边距，不限宽居中叠加留白。
- Payload 原生表格统一单元格内边距与垂直居中；选择列和拖动列由单元格分配 40px，全选与逐行选择的包装层负责居中实际控件，不能只给全宽包装层设置自动外边距。
- 规则作用于共用 `.table`，覆盖集合列表、关系选择抽屉及文件夹表格；继续使用 Payload 的表格、选择和排序逻辑。
- 勾选记录后，卡片右上角的视图切换会被 Payload 原生批量操作栏替换，避免“垃圾箱”入口清空当前选择；选中数量与操作按钮直接分组，隐藏 Payload 默认的装饰性短横线；批量删除继续使用原生 `DeleteMany`、权限检查、回收站语义和确认弹窗，不另写删除请求。
- 用户管理不启用回收站；账号删除继续由 Payload 原生权限与确认流程负责，不显示与账号语义不符的垃圾箱视图。
- 单行输入框共用控制高度；原生标签与 shadcn Field 的间距只能由一层负责。富文本、多行输入、上传和组合控件不被通用高度规则覆盖，独立分组保留自己的内边距。
- 浅色与深色模式的表单控件均使用细边框、无投影表面；焦点只用可访问的外框表达。规则覆盖 Payload 原生文本、日期、关系、代码与搜索输入，不移除菜单、日期面板和对话框的层级投影。
- 修改后运行 `pnpm check:layout`，并实测表头与行勾选框中心、键盘选择、表单控件边界及窄屏滚动。

## 目录边界

```text
src/
├── admin/                 # 后台品牌、仪表盘、集合元数据与预览配置
├── app/(payload)/         # Payload 管理端与 API 路由
├── app/(preview)/         # 与官网风格对齐的隔离预览应用
├── collections/           # 集合权限、版本和生命周期组合
├── config/                # 环境与运行配置
├── fields/presentation/   # 首页、页面、导航与页脚字段定义
├── preview/               # 预览状态、类型与展示组件
├── services/system-events/# 审计与发布事件服务
└── hooks/                 # Payload 生命周期的轻量适配层
```

`payload.config.ts` 只负责组装；字段、预览、后台体验和系统事件分层维护，避免把业务模型堆进单个配置文件。

## 性能与架构合同

- 首页、页面与导航集合统一复用 `presentation-policy.ts`；权限、审计、发布事件、版本上限和自动保存节流只有一个配置来源。自动保存使用 30 秒防抖，避免大型嵌套文档在连续输入时频繁写库和生成版本；自动保存仍保留草稿版本，但不再为每次按键额外写审计日志或查询发布事件。
- 仪表盘通过 `services/dashboard.ts` 并行读取有界视图数据；媒体统计使用数据库计数，不再把全部媒体及尺寸元数据加载到服务端内存。
- 三个公开投影 Route 只负责协议适配，查询、DTO 投影和缓存校验统一进入 `services/public-cms-api.ts`。成功响应使用强 ETag 与 `max-age=0, must-revalidate` 保持每次复核；进程内仅保留三个按内容版本校验的序列化投影，版本变化后自动失效。404 继续 `no-store` 并失败关闭。
- 实时预览把编辑消息标记为非紧急 React transition，避免大型预览重绘阻塞消息处理。三个渲染器合计体积很小，生产构建实测拆包反而增加首次加载开销，因此保留同包并由结构门防止无依据拆分。
- 头像补查只选择名称、邮箱和头像字段。性能结构门运行 `pnpm check:cms-performance`；修改数据链路后还需运行 CMS 类型检查、合同检查与生产构建。
- 页面初始化先用一次只含 Route 的投影读取建立已存在集合，再创建缺失页面；禁止在 208 页循环中逐页查询。

## 发布与构建

发布或撤回首页、导航时，CMS 会在同一事务中写入不可手工修改的审计日志和 Publish Event。内容请求本身不会调用外部网络。

配置 `ACEVEC_BUILD_HOOK_URL` 与至少 32 字符的 `ACEVEC_BUILD_HOOK_SECRET` 后，显式运行 `pnpm publish:dispatch`。分发器最多读取 25 个待处理事件，发送带时间戳、HMAC-SHA256 与幂等键的构建请求；失败事件最多重试五次。由于官网是纯静态导出，该 URL 应指向托管平台的构建钩子，而不是伪造的运行时 revalidate API。

媒体默认写入 `PAYLOAD_MEDIA_DIR`，当前只允许图片和 PDF。未确认使用权的媒体不能标记为公开可用。
