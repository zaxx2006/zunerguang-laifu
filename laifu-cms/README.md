# Laifu CMS

这是 Laifu 官网首页的独立内容管理系统，技术栈为 Payload 3.87、Next.js 16、PostgreSQL 17 和 TypeScript。它管理首页文案、图片、五个常见问题、导航和页脚；页面结构、样式与交互仍由 `laifu-web` 控制。

## 本地启动

```powershell
corepack pnpm install --frozen-lockfile
docker compose up -d
corepack pnpm payload:migrate
corepack pnpm seed
corepack pnpm dev
```

打开 <http://127.0.0.1:5158/admin> 创建第一个账号。第一个账号会自动成为管理员，之后可由管理员创建“编辑”“发布人员”或“管理员”账号。

本地也可使用 <http://localhost:5158/admin>；安全来源配置兼容同一端口的 `localhost` 与 `127.0.0.1`。浏览器分别保存这两个地址的登录状态，切换地址时需重新登录。修改来源配置后应重启 CMS。

本仓库已附带本地 `.env`。复制到其他环境时，从 `.env.example` 创建配置，并将 `PAYLOAD_SECRET`、`LAIFU_PREVIEW_SECRET`、`LAIFU_REVALIDATE_SECRET` 替换为各自独立的强随机值。CMS 与网站必须使用相同的预览和重验证密钥。

## 内容流程

1. 编辑人员在“首页呈现”“常见问题”“导航配置”或“媒体资源”中修改并保存草稿。
2. 在首页呈现编辑页使用预览入口检查真实网站效果。
3. 发布人员或管理员复核后发布；编辑人员没有发布权限。
4. 发布钩子会立即调用网站的签名重验证接口，使 Next.js 缓存失效；网络失败的事件会保留，之后用 `pnpm publish:dispatch` 重试。

网站公开读取：

| 方法 | 地址 | 内容 |
| --- | --- | --- |
| GET | `/api/public/v1/laifu/home-presentation` | 已发布首页内容 |
| GET | `/api/public/v1/laifu/navigation` | 已发布导航和页脚 |
| GET | `/api/preview/v1/laifu/home?id=...` | 受密钥保护的首页草稿 |
| GET | `/api/preview/v1/laifu/navigation?id=...` | 受密钥保护的导航草稿 |

公开响应包含版本信封、ETag 和缓存策略。只有媒体库中同时完成使用权确认并勾选“允许公开使用”的文件可以被网站访问。

## 数据库与验证

### 上传资源中心的具体资源

1. 打开“官网页面”，选择路径为 `/resources/` 的“资源中心”页面。
2. 在“页面正文 → 正文章节”中展开“按形式与阶段，找到一个起点 → 资源列表（上传与管理）”，展开已有资源，或点击“新增资源”。
3. 填写标题、简介、资源形式、适用阶段和预计用时。在“资源文件”中选择已有媒体，或展开“上传新文件”，选择文件；来源名称选填，留空也可上传。
4. 按实际授权情况勾选使用权和公开使用；未完成授权的文件可以上传保存，但会阻止页面发布。勾选公开使用后，文件本身即可通过链接访问，请勿上传私密资料。
5. 点击“上传并关联文件”，然后保存草稿、预览，最后由发布人员或管理员发布页面。前台条目会显示“查看／下载文件”或“播放音视频”。无附件条目继续使用原来的链接地址。

支持 PDF、Word、Excel、PowerPoint、TXT、CSV、ZIP、常用图片和音视频。解除关联仅移除条目的文件引用，不删除媒体库原文件。正文使用现有 JSON 字段保存关联，无需数据库迁移。

资源附件授权与投影检查：`node --import tsx --test src/services/resource-files.test.ts`。

当前初始迁移位于 `src/migrations/20261014_065641_laifu_initial.ts`。原 AceVec 交接迁移保存在 `src/migrations-legacy/`，仅作溯源，不会由 Laifu 项目执行。

```powershell
corepack pnpm payload:generate-types
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

修改内容字段后，先生成 Payload 类型，再创建并复核新迁移。`pnpm seed` 是可重复执行的本地初始化命令，不会覆盖已有首页、FAQ 或导航记录。
