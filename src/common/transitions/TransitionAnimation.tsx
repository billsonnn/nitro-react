import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { Transition } from "react-transition-group"
import { getTransitionAnimationStyle } from "./TransitionAnimationStyles"

interface TransitionAnimationProps {
    type: string;
    inProp: boolean;
    timeout?: number;
    className?: string;
    children?: ReactNode;
}

export const TransitionAnimation: FC<TransitionAnimationProps> = ({
    type,
    inProp,
    timeout = 300,
    className = "",
    children
}) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    const [ isChildrenVisible, setChildrenVisible ] = useState(false)

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        if (inProp) {
            setChildrenVisible(true)
        } else {
            timeoutId = setTimeout(() => {
                setChildrenVisible(false)
            }, timeout)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [ inProp, timeout ])

    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={timeout}>
            {(state) => (
                <div
                    ref={nodeRef}
                    className={`${className} animate__animated`}
                    style={getTransitionAnimationStyle(type, state, timeout)}
                >
                    {isChildrenVisible && children}
                </div>
            )}
        </Transition>
    )
}