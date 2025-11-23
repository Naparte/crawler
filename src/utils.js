
/** 提取页面数据格式化单价 */
export function extractRoomInfos(htmlString) {
    // 匹配 roomInfos 变量赋值语句
    const roomInfosRegex = /var\s+roomInfos\s*=\s*(\[.*?\]);/s;
    const match = htmlString.match(roomInfosRegex);

    if (!match) {
        console.warn('未找到 roomInfos 变量');
        return [];
    }

    try {
        // 处理对象数组字符串
        const arrayStr = match[1];

        // 修复不合法的key和值
        const fixedStr = arrayStr
            // 修复不合法的key（包含特殊字符的）
            .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '"$1":')
            // 修复值为 / 的情况
            .replace(/:\s*\//g, ': ""')
            // 修复值为 null 的情况
            .replace(/:\s*null/g, ': null')
            // 修复布尔值
            .replace(/:\s*true/g, ': true')
            .replace(/:\s*false/g, ': false')
            // 修复数字值
            .replace(/:\s*(\d+\.?\d*)/g, ':$1')
            // 修复字符串值（确保用双引号包裹）
            .replace(/:\s*([^",\s{}\[\]\/]+)(?=,|\s*})/g, ':"$1"')
            // 处理已经用引号包裹的字符串
            .replace(/:\s*"([^"]*)"/g, ':"$1"')
            .replace(/:\s*'([^']*)'/g, ':"$1"');

        // 解析为JavaScript对象
        const roomInfos = JSON.parse(fixedStr);

        // 确保所有对象都有相同的key，缺失的用空字符串填充
        const allKeys = new Set();
        roomInfos.forEach(obj => {
            Object.keys(obj).forEach(key => allKeys.add(key));
        });

        // 标准化所有对象
        return roomInfos.map(obj => {
            const standardizedObj = {};
            allKeys.forEach(key => {
                standardizedObj[key] = obj.hasOwnProperty(key) ? obj[key] : '';
            });
            return standardizedObj;
        });

    } catch (error) {
        console.error('解析 roomInfos 失败:', error);
        return [];
    }
}

