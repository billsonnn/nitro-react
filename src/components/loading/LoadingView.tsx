import { FC } from 'react';

interface LoadingViewProps
{
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const {} = props;

    const generateStars = (count, className) =>
    {
        return Array.from({ length: count }, () => ({
            top: `${ Math.random() * 100 }%`,
            left: `${ Math.random() * 100 }%`
        })).map((style, index) => (
            <div key={ index } className={ className } style={ style }>
                <div className="star-part" />
                <div className="star-part" />
            </div>
        ));
    };

    const smallStars = generateStars(90, 'dot');
    const mediumStars = generateStars(15, 'star');

    return (
        <div className="relative w-screen h-screen z-loading bg-loading">
            <div className="container flex w-screen h-screen">
                <div className="flex items-center justify-center w-screen h-screen">
                    { smallStars }
                    { mediumStars }
                </div>
            </div>
        </div>
    /*    <div className="relative w-screen h-screen z-loading bg-card-header">
            <div className="container flex w-screen h-screen">
                <div className="flex items-center justify-center w-screen h-screen">
                    <div className="connecting-duck" />
                </div>
            </div>
        </div>*/
    );
};
