# coding-plan-report.html 数据维护规则

本文件说明该单文件 HTML 报告的数据结构、计算规则与维护流程。新增模型、调整价格、增删套餐时请严格遵循。

## 一、项目概述

- 全部内容（CSS / 数据 / 逻辑）都在 `coding-plan-report.html` 一个文件里，无构建系统、无外部依赖。
- 报告对比全球 17 家厂商的 AI Coding Plan / Token Plan 订阅套餐，统一折算为「元/百万 tokens」单价并排名。
- 支持深色/浅色/跟随系统三种主题（AIHOT 风格分段滑块，localStorage 键 `aihot-theme`）。

## 二、核心数据结构

### 1. `companies[]` —— 厂商与套餐

每家厂商一个对象：

```js
{id:'zhipu', name:'智谱 AI', product:'GLM Coding Plan', region:'cn', country:'中国',
 url:'https://...', desc:'厂商描述',
 plans:[ /* 套餐数组 */ ]}
```

- `region` 只能是 `'cn'` 或 `'intl'`，决定侧栏区域筛选归类。
- `url` 为官网定价页，用于排名表与公司卡片的跳转链接。

每个套餐对象：

```js
{name:'GLM Pro', price:430.4, cur:'CNY', disc:0.175,
 quota:'官方额度口径文本', tokensM:63,
 annual:'年付描述', annualMonthly:430.4, quarterlyMonthly:538.0,
 promo:'促销文案', firstMonth:39.9, tag:'标签',
 models:[{n:'模型名', r:消耗倍率, tag:'可选标注'}],
 note:'备注'}
```

字段约定：

| 字段 | 必填 | 说明 |
|------|------|------|
| `price` | 是 | 标准月付价；`payg:true` 时可填 0 |
| `cur` | 是 | `'CNY'` 或 `'USD'` |
| `tokensM` | 条件 | 估算月度 tokens（单位：百万）。免费档填 `0` |
| `payg` | 否 | 按量计费网关档（如 OpenCode Zen）设 `true`，不进排名 |
| `disc` | 否 | 国内优惠因子（0~1），如智谱 0.175、MiniMax 0.833；默认 1 |
| `firstMonth` | 否 | 首月优惠实付价（原币）。有此字段的套餐按首月价参与排名并标注「首月」徽章 |
| `annualMonthly` / `quarterlyMonthly` | 否 | 年付/季付折算月均价（人民币口径），供公司页月/季/年卡切换展示 |
| `models[].r` | 是 | 该套餐内调用此模型的额度消耗倍率。`0` 表示免费不占额度 |

### 2. `apiRefs[]` —— API 按量参考价

```js
{n:'GLM-5.3', i:8, o:28, cur:'CNY', tag:'旗舰'}
```

- `i` = 输入价，`o` = 输出价（每百万 tokens，按牌价币种）。
- 模型查询页用它算「混合 3:1」参考单价，并在表格底部显示 API 按量对照行。
- 有公开 API 牌价的模型都应补进来；订阅专属无牌价者用 `tag:'参考'` 并给估算值。

### 3. `strongModels` —— 强模型集合

新旗舰/强模型必须加入此 Set，否则公司卡片中不会归入「强模型」分组前置展示：

```js
const strongModels = new Set([ 'GLM-5.3', 'GLM-5.3-Flash', ... ]);
```

## 三、计算规则（勿改动口径）

- 汇率：`FX = 7.1`（1 USD ≈ 7.1 CNY），全站固定。
- 缓存放大：默认全部套餐按 90% 缓存命中 ×10（`CACHE_BOOST_DEFAULT = 10`），可用 `cacheHitBoost` 显式覆盖。
- 折合单价：
  - 排名口径 `rankCost(p) = rankPriceCNY(p) / effTokensM(p)`
  - 普通展示口径 `planCost(p) = planDiscCNY(p) / effTokensM(p)`
  - 其中 `planDiscCNY(p) = planPriceCNY(p) × (p.disc || 1)`，`effTokensM(p) = p.tokensM × 10`
- 首月优惠：`firstMonth` 存在时排名按首月实付价折算。
- API 参考混合价：`blend(r) = (i×3 + o)/4`（输入:输出 = 3:1），USD 再乘 FX。
- 展示币种固定为人民币，美元价格自动 ×7.1 折算。

## 四、排除规则

以下两类套餐**不进入**排名（`allPlans` 构建时被过滤），但仍显示在公司卡片：

1. `payg: true` 的按量计费档（如 OpenCode Zen）；
2. `tokensM: 0` 的免费档（如 CodeBuddy Free）。

原因：两者会算出 NaN 成本污染排名。新增此类套餐时务必正确标记字段。

## 五、新增模型的操作清单

以「智谱发布 GLM-5.3-Flash」为例：

1. **加进套餐**：在对应厂商各档位的 `models[]` 里补 `{n:'GLM-5.3-Flash', r:倍率, tag:'标注'}`。倍率查官方文档（如 ZCode 积分倍率）。
2. **加进 `strongModels`**：旗舰级模型必须加，否则卡片分组错误。
3. **补 `apiRefs`**：有官方 API 牌价的模型补一行输入/输出价 + 注明日期来源。
4. **更新 `desc`**：如影响产品定位（如「已支持 XX 模型」），同步改厂商描述。
5. **核对数据截止日期**：侧栏 footer「数据截至」、header meta、「换算方法」页免责声明里的日期需一起更新。

## 六、核对/调整已有价格的流程

1. 联网核实官方定价页最新价格（优先官网 > 官方公告 > 可信媒体报道）。
2. 区分「标准价」「限时促销价」：限时促销写入 `tag` 并注明截止时间（如 OpenAI Sol 促销至 2026-11）。
3. 价格变化只改 `apiRefs`（API 价）；订阅套餐价变则改 `plans[].price` 及相应 `annualMonthly/quarterlyMonthly/promo` 字段。
4. 涉及新模型发布的（如 Gemini 3.7 Flash），若厂商现有套餐能用它，也要同步加进 `models[]`。

## 七、验证方法

任何数据修改后必须依次执行：

```bash
# 1. 提取 <script> 做语法检查（应无输出）
awk '/<script>/{f=1;next} /<\/script>/{f=0} f' coding-plan-report.html > /tmp/check.js && node --check /tmp/check.js

# 2. 冒烟测试（应看到 ✓ 冒烟通过）
node test/smoke.js
```

smoke 测试断言：渲染输出无 NaN/Infinity/undefined、排名严格升序、全部公司卡与套餐行渲染成功、所有 (套餐, 模型) 组合成本有限。

启动时的 `integrityCheck()` 会 console.warn 列出「既非强模型又无 API 牌价」的模型——工具类（联网搜索）、免费类（SWE-1.5）、多模态类（Seedream）条目属预期可忽略，其余需人工补齐。

## 八、样式与主题约定

- 所有组件颜色只能引用 CSS 变量（`var(--xxx)`），禁止硬编码色值，否则会破坏双主题。
- JS 模板字符串中的内联样式同样只用变量（如 `var(--good-soft)`、`var(--warn)`）。
- 主题机制：`<html data-theme>` + 双套变量 + localStorage 键 `aihot-theme`；head 内有一段防闪烁初始化脚本，body 末尾的 `applyTheme()` 负责交互，两者键名必须保持一致。
- 高亮类名沿用 `side-link-active`（历史遗留命名），改名会导致导航高亮失效。

## 九、常见陷阱

- 新模型忘加 `strongModels`：卡片「强模型」分组缺失（r≥1.5 会兜底命中，但 r<1.5 的旗舰会掉到普通组）。
- 新模型忘加 `apiRefs`：模型查询页没有 API 参考行，且触发 integrityCheck 警告。
- 副标题/统计数字硬编码：正文由 JS 从数据动态生成（`subtitle.textContent`），手工写死数字会造成数字腐烂。
- USD 套餐改价忘了 `firstMonth` 也可能是美元：首月价字段与 `cur` 同币种。
