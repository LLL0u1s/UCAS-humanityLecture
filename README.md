# UCAS-humanityLecture

用于 UCAS 人文讲座页面绕过与课程时间冲突问题的 Tampermonkey 用户脚本。

## 功能

- 在原“报名”按钮旁新增“忽略时间报名”按钮
- 点击后调用 `toSign(lectureId, "当天 23:00-23:30")`
- 支持分页、筛选、异步加载场景（`MutationObserver`）

## 脚本文件

- `ucas-humanitylecture-ignore-time.user.js`

## 安装方法

1. 浏览器安装 Tampermonkey（或同类用户脚本扩展）
2. 打开本仓库中的 `ucas-humanitylecture-ignore-time.user.js`
3. 复制脚本内容，新建用户脚本并保存
4. 访问 `https://xkcts.ucas.ac.cn:8443/subject/humanityLecture*` 页面使用
