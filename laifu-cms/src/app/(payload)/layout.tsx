import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import { Noto_Sans } from "next/font/google";
import config from "@payload-config";
import "./cascade-layers.css";
import "@payloadcms/next/css";
import "./admin.css";
import { importMap } from "./admin/importMap";

type Args = { children: React.ReactNode };

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap", variable: "--font-noto-sans" });
const serverFunction: ServerFunctionClient = async (args) => { "use server"; return handleServerFunctions({ ...args, config, importMap }); };
const Layout = ({ children }: Args) => <RootLayout config={config} htmlProps={{ className: notoSans.variable }} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;

export default Layout;
