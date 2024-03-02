import type { Data } from 'src/type'

/**
 * 判断函数是否为 异步函数
 *
 * @param {void} fn
 * @returns {boolean}
 */
export const isAsyncFunction = (fnc: () => Data[] | Promise<Data[]>): boolean => {
	return Object.prototype.toString.call(fnc) === '[object AsyncFunction]'
}
