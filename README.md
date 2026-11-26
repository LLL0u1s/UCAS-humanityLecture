# UCAS-humanityLecture

用于中国科学院大学（UCAS）人文讲座报名页面的浏览器用户脚本（Userscript），通过改写前端提交的时间参数，绕过“讲座时间与已选课程时间冲突”的报名限制。

> 本文档同时面向 **人类用户** 与 **AI Agent**（支持浏览器操作的 Agent 可直接按下方 SOP 帮用户完成安装、验证与使用）。

---

## 快速开始（面向用户）

### 解决什么问题？

在 UCAS 选课系统的人文讲座页面（`https://jwxk.ucas.ac.cn/subject/humanityLecture*`），当讲座时间与个人课表中的课程时间重叠时，直接点击“报名”会被系统拦截。

本脚本会在每个原有“报名”按钮右侧自动添加一个 **「忽略时间报名」** 按钮：
- 保留原“报名”按钮不变；
- 点击「忽略时间报名」时，将提交给页面的报名时间替换为 **讲座当天的 `23:00-23:30`**，从而绕过课程时间冲突检测；
- 自动适配分页切换、条件筛选及异步刷新。

### 安装方式

1. 在浏览器中安装用户脚本管理器，例如 [Tampermonkey](https://www.tampermonkey.net/)（篡改猴）或 [Violentmonkey](https://violentmonkey.github.io/)（暴力猴）。
   > Chrome / Edge 用户若首次安装 Tampermonkey，请在浏览器扩展管理页开启「开发者模式」或「允许用户脚本」，否则脚本不会运行。
2. 选择以下任一方式安装脚本：
   - **方式 A（推荐，Greasy Fork 一键安装）**：访问 [Greasy Fork 脚本页](https://greasyfork.org/zh-CN/scripts/607422) 并点击「安装此脚本」。
   - **方式 B（GitHub Raw 直接安装）**：打开 [ucas-humanitylecture-ignore-time.user.js](https://raw.githubusercontent.com/LLL0u1s/UCAS-humanityLecture/main/ucas-humanitylecture-ignore-time.user.js)，脚本管理器会自动弹出安装确认页，点击「安装」即可。
   - **方式 C（手动粘贴）**：复制仓库中 `ucas-humanitylecture-ignore-time.user.js` 的全部内容，在脚本管理器中新建脚本、粘贴并保存。
3. 登录 UCAS SEP 并进入人文讲座报名页面（`https://jwxk.ucas.ac.cn/subject/humanityLecture*`），即可在原“报名”按钮旁看到 **「忽略时间报名」**。

### 注意事项与免责声明

- 本脚本**仅修改前端提交的时间字符串**，不会改变讲座实际举办时间，请自行确认讲座时间与签到要求。
- 仅运行在 `https://jwxk.ucas.ac.cn/subject/humanityLecture*`，无外部网络请求，不收集任何数据（`@grant none`）。
- 若教务系统后续将时间冲突校验改为纯后端校验，本脚本可能失效。

---

## AI Agent 操作指南（安装与使用 SOP）

如果你是 AI Agent，用户要求你“安装这个脚本”或“用这个脚本报名冲突的人文讲座”，请按以下标准流程执行：

### 关键资源地址

| 用途 | 地址 / 标识 |
| :--- | :--- |
| Greasy Fork 脚本页（首选安装入口） | `https://greasyfork.org/zh-CN/scripts/607422` |
| GitHub Raw 脚本直链（备用安装入口） | `https://raw.githubusercontent.com/LLL0u1s/UCAS-humanityLecture/main/ucas-humanitylecture-ignore-time.user.js` |
| 仓库内脚本文件 | `ucas-humanitylecture-ignore-time.user.js` |
| 目标生效页面 | `https://jwxk.ucas.ac.cn/subject/humanityLecture*` |
| 脚本注入成功标志 | 原「报名」按钮右侧出现带 class `ucas-ignore-time-sign` 的「忽略时间报名」按钮 |

### Step 1：检查或安装脚本管理器

1. 确认用户当前浏览器已安装 **Tampermonkey** 或 **Violentmonkey**。
2. 若未安装，引导用户或打开对应浏览器扩展商店完成安装：
   - Chrome / Edge：`https://www.tampermonkey.net/`（选择对应浏览器商店跳转）
3. **关键权限检查（Chrome / Edge MV3 必做）**：提示用户或协助检查扩展详情页，确保已开启 **「允许用户脚本」（Allow User Scripts）** 或扩展管理页右上角的 **「开发者模式」**，否则 Tampermonkey 无法注入脚本。

### Step 2：安装用户脚本（按优先级尝试）

- **方案 1（首选：Greasy Fork 一键安装）**
  1. 在浏览器中打开 `https://greasyfork.org/zh-CN/scripts/607422`。
  2. 点击页面中的 **「安装此脚本」**（`Install this script`）按钮。
  3. 等待浏览器跳转到脚本管理器的安装确认页，点击 **「安装」**（`Install`）。

- **方案 2（备用：GitHub Raw 直链安装）**
  1. 在浏览器中直接打开 `https://raw.githubusercontent.com/LLL0u1s/UCAS-humanityLecture/main/ucas-humanitylecture-ignore-time.user.js`。
  2. 当脚本管理器自动拦截 `.user.js` 并打开安装确认页时，点击 **「安装」**。

- **方案 3（兜底：手动新建脚本）**
  1. 读取本仓库 `ucas-humanitylecture-ignore-time.user.js` 的完整内容。
  2. 打开 Tampermonkey / Violentmonkey 管理面板 → 点击「添加新脚本」→ 全选替换为脚本全文 → 保存（`Ctrl+S` / `Cmd+S`）。

- **方案 4（无扩展时的单次临时生效）**
  - 若当前环境无法安装浏览器扩展，可在用户已登录的 `https://jwxk.ucas.ac.cn/subject/humanityLecture*` 页面中，指导用户在 DevTools Console 中粘贴并运行 `ucas-humanitylecture-ignore-time.user.js` 内的代码（仅当前页面有效，刷新后需重新执行）。

### Step 3：验证生效与协助操作

1. 打开 `https://jwxk.ucas.ac.cn/subject/humanityLecture*`。
2. **登录边界**：若页面跳转到 UCAS SEP 登录页或出现验证码，**立即暂停并请用户本人完成登录**，不要索取密码或尝试绕过验证码。
3. **验证注入**：进入人文讲座列表后，检查每个「报名」按钮右侧是否出现 **「忽略时间报名」** 按钮（或检查 DOM 是否存在 `.ucas-ignore-time-sign`）。
   - 若未出现：优先排查 ① 扩展是否启用及是否开启「允许用户脚本」；② 脚本在 Tampermonkey 面板中是否为开启状态；③ 当前页面 URL 是否匹配 `https://jwxk.ucas.ac.cn/subject/humanityLecture*`。
4. **执行报名**：仅在用户明确指定讲座名称/时间并授权操作时，点击对应讲座行的「忽略时间报名」按钮，并向用户反馈系统弹窗或报名状态结果。

---

## License

[MIT](https://opensource.org/licenses/MIT)
