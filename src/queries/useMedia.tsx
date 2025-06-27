import { mediaApiRequest } from "@/apiRequests/media"
import { useMutation} from "@tanstack/react-query"

export const UploadMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload
    })
}