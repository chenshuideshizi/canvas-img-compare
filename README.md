# 基于 Canvas 实现的图片对比插件

启动服务: ```npm run start```

![截图1](./screenshot/screenshot1.png)


### 使用

**Options参数**

| Key名 | 类型 | 默认值 | 备注 |
| ---- | ---- | ----  | ---- |
| canvas | Element | - | 画布 |
| imgSrc | String | - | 绘制的图片地址 |
| lineStyle | Object | { lineWidth: 1, strokeColor: '#ff0000' }  | 线的样式 |

**Events**

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ----  |
| change | 鼠标位置改变后触发 | { mousePointer } |
| mouseover | 鼠标移入Canvas触发 | 原生 event |
| mousemove | 鼠标在Canvas中移动触发  | 原生 event |
| mouseout | 鼠标移出Canvas触发  | 原生 event |



