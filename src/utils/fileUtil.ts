/**
 * 压缩图片并返回新的 File 对象
 * @param inputFile 输入的图片文件
 * @param scale 缩放比例（0-1）
 * @param quality 输出质量（0-1）
 * @returns  压缩后的 File 对象
 */
export async function compressImageFile (inputFile: File, scale = 1, quality = 0.75) {
  let imageBitmap = null;
  let canvas = null;

  try {
    // 1. 解码图片为 ImageBitmap（独立内存区）
    imageBitmap = await createImageBitmap(inputFile);

    // 2. 创建 OffscreenCanvas 绘制缩放后图像
    canvas = new OffscreenCanvas(
      imageBitmap.width  * scale,
      imageBitmap.height  * scale
    );
    const ctx = canvas.getContext('2d');
    if (!ctx){
      throw new Error('无法获取Canvas 2D上下文');
    }
    ctx.drawImage(imageBitmap,  0, 0, canvas.width,  canvas.height);

    // 3. 转换为压缩后的 Blob
    const compressedBlob = await canvas.convertToBlob({
      type: inputFile.type.startsWith('image/')  ? inputFile.type  : 'image/jpeg',
      quality
    });

    // 4. 生成新 File 对象（保留原始文件名+时间戳）
    return new File([compressedBlob], `${inputFile.name}`,  {
      type: compressedBlob.type,
      lastModified: Date.now()
    });

  } catch (error) {
    //压缩失败返回原文件
    console.error(error);
    return inputFile;
  } finally {
    if (imageBitmap) {
      // 释放 ImageBitmap 内存
      imageBitmap.close();
      imageBitmap = null;
    }
    if (canvas) {
      // 释放 Canvas 内存
      canvas = null;
    }
  }
}

/**
 * 生成上传文件路径
 * 路径格式：upload/{yyyy-MM-dd}/{truncatedName}_{currentTime}{suffix}
 * @param fileName
 */
export function generateFilePath (fileName: string) {
  if (!fileName || fileName.trim()  === '') return '';
  const today = new Date().toISOString().split('T')[0]; // 获取当前日期 (yyyy-MM-dd)
  // 拆分文件名和扩展名
  const lastDotIndex = fileName.lastIndexOf('.');
  const namePart = lastDotIndex !== -1
    ? fileName.slice(0,  lastDotIndex)
    : fileName;
  const suffix = lastDotIndex !== -1
    ? fileName.slice(lastDotIndex)
    : '';

  // 截取前15个字符（兼容特殊符号）
  const truncatedName = namePart.replace(/[^\w-]/g,  '_') // 非字母数字转下划线
    .substring(0, 15)
    .trim() || 'file'; // 空文件名兜底

  const currentTime = Date.now(); // 获取当前时间戳

  return `upload/${today}/${truncatedName}_${currentTime}${suffix}`;
}
