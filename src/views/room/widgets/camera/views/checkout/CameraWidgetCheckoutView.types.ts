export interface CameraWidgetCheckoutViewProps
{
    onCloseClick: () => void;
    onCancelClick: () => void;
    price: {credits: Number, points: Number, pointsType: number};
}
