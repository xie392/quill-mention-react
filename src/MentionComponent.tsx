import { useEffect, useRef, useState } from 'react'
import { Data } from './type'
import clsx from 'clsx'
import './quill.mention.scss'

interface MentionProps {
	data: Data[] | null
	el: HTMLDivElement | null
	onSelect: (data: Data) => void
	item?: (data: Data) => React.ReactNode
}

const MentionComponent: React.FC<MentionProps> = (props) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [activeIndex, setActiveIndex] = useState<number>(0)

	const MentionRef = useRef<HTMLDivElement | null>(null)
	const ItemsRef = useRef<HTMLDivElement[]>([])

	useEffect(() => {
		props.data && setLoading(false)

		const handlerKeyDown = (e: KeyboardEvent) => {
			const length = (props.data?.length ?? 0) - 1
			if (length <= 0) return

			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault()
					setActiveIndex((prevIndex) => {
						if (prevIndex === 0) return length
						return prevIndex - 1
					})
					break
				case 'ArrowDown':
					e.preventDefault()
					setActiveIndex((prevIndex) => {
						if (prevIndex === length) return 0
						return prevIndex + 1
					})
					break
			}
		}

		props.el?.addEventListener('keydown', handlerKeyDown)

		return () => {
			props.el?.removeEventListener('keydown', handlerKeyDown)
		}
	}, [props.data, props.el])

	useEffect(() => {
		if (!MentionRef.current || !ItemsRef.current) return

		ItemsRef.current[activeIndex]?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest'
		})
	}, [activeIndex])

	if (loading) {
		return <div className="mention-popup-loading">Loading...</div>
	}

	return (
		<div className="mention-popup" ref={MentionRef} data-active-index={activeIndex}>
			{!props.data?.length ? (
				<div className="mention-popup-empty">暂无数据</div>
			) : (
				<>
					{props.data?.map((item, index) => (
						<div
							key={index}
							className={clsx('mention-popup-item', index === activeIndex && 'mention-popup-item-active')}
							onClick={() => props.onSelect(item)}
							ref={(el) => el && (ItemsRef.current[index] = el)}
						>
							{props.item ? props.item(item) : item.name}
						</div>
					))}
				</>
			)}
		</div>
	)
}

export default MentionComponent
