# AceVec 工作区规则

## 开发黄金原则

以下原则按优先级执行；发生冲突时，前项优先于后项，目标应用更近的 `AGENTS.md` 只补充细节，不得突破这里的权威边界与发布门。

1. **先锁定任务合同，再动代码。** 开始前用一句话确定目标应用、要解决的问题、验收标准和明确非目标；能从仓库确认的信息先自行确认，只有会改变产品含义、权威来源、公开事实或发布状态的分歧才向用户确认。
2. **一个对象只有一个权威来源。** 官网 Registry 管公开事实与发布合同，CMS 管已批准页面的呈现内容，看板 `src/content/` 管内部看板内容；消费者只能读取或投影权威源，不得反向覆盖，也不得创建并行真源。
3. **证据强度决定表达强度。** `synthetic` 不等于真实运行，`staged` 不等于 `production`，HTTP 可达不等于索引、引用或采用，`unknown` 不得改写成 0、通过或失败；没有批准证据不得虚构或升级客户、结果、价格、法务、实体、市场领先及发布状态。
4. **先改合同与源，再改投影。** Route、Entity、Claim、Evidence、SEO、机器合同和 Release 变化先改 Registry、Schema、模板或生成器，再生成消费者；禁止直接修补生成物、复制常量或在页面/CMS 中硬编码第二份事实。
5. **默认失败关闭。** 配置、CMS、外部证据、版本或发布前置条件缺失时，构建应报错或保持未批准状态；不得静默回退、吞错、伪造成功，也不得为了通过检查放宽 noindex、robots、安全、隐私、证据或 Release 门。
6. **复用优先于重写。** 修改前先找现有组件、函数、类型、Registry、Schema、适配器、脚本和测试夹具，优先扩展或组合已有能力；只有现有实现无法满足合同、继续复用会破坏边界，或重写收益有可验证依据时才重写，并保留兼容与迁移路径。不得复制粘贴形成近似实现，也不得以“更干净”为由替换已验证链路。
7. **只做最小完整闭环。** 以最少文件完成“权威源 → 消费者 → 验证”；禁止顺手重构、推测性抽象、无关格式化，以及无必要地新增依赖、路由、数据源、环境变量、全局 token 或跨应用耦合。
8. **先保护现场，再编辑。** 开始时检查 `git status` 和相邻 diff，把现有改动视为用户资产；只改任务所需行，不覆盖、不回退、不借机清理无关改动，发现重叠时先理解并在其上兼容。
9. **验证按风险递进。** 先运行最便宜且能证伪本次改动的定向检查，再运行目标应用 typecheck 或完整门禁；跨应用或共享合同变化才扩大到根检查。失败必须修根因，不得用 `any`、忽略规则、删测试、改快照或放宽阈值掩盖。
10. **完成必须可证明。** 交付应同时满足实现、相关合同/测试/文档一致、最小充分检查通过；未运行的检查和真实外部阻塞必须明确说明，不把“代码已写”表述成“生产已验证”。

### 防跑偏红线

- 未明确要求时，不全仓扫描、不进入 `research/` 或 `docs/recruiting/`、不跨应用、不联网调研、不改发布状态、不做部署或数据迁移。
- 新发现若会扩大任务边界、改变权威数据源、引入不可逆迁移或修改公开商业含义，先停止扩张并向用户说明；普通实现细节自行选择最小方案。
- 同一问题连续两次尝试仍失败时，回到权威源、错误输出和最小复现重新诊断，不继续叠加补丁。

## 项目边界

- `apps/web/`：对外官网、公开事实、SEO/GEO Registry、机器合同与发布门的唯一权威。
- `apps/cms/`：Payload CMS，只管理已批准的呈现内容，不得覆盖官网 Registry。
- `apps/dashboard/`：内部经营看板，不是对外官网。
- `research/`：调研、原始证据与研究计划；默认只读，任务明确涉及研究时再进入。
- `docs/recruiting/`：招聘资料；与产品开发任务无关时不要读取。

## 最小上下文

1. 先读本文件，再读目标目录最近的 `AGENTS.md`。
2. 只读取目标应用的 README、相邻实现和相关测试，不全量扫描调研、证据或生成数据。
3. 用 `rg` 精确定位；不得把 `.next/`、`out/`、`node_modules/`、`tmp/`、原始抓取结果或构建产物载入上下文。
4. 跨应用改动前先确认权威数据源和依赖方向，避免建立第二套事实源。

## 代码约束

- 函数内部不留空行。
- 代码注释和函数 docstring 使用简短单行形式，禁止多行块注释；类说明可多行但不要空行。
- 保持 TypeScript strict，不用 `any`、忽略规则或删除测试掩盖问题。
- 不直接编辑生成文件；修改源文件、合同、模板或生成器。
- 并排卡片由容器分配空间并拉伸，链接包装层必须传递拉伸，内容区填充剩余高度；禁止用固定高度或 Hug Content 修补同排缺口，外层卡片样式不得穿透嵌套卡片。布局修改运行 `pnpm check:layout` 并在浏览器核对同排底边与窄屏溢出。
- 优先做最小、可验证、可回滚的改动，不顺带重构无关代码。

## 文件与安全

- `node_modules/`、`.next/`、`out/`、`tmp/`、`*.tsbuildinfo`、日志和事务快照均为可删除中间文件。
- `.env`、私有证据、凭据、客户数据和本地媒体不得提交。
- 调研原始证据不是垃圾文件；没有明确替代物和引用核验时不得删除。
- 删除或移动文件前先检查引用；变更后运行目标应用的最小充分检查。

## 应用检查

- 全部应用类型检查：根目录运行 `pnpm typecheck`。
- 内部看板：`pnpm check:dashboard`。
- 对外官网：`pnpm check:web`。
- CMS：`pnpm --filter @acevec/cms build`；该命令需要数据库环境配置。


## 独立交付包路径说明

本包根目录对应原仓库 apps/cms；不包含官网与看板。src/contracts/cms-presentation.ts 和 seed-data/ 是来源可追溯的只读导出快照，不是新的事实权威；合同变更回原官网批准后重新导出。运行 pnpm test、pnpm typecheck、pnpm build；原仓库的跨应用门禁需由集成方运行。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
