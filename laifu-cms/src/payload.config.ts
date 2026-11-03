import { postgresAdapter } from "@payloadcms/db-postgres";
import { zh } from "@payloadcms/translations/languages/zh";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { configureCollections, shadcnListView } from "@/admin/collection-meta";
import { previewBreakpoints } from "@/admin/preview";
import { authenticated } from "@/access/roles";
import { laifuCollections, Users } from "@/collections";
import { browserOrigins, requiredEnvironment } from "@/config/environment";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const origins = browserOrigins();

export default buildConfig({
  admin: {
    user: Users.slug,
    autoRefresh: true,
    avatar: { Component: "@/admin/components/AdminAvatar#AdminAvatar" },
    dateFormat: "yyyy-MM-dd HH:mm",
    suppressHydrationWarning: true,
    theme: "all",
    timezones: { defaultTimezone: "Asia/Shanghai" },
    toast: { duration: 5000, expand: true, limit: 8, position: "bottom-right" },
    meta: { titleSuffix: " | 焕屿内容系统", icons: [{ rel: "icon", type: "image/svg+xml", url: "/brand/mark-ink.svg" }] },
    livePreview: { collections: ["home-presentations", "service-presentations", "site-pages", "navigation"], breakpoints: previewBreakpoints, openByDefault: false },
    components: {
      graphics: { Logo: "@/admin/components/Logo#Logo", Icon: "@/admin/components/Logo#Icon" },
      actions: ["@/admin/components/AdminHeader#AdminHeaderActions"],
      Nav: "@/admin/components/AdminNav#AdminNav",
      views: { forgot: { Component: "@/admin/views/EmailRecoveryDisabledView#EmailRecoveryDisabledView" }, reset: { Component: "@/admin/views/EmailRecoveryDisabledView#EmailRecoveryDisabledView" } }
    },
    importMap: { baseDir: path.resolve(dirname, "app", "(payload)", "admin") }
  },
  collections: configureCollections(laifuCollections),
  db: postgresAdapter({ pool: { connectionString: requiredEnvironment("DATABASE_URI") }, push: false, migrationDir: path.resolve(dirname, "migrations") }),
  secret: requiredEnvironment("PAYLOAD_SECRET"),
  sharp,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: origins,
  csrf: origins,
  cookiePrefix: "laifu-cms",
  folders: { browseByFolder: true, collectionSpecific: true, debug: false, collectionOverrides: [({ collection }) => ({ ...collection, labels: { singular: { en: "Folder", zh: "文件夹" }, plural: { en: "Folders", zh: "文件夹" } } })] },
  graphQL: { disable: false, disableIntrospectionInProduction: true, disablePlaygroundInProduction: true, maxComplexity: 2000 },
  i18n: { supportedLanguages: { zh }, fallbackLanguage: "zh", translations: { zh: { folder: { searchByNameInFolder: "搜索{{folderName}}中的内容" }, general: { create: "新建", noResultsFound: "暂无结果", noResultsDescription: "调整搜索或筛选条件后重试。" } } } },
  indexSortableFields: true,
  jobs: {
    addParentToTaskLog: true,
    autoRun: process.env.VERCEL ? undefined : [{ allQueues: true, cron: "0 * * * * *", limit: 50 }],
    deleteJobOnComplete: false,
    enableConcurrencyControl: true,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({ ...defaultJobsCollection, labels: { singular: "后台任务", plural: "后台任务" }, admin: { ...defaultJobsCollection.admin, components: { ...defaultJobsCollection.admin?.components, views: { ...defaultJobsCollection.admin?.components?.views, list: { ...defaultJobsCollection.admin?.components?.views?.list, Component: shadcnListView } } }, hidden: ({ user }) => !Boolean((user as { roles?: string[] } | null)?.roles?.includes("admin")), group: "CMS 系统管理", pagination: { defaultLimit: 50, limits: [50, 100, 250] }, useAsTitle: "id" } })
  },
  localization: { locales: [{ code: "zh-CN", label: "简体中文" }, { code: "en", label: "English", fallbackLocale: "zh-CN" }], defaultLocale: "zh-CN", fallback: true },
  queryPresets: { access: { create: authenticated, delete: authenticated, read: authenticated, update: authenticated }, constraints: {}, labels: { singular: "筛选方案", plural: "筛选方案" } },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") }
});
