# LAIFU 数字服务

本仓库是一个 `pnpm` 工作区，统一管理来福主站、两份公开测评、内部管理后台和 Cloudflare D1 数据接口。

## 目录

```text
apps/
  website/          主站，Next.js 静态导出
  assessments/      测评站，Next.js 静态导出
  admin/            内部后台，Next.js 服务端应用
workers/
  assessment-api/   Cloudflare Worker 与 D1 数据接口
docs/
  architecture.md   运行边界、数据流和配置
  design/            设计令牌与合规规则
tests/e2e/           主站、测评站与 Worker/D1 端到端测试
```

## 环境

- Node.js 22 或更高版本
- pnpm 12.3.4

```bash
pnpm install --frozen-lockfile
```

## 常用命令

```bash
pnpm dev:website
pnpm dev:assessments
pnpm dev:admin
pnpm dev:api
pnpm --filter @laifu/admin deploy:cf
pnpm check
```

`pnpm check` 会依次执行静态检查、全项目 CSS 合约、类型检查、单元测试、内容与文档审计、四个部署单元的构建或部署检查、Playwright、静态产物审计、性能预算和生产依赖审计。

## 文档

- [系统架构](docs/architecture.md)
- [设计系统](docs/design/system.md)
- [设计合规矩阵](docs/design/compliance.md)
- [页面章节设计清单](docs/design/section-plan.md)

仓库只保留当前有效的工程文档和发布内容。研究草稿、历史规划、编辑过程文件、个人工具配置、环境密钥和构建产物均不进入版本库。
