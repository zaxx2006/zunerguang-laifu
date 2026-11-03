import { CircleOff } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailRecoveryDisabledView(): ReactElement { return <Card className="acevec-email-recovery-disabled"><CardHeader><CircleOff /><CardTitle>邮件密码找回未启用</CardTitle><CardDescription>此后台不发送密码找回邮件。需要重置密码时，请联系管理员处理。</CardDescription></CardHeader><CardContent>账号登录、用户名登录、会话、API Key 与登录保护保持启用。</CardContent><CardFooter><Link className={buttonVariants()} href="/admin/login">返回登录</Link></CardFooter></Card>; }
