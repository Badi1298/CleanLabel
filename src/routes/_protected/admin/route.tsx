import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/_protected/admin")({
	beforeLoad: ({ context }) => {
		if (context.session.user.role !== "admin") {
			throw redirect({
				to: "/",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();

	const sidebarData = useMemo(
		() => [
			{
				title: "Logistics",
				items: [
					{
						title: "All Products",
						url: "/admin/all-products",
						isActive: location.pathname === "/admin/all-products",
					},
					{
						title: "Add Product",
						url: "/admin/add-product",
						isActive: location.pathname === "/admin/add-product",
					},
					{
						title: "Add Store",
						url: "/admin/add-store",
						isActive: location.pathname === "/admin/add-store",
					},
				],
			},
		],
		[location.pathname],
	);

	const { breadcrumbGroup, breadcrumbPage } = useMemo(() => {
		const activeGroup = sidebarData.find((group) =>
			group.items.some((item) => item.isActive),
		);
		const activeItem = activeGroup?.items.find((item) => item.isActive);

		return {
			breadcrumbGroup: activeGroup?.title || "Logistics",
			breadcrumbPage: activeItem?.title || "",
		};
	}, [sidebarData]);

	return (
		<SidebarProvider>
			<AppSidebar sidebarData={sidebarData} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								{breadcrumbGroup}
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{breadcrumbPage || "Overview"}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
