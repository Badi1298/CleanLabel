import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	getR2AccessKeyId,
	getR2AccountId,
	getR2BucketName,
	getR2PublicDomain,
	getR2SecretAccessKey,
} from "./safe-envs";

const s3 = new S3Client({
	region: "auto",
	endpoint: `https://${getR2AccountId()}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: getR2AccessKeyId(),
		secretAccessKey: getR2SecretAccessKey(),
	},
});

export async function generatePresignedUploadUrl(
	key: string,
	contentType: string,
) {
	const command = new PutObjectCommand({
		Bucket: getR2BucketName(),
		Key: key,
		ContentType: contentType,
	});

	// URL expires in 5 minutes
	const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
	const publicUrl = `${getR2PublicDomain()}/${key}`;

	return { uploadUrl, publicUrl };
}
