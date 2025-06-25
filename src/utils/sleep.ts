/**
 * 线程睡眠
 * @param ms 毫秒数
 */
export default function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
