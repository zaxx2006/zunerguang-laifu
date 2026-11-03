# Payload CMS 复用边界

## 决策

AceVec 复用 `hubeitongren01-code/zunerguang-web` 的 Payload CMS 后端能力，不复用其 `apps/web` 页面、组件、样式、品牌资产或法律行业内容模型。前端继续由 AceVec 独立设计，CMS 只通过受控 DTO 提供经过发布的展示内容。

参考基线：`zunerguang-web` `main` 分支提交 `c59539ac6bdeed7b803df33f5e9e63cfd8aa7610`。

## 可复用能力

- Payload 3 + Next.js 16 管理端、PostgreSQL 适配器与迁移流程。
- 用户、角色、访问控制、审计日志和租户隔离模式。
- Draft/Published 版本、预览、发布事件、缓存失效与失败恢复。
- 媒体、SEO、Redirect、Search、Form Builder 和提交留存策略。
- 统一公开 API envelope、错误合同、Correlation ID、Locale/Region 上下文和 ETag 结构。
- 内容客户端的超时、不可用、条件请求和构建期读取模式。

## 禁止复用

- `apps/web` 中任何页面结构、React 组件、CSS、Tailwind token、动效与图片表现。
- 律师、案例、律所地区等行业专属 Collection 和 DTO。
- 尊而光的品牌颜色、字体、Logo、文案与导航信息架构。
- CMS 数据对 AceVec Claim、Evidence、SEO 或机器合同的直接覆盖。

## 权威边界

| 对象 | 权威来源 | CMS 权限 |
| --- | --- | --- |
| 完整首页、页面呈现、主导航、页脚和已批准 CTA 文案 | Payload 发布投影 | 可编辑 |
| Decision Task、Claim、Evidence、Entity | AceVec 控制平面注册表 | 只读投影 |
| Canonical、Robots、Sitemap、Schema、llms.txt | SEO 与 Public Contract Registry | 不可覆盖 |
| 路由资格、发布状态、Release Manifest | Route 与 Release Registry | 不可覆盖 |
| 视觉 token、组件和响应式布局 | AceVec 前端代码 | 不进入 CMS |

## 发布接口

构建期读取 `GET /api/public/v1/acevec/home-presentation`、`GET /api/public/v1/acevec/page-presentations` 与 `GET /api/public/v1/acevec/navigation`。响应必须使用 `apiVersion=v1`、`projectionVersion=2026-09-01`，并在 `data.presentation` 或 `data.presentations` 中返回发布投影。CMS 可编辑 208 个已注册 Route 的标题、摘要、正文、要点、表格、视觉说明、相关页面文案和 CTA 文案；Route、章节 ID、链接目标、来源、Schema 和机器事实继续由 Registry 决定。

默认 `ACEVEC_CONTENT_SOURCE=static`。只有显式设置为 `payload` 时才访问 CMS；此时缺少 URL、网络失败、非 2xx、版本错误或字段错误都会终止构建，不允许静默回退到静态内容。

### 接口责任与复用入口

公开呈现合同的唯一代码入口是 `apps/web/src/contracts/cms-presentation.ts`，包含端点目录、版本、响应 envelope 与 DTO 类型。CMS 只依赖这份无框架、无内容数据的合同；官网运行代码不依赖 CMS 配置、数据库或生成文档类型。

| 接口 | 权威源与权限 | 公开响应 | 官网消费者 |
| --- | --- | --- | --- |
| `GET /api/public/v1/acevec/home-presentation` | `home-presentations` 的 `home` 已发布文档；匿名只读 | `data.presentation: HomePresentation` | `getHomePresentation` |
| `GET /api/public/v1/acevec/navigation` | `navigation` 的 `primary` 已发布文档；匿名只读 | `data.presentation: NavigationPresentation` | `getNavigationPresentation` |
| `GET /api/public/v1/acevec/page-presentations` | `page-presentations` 已发布文档；匿名只读 | `data.presentations: PagePresentation[]` | `getPagePresentation` |
| `/api/{collection}` 原生 REST | Payload Collection、生成类型与集合权限 | Payload 原生文档和分页结构 | 管理端；不作为官网公开合同 |
| `POST /api/graphql` 原生 GraphQL | 同一 Payload Collection 与权限 | Payload 原生 GraphQL Schema | 需要 GraphQL 的受权消费者；官网当前不使用 |

- CMS 的 `src/services/cms-presentations.ts` 用 Payload `DataFromCollectionSlug` 读取生成类型，集中执行公开字段白名单转换；不得重新手写 CMS 文档结构或用双重断言跳过检查。
- 官网三个内容入口共用 `src/lib/cms-content-client.ts`，统一内容源选择、同源 URL 校验、超时、构建请求标识和 envelope 校验；各内容入口保留领域字段与 Registry 约束校验。
- 三个公开接口无已发布内容时均返回不可缓存的 404。Payload 模式下，缺少目标页面、重复 Route、章节缺失或重复、CTA 目标偏离 Registry 均报错；显式 `static` 模式继续可用，禁止请求失败后自动切回。
- `contentVersion` 是非空字符串，页面集合同时保留各页面版本。构建请求标识只用于隔离请求，不代表数据库事务快照，也不证明三个响应来自同一次发布。
- 修改字段时，先修改所属源：CMS 存储字段改 Collection 并生成类型；公开 DTO 改本合同。随后调整转换与消费者，并运行合同检查，不能在两端各补一个相似类型。

### 本地联调与验证

从根目录分别运行 `pnpm dev:cms` 与 `ACEVEC_CONTENT_SOURCE=payload ACEVEC_CMS_URL=http://127.0.0.1:5158 pnpm dev:web`。CMS 依赖已配置的本地数据库；已有数据环境不应为启动而重新 seed 或迁移。

- `pnpm check:cms-contract`：不连接数据库，使用合成夹具验证后端转换到前端解析、字段白名单、版本、超时/错误路径及禁止静默回退。
- `pnpm check:cms-contract --live`：在上述检查后，只读访问本地 5158 端口，核对首页、导航和每个已注册页面的发布投影及章节身份，不修改 CMS 内容。
- `pnpm typecheck`：检查合同、CMS 转换、官网消费者及测试的类型一致性。

开发服务读取 CMS 与正式静态站更新是两条不同流程；静态站仍需显式构建、部署及回读，合同检查不构成生产发布批准。预览组件复用尚未在本轮收敛，不将现有独立预览视作官网渲染一致性证明。

## 当前落地

独立 CMS 已建立在 [AceVec-CMS](../../cms/README.md)。当前包含 Payload 3.87、Next.js 16.3、PostgreSQL、用户角色、Draft/Published、完整首页、208 个页面 Presentation、导航与页脚、媒体权利门、不可变审计日志、Publish Event Outbox、HMAC 构建钩子分发、首个管理员保护、初始内容种子和上述公开投影端点。管理台使用独立的 shadcn `base-lyra` 组件系统；它与静态官网分开构建，未引入尊而光前端代码或样式。

## 实施顺序

1. 已完成 Web 侧严格内容源适配器与静态默认投影。
2. 已完成独立 CMS 骨架、用户角色、完整首页与页面 Presentation、Draft/Published 与公开 API。
3. 已完成 Media、Navigation、Footer、实时 Preview、审计日志、发布事件和显式 Build Hook Outbox，不迁移法律行业 Collection。
4. 已将受控页面注册表内容导入 CMS 作为可编辑呈现副本；事实权威源仍不可编辑。
5. 下一步建立 Artifact Hash、部署回读和回滚联动。
6. 外部业务、法律、域名、Crawler、Lead 和安全门全部批准后，才允许 production release。
