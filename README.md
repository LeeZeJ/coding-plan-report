# coding-plan-report

全球主流 AI **Coding Plan / Token Plan** 套餐研究对比报表（单文件静态 HTML）。

一个自包含的单文件 HTML 报表，对比国内外 17 家厂商、66 档付费 AI 编程 / Token 订阅套餐的**折合单价（元 / 百万 tokens）**，支持总排名、按公司浏览、按模型查询与换算方法说明。无构建系统、无外部依赖、无后端。

## 在线预览

https://z2zv3mie.sc.monkeycode-ai.online/

## 本地查看

直接用浏览器打开 [`coding-plan-report.html`](./coding-plan-report.html) 即可。

- 左侧栏支持**外观**（深色 / 跟随系统 / 浅色，刷新记忆）与**区域筛选**（全部 / 仅国内 / 仅国外）。
- 四个标签页：划算排名、按公司浏览、按模型查询、换算方法。
- 排行榜套餐名可点击跳转到对应公司卡片并高亮。

## 项目结构

| 文件 | 说明 |
| --- | --- |
| `coding-plan-report.html` | 报表主体（CSS / 数据 / 原生 JS 全部内联） |
| `CLAUDE.md` | 给 Claude Code 的项目说明（架构、计算口径、命令） |
| `国内Coding-Plan套餐官网与计价文档清单.md` | 国内厂商官网 / 计价文档与核对记录 |
| `package.json` / `test/smoke.js` | 渲染冒烟测试 |

> 注：`.workbuddy/`、`reasonix.toml` 等为本地工具配置，已在 `.gitignore` 中排除，不会进入仓库。

## 测试

```bash
npm test
```

在 Node 沙箱（mock DOM：`getElementById` / `querySelector` / `classList` / `style` / `addEventListener`）中跑全量渲染，断言：无 `NaN` / `Infinity` / `undefined`、排名严格升序、每个公司卡片与套餐行均渲染、每个 `(plan, model)` 成本有限、GLM 季卡 / 年卡字段与年付字符串一致（回归守卫）。失败时退出码非零。

## 数据口径

- 汇率固定 **1 USD = 7.1 CNY**。
- 折合单价 = 套餐价（折后，CNY）÷ 估算月 tokens（不含缓存放大，有缓存时实际可用量更多）。
- 国内套餐在标准月价之上叠加官方促销优惠因子（`disc`，如智谱 ZCode×包年 7 折≈0.175、MiniMax 包年 83 折、MiMo 夜间×包年 88 折、Kimi 包年 8 折）；带 `firstMonth` 的套餐排名按首月实付价折算并标注「首月」。
- 美元额度型按约 `$5 / M` 折算；官方倍率优先。
- 详见报表内「换算方法」页。

## 声明

价格数据截至 **2026-08**，结合官方定价页、官方博客 / 公告与社区横评交叉核对；促销价以 `promo` 字段标注、常规价为准。本报表仅供研究对比，**非购买建议**。
