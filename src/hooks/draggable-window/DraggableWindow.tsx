import Draggable from 'react-draggable';
import { DraggableWindowProps } from './DraggableWindow.types';

export function DraggableWindow(props: DraggableWindowProps): JSX.Element
{
    return (
        <Draggable handle={ props.handle } { ...props.draggableOptions }>
            { props.children }
        </Draggable>
    );
}
