import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

export const ReactPopover: FC<PropsWithChildren<{
    content: JSX.Element;
    trigger?: 'click' | 'hover';
}>> = props =>
{
    const { content = null, trigger = null, children = null } = props;
    const [ show, setShow ] = useState(false);
    const wrapperRef = useRef(null);

    const handleMouseOver = () => (trigger === 'hover') && setShow(true);

    const handleMouseLeft = () => (trigger === 'hover') && setShow(false);

    useEffect(() =>
    {
        if(!show) return;

        const handleClickOutside = (event: MouseEvent) =>
        {
            if(wrapperRef.current && !wrapperRef.current.contains(event.target)) setShow(false);
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
        {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ show, wrapperRef ]);

    return (
        <div
            ref={ wrapperRef }
            className="relative flex justify-center w-fit h-fit"
            onMouseEnter={ handleMouseOver }
            onMouseLeave={ handleMouseLeft }>
            <div
                onClick={ () => setShow(!show) }
            >
                { children }
            </div>
            <div
                className="min-w-fit w-[200px] h-fit absolute bottom-[100%] z-50 transition-all"
                hidden={ !show }>
                <div className="rounded bg-white p-3 shadow-[10px_30px_150px_rgba(46,38,92,0.25)] mb-[10px]">
                    { content }
                </div>
            </div>
        </div>
    );
};
