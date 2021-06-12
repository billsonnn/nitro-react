import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollableAreaViewProps } from './ScrollableAreaView.types';

export const ScrollableAreaView: FC<ScrollableAreaViewProps> = props =>
{
    const { className = null, children = null } = props;
    const [ height, setHeight ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    const resize = useCallback(() =>
    {
        setHeight(elementRef.current.parentElement.clientHeight);
    }, [ elementRef ]);

    useEffect(() =>
    {
        resize();
        
        window.addEventListener('resize', resize);

        return () =>
        {
            window.removeEventListener('resize', resize);
        }
    }, [ resize ]);

    return (
        <div ref={ elementRef } className={ className } style={ { 'overflowY': 'auto', height } }>
            { children }
        </div>
    );
}
