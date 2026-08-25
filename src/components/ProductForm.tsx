/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */
import { useForm } from "@tanstack/react-form";
import { CameraIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { useImageUploadMutation } from "#/hooks/use-image-upload-mutation";

export type ProductFormValues = {
	barcode: string;
	name: string;
	brand: string;
	categoryId: string;
	score: "gold" | "silver" | "bronze" | "none";
	status: "pending_review" | "approved" | "rejected";
	rawIngredientsText: string;
	imageFront: string | File | undefined;
	imageBack: string | File | undefined;
};

function FieldInfo({ field }: { field: any }) {
	return (
		<div className="min-h-5 mt-1">
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<em className="text-sm text-red-500 dark:text-red-400">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className="text-sm text-slate-500">Validating...</span>
			) : null}
		</div>
	);
}

export function ProductForm({
	isAdmin = false,
	defaultValues,
	categories = [],
	onSubmit,
}: {
	isAdmin?: boolean;
	defaultValues?: Partial<ProductFormValues>;
	categories?: { id: string; name: string }[];
	onSubmit: (values: ProductFormValues) => void;
}) {
	const [showFullForm, setShowFullForm] = useState(isAdmin);

	const imageUploadMutation = useImageUploadMutation();
	const form = useForm({
		defaultValues: {
			barcode: defaultValues?.barcode || "",
			name: defaultValues?.name || "",
			brand: defaultValues?.brand || "",
			categoryId: defaultValues?.categoryId || "",
			score: defaultValues?.score || "none",
			status: defaultValues?.status || "pending_review",
			rawIngredientsText: defaultValues?.rawIngredientsText || "",
			imageFront: defaultValues?.imageFront,
			imageBack: defaultValues?.imageBack,
		},
		onSubmit: async ({ value }) => {
			let imageFrontUrl =
				typeof value.imageFront === "string" ? value.imageFront : undefined;
			let imageBackUrl =
				typeof value.imageBack === "string" ? value.imageBack : undefined;

			if (value.imageFront instanceof File) {
				imageFrontUrl = await imageUploadMutation.mutateAsync({
					file: value.imageFront,
					type: "front",
				});
			}
			if (value.imageBack instanceof File) {
				imageBackUrl = await imageUploadMutation.mutateAsync({
					file: value.imageBack,
					type: "back",
				});
			}

			onSubmit({
				...value,
				imageFront: imageFrontUrl,
				imageBack: imageBackUrl,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<div className="space-y-4">
				<h2 className="text-lg font-semibold border-b pb-2">Photos</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="imageFront"
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor="imageFront">Front Photo</Label>
								<div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative overflow-hidden group min-h-[160px]">
									<Input
										id="imageFront"
										type="file"
										accept="image/*"
										capture="environment"
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
										onChange={(e) => {
											if (e.target.files?.[0]) {
												field.handleChange(e.target.files[0]);
											}
										}}
									/>
									{field.state.value ? (
										<div className="absolute inset-0">
											<img
												src={
													field.state.value instanceof File
														? URL.createObjectURL(field.state.value)
														: (field.state.value as string)
												}
												alt="Front preview"
												className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
											/>
											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
												<span className="text-white font-medium drop-shadow-md">
													Change Photo
												</span>
											</div>
										</div>
									) : (
										<>
											<CameraIcon className="w-8 h-8 text-slate-400 mb-2" />
											<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
												Take a photo of the front
											</span>
										</>
									)}
								</div>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					<form.Field
						name="imageBack"
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor="imageBack">
									Back Photo (Ingredients & Barcode)
								</Label>
								<div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative overflow-hidden group min-h-[160px]">
									<Input
										id="imageBack"
										type="file"
										accept="image/*"
										capture="environment"
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
										onChange={(e) => {
											if (e.target.files?.[0]) {
												field.handleChange(e.target.files[0]);
											}
										}}
									/>
									{field.state.value ? (
										<div className="absolute inset-0">
											<img
												src={
													field.state.value instanceof File
														? URL.createObjectURL(field.state.value)
														: (field.state.value as string)
												}
												alt="Back preview"
												className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
											/>
											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
												<span className="text-white font-medium drop-shadow-md">
													Change Photo
												</span>
											</div>
										</div>
									) : (
										<>
											<CameraIcon className="w-8 h-8 text-slate-400 mb-2" />
											<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
												Take a photo of the back
											</span>
										</>
									)}
								</div>
								<FieldInfo field={field} />
							</div>
						)}
					/>
				</div>
			</div>

			{!isAdmin && !showFullForm && (
				<div className="flex flex-col gap-3 pt-4">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="w-full"
							>
								{isSubmitting ? "Submitting Photos..." : "Submit Photos"}
							</Button>
						)}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() => setShowFullForm(true)}
						className="w-full"
					>
						Or fill out product details manually
					</Button>
				</div>
			)}

			{showFullForm && (
				<div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
					<h2 className="text-lg font-semibold border-b pb-2 pt-4">
						Product Details
					</h2>

					<form.Field
						name="barcode"
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Barcode</Label>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. 5941234567890"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									!value ? "Name is required" : undefined,
							}}
							children={(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Product Name</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Organic Almond Milk"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>

						<form.Field
							name="brand"
							validators={{
								onChange: ({ value }) =>
									!value ? "Brand is required" : undefined,
							}}
							children={(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Brand</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Alpro"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>
					</div>

					<form.Field
						name="categoryId"
						validators={{
							onChange: ({ value }) =>
								!value ? "Category is required" : undefined,
						}}
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Category</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										{categories.length > 0 ? (
											categories.map((c) => (
												<SelectItem key={c.id} value={c.id}>
													{c.name}
												</SelectItem>
											))
										) : (
											<SelectItem value="placeholder-category" disabled>
												No categories available
											</SelectItem>
										)}
									</SelectContent>
								</Select>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					<form.Field
						name="rawIngredientsText"
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Ingredients List</Label>
								<Textarea
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. Water, Almonds (2%), Calcium, Sea Salt..."
									className="min-h-24"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					{isAdmin && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field
								name="score"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Clean Label Score</Label>
										<Select
											value={field.state.value}
											onValueChange={(
												value: "gold" | "silver" | "bronze" | "none",
											) => field.handleChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a score" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="gold">Gold</SelectItem>
												<SelectItem value="silver">Silver</SelectItem>
												<SelectItem value="bronze">Bronze</SelectItem>
											</SelectContent>
										</Select>
										<FieldInfo field={field} />
									</div>
								)}
							/>

							<form.Field
								name="status"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Status</Label>
										<Select
											value={field.state.value}
											onValueChange={(
												value: "pending_review" | "approved" | "rejected",
											) => field.handleChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending_review">
													Pending Review
												</SelectItem>
												<SelectItem value="approved">Approved</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
										<FieldInfo field={field} />
									</div>
								)}
							/>
						</div>
					)}

					<div className="pt-4">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting}
									className="w-full"
								>
									{isSubmitting ? "Saving Product..." : "Save Product"}
								</Button>
							)}
						/>
					</div>
				</div>
			)}
		</form>
	);
}
