import Quill from 'quill'
import { Delta } from 'quill/core'
import './quill.mention.scss'
import MentionComponent from './MentionComponent'
import { Root, createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { Data } from './type'
import './blots/mention'

interface MentionOptions {
	triggerChar?: string[]
	source?: () => Promise<Data[]>
	visable?: boolean
	render?: (data?: Data[]) => React.ReactNode
	loading?: boolean
	onSelect?: (data: Data | number) => void
}

const defaultOptions = {
	triggerChar: ['@'],
	visable: true,
	loading: true,
	onSelect: () => null
}

/**
 * @description 自定义提及
 *
 * @param quill
 * @param options
 */
class Mention {
	public static className = 'ql-mention-denotation'

	private quill!: Quill
	private options!: MentionOptions

	private container!: HTMLDivElement | null
	private root!: Root | null
	private mentionComponent!: React.ReactNode

	private source!: Data[]

	private isEnter: boolean = false

	constructor(quill: Quill, options: MentionOptions) {
		this.quill = quill
		this.options = { ...defaultOptions, ...options }

		this.quill.on('text-change', this.handleTextChange.bind(this))

		document.body.addEventListener('click', () => this.clearContainer())

		this.quill.root.addEventListener('keydown', this.handleEnter.bind(this), true)
	}

	/**
	 * 创建一个新节点并初始化其属性。
	 */
	createNode() {
		const denotationChar = document.createElement('div')
		denotationChar.className = Mention.className
		denotationChar.tabIndex = 10

		this.root = createRoot(denotationChar)
		this.root.render(this.mentionComponent)

		document.body.appendChild(denotationChar)

		this.container = denotationChar
		this.handleBounds()
	}

	/**
	 * 处理文本更改事件。
	 *
	 * @param {Delta} delta -代表文本更改的增量
	 * @return {Promise<void>} 一个在处理文本更改时解析的承诺
	 */
	async handleTextChange(delta: Delta) {
		this.isEnter = true

		// 如果不需要显示提及
		if (this.options.visable === false) return

		// 如果有上一次存留的 @
		this.clearContainer()

		const char = delta.ops?.at(-1)?.insert
		if (!char) return

		// 获取触发提及的字符（在这里为 '@'）
		const triggerChar = this.options.triggerChar ?? defaultOptions.triggerChar
		if (!triggerChar.includes(char as string)) return

		// 创建提及
		this.createMentionNode()
		// loading
		this.createNode()

		this.source = (this.options.source && (await this.options.source())) ?? []

		if (this.container && this.root) {
			// 创建提及
			this.mentionComponent = this.createMentionNode(this.source)
			this.root.render(this.mentionComponent)
			this.isEnter = false

			setTimeout(() => {
				this.handleBounds()
			}, 0)
		}
	}

	/**
	 * 处理提及回车确认事件
	 *
	 * @param {string} text - 提及内容
	 * @return {Promise<void>} 一个在处理文本更改时解析的承诺
	 */
	handleEnter(e: KeyboardEvent) {
		if (e.key !== 'Enter') return

		if (!this.isEnter) e.preventDefault()
		else return

		const mentionEl = this.container?.firstElementChild as HTMLDivElement
		const activeIndex = Number(mentionEl?.dataset?.activeIndex) ?? 0

		const item = this.source?.[activeIndex] ?? {
			name: '全体成员',
			id: 0
		}
		this.options.onSelect?.(item)

		this.insert({ ...item, name: `@${item.name}` })
		this.clearContainer()
		this.isEnter = true
	}

	/**
	 * 插入内容
	 *
	 * @param {Data} data
	 */
	insert(data: Data) {
		// 删除输入字符 @
		// const text = this.quill.getText()
		// const selection = this.quill.getSelection()
		// if (!selection) return
		// const cursorPos = selection.index
		// const start = text.lastIndexOf(' ', cursorPos - 2) + 1
		// console.log("start",start);
		// this.quill.deleteText(start, 1)

		// 插入提及
		const range = this.quill.selection?.savedRange
		if (!range || range.length != 0) return
		const position = range.index
		this.quill.insertEmbed(position, 'mention', data, Quill.sources.API)
		this.quill.insertText(position + 1, ' ', Quill.sources.API)
		this.quill.setSelection(position + 2, Quill.sources.API)
		this.quill.deleteText(position - 1, 1)
	}

	/**
	 * 移除开始的 @
	 *
	 */
	removeStart() {
		const range = this.quill.selection?.savedRange
		if (!range || range.length != 0) return
		const position = range.index
		this.quill.deleteText(position, 1)
		this.quill.setSelection(position, Quill.sources.API)
	}

	/**
	 * 获取光标所在位置
	 *
	 * @returns {Bounds}
	 */
	getBounds() {
		// 获取光标所在位置
		const selection = this.quill.getSelection()
		if (!selection) return

		// 获取光标位置的坐标
		const bounds = this.quill.getBounds(selection.index)
		if (!bounds) return null
		return bounds
	}

	/**
	 * 处理边界问题
	 *
	 * @param data
	 */
	handleBounds() {
		if (!this.container) return

		const bounds = this.getBounds()
		if (!bounds) return

		const containerRect = this.container.getBoundingClientRect()
		const quillContainerRect = this.quill.container.getBoundingClientRect()

		// 解决 loading 位置不对
		const offsetHeight = this.container.offsetHeight < 10 ? 36 : this.container.offsetHeight

		this.container.style.left = `${bounds.left}px`
		this.container.style.top = `${quillContainerRect.top + bounds.top - offsetHeight - 8}px`
		this.container.style.bottom = `auto`

		// 控制右边界
		const width = document.body.clientWidth
		if (containerRect.right > width) {
			this.container.style.right = `5px`
			this.container.style.left = `auto`
		}
	}

	createMentionNode(data?: Data[]) {
		this.mentionComponent = this.options.render
			? this.options.render(data)
			: createElement(MentionComponent, {
					data: data ?? null,
					el: this.quill.root,
					onSelect: this.options.onSelect ?? defaultOptions.onSelect
				})
		return this.mentionComponent
	}

	clearContainer() {
		if (!this.container) return
		this.quill.root.removeEventListener('keydown', this.handleEnter)
		this.mentionComponent = null
		this.container.remove()
		this.container = null
		this.root?.unmount()
	}
}


Quill.register({ 'modules/mention': Mention })

export default Mention
