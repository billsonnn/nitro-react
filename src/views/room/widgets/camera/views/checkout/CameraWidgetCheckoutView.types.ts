export interface CameraWidgetCheckoutViewProps
{
    onCloseClick: () => void;
    onCancelClick: () => void;
    price: { credits: number, duckets: number, publishDucketPrice: number };
}
