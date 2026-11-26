# UCAS-humanityLecture

用于中国科学院大学（UCAS）人文讲座报名页面的浏览器用户脚本（Userscript），通过改写前端提交的时间参数，绕过“讲座时间与已选课程时间冲突”的报名限制。

> 本文档同时面向 **人类用户**（快速安装与使用）与 **AI Agent / 开发者**（仓库结构、DOM 契约、修改约束与排查清单）。

---

## 快速开始（面向用户）

### 解决什么问题？

在 UCAS 选课系统的人文讲座页面（`https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*`），当讲座时间与个人课表中的课程时间重叠时，直接点击“报名”会被系统拦截。

本脚本会在每个原有“报名”按钮右侧自动添加一个 **「忽略时间报名」** 按钮：
- 保留原“报名”按钮不变；
- 点击「忽略时间报名」时，将传给页面原生函数 `toSign(lectureId, timeStr)` 的时间段替换为 **讲座当天的 `23:00-23:30`**，从而绕过课程时间冲突检测；
- 自动适配分页切换、条件筛选及异步刷新（基于 `MutationObserver`）。

### 安装方式

1. 在浏览器中安装用户脚本管理器，例如 [Tampermonkey](https://www.tampermonkey.net/)（篡改猴）或 [Violentmonkey](https://violentmonkey.github.io/)（暴力猴）。
2. 选择以下任一方式安装脚本：
   - **方式 A（推荐，Greasy Fork 一键安装）**：访问 [Greasy Fork 脚本页](https://greasyfork.org/zh-CN/scripts/607422) 并点击「安装此脚本」。
   - **方式 B（GitHub Raw 直接安装）**：打开本仓库中的 Raw 脚本链接：[ucas-humanitylecture-ignore-time.user.js](https://raw.githubusercontent.com/LLL0u1s/UCAS-humanityLecture/main/ucas-humanitylecture-ignore-time.user.js)，脚本管理器会自动弹出安装确认页，点击“安装”即可。
   - **方式 C（手动粘贴）**：复制仓库中 `ucas-humanitylecture-ignore-time.user.js` 的全部内容，在脚本管理器中点击“添加新脚本”，粘贴并保存。
3. 登录 UCAS SEP 并进入人文讲座报名页面（`https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*`），即可在原“报名”按钮旁看到 **「忽略时间报名」**。

### 注意事项与免责声明

- 本脚本**仅修改前端提交给 `toSign()` 的时间字符串**，不会改变讲座实际举办时间，请自行确认讲座时间与签到要求。
- 仅运行在 `https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*`，不请求外部网络，不收集任何个人数据（`@grant none`）。
- 若学校教务系统后续将时间冲突校验改为纯后端校验，或修改了页面 DOM / `toSign` 函数签名，本脚本可能失效。

---

## 项目概览与技术规范（面向 AI Agent 与开发者）

本节提供机器易读、无歧义的仓库契约与实现细节，便于 AI Agent 或贡献者直接理解、审计和修改代码。

### 仓库结构

```text
UCAS-humanityLecture/
├── README.md                                  # 项目说明文档（人类 + Agent 双视角）
└── ucas-humanitylecture-ignore-time.user.js   # 核心且唯一的单文件用户脚本（纯 ES6+，零依赖，无需构建）
```

| 属性 | 值 |
| :--- | :--- |
| 语言 / 运行环境 | Vanilla JavaScript (ES6+)，浏览器 Userscript 环境（IIFE + `'use strict'`） |
| 外部依赖 / 构建流程 | 无外部依赖，无 `package.json`，无需打包或编译 |
| 目标匹配规则 (`@match`) | `https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*` |
| 注入时机 (`@run-at`) | `document-idle` |
| 权限声明 (`@grant`) | `none`（直接运行在页面上下文，可直接调用页面全局函数 `toSign`） |
| 开源协议 (`@license`) | MIT |

### 核心实现与 DOM 契约

脚本入口为自执行函数，执行两步操作：立即调用一次 `addButtons()`，然后通过 `MutationObserver` 监听 `document.body` 的 `{ childList: true, subtree: true }` 变化并再次调用 `addButtons()`。

1. **目标节点选择**：
   - CSS 选择器：`a[onclick*="toSign("]:not([data-ucas-processed])`
   - 依赖页面中原始报名按钮为 `<a>` 标签，且内联 `onclick` 属性包含 `toSign(...)` 调用。
2. **参数解析正则**：
   ```js
   /toSign\s*\(\s*(['"])(.*?)\1\s*,\s*(['"])(\d{4}-\d{2}-\d{2})\s+[^'"]+\3\s*\)/
   ```
   - 捕获组 `match[2]`：`lectureId`（讲座 ID）
   - 捕获组 `match[4]`：`date`（讲座日期，格式 `YYYY-MM-DD`）
   - 构造的新时间参数：`` `${date} 23:00-23:30` ``
3. **按钮注入与幂等保证**：
   - 给原按钮设置 `data-ucas-processed="true"`，防止重复处理；
   - 若原按钮的 `nextElementSibling` 已包含 class `ucas-ignore-time-sign`（常量 `MARKER`），则跳过插入；
   - 通过 `originalButton.cloneNode(true)` 克隆原按钮以复用页面原有样式，移除 `data-ucas-processed`，添加 class `ucas-ignore-time-sign`，设置文本为 `忽略时间报名` 与 `marginLeft: '8px'`；
   - 使用 `JSON.stringify` 安全转义参数后写入 `onclick`：
     ```js
     `toSign(${JSON.stringify(lectureId)}, ${JSON.stringify(newTime)}); return false;`
     ```
   - 使用 `originalButton.insertAdjacentElement('afterend', newButton)` 插入原按钮之后。

### 修改约束与开发指南

修改 `ucas-humanitylecture-ignore-time.user.js` 时，请遵守以下不变量：

- **保持幂等性**：`MutationObserver` 会因脚本自身插入 DOM 节点而触发回调，必须保留 `data-ucas-processed` 与 `MARKER` 检查，避免无限循环或重复生成按钮。
- **保留 `@grant none`**：脚本依赖页面全局作用域中的 `toSign` 函数；若改为使用 `GM_*` API，需改用 `unsafeWindow.toSign`。
- **保持 `@namespace` 不变**：不要随意更改 `@namespace`（`https://xkcts.ucas.ac.cn/`），否则已安装用户无法平滑升级；每次发布改动时递增 `@version`。
- **保持参数转义与默认行为拦截**：继续使用 `JSON.stringify(...)` 构造内联 `onclick` 参数并保留 `return false;`，防止引号注入或 `<a>` 标签默认跳转。
- **语法验证**：由于无本地测试套件，修改后至少执行语法检查：
  ```bash
  node --check ucas-humanitylecture-ignore-time.user.js
  ```

### 常见失效排查清单

如果脚本在页面上没有生效或点击报错，按以下顺序排查：

1. **URL 未命中 `@match`**：检查浏览器地址栏域名、端口（`:8443`）与路径前缀是否仍为 `https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*`。
2. **DOM 结构或函数名变更**：在浏览器 DevTools 控制台执行 `document.querySelectorAll('a[onclick*="toSign("]')`，确认按钮是否仍使用内联 `onclick="toSign(...)"`。
3. **日期格式变更**：检查原按钮 `onclick` 中的时间参数是否仍以 `YYYY-MM-DD ` 开头，必要时调整正则。
4. **服务端校验升级**：若点击后接口返回时间冲突错误，说明教务系统已改为后端根据 `lectureId` 查询真实时间进行校验，纯前端改参已无法绕过。

## License

[MIT](https://opensource.org/licenses/MIT)
