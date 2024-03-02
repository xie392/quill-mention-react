import { useEffect, useRef, useState } from 'react'
import  { Data } from './type'
import clsx from 'clsx'

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
		return <div className="p-2">Loading...</div>
	}

	return (
		<div className="mention-popup" ref={MentionRef} data-active-index={activeIndex}>
			{!props.data?.length ? (
				<div className="text-center text-[0.9rem] text-gray-500">暂无数据</div>
			) : (
				<>
					{props.data?.map((item, index) => (
						<div
							key={index}
							className={clsx(
								'mention-popup-item py-[6px] px-2 cursor-pointer hover:bg-[#F3F4F6]',
								index === activeIndex && 'bg-[#F3F4F6]'
							)}
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
