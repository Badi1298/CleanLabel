import { Link } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "#/components/ui/sidebar.tsx";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Admin",
			url: "/admin/",
			items: [
				{
					title: "Add Product",
					url: "/admin/",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/profile">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium">Documentation</span>
									<span className="">v1.0.0</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-2">
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link to={item.url} className="font-medium">
										{item.title}
									</Link>
								</SidebarMenuButton>
								{item.items?.length ? (
									<SidebarMenuSub className="ml-0 border-l-0 px-1.5">
										{item.items.map((item) => (
											<SidebarMenuSubItem key={item.title}>
												<SidebarMenuSubButton
													asChild
													isActive={item.url === "/admin/"}
												>
													<Link to={item.url}>{item.title}</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
