import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Upload } from 'lucide-react';

interface CloudinaryUploaderProps {
    onUploadSuccess: (publicId: string) => void;
}

/**
 * The CloudinaryUploader component in TypeScript React allows users to upload images to Cloudinary
 * with specified options and triggers a callback on successful upload.
 * @param {CloudinaryUploaderProps}  - The `CloudinaryUploader` component is a React functional
 * component that renders a Cloudinary upload button for uploading images. It takes a prop
 * `onUploadSuccess` which is a function to be called when the upload is successful.
 * @returns The `CloudinaryUploader` component is being returned. It is a functional component that
 * renders a `CldUploadButton` component within a `div` element. The `CldUploadButton` component is
 * used for uploading images to Cloudinary and has various options such as upload sources, cropping,
 * and onSuccess callback. When a successful upload occurs, the `onUploadSuccess` function is called
 * with
 */
export const CloudinaryUploader = ({ onUploadSuccess }: CloudinaryUploaderProps) => {
    return (
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!}
                options={{
                    sources: ['local', 'url', 'unsplash', 'camera'],
                    cropping: true,
                    multiple: false,
                }}
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                    const info = result.info;
                    if (typeof info === 'object' && info !== null && 'public_id' in info) {
                        onUploadSuccess(info.public_id);
                    }
                }}
                className="transition ease-in-out delay-200"
            >
                <div className="flex items-center group group-hover:bg-blue-400 justify-center w-full h-64 max-w-lg p-8 transition-all border-4 border-gray-400 border-dashed rounded-lg group-hover:text-blue-400 bg-gray-50 hover:bg-gray-100 hover:border-blue-600">
                    <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-600 transition-transform transform hover:scale-110  group-hover:text-blue-600" />
                        <p className="text-lg font-medium text-gray-600  group-hover:text-blue-600">
                            Drag & drop an image here, or click to select one
                        </p>
                        <p className="mt-2 text-sm text-gray-400  group-hover:text-blue-400">
                            PNG, JPG, JPEG up to 10MB
                        </p>
                    </div>
                </div>
            </CldUploadButton>
        </div>
    );
};