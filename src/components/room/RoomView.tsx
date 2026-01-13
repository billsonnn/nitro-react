import { FC, useEffect, useRef } from "react"
import { CreateLinkEvent, DispatchMouseEvent, DispatchTouchEvent, GetNitroInstance } from "../../api"
import { useRoom } from "../../hooks"
import { RoomWidgetsView } from "./widgets/RoomWidgetsView"

export const RoomView: FC<{}> = props =>
{
    const { roomSession = null } = useRoom()
    const elementRef = useRef<HTMLDivElement>()

    useEffect(() =>
    {
        const canvas = GetNitroInstance().application.renderer.view

        if(!canvas) return

        canvas.onclick = event => DispatchMouseEvent(event)
        canvas.onmousemove = event => DispatchMouseEvent(event)
        canvas.onmousedown = event => DispatchMouseEvent(event)
        canvas.onmouseup = event => DispatchMouseEvent(event)

        canvas.ontouchstart = event => DispatchTouchEvent(event)
        canvas.ontouchmove = event => DispatchTouchEvent(event)
        canvas.ontouchend = event => DispatchTouchEvent(event)
        canvas.ontouchcancel = event => DispatchTouchEvent(event)

        const element = elementRef.current

        if(!element) return

        element.appendChild(canvas)
    }, [])

    CreateLinkEvent("games/hide")

    return (
        <div ref={ elementRef } className="bg-black">
            { roomSession && <RoomWidgetsView /> }
        </div>
    )
}
