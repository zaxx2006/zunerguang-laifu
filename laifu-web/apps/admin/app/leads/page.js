import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeadsFilters from "../../components/LeadsFilters";
import LeadsPagination from "../../components/LeadsPagination";
import LeadsTable from "../../components/LeadsTable";
import { ADMIN_SESSION_COOKIE, isAuthorizedSessionValue } from "../../lib/auth";
import { deleteLeadsAction } from "./actions";
import {
  buildLeadsSearchParams,
  normalizeLeadFilters,
  normalizeLeadPage,
  queryLeads,
} from "../../lib/leadsQuery";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAuthorizedSessionValue(sessionValue)) {
    redirect("/login");
  }

  const resolvedSearchParams =
    searchParams && typeof searchParams.then === "function"
      ? await searchParams
      : searchParams ?? {};

  const filters = normalizeLeadFilters(resolvedSearchParams);
  const page = normalizeLeadPage(resolvedSearchParams?.page);
  const { rows, count, pageSize, error } = await queryLeads(filters, { page });
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (!error && count > 0 && page > totalPages) {
    const params = buildLeadsSearchParams(filters, { page: totalPages });
    redirect(`/leads${params.toString() ? `?${params.toString()}` : ""}`);
  }
  const exportParams = buildLeadsSearchParams(filters, { includePage: false });
  const exportHref = `/api/leads/export${
    exportParams.toString() ? `?${exportParams.toString()}` : ""
  }`;

  return (
    <main className="page">
      <div className="container">
        <section className="panel">
          <div className="title-row">
            <div>
              <h1 className="title">后台线索列表（MVP）</h1>
              <p className="subtitle">
                线索管理入口页，支持筛选、导出当前筛选结果与轻分页。
              </p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button className="btn btn-danger" type="submit">
                退出登录
              </button>
            </form>
          </div>
        </section>

        <div style={{ height: 12 }} />

        <LeadsFilters filters={filters} />

        <div style={{ height: 12 }} />

        <section className="panel">
          <div className="list-head">
            <div className="muted">
              当前筛选共 {count} 条记录，本页展示 {rows.length} 条。
            </div>
            <a className="btn btn-ghost" href={exportHref}>
              导出当前筛选结果
            </a>
          </div>
          {error ? (
            <div className="error">
              查询失败：{error.message || "请检查 Cloudflare 数据库接口与权限配置。"}
            </div>
          ) : null}
          <LeadsTable rows={rows} deleteAction={deleteLeadsAction} />
          <LeadsPagination
            filters={filters}
            page={page}
            pageSize={pageSize}
            totalCount={count}
          />
        </section>
      </div>
    </main>
  );
}
