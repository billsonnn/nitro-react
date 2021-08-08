export interface CameraWidgetCheckoutViewProps
{
    pictureUrl: string;
    onCloseClick: () => void;
    onCancelClick: () => void;
    price: { credits: number, duckets: number, publishDucketPrice: number };
}
