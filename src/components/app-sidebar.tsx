import { Link } from "@tanstack/react-router";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "#/components/ui/sidebar.tsx";
import { Button } from "./ui/button";

export type SidebarItem = {
	title: string;
	url: string;
	isActive?: boolean;
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
			<SidebarHeader className="pt-4">
				<h2 className="text-xl font-bold ">Clean Label Admin</h2>
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
