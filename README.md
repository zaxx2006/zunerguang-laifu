# 焕屿 / Laifu

焕屿网站及内容管理系统源码。

## 目录

- `laifu-web/`：主站、测评站、内部管理后台、Cloudflare Worker/D1 接口、测试、素材与页面原型。
- `laifu-cms/`：Payload CMS、数据库迁移、初始化脚本和种子素材。
- `docs/`：项目图片与设计提示词资料。

详细配置、依赖安装和初始化说明见 [网站 README](laifu-web/README.md)、[网站交接说明](laifu-web/HANDOFF.txt) 和 [CMS README](laifu-cms/README.md)。

## 本地端口

| 应用 | 地址 |
| --- | --- |
| 主站 | http://127.0.0.1:3001/ |
| 测评站 | http://127.0.0.1:3002/ |
| 内部管理后台 | http://127.0.0.1:3003/ |
| CMS | http://127.0.0.1:5158/admin/login |
| 测评接口 | http://127.0.0.1:8787/health |

需要 Node.js 22 或更高版本；各工作区使用其 `package.json` 指定的 pnpm 版本。CMS 依赖 PostgreSQL，可在 `laifu-cms/` 运行 `docker compose up -d` 启动。

本仓库不包含真实环境配置、凭据、数据库、CMS 上传文件、依赖目录、构建缓存和运行日志。环境变量请根据各应用的 `.env.example` / `.dev.vars.example` 在本地配置；CMS 已有内容和上传文件需要单独备份与迁移。

当前 Git 历史从本次本地源码导入开始；旧交接文档中的提交编号和校验清单仅描述交接时的历史快照。
