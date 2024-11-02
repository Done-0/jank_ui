# Jank UI

# 介绍

`Jank UI` 是基于 `Vue 3`, `TypeScript` 和 `Vite` 的 博客系统前端项目。

# 技术栈

- Vue 3
- TypeScript
- Vite
- Shadcn-vue

**开发流程建议**：

1. **新功能开发流程**：
   - 先定义类型（types/）
   - 添加 API 接口（api/）
   - 创建/更新状态管理（stores/）
   - 开发组件（components/）
   - 实现页面（views/）

2. **组件开发建议**：
   - 通用组件放在 components/common/
   - 业务组件放在 components/business/
   - 页面私有组件放在对应页面目录下的 components/

3. **状态管理使用建议**：
   - 全局状态放在 stores/
   - 组件内部状态用 ref/reactive
   - 多组件共享状态用 provide/inject

4. **样式管理建议**：
   - 全局样式变量放在 assets/styles/vars.scss
   - 组件样式使用 scoped
   - 建议使用 CSS Modules 或 BEM 命名规范

5. **工具函数开发建议**：
   - 通用工具放在 utils/
   - 特定功能的 hooks 放在 hooks/
   - 保持单一职责原则

6. **类型定义建议**：
   - 接口类型定义放在 types/
   - 尽可能使用 TypeScript 的类型推导
   - 避免使用 any