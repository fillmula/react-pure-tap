import {
    useState, useEffect, createElement, FC, CSSProperties, ComponentProps,
    useRef
} from 'react'

interface PureTapProps {
    component: string
    className?: string
    onClassName?: string
    style?: CSSProperties
    action?(): void
    direction?: 'horizontal' | 'vertical'
}

const PureTap: FC<PureTapProps> = ({
    children,
    component = 'span',
    className = '__pure-tap',
    onClassName = '__pure-tap-on',
    style,
    action,
    direction = 'vertical'
}) => {
    const [isOn, setIsOn] = useState(false)
    const pointRef = useRef<number[] | null>(null)
    const shouldTriggerActionRef = useRef<boolean>(false)
    useEffect(() => {
        let windowMouseUp: (this: Window, ev: MouseEvent) => any
        // If this is a mouse device instead of a touching device
        if (!window.ontouchstart) {
            windowMouseUp = () => {}
            window.addEventListener('mouseup', windowMouseUp);
        }
        return () => {
            if (!window.ontouchstart) {
                window.removeEventListener('mouseup', windowMouseUp)
            }
        }
    }, [])
    const handlers: () => ComponentProps<"span"> = () => {
        if (window.ontouchstart === undefined) {
            return {
                onMouseDown: event => {
                    setIsOn(true)
                },
                onMouseUp: event => {
                    setIsOn(false)
                    action && action()
                },
                onMouseLeave: event => {
                    setIsOn(false)
                }
            }
        } else {
            return {
                onTouchStart: event => {
                    shouldTriggerActionRef.current = true
                    setIsOn(true)
                    pointRef.current = [
                        event.touches[0].clientX,
                        event.touches[0].clientY
                    ]
                },
                onTouchMove: event => {
                    if (!shouldTriggerActionRef.current) return;
                    if (direction === 'vertical') {
                        if (event.touches[0].clientY !== pointRef.current![1]) {
                            shouldTriggerActionRef.current = false
                            setIsOn(false)
                            pointRef.current = null
                        }
                    } else if (direction === 'horizontal') {
                        if (event.touches[0].clientX !== pointRef.current![0]) {
                            shouldTriggerActionRef.current = false
                            setIsOn(false)
                            pointRef.current = null
                        }
                    }
                },
                onTouchEnd: event => {
                    if (shouldTriggerActionRef.current) {
                        action && action()
                    }
                    shouldTriggerActionRef.current = false
                    setIsOn(false)
                    pointRef.current = null
                },
                onTouchCancel: event => {
                    shouldTriggerActionRef.current = false
                    setIsOn(false)
                    pointRef.current = null
                }
            }
        }
    }
    const props = {
        style,
        className: `${className}${isOn ? ` ${onClassName}` : ''}`,
        ...handlers()
    }
    return createElement(component, props, children)
}

export default PureTap
