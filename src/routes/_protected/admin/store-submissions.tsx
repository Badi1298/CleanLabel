import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	Check,
	CheckCircle,
	ExternalLink,
	Eye,
	Loader2,
	Package,
	Store,
	X,
} from "lucide-react";
import { useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { storesQueryOptions } from "#/queries/store-queries";
import {
	pendingStoreSubmissionsCountQueryOptions,
	storeSubmissionsQueryOptions,
} from "#/queries/store-submission-queries";
import {
	approveStoreSubmission,
	rejectStoreSubmission,
} from "#/server/store-submission-functions";

type SubmissionFilter = "pending_review" | "approved" | "rejected" | "all";

export const Route = createFileRoute("/_protected/admin/store-submissions")({
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(storeSubmissionsQueryOptions("pending_review")),
			queryClient.ensureQueryData(storesQueryOptions()),
			queryClient.ensureQueryData(pendingStoreSubmissionsCountQueryOptions()),
		]);
	},
	component: StoreSubmissionsAdminPage,
});

function StoreSubmissionsAdminPage() {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] =
		useState<SubmissionFilter>("pending_review");

	const { data: submissions, isLoading } = useQuery(
		storeSubmissionsQueryOptions(statusFilter),
	);
	const { data: stores } = useQuery(storesQueryOptions());
	const { data: pendingCountData } = useQuery(
		pendingStoreSubmissionsCountQueryOptions(),
	);
	const pendingCount = pendingCountData?.count ?? 0;

	const approveFn = useServerFn(approveStoreSubmission);
	const rejectFn = useServerFn(rejectStoreSubmission);

	// Image modal state
	const [inspectImage, setInspectImage] = useState<{
		url: string;
		title: string;
	} | null>(null);

	// Other store approval modal
	const [resolvingSubmission, setResolvingSubmission] = useState<any | null>(
		null,
	);
	const [resolveMode, setResolveMode] = useState<"create" | "map">("create");
	const [newStoreName, setNewStoreName] = useState("");
	const [selectedExistingStoreId, setSelectedExistingStoreId] = useState("");

	const approveMutation = useMutation({
		mutationFn: async (args: {
			submissionId: string;
			storeId?: string;
			newStoreName?: string;
		}) => {
			return await approveFn({ data: args });
		},
		onSuccess: () => {
			toast.success("Store submission approved and linked to product!");
			queryClient.invalidateQueries({ queryKey: ["storeSubmissions"] });
			queryClient.invalidateQueries({
				queryKey: ["pendingStoreSubmissionsCount"],
			});
			queryClient.invalidateQueries({ queryKey: ["productDetails"] });
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			queryClient.invalidateQueries({ queryKey: ["allProducts"] });
			setResolvingSubmission(null);
		},
		onError: (error: any) => {
			console.error("Failed to approve submission:", error);
			toast.error(error?.message || "Failed to approve store submission.");
		},
	});

	const rejectMutation = useMutation({
		mutationFn: async (submissionId: string) => {
			return await rejectFn({ data: { submissionId } });
		},
		onSuccess: () => {
			toast.success("Store submission rejected.");
			queryClient.invalidateQueries({ queryKey: ["storeSubmissions"] });
			queryClient.invalidateQueries({
				queryKey: ["pendingStoreSubmissionsCount"],
			});
		},
		onError: (error: any) => {
			console.error("Failed to reject submission:", error);
			toast.error(error?.message || "Failed to reject submission.");
		},
	});

	const handleOpenOtherResolution = (submission: any) => {
		setResolvingSubmission(submission);
		setResolveMode("create");
		setNewStoreName(submission.otherStoreName || "");
		setSelectedExistingStoreId("");
	};

	const handleConfirmOtherResolution = () => {
		if (!resolvingSubmission) return;

		if (resolveMode === "create") {
			if (!newStoreName.trim()) {
				toast.error("Please enter a store name.");
				return;
			}
			approveMutation.mutate({
				submissionId: resolvingSubmission.id,
				newStoreName: newStoreName.trim(),
			});
		} else {
			if (!selectedExistingStoreId) {
				toast.error("Please select an existing store.");
				return;
			}
			approveMutation.mutate({
				submissionId: resolvingSubmission.id,
				storeId: selectedExistingStoreId,
			});
		}
	};

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
						<Store className="w-6 h-6 text-emerald-600" />
						Store Submissions
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
						Review user-reported product availability and verify store locations.
					</p>
				</div>

				{/* Filter Tabs */}
				<div className="flex flex-wrap bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
					<Button
						variant={statusFilter === "pending_review" ? "default" : "ghost"}
						size="sm"
						onClick={() => setStatusFilter("pending_review")}
						className="h-8 text-xs px-3 font-medium cursor-pointer rounded-lg gap-1.5"
					>
						Pending
						{pendingCount > 0 && (
							<span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
								{pendingCount}
							</span>
						)}
					</Button>
					<Button
						variant={statusFilter === "approved" ? "default" : "ghost"}
						size="sm"
						onClick={() => setStatusFilter("approved")}
						className="h-8 text-xs px-3 font-medium cursor-pointer rounded-lg"
					>
						Approved
					</Button>
					<Button
						variant={statusFilter === "rejected" ? "default" : "ghost"}
						size="sm"
						onClick={() => setStatusFilter("rejected")}
						className="h-8 text-xs px-3 font-medium cursor-pointer rounded-lg"
					>
						Rejected
					</Button>
					<Button
						variant={statusFilter === "all" ? "default" : "ghost"}
						size="sm"
						onClick={() => setStatusFilter("all")}
						className="h-8 text-xs px-3 font-medium cursor-pointer rounded-lg"
					>
						All
					</Button>
				</div>
			</div>

			{/* Submissions List */}
			{isLoading ? (
				<div className="py-20 flex flex-col items-center justify-center gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
					<p className="text-sm text-slate-500">Loading submissions...</p>
				</div>
			) : !submissions || submissions.length === 0 ? (
				<Card className="rounded-2xl border-dashed border-slate-200 dark:border-slate-800 p-12 text-center shadow-none bg-slate-50/50 dark:bg-slate-900/30">
					<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
						<CheckCircle className="w-6 h-6" />
					</div>
					<h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
						No {statusFilter.replace("_", " ")} submissions
					</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
						{statusFilter === "pending_review"
							? "All store submissions have been reviewed. Great work!"
							: `There are currently no submissions with status '${statusFilter}'.`}
					</p>
				</Card>
			) : (
				<div className="space-y-4">
					{submissions.map((submission) => {
						const isPending = submission.status === "pending_review";
						const isApproved = submission.status === "approved";
						const isRejected = submission.status === "rejected";

						return (
							<Card
								key={submission.id}
								className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
							>
								<CardContent className="p-5">
									<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
										{/* Product Section (4 cols) */}
										<div className="lg:col-span-4 flex gap-3.5 items-start">
											{submission.product?.imageFrontUrl ? (
												<button
													type="button"
													onClick={() =>
														setInspectImage({
															url: submission.product.imageFrontUrl!,
															title: submission.product.name,
														})
													}
													className="group relative w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0 overflow-hidden cursor-zoom-in border border-slate-200 dark:border-slate-700"
												>
													<img
														src={submission.product.imageFrontUrl}
														alt={submission.product.name}
														className="w-full h-full object-contain group-hover:scale-105 transition-transform"
													/>
													<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
														<Eye className="w-4 h-4 text-white" />
													</div>
												</button>
											) : (
												<div className="w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
													<Package className="w-7 h-7" />
												</div>
											)}

											<div className="min-w-0 flex-1">
												<span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
													{submission.product?.brand || "Brand"}
												</span>
												<h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2">
													{submission.product?.name || "Product"}
												</h3>
												{submission.product?.id && (
													<Link
														to="/products/$productId"
														params={{ productId: submission.product.id }}
														className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-1 font-medium"
													>
														<span>View product page</span>
														<ExternalLink className="w-3 h-3" />
													</Link>
												)}
											</div>
										</div>

										{/* Proof & Reported Store Section (5 cols) */}
										<div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
											{/* Proof Photo */}
											<div className="flex flex-col items-center">
												<button
													type="button"
													onClick={() =>
														setInspectImage({
															url: submission.proofImageUrl,
															title: `Verification photo for ${submission.product?.name || "Product"}`,
														})
													}
													className="group relative w-20 h-24 rounded-xl bg-slate-950 p-1 overflow-hidden cursor-zoom-in border-2 border-emerald-500/40 shadow-sm"
												>
													<img
														src={submission.proofImageUrl}
														alt="Verification proof"
														className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
													/>
													<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium gap-1">
														<Eye className="w-3.5 h-3.5" />
														<span>Zoom</span>
													</div>
												</button>
												<span className="text-[10px] text-slate-500 mt-1 font-medium">
													Proof Photo
												</span>
											</div>

											{/* Store info & Submitter details */}
											<div className="space-y-2 min-w-0 flex-1">
												<div>
													<span className="text-[11px] text-slate-500 block">
														Reported Store:
													</span>
													{submission.store ? (
														<div className="flex items-center gap-2 mt-0.5">
															{submission.store.logoUrl ? (
																<img
																	src={submission.store.logoUrl}
																	alt=""
																	className="w-5 h-5 rounded-full object-cover"
																/>
															) : (
																<Store className="w-4 h-4 text-emerald-600" />
															)}
															<span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
																{submission.store.name}
															</span>
															<Badge
																variant="secondary"
																className="text-[10px] font-normal"
															>
																Existing Store
															</Badge>
														</div>
													) : (
														<div className="flex items-center gap-2 mt-0.5 flex-wrap">
															<span className="font-semibold text-amber-700 dark:text-amber-400 text-sm">
																{submission.otherStoreName}
															</span>
															<Badge
																variant="outline"
																className="text-[10px] font-normal border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
															>
																New Store Requested
															</Badge>
														</div>
													)}
												</div>

												{/* Submitter & Date */}
												<div className="text-xs text-slate-500 space-y-0.5">
													<p>
														Submitted by:{" "}
														<strong className="text-slate-700 dark:text-slate-300 font-medium">
															{submission.submittedBy?.name ||
																submission.submittedBy?.email ||
																"Anonymous"}
														</strong>
													</p>
													<p className="text-[11px]">
														{new Date(
															submission.createdAt,
														).toLocaleDateString(undefined, {
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
												</div>

												{/* Review status tags */}
												{!isPending && (
													<div className="pt-1">
														{isApproved && (
															<Badge className="bg-emerald-600 text-white text-[10px]">
																Approved
															</Badge>
														)}
														{isRejected && (
															<Badge variant="destructive" className="text-[10px]">
																Rejected
															</Badge>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Actions Section (3 cols) */}
										<div className="lg:col-span-3 flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
											{isPending ? (
												<>
													{submission.storeId ? (
														// One-click approve for existing stores
														<Button
															size="sm"
															disabled={approveMutation.isPending}
															onClick={() =>
																approveMutation.mutate({
																	submissionId: submission.id,
																})
															}
															className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-medium cursor-pointer shadow-sm flex-1 lg:flex-initial"
														>
															<Check className="w-3.5 h-3.5" />
															Approve & Add Store
														</Button>
													) : (
														// Open modal to resolve "Other" store
														<Button
															size="sm"
															disabled={approveMutation.isPending}
															onClick={() =>
																handleOpenOtherResolution(submission)
															}
															className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs font-medium cursor-pointer shadow-sm flex-1 lg:flex-initial"
														>
															<Check className="w-3.5 h-3.5" />
															Resolve & Approve...
														</Button>
													)}

													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																disabled={rejectMutation.isPending}
																className="text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5 text-xs font-medium cursor-pointer flex-1 lg:flex-initial"
															>
																<X className="w-3.5 h-3.5" />
																Reject
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Reject store submission?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to reject this store
																	submission for{" "}
																	<strong>
																		{submission.product?.name}
																	</strong>
																	? This will mark the submission as rejected.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		rejectMutation.mutate(submission.id)
																	}
																	className="bg-red-600 hover:bg-red-700 text-white"
																>
																	Reject Submission
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</>
											) : (
												<div className="text-right text-xs text-slate-500 py-2">
													Reviewed on{" "}
													{submission.reviewedAt
														? new Date(
																submission.reviewedAt,
															).toLocaleDateString()
														: "N/A"}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* Modal for Zooming / Inspecting Image */}
			<Dialog
				open={!!inspectImage}
				onOpenChange={(open) => !open && setInspectImage(null)}
			>
				<DialogContent className="max-w-2xl p-4">
					<DialogHeader>
						<DialogTitle className="text-base truncate">
							{inspectImage?.title}
						</DialogTitle>
					</DialogHeader>
					<div className="overflow-hidden rounded-xl bg-slate-950 max-h-[70vh] flex items-center justify-center p-2">
						{inspectImage && (
							<TransformWrapper>
								<TransformComponent
									wrapperStyle={{ width: "100%", height: "100%" }}
								>
									<img
										src={inspectImage.url}
										alt={inspectImage.title}
										className="w-full h-auto object-contain max-h-[65vh] rounded-lg"
									/>
								</TransformComponent>
							</TransformWrapper>
						)}
					</div>
					<p className="text-xs text-slate-500 text-center">
						Scroll or pinch to zoom. Drag to pan.
					</p>
				</DialogContent>
			</Dialog>

			{/* Modal to Resolve "Other" Store */}
			<Dialog
				open={!!resolvingSubmission}
				onOpenChange={(open) => !open && setResolvingSubmission(null)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-lg">
							Approve Store Submission
						</DialogTitle>
						<DialogDescription>
							The user requested a new store:{" "}
							<strong className="text-slate-900 dark:text-slate-100">
								"{resolvingSubmission?.otherStoreName}"
							</strong>
							. How would you like to assign it?
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						{/* Mode Toggle */}
						<div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
							<Button
								type="button"
								variant={resolveMode === "create" ? "default" : "ghost"}
								size="sm"
								onClick={() => setResolveMode("create")}
								className="flex-1 text-xs font-medium cursor-pointer"
							>
								Create New Store
							</Button>
							<Button
								type="button"
								variant={resolveMode === "map" ? "default" : "ghost"}
								size="sm"
								onClick={() => setResolveMode("map")}
								className="flex-1 text-xs font-medium cursor-pointer"
							>
								Assign to Existing Store
							</Button>
						</div>

						{resolveMode === "create" ? (
							<div className="space-y-2">
								<Label htmlFor="newStoreName" className="text-xs font-medium">
									New Store Name
								</Label>
								<Input
									id="newStoreName"
									value={newStoreName}
									onChange={(e) => setNewStoreName(e.target.value)}
									placeholder="e.g. Whole Foods"
									className="rounded-xl"
								/>
								<p className="text-xs text-slate-500">
									This will create a new store in your database and link it to
									this product.
								</p>
							</div>
						) : (
							<div className="space-y-2">
								<Label htmlFor="existingStore" className="text-xs font-medium">
									Select Existing Store
								</Label>
								<Select
									value={selectedExistingStoreId}
									onValueChange={setSelectedExistingStoreId}
								>
									<SelectTrigger id="existingStore" className="rounded-xl">
										<SelectValue placeholder="Choose store..." />
									</SelectTrigger>
									<SelectContent className="max-h-56">
										{stores?.map((s) => (
											<SelectItem key={s.id} value={s.id}>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-xs text-slate-500">
									Use this if the user made a typo or entered an existing store
									under a different spelling.
								</p>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setResolvingSubmission(null)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmOtherResolution}
							disabled={approveMutation.isPending}
							className="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							{approveMutation.isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"Approve & Link Store"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
