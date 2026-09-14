# 数据更新流程

> 最后更新：2026-09-14
> 适用版本：v2026-09（18 厂商 / 79 档 / 82 模型）

## 更新频率

| 类型 | 频率 | 触发条件 |
|------|------|----------|
| **例行检查** | 每月 1 日 | 固定周期 |
| **即时更新** | 随时 | 新模型发布、厂商改版公告、价格调整新闻 |

## 厂商核对清单

### 国际厂商（10 家）

| # | 厂商 | 订阅定价页 | API 定价页 | 重点核对项 |
|---|------|-----------|-----------|-----------|
| 1 | **Anthropic** | anthropic.com/pricing | anthropic.com/pricing（底部 API 区域） | Pro/Max 月价；新模型（Opus/Sonnet/Fable 系列）；API 输入/输出/缓存价 |
| 2 | **OpenAI** | openai.com/chatgpt/pricing | platform.openai.com/docs/pricing | Go/Plus/Pro 月价；GPT-5.6 系列 API 价；Cyber/Sol Pro 等新模型；o 系列状态 |
| 3 | **Google** | one.google.com/about/ai-premium | ai.google.dev/pricing | AI Plus/Pro/Ultra 月价；Gemini 新版本；附赠权益变化 |
| 4 | **xAI** | x.ai/grok | x.ai/api/pricing | SuperGrok 各档月价；Grok 新版本；Heavy 专属模型 |
| 5 | **Cursor** | cursor.com/pricing | — | Pro/Pro+/Ultra 月价；Teams 价格；新增产品线（Grok/Bugbot/Cloud Agents） |
| 6 | **GitHub Copilot** | github.com/features/copilot | docs.github.com/en/copilot | Pro/Pro+/Max/Pro+ 月价和 AI Credits 额度；新增模型 |
| 7 | **Windsurf→Devin** | windsurf.com/pricing → app.devin.ai/pricing | — | 品牌整合状态；Pro/Max 月价；定价结构变化 |
| 8 | **Moonshot 国际版** | kimi.com/me/pricing?lang=en | platform.kimi.com | Moderato/Allegretto/Allegro/Vivace 月价；K3 可用性 |
| 9 | **OpenCode→Crush** | opencode.ai/pricing | — | Go/Zen 月价和额度上限；模型清单变化；品牌转型进展 |
| 10 | **Command Code** | commandcode.ai/pricing | — | Go/GOAT/Pro/Max 月价和信用额度；新增模型；taste-1 更新 |

### 国内厂商（8 家）

| # | 厂商 | 订阅定价页 | API/计价文档 | 重点核对项 |
|---|------|-----------|------------|-----------|
| 11 | **智谱 AI** | bigmodel.cn/glm-coding | docs.bigmodel.cn/cn/coding-plan/overview + open.bigmodel.cn/pricing | Lite/Pro/Max 月价和积分规则；龙虾套餐价格；GLM 新版本（5.3/5.3-Flash/5.2）API 价 |
| 12 | **阿里云百炼** | aliyun.com/benefit/scene/tokenplan | help.aliyun.com/zh/model-studio/model-pricing | Coding Plan Pro 状态；Token Plan 个人版（Lite/Standard/Pro）价格和 Credits；团队版；新模型（qwen3.8/deepseek-v4/kimi-k3） |
| 13 | **火山引擎方舟** | volcengine.com/activity/codingplan + /activity/agentplan | docs.volcengine.com/docs/82379/1544106 | Coding Lite/Pro/Max 价格；Agent Small/Medium/Large/Max 价格和 AFP；新模型（Seedance/Seedream 版本）；促销活动截止日期 |
| 14 | **MiniMax** | platform.minimaxi.com/subscribe/token-plan | platform.minimaxi.com/docs/guides/pricing-token-plan | Starter/Plus/Max/极速 月价；Ultra 价格；M3/M2.7 新版本；积分包价格 |
| 15 | **腾讯云** | cloud.tencent.com/act/pro/tokenplan | cloud.tencent.com/document/product/1823/130060 | 通用 Token Plan 四档价格和积分；Hy Token Plan 四档价格；模型列表变化（下线/上线）；积分抵扣系数表 |
| 16 | **百度千帆** | cloud.baidu.com/product/codingplan.html | cloud.baidu.com/doc/qianfan-docs/s/Jm8r1826a + /doc/qianfan/s/Smoghsq3g | Token 福利包价格；Token Plan 个人版（Mini/Lite/Pro/Max）；Coding Plan 状态；ERNIE 新版本 |
| 17 | **Kimi 国内版** | kimi.com/membership/pricing | platform.kimi.com/docs/pricing/chat-v1 | 会员连续包月/包年价格；Coding Plan 入门/中档/高档价格；K3 可用档位 |
| 18 | **小米 MiMo** | mimo.mi.com/docs/zh-CN/price/token-plan | 同左 | Lite/Standard/Pro/Max 月价和 Credits；MiMo Claw 价格；V2.5-Pro-UltraSpeed 状态；夜间折扣规则 |

### 模型评分来源

| 来源 | URL | 更新频率 |
|------|-----|---------|
| **AIHOT 排行榜** | aihot.virxact.com/leaderboard | 每日自动更新 |

## 更新步骤

### 第一步：例行检查（每月 1 日）

1. **订阅定价页核对**：逐个打开上表「订阅定价页」列的 URL，核对每个套餐的月价、年价、额度是否有变化
2. **API 定价页核对**：检查各厂 API 按量价是否有调整（尤其关注新模型发布后的定价）
3. **模型列表核对**：检查各套餐支持的模型是否有新增或下线
4. **AIHOT 排行榜**：抓取最新共识分，更新 `modelScores` 对象
5. **新闻搜索**：搜索"[厂商名] pricing 2026" 或 "[厂商名] 定价 调整" 查找近期变化

### 第二步：数据更新

1. **打开 `coding-plan-report.html`**，定位到 `<script>` 中的数据区域
2. **逐厂商更新**：
   - 修改 `companies[]` 中的价格、额度、模型列表
   - 新增套餐：在对应厂商的 `plans[]` 数组末尾添加
   - 删除套餐：移除对应条目
   - 模型变化：更新 `models[]` 中的模型名和消耗倍率 `r`
3. **更新 `apiRefs[]`**：新增或修改 API 按量参考价
4. **更新 `strongModels`**：新旗舰模型加入 Set
5. **更新 `modelScores`**：同步 AIHOT 最新评分
6. **更新 desc**：在厂商描述中补充重大变化（新模型、品牌变更、计费模式切换等）
7. **更新报告日期**：修改标题、侧栏、页头、免责声明中的日期

### 第三步：验证

1. **运行冒烟测试**：
   ```bash
   npm test
   ```
   确认：厂商数、套餐数、模型数正确；无 NaN/Infinity；排名升序；完整性自检通过

2. **检查完整性警告**：
   - 工具类模型（Auto 智能调度、联网搜索、全模型可选）→ 可忽略
   - 新增的非工具模型 → 确认是否需要加入 `strongModels` 或 `apiRefs`

3. **浏览器预览**：
   - 启动本地服务器：`python3 -m http.server 8000`
   - 检查四个 Tab 页：排名、公司、模型查询、换算方法
   - 切换深色/浅色主题检查样式
   - 切换综合能力/划算排名检查功能

### 第四步：文档同步

1. **更新 `README.md`**：修改数据截至日期和套餐/模型数量
2. **更新 `CLAUDE.md`**：修改厂商数、套餐数、关键模型列表
3. **更新 `国内Coding-Plan套餐官网与计价文档清单.md`**：核对链接状态、更新价格快照

## 关键模型追踪清单

以下是各厂需要持续追踪的主力/旗舰模型：

| 厂商 | 追踪模型 | 备注 |
|------|---------|------|
| Anthropic | Claude Opus 5, Sonnet 5, Fable 5.1, Haiku 4.5 | Opus 5 为最强旗舰 |
| OpenAI | GPT-6 Astra（订阅内名 GPT-6 Pro）, GPT-5.6 Sol/Sol Pro/Terra/Luna/Cyber | Astra 2026-09-03 发布；$200 档 Pro 9-09 起暂停新订阅 |
| Google | Gemini 3.8 Flash, 3.1 Pro, Deep Think, 3.7/3.6 Flash | 3.8 Flash 09-02 GA；Pro 级旗舰仍为 3.1 Pro |
| xAI | Grok 4.6, 4.5, 4 Heavy, 4.3 | 4.6（2T 参数）已于 8-12 全量推送 |
| Cursor | Claude Sonnet 4.6, Opus 4.6, GPT-5.4, Gemini 3 Pro | 随上游模型更新 |
| GitHub Copilot | Grok 4.6（08-14 上线）, GPT-5.5, Claude Sonnet 4.6, Opus 4.6, Gemini 2.5 Pro, o3 | Credits 制 |
| 智谱 | GLM-5.3, 5.3-Flash, 5.2, 5-Turbo | 5.3 为旗舰；GLM-6.0（全自训练）已披露未发布 |
| 阿里 | Qwen3.8-Max（0902 刷新版）, qwen3.7-plus, qwen3.7-max | 8 月开源 Qwen3.8-2.4T-A95B |
| 火山 | Doubao-Seed-Evolving, Doubao-Seed-2.0-Code, Seedance 2.5, Seedream 5.0 Pro | Evolving 周级升级、1M 上下文 |
| MiniMax | MiniMax-M3, M2.7, highspeed 系列 | M3 为最新 |
| 腾讯 | 混元 HY (Hy3), GLM-5.2, Kimi K3, MiniMax-M3 | K3 高消耗 |
| 百度 | ERNIE 5.1, 5.0 | 5.1 为旗舰 |
| Kimi | Kimi K3, K2.7 Code, K2.6 | K3 为最强（9-08 上线视觉理解版） |
| 小米 | MiMo-V2.5-Pro, V2.5 | 9-08 开放 MiMo-X-Pro/Flash-Preview（V3 系列）邀测 |
| DeepSeek | DeepSeek-V4.1-Flash（09-10 发布）, V4-Pro, V4-Flash | 峰谷计价 |
| Command Code | taste-1, 50+ 模型 | 关注新模型接入 |

## 常见更新场景速查

### 场景 A：新模型发布

1. 在 `apiRefs[]` 添加 API 按量价
2. 在对应厂商 `plans[].models[]` 中添加模型
3. 若为旗舰模型，加入 `strongModels`
4. 在 `modelScores` 添加 AIHOT 评分
5. 更新厂商 `desc` 说明

### 场景 B：厂商涨价/降价

1. 修改 `plans[].price`
2. 若有新促销，更新 `promo` / `firstMonth`
3. 若年付价变化，更新 `annual` / `annualMonthly` / `quarterlyMonthly`
4. 更新厂商 `desc`

### 场景 C：套餐停售/新增

1. 停售：移除 `plans[]` 中对应条目，或标注 `note:'已停售'`
2. 新增：在 `plans[]` 末尾添加新条目，确保 `tokensM > 0` 或 `payg: true`

### 场景 D：品牌/产品线变更

1. 更新厂商 `name` 和 `product`
2. 更新 `url`
3. 更新 `desc` 说明变更背景

### 场景 E：积分/计量模式切换

1. 更新 `quota` 字段描述
2. 核实 `tokensM` 估算是否仍准确
3. 检查模型消耗倍率 `r` 是否需要调整
4. 更新 `desc` 和方法论页说明

## 注意事项

- **不要硬编码衍生数字**：厂商数、套餐数、模型数由代码自动计算
- **新模型务必加 `strongModels`**：否则公司卡片中不会前置显示
- **新模型务必加 `apiRefs`**：否则模型查询页无参考价行
- **tokensM 不能为 0**：付费套餐必须有正数 token 估算，否则排名会 NaN
- **payg 套餐设 `payg: true`**：按量套餐不参与排名
- **消耗倍率 r 的含义**：r=1 为基准，r>1 表示更贵的模型消耗更多额度，r<1 表示更便宜
- **更新后必须跑 `npm test`**：确保数据完整性
