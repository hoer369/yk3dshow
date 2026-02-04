# 3D雨刮器展示系统 - 开发文档

## 项目概述

本项目是一个网页端3D展示雨刮器的H5应用，用于向国外客户展示雨刮器产品。系统支持PC端和移动端访问，用户可以通过鼠标或触摸交互查看3D模型。

### 项目目标
- 展示不同型号的雨刮器3D模型
- 支持切换不同卡扣（Adapter）
- 提供后台管理系统管理产品和卡扣
- 支持多端访问（PC/移动端）

---

## 技术栈

### 前端技术
- **框架**: React 18+ / Vue 3+ (推荐React)
- **3D引擎**: Three.js / React Three Fiber
- **模型加载**: GLTFLoader (支持.glb格式)
- **UI组件库**: Ant Design / Element Plus
- **样式**: Tailwind CSS / styled-components
- **响应式**: 媒体查询 + Flexbox/Grid布局
- **构建工具**: Vite / Webpack

### 后端技术
- **框架**: Node.js (Express/Koa) 或 Python (Django/FastAPI)
- **数据库**: MongoDB / PostgreSQL
- **文件存储**: 本地存储 / AWS S3 / 阿里云OSS
- **API**: RESTful API

---

## 功能需求

### 前端展示功能

#### 1. 主页面布局
- **背景图**: 全屏背景图片
- **3D展示区**: 页面中央区域，用于展示3D模型
- **控制面板**: 页面底部，包含雨刮器型号切换和卡扣切换

#### 2. 雨刮器型号切换
- 显示所有可用的雨刮器型号（wiper）
- 点击切换型号，3D展示区加载对应的雨刮器模型
- 每个型号对应一组卡扣

#### 3. 卡扣（Adapter）切换
- 在当前雨刮器型号下方显示对应的卡扣列表
- 卡扣按钮显示卡扣名称
- 卡扣容器固定宽度，支持自动换行
- 点击卡扣按钮：
  - 首次点击：3D模型切换为对应卡扣模型，按钮状态变为黑色白字
  - 再次点击：卡扣模型消失，恢复为雨刮器模型，按钮恢复原状态
- 切换雨刮器型号时，卡扣列表同步更新

#### 4. 雨刮臂图片展示
- 当显示卡扣模型时，右上方显示该卡扣对应的雨刮臂图片
- 图片位置固定，不遮挡3D模型
- 隐藏卡扣时，雨刮臂图片同时隐藏

#### 5. 交互功能
- **PC端**: 鼠标拖拽旋转模型，滚轮缩放
- **移动端**: 手指触摸拖拽旋转，双指缩放
- 支持自动旋转展示（可选）

### 后台管理功能

#### 1. 雨刮器管理
- **添加雨刮器**
  - 输入雨刮器型号名称
  - 上传雨刮器3D模型文件（.glb格式）
  - 保存到数据库

- **编辑雨刮器**
  - 修改雨刮器名称
  - 更新3D模型文件

- **删除雨刮器**
  - 删除雨刮器及其关联的所有卡扣
  - 删除关联的模型文件

- **查询雨刮器**
  - 列表展示所有雨刮器
  - 支持搜索和筛选

#### 2. 卡扣管理
- **添加卡扣**
  - 选择关联的雨刮器
  - 输入卡扣名称
  - 上传卡扣3D模型文件（.glb格式）
  - 上传对应的雨刮臂图片
  - 保存到数据库

- **编辑卡扣**
  - 修改卡扣名称
  - 更新卡扣3D模型
  - 更新雨刮臂图片

- **删除卡扣**
  - 删除卡扣记录
  - 删除关联的模型和图片文件

- **查询卡扣**
  - 按雨刮器筛选卡扣
  - 列表展示所有卡扣信息

---

## 数据结构设计

### 雨刮器（Wiper）
```json
{
  "_id": "唯一标识",
  "name": "雨刮器型号名称",
  "modelUrl": "3D模型文件路径",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### 卡扣（Adapter）
```json
{
  "_id": "唯一标识",
  "wiperId": "关联的雨刮器ID",
  "name": "卡扣名称",
  "modelUrl": "卡扣3D模型文件路径",
  "armImageUrl": "雨刮臂图片路径",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

---

## 前端页面设计

### 主页面组件结构

```
App
├── Background (背景图)
├── Scene3D (3D展示区)
│   ├── Canvas (Three.js画布)
│   ├── ModelLoader (模型加载器)
│   └── Controls (交互控制器)
├── ArmImage (雨刮臂图片，条件渲染)
└── ControlPanel (控制面板)
    ├── WiperSelector (雨刮器选择器)
    └── AdapterSelector (卡扣选择器)
        └── AdapterButton (卡扣按钮)
```

### 关键组件说明

#### 1. Scene3D 组件
```javascript
// 功能
- 初始化Three.js场景
- 加载和渲染3D模型
- 处理用户交互（旋转、缩放）
- 模型切换动画

// 关键API
- GLTFLoader: 加载.glb模型
- OrbitControls: 相机控制
- TWEEN: 动画过渡
```

#### 2. ControlPanel 组件
```javascript
// 功能
- 显示雨刮器型号列表
- 显示当前型号的卡扣列表
- 处理型号和卡扣切换逻辑
- 管理选中状态

// 状态管理
- currentWiper: 当前选中的雨刮器
- currentAdapter: 当前选中的卡扣（可为null）
- wiperList: 雨刮器列表
- adapterList: 当前雨刮器的卡扣列表
```

#### 3. AdapterButton 组件
```javascript
// 功能
- 显示卡扣名称
- 处理点击事件
- 切换选中/未选中状态

// 样式
- 未选中：默认样式
- 选中：黑色背景，白色文字
```

---

## 后端API设计

### 雨刮器接口

#### 获取所有雨刮器
```
GET /api/wipers
Response: {
  "success": true,
  "data": [Wiper对象数组]
}
```

#### 获取单个雨刮器
```
GET /api/wipers/:id
Response: {
  "success": true,
  "data": Wiper对象
}
```

#### 创建雨刮器
```
POST /api/wipers
Content-Type: multipart/form-data
Body: {
  "name": "雨刮器名称",
  "model": "3D模型文件"
}
Response: {
  "success": true,
  "data": Wiper对象
}
```

#### 更新雨刮器
```
PUT /api/wipers/:id
Content-Type: multipart/form-data
Body: {
  "name": "雨刮器名称",
  "model": "3D模型文件（可选）"
}
Response: {
  "success": true,
  "data": Wiper对象
}
```

#### 删除雨刮器
```
DELETE /api/wipers/:id
Response: {
  "success": true,
  "message": "删除成功"
}
```

### 卡扣接口

#### 获取雨刮器的所有卡扣
```
GET /api/wipers/:wiperId/adapters
Response: {
  "success": true,
  "data": [Adapter对象数组]
}
```

#### 获取单个卡扣
```
GET /api/adapters/:id
Response: {
  "success": true,
  "data": Adapter对象
}
```

#### 创建卡扣
```
POST /api/adapters
Content-Type: multipart/form-data
Body: {
  "wiperId": "雨刮器ID",
  "name": "卡扣名称",
  "model": "卡扣3D模型文件",
  "armImage": "雨刮臂图片文件"
}
Response: {
  "success": true,
  "data": Adapter对象
}
```

#### 更新卡扣
```
PUT /api/adapters/:id
Content-Type: multipart/form-data
Body: {
  "name": "卡扣名称",
  "model": "卡扣3D模型文件（可选）",
  "armImage": "雨刮臂图片文件（可选）"
}
Response: {
  "success": true,
  "data": Adapter对象
}
```

#### 删除卡扣
```
DELETE /api/adapters/:id
Response: {
  "success": true,
  "message": "删除成功"
}
```

---

## 文件存储结构

```
/uploads/
├── models/
│   ├── wipers/
│   │   ├── {wiperId}.glb
│   │   └── ...
│   └── adapters/
│       ├── {adapterId}.glb
│       └── ...
└── images/
    └── arms/
        ├── {adapterId}.jpg
        └── ...
```

---

## 响应式设计

### PC端布局
- 背景图：全屏
- 3D展示区：屏幕中央，占主要区域
- 控制面板：底部固定，宽度自适应
- 卡扣按钮：横向排列，自动换行

### 移动端布局
- 背景图：全屏
- 3D展示区：屏幕中央，适配屏幕宽度
- 控制面板：底部固定，按钮尺寸适配触摸
- 卡扣按钮：网格布局，自动换行

### 断点设置
- 移动端：< 768px
- 平板端：768px - 1024px
- PC端：> 1024px

---

## 交互设计

### 模型加载
- 初始加载：显示加载动画
- 模型切换：平滑过渡动画
- 加载失败：显示错误提示

### 用户交互
- 鼠标/手指拖拽：旋转模型
- 滚轮/双指：缩放模型
- 点击按钮：切换模型
- 长按：显示模型信息（可选）

### 状态反馈
- 加载中：显示loading动画
- 加载成功：平滑显示模型
- 加载失败：显示错误信息
- 选中状态：按钮高亮显示

---

## 开发规范

### 代码规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Airbnb JavaScript风格指南
- 组件命名使用PascalCase
- 函数命名使用camelCase

### Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

### 文件命名规范
- 组件文件：PascalCase（如：WiperSelector.jsx）
- 工具文件：camelCase（如：modelLoader.js）
- 样式文件：kebab-case（如：scene-3d.css）

---

## 性能优化

### 3D模型优化
- 使用Draco压缩模型
- 控制模型面数和纹理大小
- 使用LOD（Level of Detail）技术
- 预加载常用模型

### 加载优化
- 模型懒加载
- 图片压缩和WebP格式
- CDN加速
- 浏览器缓存策略

### 渲染优化
- 使用requestAnimationFrame
- 离屏渲染
- 减少重绘和回流

---

## 测试计划

### 单元测试
- 组件测试
- 工具函数测试
- API接口测试

### 集成测试
- 模型加载流程
- 用户交互流程
- 数据同步流程

### 兼容性测试
- Chrome、Firefox、Safari、Edge
- iOS Safari、Android Chrome
- 不同屏幕尺寸

---

## 部署方案

### 前端部署
- 构建生产版本
- 部署到CDN
- 配置HTTPS

### 后端部署
- Docker容器化
- 负载均衡
- 数据库备份

### 监控和日志
- 错误监控（Sentry）
- 性能监控
- 访问日志

---

## 开发阶段规划

### 第一阶段：基础框架
- [ ] 项目初始化
- [ ] 技术栈搭建
- [ ] 基础页面布局

### 第二阶段：3D展示
- [ ] Three.js场景搭建
- [ ] 模型加载功能
- [ ] 交互控制实现

### 第三阶段：业务逻辑
- [ ] 雨刮器切换功能
- [ ] 卡扣切换功能
- [ ] 雨刮臂图片展示

### 第四阶段：后台管理
- [ ] 雨刮器CRUD接口
- [ ] 卡扣CRUD接口
- [ ] 后台管理页面

### 第五阶段：优化和测试
- [ ] 性能优化
- [ ] 兼容性测试
- [ ] Bug修复

### 第六阶段：部署上线
- [ ] 生产环境部署
- [ ] 监控配置
- [ ] 文档完善

---

## 注意事项

1. **模型文件要求**
   - 格式：.glb
   - 大小：建议小于5MB
   - 坐标系：Y轴向上
   - 单位：毫米

2. **图片文件要求**
   - 格式：JPG/PNG/WebP
   - 尺寸：建议800x600
   - 大小：建议小于500KB

3. **浏览器兼容性**
   - 支持WebGL 2.0
   - ES6+语法支持
   - 移动端触摸事件支持

4. **安全性**
   - 文件上传类型验证
   - 文件大小限制
   - API接口鉴权
   - XSS防护

---

## 附录

### 参考资源
- Three.js官方文档：https://threejs.org/docs/
- React Three Fiber：https://docs.pmnd.rs/react-three-fiber
- GLTF模型规范：https://github.com/KhronosGroup/glTF

### 联系方式
- 技术支持：[待填写]
- 项目负责人：[待填写]

---

*文档版本：v1.0*
*最后更新：2026-01-29*
