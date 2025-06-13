import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ImageInterface } from "@/interface/user"
import { CldImage } from "next-cloudinary"

export function ImageDialog(props: ImageInterface) {
    async function deleteImage(imageId: string) {
        try {
            // const result = await cloudinary.uploader.destroy(imageId);
            // console.log('Deleted:', result);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <CldImage
                    width="150"
                    height="150"
                    src={props.imageId}
                    alt="Image"
                    sizes="100vw"
                    className="select-auto bg-gray-400/40 saturate-0 hover:saturate-150 rounded-md shadow-lg"
                />
            </DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>
                        Image
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Uploaded on {new Date(props.createdAt).toLocaleDateString("en-US", {})}
                    </p>
                </DialogHeader>
                <CldImage
                    width="1000"
                    height="1000"
                    src={props.imageId}
                    sizes="100vw"
                    className="max-h-96 rounded-md"
                    alt="Image"
                />
                <DialogFooter>
                    <Button variant="destructive" onClick={() => deleteImage(props.imageId)}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
