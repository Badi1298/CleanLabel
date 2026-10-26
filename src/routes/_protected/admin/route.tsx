import { useQuery } from "@tanstack/react-query";
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
import { pendingStoreSubmissionsCountQueryOptions } from "#/queries/store-submission-queries";

export const Route = createFileRoute("/_protected/admin")({
	beforeLoad: ({ context }) => {
		if (context.session.user.role !== "admin") {
			throw redirect({
				to: "/",
			});
		}
	},
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(
			pendingStoreSubmissionsCountQueryOptions(),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();
	const { data: pendingStoreSubmissions } = useQuery(
		pendingStoreSubmissionsCountQueryOptions(),
	);
	const pendingCount = pendingStoreSubmissions?.count ?? 0;

	const sidebarData = useMemo(
		() => [
			{
				title: "Products",
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
				],
			},
			{
				title: "Stores",
				items: [
					{
						title: "All Stores",
						url: "/admin/all-stores",
						isActive: location.pathname === "/admin/all-stores",
					},
					{
						title: "Store Submissions",
						url: "/admin/store-submissions",
						isActive: location.pathname === "/admin/store-submissions",
						badge:
							pendingCount > 0 ? (
								<span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
									{pendingCount}
								</span>
							) : undefined,
					},
				],
			},
			{
				title: "Categories",
				items: [
					{
						title: "All Categories",
						url: "/admin/all-categories",
						isActive: location.pathname === "/admin/all-categories",
					},
					{
						title: "Category Mappings",
						url: "/admin/category-mappings",
						isActive: location.pathname === "/admin/category-mappings",
					},
				],
			},
			{
				title: "Ingredients",
				items: [
					{
						title: "All Ingredients",
						url: "/admin/all-ingredients",
						isActive: location.pathname === "/admin/all-ingredients",
					},
					{
						title: "Ingredient Mappings",
						url: "/admin/ingredient-mappings",
						isActive: location.pathname === "/admin/add-ingredient",
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
