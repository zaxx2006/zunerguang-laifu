import type { PayloadRequest } from "payload";

export async function loadDashboardSnapshot(req: PayloadRequest) {
  const isAdmin = Boolean(req.user?.roles?.includes("admin"));
  const [recentPages, publishedPages, mediaDocuments, deliveryCounts] = await Promise.all([
    req.payload.find({ collection: "page-presentations", depth: 0, limit: 8, sort: "-updatedAt", select: { internalTitle: true, route: true, _status: true, updatedAt: true }, overrideAccess: false, user: req.user }),
    req.payload.count({ collection: "page-presentations", overrideAccess: false, user: req.user, where: { _status: { equals: "published" } } }),
    req.payload.count({ collection: "media", overrideAccess: false, user: req.user }),
    isAdmin ? Promise.all([
      req.payload.count({ collection: "publish-events", overrideAccess: false, user: req.user, where: { deliveryStatus: { equals: "queued" } } }),
      req.payload.count({ collection: "publish-events", overrideAccess: false, user: req.user, where: { deliveryStatus: { equals: "succeeded" } } }),
      req.payload.count({ collection: "publish-events", overrideAccess: false, user: req.user, where: { deliveryStatus: { equals: "failed" } } })
    ]) : Promise.resolve([{ totalDocs: 0 }, { totalDocs: 0 }, { totalDocs: 0 }])
  ]);
  return { deliveryCounts, isAdmin, mediaDocuments, publishedPages, recentPages };
}
