import { ArrowUpRight, CheckCircle2, CircleAlert, Clock3, FileText, FolderOpen, House, Image, type LucideIcon, PanelTop, Plus, Send } from "lucide-react";
import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { loadDashboardSnapshot } from "@/services/dashboard";

type DashboardMetric = { detail: string; href?: string; icon: LucideIcon; label: string; tone: "amber" | "blue" | "green" | "violet"; value: number | string };
type WorkspaceCardItem = { description: string; href: string; icon: LucideIcon; label: string; title: string };
type DeliveryStat = { icon: LucideIcon; label: string; tone: "danger" | "neutral" | "success"; value: number };

const workspaces: WorkspaceCardItem[] = [
  { href: "/admin/collections/page-presentations", icon: FileText, label: "受控内容", title: "全部页面", description: "管理每条 Route 的标题、摘要、章节与 CTA。" },
  { href: "/admin/collections/home-presentations", icon: House, label: "首页", title: "首页呈现", description: "维护首屏、开场与首页内容的版本化呈现。" },
  { href: "/admin/collections/navigation", icon: PanelTop, label: "全局", title: "导航与页脚", description: "维护公告、菜单、页头行动与完整页脚。" },
  { href: "/admin/collections/media", icon: Image, label: "资源", title: "媒体资源", description: "管理文件、替代文本、来源与使用授权。" }
];

function formatDate(value: string): string { return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(new Date(value)); }
function MetricCard({ metric }: { metric: DashboardMetric }): ReactElement { const Icon = metric.icon; const card = <Card className="acevec-metric-card" data-tone={metric.tone} size="sm"><CardHeader><span className="acevec-metric-card__icon" aria-hidden="true"><Icon /></span>{metric.href ? <CardAction><ArrowUpRight aria-hidden="true" className="acevec-metric-card__arrow" /></CardAction> : null}</CardHeader><CardContent><dl><div><dd>{metric.value}</dd><dt>{metric.label}</dt></div></dl><p>{metric.detail}</p></CardContent></Card>; return metric.href ? <Link className="acevec-metric-link" href={metric.href}>{card}</Link> : card; }
function WorkspaceCard({ item }: { item: WorkspaceCardItem }): ReactElement { const Icon = item.icon; return <Link className="acevec-workspace-link" href={item.href}><Card className="acevec-workspace-card" size="sm"><CardHeader><div className="acevec-workspace-card__lead"><span className="acevec-workspace-link__icon" aria-hidden="true"><Icon /></span><div className="acevec-workspace-link__heading"><CardDescription>{item.label}</CardDescription><CardTitle>{item.title}</CardTitle></div></div><CardAction><ArrowUpRight aria-hidden="true" className="acevec-workspace-link__arrow" /></CardAction></CardHeader><CardContent><p>{item.description}</p></CardContent></Card></Link>; }
function DeliveryStatus({ item }: { item: DeliveryStat }): ReactElement { const Icon = item.icon; return <div className="acevec-delivery-status" data-tone={item.tone}><span aria-hidden="true"><Icon /></span><dl><dt>{item.label}</dt><dd>{item.value}</dd></dl></div>; }

export async function DashboardView({ initPageResult }: AdminViewServerProps): Promise<ReactElement> {
  const { req } = initPageResult;
  const { deliveryCounts, isAdmin, mediaDocuments, publishedPages, recentPages } = await loadDashboardSnapshot(req);
  const totalPages = recentPages.totalDocs;
  const unpublishedPages = Math.max(totalPages - publishedPages.totalDocs, 0);
  const [queuedEvents, succeededEvents, failedEvents] = deliveryCounts;
  const deliveryTotal = queuedEvents.totalDocs + succeededEvents.totalDocs + failedEvents.totalDocs;
  const deliveryProgress = deliveryTotal === 0 ? 0 : Math.round((succeededEvents.totalDocs / deliveryTotal) * 100);
  const metrics: DashboardMetric[] = [
    { label: "页面呈现", value: totalPages, detail: `${publishedPages.totalDocs} 条已发布`, href: "/admin/collections/page-presentations", icon: FileText, tone: "blue" },
    { label: "待发布页面", value: unpublishedPages, detail: unpublishedPages === 0 ? "所有页面均已发布" : "需要审核并完成发布", href: "/admin/collections/page-presentations", icon: CheckCircle2, tone: "green" },
    { label: "媒体资源", value: mediaDocuments.totalDocs, detail: "已纳入来源与授权管理", href: "/admin/collections/media", icon: Image, tone: "amber" },
    { label: "待投递事件", value: queuedEvents.totalDocs, detail: isAdmin ? `${failedEvents.totalDocs} 条投递失败` : "仅管理员可查看详情", href: isAdmin ? "/admin/collections/publish-events" : undefined, icon: Clock3, tone: "violet" }
  ];
  const deliveryStats: DeliveryStat[] = [
    { label: "等待投递", value: queuedEvents.totalDocs, icon: Clock3, tone: "neutral" },
    { label: "投递成功", value: succeededEvents.totalDocs, icon: CheckCircle2, tone: "success" },
    { label: "投递失败", value: failedEvents.totalDocs, icon: CircleAlert, tone: "danger" }
  ];
  return <main className="acevec-admin-page">
    <header className="acevec-admin-page__header"><div><p className="acevec-page-eyebrow">内容运营</p><h1 className="acevec-page-title">内容工作台</h1><p className="acevec-page-description">集中管理受控页面、首页呈现、导航、媒体资源与发布工作流。</p></div><div className="acevec-admin-page__actions"><Link className={buttonVariants({ size: "sm", variant: "outline" })} href="/admin/collections/page-presentations">查看全部<ArrowUpRight data-icon="inline-end" /></Link><Link className={buttonVariants({ size: "sm" })} href="/admin/collections/page-presentations/create"><Plus data-icon="inline-start" />新建页面</Link></div></header>
    <section className="acevec-metric-grid" aria-label="内容运营概览">{metrics.map(metric => <MetricCard key={metric.label} metric={metric} />)}</section>
    <section className="acevec-dashboard-split" aria-label="常用操作与发布工作流"><Card className="acevec-dashboard-panel acevec-dashboard-panel--actions" size="sm"><CardHeader><CardTitle>常用操作</CardTitle><CardDescription>进入最常维护的内容区域。</CardDescription></CardHeader><CardContent><nav className="acevec-workspace-grid" aria-label="内容工作区">{workspaces.map(item => <WorkspaceCard item={item} key={item.href} />)}</nav></CardContent></Card><Card className="acevec-dashboard-panel acevec-dashboard-panel--delivery" size="sm"><CardHeader><CardTitle>发布工作流</CardTitle><CardDescription>页面发布后的事件投递状态，与页面发布进度分开统计。</CardDescription></CardHeader><CardContent>{isAdmin ? <div className="acevec-delivery-panel"><div className="acevec-delivery-grid">{deliveryStats.map(item => <DeliveryStatus item={item} key={item.label} />)}</div><Progress className="acevec-publish-progress" value={deliveryProgress}><ProgressLabel>事件投递成功率</ProgressLabel><ProgressValue /></Progress></div> : <Empty className="acevec-delivery-empty"><EmptyHeader><EmptyMedia variant="icon"><Send /></EmptyMedia><EmptyTitle>仅管理员可查看</EmptyTitle><EmptyDescription>发布工作流包含受限的投递状态与失败记录。</EmptyDescription></EmptyHeader></Empty>}</CardContent>{isAdmin ? <CardFooter><Link className={buttonVariants({ size: "sm", variant: "ghost" })} href="/admin/collections/publish-events">查看发布事件<Send data-icon="inline-end" /></Link></CardFooter> : null}</Card></section>
    <Card className="acevec-dashboard-panel acevec-dashboard-panel--recent" size="sm"><CardHeader><CardTitle>最近更新</CardTitle><CardDescription>最近编辑的页面呈现会优先显示在这里。</CardDescription><CardAction><Link className={buttonVariants({ size: "sm", variant: "ghost" })} href="/admin/collections/page-presentations">查看全部<ArrowUpRight data-icon="inline-end" /></Link></CardAction></CardHeader>{recentPages.docs.length === 0 ? <Empty className="acevec-dashboard-empty"><EmptyHeader><EmptyMedia variant="icon"><FolderOpen /></EmptyMedia><EmptyTitle>暂无页面呈现</EmptyTitle><EmptyDescription>创建第一条页面呈现后，会在这里显示最近编辑记录。</EmptyDescription></EmptyHeader><EmptyContent><Link className={buttonVariants()} href="/admin/collections/page-presentations/create">新建页面</Link></EmptyContent></Empty> : <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>页面</TableHead><TableHead className="w-[28%]">Route</TableHead><TableHead className="w-28">状态</TableHead><TableHead className="w-48">更新时间</TableHead><TableHead className="w-12"><span className="sr-only">操作</span></TableHead></TableRow></TableHeader><TableBody>{recentPages.docs.map(page => <TableRow key={page.id}><TableCell>{page.internalTitle}</TableCell><TableCell className="acevec-route-cell">{page.route}</TableCell><TableCell><Badge data-status={page._status} variant={page._status === "published" ? "success" : "warning"}>{page._status === "published" ? "已发布" : "草稿"}</Badge></TableCell><TableCell className="acevec-date-cell">{formatDate(page.updatedAt)}</TableCell><TableCell><Link aria-label={`编辑 ${page.internalTitle}`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "acevec-table-action")} href={`/admin/collections/page-presentations/${page.id}`} title="编辑页面"><ArrowUpRight /></Link></TableCell></TableRow>)}</TableBody></Table></CardContent>}</Card>
  </main>;
}
