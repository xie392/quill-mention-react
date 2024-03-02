/**
 * mention 数据类型
 */
export interface Data {
	name: string
	[key: string]: any
}

/**
 * mention 配置
 */
export interface MentionOptions {
	/**
	 * 触发字符
	 * @default '@'
	 */
	targetChars: string[]
	/**
	 * 要展示的数据
	 * @example
	 * source: () => Promise<Data[]>
	 * source: () => Data[]
	 * @returns
	 */
	source: () => Promise<Data[]> | Data[]
	/**
	 * 选中时的回调
	 *
	 * @param {Data} data
	 * @returns
	 */
	onSelect?: (data: Data) => void
	/**
	 * 自定义渲染的元素
	 */
	item?: (data:Data) => React.ReactNode
}

