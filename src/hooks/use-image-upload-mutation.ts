import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import imageCompression from "browser-image-compression";
import { getProductUploadUrls } from "#/server/upload-functions";

export function useImageUploadMutation() {
	const getUploadUrlsFn = useServerFn(getProductUploadUrls);

	return useMutation({
		mutationFn: async ({
			file,
			type,
		}: {
			file: File;
			type: "front" | "back";
		}) => {
			const options = {
				maxSizeMB: 0.8,
				maxWidthOrHeight: 2048,
				useWebWorker: true,
				fileType: "image/jpeg",
			};
			const compressedBlob = await imageCompression(file, options);
			const compressedFile = new File([compressedBlob], file.name, {
				type: "image/jpeg",
			});

			const { uploadUrl, publicUrl } = await getUploadUrlsFn({
				data: { fileType: "image/jpeg", type },
			});

			const response = await fetch(uploadUrl, {
				method: "PUT",
				body: compressedFile,
				headers: { "Content-Type": "image/jpeg" },
			});

			if (!response.ok) throw new Error(`Failed to upload ${type} image`);
			return publicUrl;
		},
	});
}
