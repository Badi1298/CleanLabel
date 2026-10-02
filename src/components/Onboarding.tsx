import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
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
import { authClient } from "#/lib/auth-client";

export function Onboarding({ user }: { user: any }) {
	const [isOpen, setIsOpen] = useState(false);
	const [firstName, setFirstName] = useState(user.firstName || "");
	const [lastName, setLastName] = useState(user.lastName || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check if this is their first login (e.g. account created in the last 5 minutes)
	useEffect(() => {
		if (user && !user.hasCompletedOnboarding) {
			const createdAt = new Date(user.createdAt).getTime();
			const now = Date.now();
			const isRecent = now - createdAt < 1000 * 60 * 5;
			const hasDismissed = sessionStorage.getItem(
				`onboarding_dismissed_${user.id}`,
			);

			if (isRecent && !hasDismissed) {
				setIsOpen(true);
			}
		}
	}, [user]);

	if (user?.hasCompletedOnboarding) return null;

	const handleSave = async () => {
		if (!firstName || !lastName) {
			toast.error("Please fill in both first and last name");
			return;
		}

		setIsSubmitting(true);
		const { error } = await authClient.updateUser({
			name: `${firstName} ${lastName}`,
			firstName,
			lastName,
			hasCompletedOnboarding: true,
		});

		setIsSubmitting(false);

		if (error) {
			toast.error(error.message || "Failed to update profile");
		} else {
			toast.success("Profile updated successfully!");
			setIsOpen(false);
			// Force refresh session to remove banner/dialog
			window.location.reload();
		}
	};

	const handleDismiss = () => {
		setIsOpen(false);
		sessionStorage.setItem(`onboarding_dismissed_${user.id}`, "true");
	};

	return (
		<>
			{/* Non-intrusive warning banner */}

			<div className="bg-emerald-500 text-white px-4 py-2 flex items-center justify-between text-sm shadow-sm z-40 relative">
				<div className="flex items-center gap-2">
					<AlertCircle className="w-4 h-4" />
					<span>
						Please complete your profile to get the most out of our app.
					</span>
				</div>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => setIsOpen(true)}
					className="h-7 text-xs bg-white text-emerald-700 hover:bg-white/90"
				>
					Complete Now
				</Button>
			</div>

			<Dialog open={isOpen} onOpenChange={handleDismiss}>
				<DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
					<DialogHeader>
						<DialogTitle className="text-xl">
							Welcome to CleanLabel! 🎉
						</DialogTitle>
						<DialogDescription className="text-slate-500 dark:text-slate-400">
							Let's get to know you better. Please provide your first and last
							name to complete your profile.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								placeholder="John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								placeholder="Doe"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter className="flex justify-end gap-2 sm:justify-end mt-4">
						<Button
							type="button"
							variant="ghost"
							onClick={handleDismiss}
							className="text-slate-500"
						>
							I'll do this later
						</Button>
						<Button
							type="button"
							onClick={handleSave}
							disabled={isSubmitting}
							className="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							{isSubmitting ? "Saving..." : "Save Profile"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
