import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { BrandLogo } from "#/components/brand-logo";
import { Badge } from "#/components/ui/badge";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "#/components/ui/sidebar.tsx";
import { Button } from "./ui/button";

export type SidebarItem = {
	title: string;
	url: string;
	isActive?: boolean;
	badge?: React.ReactNode;
};

export type SidebarGroupData = {
	title: string;
	items: SidebarItem[];
};

export function AppSidebar({
	sidebarData,
	...props
}: React.ComponentProps<typeof Sidebar> & { sidebarData: SidebarGroupData[] }) {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="pt-4 px-3">
				<div className="flex items-center gap-2.5">
					<BrandLogo surface="adaptive" size="sm" />
					<Badge
						variant="secondary"
						className="text-[11px] font-bold uppercase tracking-wider"
					>
						Admin
					</Badge>
					<span className="sr-only">PickItWell Admin</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{sidebarData.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={item.isActive}>
											<Link to={item.url}>{item.title}</Link>
										</SidebarMenuButton>
										{item.badge != null && (
											<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<Button variant="outline" asChild>
					<Link to="/">Return to App</Link>
				</Button>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
