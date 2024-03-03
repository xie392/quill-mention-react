import Quill from 'quill'
import { Data, MentionOptions } from './type'
import { Delta } from 'quill/core'
import { isAsyncFunction } from './shared/utils'
import { Root, createRoot } from 'react-dom/client'
import { createElement } from 'react'
import MentionComponent from './MentionComponent'
import './quill.mention.scss'
import { KeyboardType } from './shared/constants'
import './blots/mention'

const defaultOptions: MentionOptions = {
	targetChars: ['@'],
	source: () => [],
	onSelect: () => {}
}

class Mention {
	private static className = 'ql-mention-denotation'
	private static LoadingClassName = 'ql-mention-loading'

	private quill!: Quill
	private options!: MentionOptions

	/** mention 组件 */
	private mentionComponent!: Root | null
	/** mention 容器 */
	private container!: HTMLDivElement | null

	private handlerClickEvent = this.destroy.bind(this)
	private handlerEnterEvent = this.handlerEnter.bind(this)

	private data!: Data[] | null
	private timer: NodeJS.Timeout | null = null

	constructor(quill: Quill, options: MentionOptions) {
		this.quill = quill
		this.options = Object.assign({}, defaultOptions, options)
		this.quill.on(Quill.events.TEXT_CHANGE, this.handlerTextChange.bind(this))
	}

	/**
	 * 文本改变处理
	 *
	 * @param {Delta} delta
	 */
	async handlerTextChange(delta: Delta) {
		// 如果已经存在 mention 组件，则移除
		if (this.container) this.destroy()

		// 如果不是触发字符，直接返回
		const char = delta.ops?.at(-1)?.insert as string
		if (!this.options.targetChars.includes(char)) return

		this.createElement()

		// 判断 source 是否为 Promise
		let sourceData: Data[] | null = null
		if (isAsyncFunction(this.options.source)) {
			sourceData = await this.options.source()
		} else {
			sourceData = this.options.source() as Data[]
		}

		this.data = sourceData
		this.updateData(sourceData)
	}

	/**
	 * 创建元素
	 *
	 * @returns
	 */
	createElement() {
		this.container = document.createElement('div')
		this.container.classList.add(Mention.className, Mention.LoadingClassName)
		this.container.textContent = 'Loading...'
		this.quill.container.appendChild(this.container)
		this.claculatePosition()
		this.quill.root.addEventListener('keydown', this.handlerEnterEvent, true)
		document.body.addEventListener('click', this.handlerClickEvent)
	}

	/**
	 * 更新数据
	 *
	 * @param {Data[] | null} data
	 */
	updateData(data: Data[] | null) {
		if (!this.container) return
		this.mentionComponent = createRoot(this.container)
		this.mentionComponent.render(
			createElement(MentionComponent, {
				data,
				el: this.quill.root,
				onSelect: this.onSelect.bind(this),
				item: this.options.item
			})
		)
		this.container.classList.remove(Mention.LoadingClassName)

		requestAnimationFrame(() => {
			this.timer = setTimeout(() => this.claculatePosition(), 0)
		})
	}

	/**
	 * 选择选项
	 *
	 * @param {Data} data
	 */
	onSelect(data: Data) {
		this.insertElement(data)
		this.destroy()
	}

	/**
	 * 计算组件显示位置
	 */
	claculatePosition() {
		if (!this.container) return

		// 获取光标所在位置
		const selection = this.quill.getSelection()
		if (!selection) return

		// 获取光标位置的坐标
		const bounds = this.quill.getBounds(selection.index)
		if (!bounds) return

		this.container.style.left = `${bounds.left}px`
		this.container.style.top = `${bounds.top + bounds.height}px`

		const mentionBounds = this.container.getBoundingClientRect()

		const bodyHeight = window.innerHeight
		const bodyWidth = window.innerWidth
		const mentionBoundsHeight = this.container.offsetHeight
		
		// 触发底部边界
		if (mentionBounds.top + mentionBoundsHeight > bodyHeight) {
			// 如果当前元素的高度和 body 高度相差少于 100
			if (bodyHeight - mentionBoundsHeight < 100) {
				const itemEl = this.container.querySelector('.ql-mention-denotation-item') as HTMLDivElement
				if (!itemEl) return
				const height = itemEl.offsetHeight * 2
				this.container.style.height = `${height}px`
				this.container.style.top = `${bounds.top - height}px`
			} else {
				this.container.style.top = `-${mentionBoundsHeight - bounds.top}px`
			}
		}

		// 触发右侧边界
		if (bounds.left + mentionBounds.width > bodyWidth) {
			this.container.style.left = `${bounds.left - mentionBounds.width}px`
		}
	}

	/**
	 * 确认操作
	 *
	 * @param {KeyboardEvent} e
	 */
	handlerEnter(e: KeyboardEvent) {
		if (e.key === KeyboardType.ESCAPE) return this.destroy()
		if (e.key !== KeyboardType.ENTER) return
		e.preventDefault()
		const mentionEl = this.container?.firstElementChild as HTMLDivElement
		const activeIndex = Number(mentionEl?.dataset?.activeIndex) ?? 0
		const data = this.data?.[activeIndex] ?? null
		this.insertElement(data!)
	}

	/**
	 * 插入提及
	 *
	 * @param {Data} data
	 */
	insertElement(data: Data) {
		if (!data) return
		const range = this.quill.selection?.savedRange
		if (!range || range.length != 0) return
		const position = range.index
		this.quill.insertEmbed(position, 'mention', { ...data, name: `@${data.name}` }, Quill.sources.API)
		this.quill.insertText(position + 1, ' ', Quill.sources.API)
		this.quill.setSelection(position + 2, Quill.sources.API)
		this.quill.deleteText(position - 1, 1)
		this.options?.onSelect?.(data)
	}

	/**
	 * 销毁
	 *
	 * @returns
	 */
	destroy() {
		if (!this.container) return
		this.container.remove()
		this.mentionComponent?.unmount()
		document.body.removeEventListener('click', this.handlerClickEvent)
		this.quill.root.removeEventListener('keydown', this.handlerEnterEvent, true)
		this.container = null
		this.mentionComponent = null
		if (this.timer) clearTimeout(this.timer)
	}
}

Quill.register({ 'modules/mention': Mention })

export default Mention
