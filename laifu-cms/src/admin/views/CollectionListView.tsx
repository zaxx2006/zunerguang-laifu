"use client";

import { getTranslation } from "@payloadcms/translations";
import { DefaultListView, ListControls, ListSelection, PageControls, RelationshipProvider, SelectionProvider, SelectMany, TableColumnsProvider, useBulkUpload, useConfig, useListDrawerContext, useListQuery, useModal, useSelection, useStepNav, useTranslation } from "@payloadcms/ui";
import { FolderOpen, Inbox, List, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import type { ListViewClientProps } from "payload";
import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

function SelectionAwareCardAction({ selectionActions, viewActions }: { selectionActions: ReactNode; viewActions: ReactNode }): ReactElement {
  const { count } = useSelection();
  return <CardAction>{count > 0 ? selectionActions : viewActions}</CardAction>;
}

export function CollectionListView(props: ListViewClientProps): ReactElement {
  const { AfterList, AfterListTable, beforeActions, BeforeList, BeforeListTable, collectionSlug, columnState, disableBulkDelete, disableBulkEdit, disableQueryPresets, enableRowSelections, hasCreatePermission: hasCreatePermissionFromProps, hasDeletePermission, hasTrashPermission, listMenuItems, newDocumentURL, queryPreset, queryPresetPermissions, renderedFilters, resolvedFilterOptions, Table, viewType } = props;
  const { allowCreate, isInDrawer, onBulkSelect } = useListDrawerContext();
  const { config, getEntityConfig } = useConfig();
  const { data, isGroupingBy } = useListQuery();
  const { i18n } = useTranslation();
  const { openModal } = useModal();
  const { drawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload();
  const { setStepNav } = useStepNav();
  const router = useRouter();
  const collectionConfig = getEntityConfig({ collectionSlug });
  const hasCreatePermission = allowCreate === undefined ? hasCreatePermissionFromProps : allowCreate && hasCreatePermissionFromProps;
  const pluralLabel = getTranslation(collectionConfig.labels.plural, i18n);
  const singularLabel = getTranslation(collectionConfig.labels.singular, i18n);
  const description = typeof collectionConfig.admin.description === "string" ? collectionConfig.admin.description : undefined;
  const isTrashEnabled = Boolean(collectionConfig.trash);
  const isFoldersEnabled = Boolean(collectionConfig.folders && config.folders);
  const isUploadCollection = Boolean(collectionConfig.upload);
  const uploadConfig = typeof collectionConfig.upload === "object" ? collectionConfig.upload : undefined;
  const isBulkUploadEnabled = Boolean(isUploadCollection && uploadConfig?.bulkUpload && !uploadConfig.hideFileInputOnCreate);
  const showRowSelections = !(disableBulkDelete && disableBulkEdit);
  const baseURL = formatAdminURL({ adminRoute: config.routes.admin, path: `/collections/${collectionSlug}` });
  const folderURL = config.folders ? formatAdminURL({ adminRoute: config.routes.admin, path: `/collections/${collectionSlug}/${config.folders.slug}` }) : baseURL;
  const trashURL = formatAdminURL({ adminRoute: config.routes.admin, path: `/collections/${collectionSlug}/trash` });
  const openBulkUpload = useCallback((): void => { setCollectionSlug(collectionSlug); openModal(drawerSlug); setOnSuccess(() => router.refresh()); }, [collectionSlug, drawerSlug, openModal, router, setCollectionSlug, setOnSuccess]);
  useEffect(() => { if (!isInDrawer) setStepNav([{ label: pluralLabel }]); }, [isInDrawer, pluralLabel, setStepNav]);
  if (isInDrawer || !data) return <DefaultListView {...props} />;
  const listControlActions = showRowSelections && enableRowSelections && typeof onBulkSelect === "function" ? [...(beforeActions || []), <SelectMany key="select-many" onClick={onBulkSelect} />] : beforeActions;
  return <TableColumnsProvider collectionSlug={collectionSlug} columnState={columnState}>
    <SelectionProvider docs={data.docs} totalDocs={data.totalDocs}>
      <main className={`acevec-collection-shell acevec-collection-shell--${collectionSlug}`}>
        {BeforeList}
        <header className="acevec-collection-header">
          <div className="acevec-collection-header__copy"><h1>{pluralLabel}</h1>{description ? <p>{description}</p> : null}</div>
          <div className="acevec-collection-header__actions">
            {hasCreatePermission && viewType !== "trash" ? <Link className={buttonVariants()} href={newDocumentURL}><Plus data-icon="inline-start" />新建{singularLabel}</Link> : null}
            {isBulkUploadEnabled && viewType !== "trash" ? <Button onClick={openBulkUpload} variant="outline"><Upload data-icon="inline-start" />批量上传</Button> : null}
          </div>
        </header>
        <Card className="acevec-collection-card" data-row-selection={showRowSelections ? "visible" : "hidden"} size="sm">
          <CardHeader>
            <CardTitle>内容列表</CardTitle><CardDescription>{data.totalDocs} 条记录</CardDescription><SelectionAwareCardAction selectionActions={showRowSelections && !isGroupingBy ? <ListSelection collectionConfig={collectionConfig} disableBulkDelete={disableBulkDelete} disableBulkEdit={disableBulkEdit} hasDeletePermission={hasDeletePermission} hasTrashPermission={hasTrashPermission} label={pluralLabel} showSelectAllAcrossPages viewType={viewType} /> : null} viewActions={<nav className="acevec-collection-views" aria-label="列表视图"><Link aria-current={viewType === "list" ? "page" : undefined} className={buttonVariants({ size: "sm", variant: viewType === "list" ? "secondary" : "ghost" })} href={baseURL}><List data-icon="inline-start" />全部</Link>{isFoldersEnabled ? <Link aria-current={viewType === "folders" ? "page" : undefined} className={buttonVariants({ size: "sm", variant: "ghost" })} href={folderURL}><FolderOpen data-icon="inline-start" />按文件夹</Link> : null}{isTrashEnabled && hasTrashPermission ? <Link aria-current={viewType === "trash" ? "page" : undefined} className={buttonVariants({ size: "sm", variant: viewType === "trash" ? "secondary" : "ghost" })} href={trashURL}><Trash2 data-icon="inline-start" />垃圾箱</Link> : null}</nav>} />
          </CardHeader>
          <CardContent className="p-0">
            <ListControls beforeActions={listControlActions} collectionConfig={collectionConfig} collectionSlug={collectionSlug} disableQueryPresets={collectionConfig.enableQueryPresets !== true || disableQueryPresets} listMenuItems={listMenuItems} queryPreset={queryPreset} queryPresetPermissions={queryPresetPermissions} renderedFilters={renderedFilters} resolvedFilterOptions={resolvedFilterOptions} />
            {BeforeListTable}
            {data.docs.length > 0 ? <div className="acevec-collection-table"><RelationshipProvider>{Table}</RelationshipProvider></div> : <Empty className="acevec-collection-empty"><EmptyHeader><EmptyMedia variant="icon"><Inbox /></EmptyMedia><EmptyTitle>{viewType === "trash" ? "回收站为空" : "暂无结果"}</EmptyTitle><EmptyDescription>{viewType === "trash" ? "删除的内容会显示在这里。" : "调整搜索或筛选条件，也可以创建第一条内容。"}</EmptyDescription></EmptyHeader>{hasCreatePermission && viewType !== "trash" ? <EmptyContent><Link className={buttonVariants()} href={newDocumentURL}><Plus data-icon="inline-start" />新建{singularLabel}</Link></EmptyContent> : null}</Empty>}
            {AfterListTable}
          </CardContent>
          {data.docs.length > 0 ? <CardFooter><PageControls collectionConfig={collectionConfig} /></CardFooter> : null}
        </Card>
        {AfterList}
      </main>
    </SelectionProvider>
  </TableColumnsProvider>;
}
