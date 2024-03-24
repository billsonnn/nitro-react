import { GetStage, GetTicker, NitroRectangle, NitroTicker, RoomObjectType } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeStack, GetRoomObjectBounds, GetRoomObjectScreenLocation, GetRoomSession } from '../../../../api';
import { Base, BaseProps } from '../../../../common';
import { ContextMenuCaretView } from './ContextMenuCaretView';

interface ContextMenuViewProps extends BaseProps<HTMLDivElement>
{
    objectId: number;
    category: number;
    userType?: number;
    fades?: boolean;
    onClose: () => void;
    collapsable?: boolean;
}

const LOCATION_STACK_SIZE: number = 25;
const BUBBLE_DROP_SPEED: number = 3;
const FADE_DELAY = 5000;
const FADE_LENGTH = 75;
const SPACE_AROUND_EDGES = 10;

let COLLAPSED = false;
let FIXED_STACK: FixedSizeStack = null;
let MAX_STACK = -1000000;
let FADE_TIME = 1;

export const ContextMenuView: FC<ContextMenuViewProps> = props =>
{
    const { objectId = -1, category = -1, userType = -1, fades = false, onClose = null, position = 'absolute', classNames = [], style = {}, children = null, collapsable = false, ...rest } = props;
    const [ pos, setPos ] = useState<{ x: number, y: number }>({ x: null, y: null });
    const [ opacity, setOpacity ] = useState(1);
    const [ isFading, setIsFading ] = useState(false);
    const [ isCollapsed, setIsCollapsed ] = useState(COLLAPSED);
    const elementRef = useRef<HTMLDivElement>();

    const updateFade = useCallback((time: number) =>
    {
        if(!isFading) return;

        FADE_TIME += time;

        let newOpacity = ((1 - (FADE_TIME / FADE_LENGTH)) * 1);

        if(newOpacity <= 0)
        {
            onClose();

            return false;
        }

        setOpacity(newOpacity);
    }, [ isFading, onClose ]);

    const updatePosition = useCallback((bounds: NitroRectangle, location: { x: number, y: number }) =>
    {
        if(!bounds || !location || !FIXED_STACK) return;

        let offset = -(elementRef.current.offsetHeight);

        if((userType > -1) && ((userType === RoomObjectType.USER) || (userType === RoomObjectType.BOT) || (userType === RoomObjectType.RENTABLE_BOT)))
        {
            offset = (offset + ((bounds.height > 50) ? 15 : 0));
        }
        else
        {
            offset = (offset - 14);
        }

        FIXED_STACK.addValue((location.y - bounds.top));

        let maxStack = FIXED_STACK.getMax();

        if(maxStack < (MAX_STACK - BUBBLE_DROP_SPEED)) maxStack = (MAX_STACK - BUBBLE_DROP_SPEED);

        MAX_STACK = maxStack;

        const deltaY = (location.y - maxStack);

        let x = ~~(location.x - (elementRef.current.offsetWidth / 2));
        let y = ~~(deltaY + offset);

        const maxLeft = ((GetStage().width - elementRef.current.offsetWidth) - SPACE_AROUND_EDGES);
        const maxTop = ((GetStage().height - elementRef.current.offsetHeight) - SPACE_AROUND_EDGES);

        if(x < SPACE_AROUND_EDGES) x = SPACE_AROUND_EDGES;
        else if(x > maxLeft) x = maxLeft;

        if(y < SPACE_AROUND_EDGES) y = SPACE_AROUND_EDGES;
        else if(y > maxTop) y = maxTop;

        setPos({ x, y });
    }, [ userType ]);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-context-menu' ];
        
        if (isCollapsed) newClassNames.push('menu-hidden');

        newClassNames.push((pos.x !== null) ? 'visible' : 'invisible');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ pos, classNames, isCollapsed ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        newStyle.left = (pos.x || 0);
        newStyle.top = (pos.y || 0);
        newStyle.opacity = opacity;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ pos, opacity, style ]);

    useEffect(() =>
    {
        if(!elementRef.current) return;
        
        const update = (ticker: NitroTicker) =>
        {
            if(!elementRef.current) return;

            updateFade(ticker.lastTime);

            const bounds = GetRoomObjectBounds(GetRoomSession().roomId, objectId, category);
            const location = GetRoomObjectScreenLocation(GetRoomSession().roomId, objectId, category);

            updatePosition(bounds, location);
        }

        GetTicker().add(update);

        return () =>
        {
            GetTicker().remove(update);
        }
    }, [ objectId, category, updateFade, updatePosition ]);

    useEffect(() =>
    {
        if(!fades) return;

        const timeout = setTimeout(() => setIsFading(true), FADE_DELAY);

        return () => clearTimeout(timeout);
    }, [ fades ]);

    useEffect(() =>
    {
        COLLAPSED = isCollapsed;
    }, [ isCollapsed ]);

    useEffect(() =>
    {
        FIXED_STACK = new FixedSizeStack(LOCATION_STACK_SIZE);
        MAX_STACK = -1000000;
        FADE_TIME = 1;
    }, []);
    
    return <Base innerRef={ elementRef } position={ position } classNames={ getClassNames } style={ getStyle } { ...rest }>
        { !(collapsable && COLLAPSED) && children }
        { collapsable && <ContextMenuCaretView onClick={ () => setIsCollapsed(!isCollapsed) } collapsed={ isCollapsed } /> }
    </Base>;
}
