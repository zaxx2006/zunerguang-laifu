import Link from "next/link";
import { buildLeadsSearchParams } from "../lib/leadsQuery";

function buildPageHref(filters, page) {
  const params = buildLeadsSearchParams(filters, { page });
  return `/leads${params.toString() ? `?${params.toString()}` : ""}`;
}

export default function LeadsPagination({ filters, page, pageSize, totalCount }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="pagination">
      <div className="muted">
        第 {page} / {totalPages} 页，显示 {from}-{to} 条
      </div>
      <div className="toolbar">
        {canGoPrev ? (
          <Link className="btn btn-muted" href={buildPageHref(filters, page - 1)}>
            上一页
          </Link>
        ) : (
          <span className="btn btn-muted disabled-btn">上一页</span>
        )}
        {canGoNext ? (
          <Link className="btn btn-muted" href={buildPageHref(filters, page + 1)}>
            下一页
          </Link>
        ) : (
          <span className="btn btn-muted disabled-btn">下一页</span>
        )}
      </div>
    </div>
  );
}
