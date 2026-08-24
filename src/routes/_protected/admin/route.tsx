import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { AppSidebar, appSidebarData } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
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
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();

	let parentTitle = "Admin";
	let parentUrl = "/admin";
	let currentPageTitle = "Welcome";

	appSidebarData.navMain.forEach((mainItem) => {
		if (location.pathname.startsWith(mainItem.url)) {
			parentTitle = mainItem.title;
			parentUrl = mainItem.url;
		}

		if (
			location.pathname === mainItem.url ||
			location.pathname === `${mainItem.url}/`
		) {
			currentPageTitle = "Welcome";
		}

		mainItem.items?.forEach((subItem) => {
			if (
				location.pathname === subItem.url ||
				location.pathname === `${subItem.url}/`
			) {
				currentPageTitle = subItem.title;
			}
		});
	});

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "19rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink asChild>
									<Link to={parentUrl}>{parentTitle}</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
