# 国内 AI Coding Plan / Token Plan 套餐 —— 官网、计价文档与数据获取清单

> 用途：本项目（`coding-plan-report.html` 价格对比报告）持续运营时的**数据源手册**。
> 范围：仅国内厂商（国外暂不收录）。收录依据：已进入报告的 8 家 + 报告中提及的补充厂商，外加「观察清单」。
> 维护：建议每月 1 号 + 厂商改版公告出现时核对一次；所有价格以**官网订阅页实时展示**为准，本文档中的价格为 2026-08-20 快照，仅作字段对照参考。
> 链接核对：2026-08-20 已全部 curl 验证（状态码见各节「✓200 / ⚠重定向 / ✗修复」标注）。
> 最后更新：2026-08-20

---

## 0. 快速索引

| # | 厂商 | 套餐产品 | 官网 | 订阅页 | 计价文档 |
|---|------|----------|------|--------|----------|
| 1 | 智谱 AI | GLM Coding Plan（个人/团队）+ 龙虾套餐 | bigmodel.cn | bigmodel.cn/glm-coding | docs.bigmodel.cn/cn/coding-plan |
| 2 | 阿里云百炼 | Coding Plan / Token Plan（个人/企业版） | aliyun.com | aliyun.com/benefit/scene/tokenplan | help.aliyun.com 模型计费 |
| 3 | 火山引擎方舟 | Coding Plan / Agent Plan | volcengine.com | volcengine.com/activity/codingplan | volcengine.com/docs/82379 |
| 4 | MiniMax | Token Plan（Plus/Max/Ultra） | platform.minimaxi.com | /subscribe/token-plan | /docs/guides/pricing-* |
| 5 | 腾讯云 | Token Plan 个人版（通用/Hy）+ 企业版 + CodeBuddy | cloud.tencent.com | /act/pro/tokenplan | /document/product/1823 |
| 6 | 百度千帆 | Coding Plan / Token 福利包 / TPM 保障包 | qianfan.cloud.baidu.com | cloud.baidu.com/product/codingplan.html | cloud.baidu.com/doc/qianfan |
| 7 | 月之暗面 Kimi | Kimi 会员（含 Coding 额度）/ Kimi Code | kimi.com / moonshot.cn | kimi.com/membership/pricing | platform.kimi.com/docs |
| 8 | 无问芯穹 Infini-AI | Infini Coding Plan | cloud.infini-ai.com | platform 页面 | docs.infini-ai.com |
| 9 | 小米 MiMo | Token Plan（Lite/Standard/Pro/Max） | mimo.mi.com | platform.xiaomimimo.com/token-plan | mimo.mi.com/docs/price/token-plan |
| 10 | （观察） | 移动云 / 天翼云 / 快手 KwaiKAT / 超算互联网 / 优刻得 | — | — | — |

> 注：腾讯云 **CodeBuddy（IDE 插件，Free/Pro/Team/企业版）** 与 **WorkBuddy（桌面智能体）** 与 Token Plan 是不同的产品线，报告里已拆开，需分别核对。

---

## 1. 智谱 AI（GLM Coding Plan）

- **公司官网**：https://www.bigmodel.cn
- **套餐订阅页**：https://www.bigmodel.cn/glm-coding （含个人 3 档 Lite/Pro/Max + 连续包月/包季/包年；龙虾套餐 2 档 ¥39/¥99）
  - 团队版：https://www.bigmodel.cn/glm-coding（页面内切「团队套餐」）
- **文档中心**：https://docs.bigmodel.cn
  - 套餐概览（计价方式核心）：https://docs.bigmodel.cn/cn/coding-plan/overview
  - 老用户权益 / 改版公告（2026-07-30 改积分制）：https://docs.bigmodel.cn/cn/coding-plan/notice/usage-revision
  - 团队版权益：https://docs.bigmodel.cn/cn/coding-plan/team
  - FAQ（限购/余额不足等）：https://docs.bigmodel.cn/cn/coding-plan/faq
- **API 按量价（模型参考价用）**：https://open.bigmodel.cn/pricing

### 计价方式（重点）

- 2026-07-30 起改为**积分制**（Token 消耗折算积分）：`模型消耗积分 = (输入Token×输入系数 + 缓存命中Token×缓存系数 + 输出Token×输出系数) / 10000`
- 额度窗口：每 5 小时动态刷新 + 每周刷新；额度耗尽后不扣余额，等窗口恢复
- 2026-08-20 快照（年付折后月价）：Lite ¥94.4、Pro ¥430.4、Max ¥862.4；包季价更高；老用户 V1/V2 价格保留
- 高阶模型（GLM-5.2/GLM-5-Turbo）高峰期 3×、非高峰 2× 抵扣（限时福利：非高峰 1×，至 9 月底）

### 资源获取方式

1. **程序化（推荐）**：文档站是 Mintlify 构建，支持 `llms.txt` → 直接抓 **https://docs.bigmodel.cn/llms.txt**，得到全部文档 URL 清单（含 .md 源文件直链，如 `https://docs.bigmodel.cn/cn/coding-plan/overview.md`），价格/系数解析可直接读 markdown。
2. **订阅页价格**：`bigmodel.cn/glm-coding` 是 SSR/动态页，直接 `curl` 可拿到部分渲染内容；若拿不全，用无头浏览器（Playwright/Puppeteer）截取订阅档位区。
3. **人工核对要点**：连续包月/包季/包年三套价 × 3 档 = 9 个价格点；注意「特惠订阅」入口价与展示价的区别；需登录后才能看到龙虾套餐实时价。

---

## 2. 阿里云百炼（Model Studio / DashScope）

- **公司官网**：https://www.aliyun.com ✓200
- **订阅页**：https://www.aliyun.com/benefit/scene/tokenplan ✓200 —— ⚠️ 原 `/benefit/scene/codingplan` 已 301 重定向至此（Coding Plan 与 Token Plan 场景页合并）
  - 直接购买链路：https://common-buy.aliyun.com/token-plan/personal（需登录，跳转 login ✓200）
- **文档**：
  - 国内站模型计费（API 按量价，模型参考价用）：https://help.aliyun.com/zh/model-studio/model-pricing ✓200（原 `developer-reference/billing-for-tongyiqianwen` 已 301 重定向至此）
  - 计费模式总览：https://help.aliyun.com/zh/model-studio/product-billing ✓200
  - Coding Plan 说明（国际站中文文档，含套餐/额度）：https://www.alibabacloud.com/help/tc/model-studio/coding-plan ✓200
  - 开发者社区介绍文（含配置价格表，可作交叉验证）：https://developer.aliyun.com/article/1751053 ✓200

### 计价方式（重点）

- **Coding Plan（个人版）**：按**请求次数**计费，Lite 停售仅剩 Pro ¥200/月（9 万次请求/月；5 小时 6,000 次 / 周 45,000 次）；额度按 5 小时滚动、每周一、每月 1 日重置
- **Token Plan（2026 焕新，Credits 计量）**：个人版 Lite ¥39 / Standard ¥139 / Pro ¥499（月付；支持包季/包年）；企业版多档；Credits 按模型抵扣，含 Qwen3.8-Max、DeepSeek-V4-Pro、HappyHorse 等 + Harness 工具
- API 按量：qwen3.x 系列输入/输出分价，支持上下文缓存（命中按 10% 计费）、Batch 半价、阶梯计费

### 资源获取方式

1. **文档抓取**：help.aliyun.com 有 sitemap，文档页可直接 curl；推荐抓 `model-studio/model-pricing` 解析模型单价表。
2. **订阅页价格**：`aliyun.com/benefit/scene/tokenplan` 是活动页，动态渲染 + 登录态差异大（新用户首月 7.9/39.9 元），建议人工核对；自动化可用无头浏览器。
3. **人工核对要点**：区分「新用户首月价 / 次月续费价 / 常规价」三档；Coding Plan Lite 是否恢复售卖以页面为准（2026-03-20 起停新购）；**注意 Coding Plan 场景页已并入 Token Plan，报告需同步拆分口径**。

---

## 3. 火山引擎（字节跳动）· 方舟

- **公司官网**：https://www.volcengine.com ✓200
- **Coding Plan 订阅页**：https://www.volcengine.com/activity/codingplan ✓200 （另有活动页 https://www.volcengine.com/activity/newyear ✓200）
- **Agent Plan 订阅页**：https://www.volcengine.com/activity/agentplan ✓200
- **产品页**：https://www.volcengine.com/product/ark ✓200
- **文档**：
  - 方舟文档中心（模型价格/计费）：https://www.volcengine.com/docs/82379/ ✓200
  - 模型价格页（在线推理单价，模型参考价用）：https://docs.volcengine.com/docs/82379/1544106 ✓200（原 `/docs/82379/1099320` 已 301 重定向至 1544106，两页合并为「模型价格」）
  - Agent Plan 计费（AFP 燃料值/模型单元）：同上 1544106（含 Managed Agents 计费）
  - 包季/包年折扣活动：https://docs.volcengine.com/docs/82379/2479130 ✓200

### 计价方式（重点）

- **Coding Plan**：按请求次数，Lite ¥40/月（首月 8.9-9.9）、Pro ¥200/月（首月 49.9）；5 小时 1,200/6,000 次、周 9,000/45,000 次、月 18,000/90,000 次
- **Agent Plan**：四档 Small ¥40 / Medium ¥200 / Large ¥500 / Max ¥1000，按 **AFP（Agent 燃料值）** 计量，含多模态（Seedance/Seedream）+ Harness（联网搜索/Embedding）
- 包季/包年折扣活动：见 https://docs.volcengine.com/docs/82379/2479130

### 资源获取方式

1. **文档抓取**：docs.volcengine.com 支持直接 curl；计费页 HTML 含表格，易解析。
2. **订阅页**：activity 页动态渲染 + 限时折扣（如 2.5 折到 2026-08-07），**促销价变化极快**，必须人工核对并记录活动截止日期。
3. **人工核对要点**：Coding Plan 与 Agent Plan 是两条产品线、两种计量单位（次 vs AFP），报告里要分开；注意「刊例价 vs 限时价」。

---

## 4. MiniMax

- **公司官网**：https://platform.minimaxi.com （开放平台，即订阅入口）
- **Token Plan 订阅页**：https://platform.minimaxi.com/subscribe/token-plan
- **文档**：
  - 产品定价总览：https://platform.minimaxi.com/docs/pricing/overview
  - **按量计费（模型参考价用）**：https://platform.minimaxi.com/docs/guides/pricing-paygo
  - **Token Plan 订阅定价**：https://platform.minimaxi.com/docs/guides/pricing-token-plan
  - Token Plan 团队版：https://platform.minimaxi.com/docs/guides/pricing-token-plan-team
  - 国际站英文版：https://intl.minimaxi.com/docs/coding-plan/intro
- **公告/模型发布**：https://platform.minimaxi.com/docs/release-notes/models

### 计价方式（重点）

- **Token Plan**：三档 Plus ¥49 / Max ¥119 / Ultra ¥469（2026-03 升级后额度暴涨 4.5-6 倍，底层 M2.5/M2.1 → M3/M2.7）；月度 M3 用量约 6 亿/18 亿/55 亿 token
- 额度窗口：5 小时滚动 + 每周窗口；文本/图像/语音/音乐共享同一额度池；支持购买积分（¥30=4285 积分起）溢出兜底
- API 按量：M3 输入 ¥2.10（≤512k，五折后）/输出 ¥8.40/百万 tokens，缓存读取 ¥0.42；M2.7 输入 ¥2.1/输出 ¥8.4

### 资源获取方式

1. **程序化（推荐）**：文档站也是 Mintlify → **https://platform.minimaxi.com/docs/llms.txt** 可拿到全部文档 + .md 源文件直链，定价页直接解析 markdown 表格。
2. **订阅页**：`/subscribe/token-plan` 动态渲染，价格档位可用无头浏览器抓；积分包价格也在同一页。
3. **人工核对要点**：老用户套餐价格保留（与页面新价可能不同）；M3 五折活动可能随时结束。

---

## 5. 腾讯云

- **公司官网**：https://cloud.tencent.com ✓200
- **Token Plan 购买页**：https://cloud.tencent.com/act/pro/tokenplan ✓200
- **文档**：
  - **Token Plan 个人版套餐概览（核心计价文档）**：https://cloud.tencent.com/document/product/1823/130060 ✓200 —— ⚠️ 原 `/document/product/1772/129449` 已 301 重定向至此（Token Plan 文档从「知识引擎」迁至「TokenHub」产品线，产品 ID 1772→1823）
  - Token Plan 企业版：https://cloud.tencent.com/document/product/1823/ ✓200（PDF: main.qcloudimg.com/raw/document/product/pdf/1823_130657_cn.pdf）
  - 知识引擎原子能力 Token Plan 文档 PDF：https://main.qcloudimg.com/raw/document/product/pdf/1772_129432_cn.pdf ✓200
- **CodeBuddy（IDE 插件，另一产品线）**：https://cloud.tencent.com/product/acc ✓200 —— ⚠️ 原 `/product/codebuddy` 404 已修复；CodeBuddy 独立官网 https://www.codebuddy.cn
- **API 按量价（混元大模型，模型参考价用）**：https://cloud.tencent.com/document/product/1729/97731 ✓200

### 计价方式（重点）

- **通用 Token Plan 个人版**：Lite ¥39（3500 万 tokens/月）、Standard ¥99（1 亿）、Pro ¥299（3.2 亿）、Max ¥599（6.5 亿）
- **Hy Token Plan 个人版**（混元自研，更便宜）：Lite ¥28 / Standard ¥78 / Pro ¥238 / Max ¥468
- 统一规则：缓存命中/未命中/输出 Token 一律从套餐统一抵扣；不结转、不支持降配/退款；个人版仅 1 个 API Key
- 企业版：积分池制（100 积分=1 元），月预算 1000-20000 元，按模型单价实时扣减

### 资源获取方式

1. **文档抓取**：cloud.tencent.com/document 页面可 curl（HTML 含表格）；也有官方 PDF 直链（推荐抓 PDF，结构稳定）。
2. **订阅页**：act/pro/tokenplan 活动页动态渲染，登录后才显示完整价格，建议人工核对。
3. **人工核对要点**：通用版 vs Hy 版两套价格；模型下线时间（MiniMax-M2.5 2026-08-07 下线、Kimi-K2.5 2026-08-31 下线、Hy2.0/T1/TurboS 2026-06-22 下线）会影响报告模型列表，需从「可用模型」表格同步；可用模型动态更新，以购买页/控制台为准。

---

## 6. 百度智能云千帆

- **公司官网/控制台**：https://qianfan.cloud.baidu.com ✓200（302 → cloud.baidu.com/product-s/qianfan_home，正常） / 控制台：https://console.bce.baidu.com ✓200
- **Coding Plan 产品页**：https://cloud.baidu.com/product/codingplan.html ✓200
- **文档**：
  - **Coding Plan（核心计价文档）**：https://cloud.baidu.com/doc/qianfan/s/imlg0beiu ✓200
  - **Token 福利包（积分制计价文档）**：https://cloud.baidu.com/doc/qianfan/s/Smoghsq3g ✓200
  - **API 按量价（千帆模型计价，模型参考价用）**：https://cloud.baidu.com/doc/qianfan-docs/s/Jm8r1826a ✓200（「价格」文档；原泛链接 `/doc/qianfan/s/` 404 已修复）

### 计价方式（重点）

- **Coding Plan**：按请求次数，Lite ¥40/月（1.8 万次/月）、Pro ¥200/月（9 万次/月）；5 小时 1,200/6,000 次、周 9,000/45,000 次
- **Token 福利包**：积分制，50,000-800,000 积分 5 档（¥50-¥800，首购 9 折），按「每千 token 消耗积分」换算（如 DeepSeek-V4-Pro 输入 12 积分/千 token）
- **TPM 保障包**：按并发/吞吐保障计费（企业向）

### 资源获取方式

1. **文档抓取**：cloud.baidu.com/doc 文档页可直接 curl，HTML 含完整表格（Token 福利包的积分表非常适合程序解析）。
2. **订阅页**：cloud.baidu.com/product/codingplan.html 动态渲染 + 新用户秒杀（首购 7.9/39.9 元），人工核对。
3. **人工核对要点**：Coding Plan 与 Token 福利包是两套计量体系（次 vs 积分）；Token Plan 个人版（2026-07-13 新发布，Mini/Lite/Pro/Max 四档 ¥9.97-¥600）是否替代 Coding Plan 需持续观察。

---

## 7. 月之暗面（Kimi）· 国内版

- **公司官网**：https://www.moonshot.cn ✓200 / https://www.kimi.com ✓200
- **Kimi 会员/套餐页（含 Coding 额度）**：https://www.kimi.com/membership/pricing ✓200 —— ⚠️ 原 `kimi.com/me/pricing` 已失效（跳首页），已更新为新地址
- **API 开放平台**：https://platform.moonshot.cn（301 → https://platform.kimi.com，正常）
- **文档**：
  - 定价文档：https://platform.kimi.com/docs/pricing/chat-v1 ✓200（原 platform.moonshot.cn/docs/pricing/chat-v1 301 重定向至此）
  - 文档总览：https://platform.kimi.com/docs/overview ✓200

### 计价方式（重点）

- Kimi 的 Coding 是**会员体系内的权益**（不是独立 Coding Plan）：连续包月 Andante ¥39（原价 ¥49）/ Moderato ¥79（¥99）/ Allegretto ¥159（¥199）/ Allegro ¥559（¥699）；包年 ¥468-¥6708；仅支持 Kimi 自家模型（K2.5/K2.6/K3）
- API 按量：K3 输入 ¥20/输出 ¥100/百万 tokens（缓存命中 ¥2）；K2.7 Code 输入 ¥6.5/输出 ¥27
- 国际版（membership/pricing?lang=en）价格不同，报告中已单列「Moonshot AI（国际版）」——国外暂不处理，但注意**别把国际版价格混进国内版**

### 资源获取方式

1. **文档抓取**：platform.kimi.com 文档站支持 llms.txt（Mintlify）→ `https://platform.kimi.com/docs/llms.txt`。
2. **会员套餐页**：kimi.com/membership/pricing 需登录 + 动态渲染，人工核对为主；Kimi 会员体系含「Kimi Code 额度」子项，注意区分会员总价与 Coding 额度。
3. **人工核对要点**：国内版 vs 国际版（moonshotcn vs moonshotintl）两行数据不要串；连续包月价与按年价两套口径。

---

## 8. 无问芯穹（Infini-AI）· 补充收录

- **公司官网**：https://cloud.infini-ai.com ✓200
- **Coding Plan（GenStudio Infini 编码套餐）**：https://cloud.infini-ai.com/platform/ai ✓200
- **文档中心**：http://docs.infini-ai.com ✓200

### 计价方式（重点）

- 按**请求次数**计费（非 Token）：Lite ¥40/月（5 小时 1,000 次/周 6,000 次/月 12,000 次）、Pro ¥200/月（5,000/30,000/60,000 次）
- 多模型聚合（DeepSeek/MiniMax/Kimi/GLM），兼容 OpenAI + Anthropic 双协议，不设 RPM/TPM/TPD 限
- 注意：2026-08 曾现「售罄」状态，订阅页可能不可购，需人工确认

### 资源获取方式

1. 文档站 docs.infini-ai.com 可 curl（内容较简，以产品页为准）。
2. 订阅页在云控制台内，需登录，人工核对。

---

## 9. 小米（Xiaomi MiMo）

- **公司官网**：https://mimo.mi.com ✓200（开放平台：https://platform.xiaomimimo.com ✓200）
- **Token Plan 订阅页**：https://platform.xiaomimimo.com/token-plan ✓200
- **文档**：
  - **Token Plan 订阅说明（核心计价文档）**：https://mimo.mi.com/docs/price/token-plan ✓200
  - 发布公告（Token Plan 正式发布）：https://mimo.mi.com/docs/news/token-plan-release ✓200
- **接入文档（QuickStart 等）**：https://mimo.mi.com/docs/zh-CN/quick-start/summary/first-api-call

### 计价方式（重点）

- **Token Plan**：统一 **Credit 积分制**（按 Token 用量换算 Credit 消耗），四档月付 Lite ¥39 / Standard ¥99 / Pro ¥329 / Max ¥659（2026-05-26 升级后全档位 Credits 额度提升 5-8 倍，价格不变）
  - 快照（升级后）：Lite 4.1B / Standard 11B / Pro 38B / Max 82B Credits/月；包年 ≈ 月付×12 再 88 折
- **消耗倍率**：mimo-v2.5 按 1×、mimo-v2.5-pro 按 2×（超长上下文按 4×）；夜间（0:00-8:00 UTC+8）0.8× 消耗
- **无 5 小时/周限额**：支持集中消耗，不做滚动窗口限流（区别于大多数竞品）
- 支持模型：mimo-v2.5-pro / mimo-v2.5 / mimo-v2.5-asr / mimo-v2.5-tts（TTS 限时免费）等
- 优惠：首购 88 折、连续包年 88 折、新模型优先内测
- API 按量参考价（模型参考价用）：mimo-v2.5-pro 输入 $0.435/输出 $0.87 每百万 tokens（官网 API 文档）

### 资源获取方式

1. **文档抓取**：`mimo.mi.com/docs/*` 是 SPA（客户端渲染），**直接 curl 只能拿到 HTML 壳**，需无头浏览器（Playwright）或抓取页面内嵌的 JSON 数据；`/docs/llms.txt` 非标准 Mintlify（返回首页 HTML），不可用作目录端点。
2. **订阅页**：`platform.xiaomimimo.com/token-plan` 动态渲染，价格/额度档位可用无头浏览器抓；首购折扣、包年价需人工确认。
3. **人工核对要点**：米家产品线命名（Token Plan 官方名，非 Coding Plan）；额度单位是 Credits（不是 tokens），报告折算 tokensM 时需按倍率换算；2026-05-26 刚升级过额度，老资料上的 60M/200M/700M/1600M 数字已过时。

---

## 10. 观察清单（未收录，视运营需要扩展）

以下厂商国内有同类套餐，当前报告未收录，可在二期考虑：

| 厂商 | 套餐 | 订阅页/参考 |
|------|------|-------------|
| 移动云 | 大模型 Coding Plan（Lite ¥40/Pro ¥200，仅 MiniMax 系列） | 移动云官网活动页 |
| 天翼云 | Coding Plan（GLM 系列，¥49/¥149/¥469 曾售罄） | 天翼云官网 |
| 快手（万擎 StreamLake） | KwaiKAT Coding Plan（Mini ¥29 起） | https://www.streamlake.com/marketing/coding-plan ✓200 |
| 国家超算互联网 | Coding Plan（Lite ¥20 / Pro ¥100） | 超算互联网平台 |
| 优刻得 UCloud | 编程套餐（¥6.9 起，积分制） | UCloud 官网 |
| Cerebras（海外，暂不做） | — | — |

> 国外（Anthropic/OpenAI/Google/xAI/Cursor/GitHub Copilot/Windsurf/OpenCode/Kimi 国际版）本次不收录，如需二期可另建文件。

---

## 11. 持续更新工作流（建议）

### 11.1 更新频率
- **月度例行**：每月 1 日核对 8 家订阅页价格快照 + 文档页「最近更新时间」。
- **事件驱动**：收到改版公告（如智谱积分制改版、腾讯模型下线、阿里场景页合并）立即核对。
- **每次报告发布前**：全量过一遍「人工核对要点」。

### 11.2 可自动化部分
1. **llms.txt 拉取**（智谱 / MiniMax / Kimi）：`curl https://docs.bigmodel.cn/llms.txt` 等 → 提取 `.md` 直链 → 解析定价表格，用于**计价方式变更告警**（对比哈希）。小米 MiMo 无标准 llms.txt，需另行处理。
2. **文档页抓取**（阿里 help.aliyun.com / 火山 docs.volcengine.com / 腾讯 document / 百度 doc.qianfan）：定期 curl + 解析 HTML 表格，存 JSON 快照，diff 检测价格变动。
3. **订阅页快照**：无头浏览器（Playwright）对 8 个订阅页截图 + 提取价格节点，存档比对（因登录态/防爬，建议半自动 + 人工复核）。

### 11.3 必须人工确认的字段（半自动无法替代）
- 促销价有效期（新用户首月价、限时折扣截止日期）
- 售罄/停售状态（Lite 停售、无问芯穹售罄等）
- 双产品线拆分（腾讯 Token Plan vs CodeBuddy；火山 Coding vs Agent；阿里 Coding Plan vs Token Plan；百度 Coding vs Token 福利包；小米 Token Plan 单线）
- 模型下线上线时间（影响报告的模型列表与强模型集合）

### 11.4 数据入库字段映射（对应 coding-plan-report.html 的 `companies[]`）
| 报告字段 | 来源 |
|----------|------|
| `name` / `product` | 官网 + 订阅页 |
| `url` | 订阅页（非官网首页，用户点「订阅↗」跳转用） |
| `plans[].price` | 订阅页常规价（**用常规价，不用新用户首月价**；促销价记入 `promo`） |
| `plans[].annual` | 连续包年折后月价 |
| `plans[].tokensM` | 月 token 额度换算（次/积分制厂商按官方换算口径折算） |
| `plans[].models[].consumptionRate` | 计价文档中的抵扣系数/倍率（如智谱高峰 3×、MiniMax highspeed 2×、MiMo v2.5-pro 2×） |
| `apiRefs[]` | 各家「API 按量价」文档（上表已标注） |

---

## 附：验证过的程序化端点（2026-08-20 curl 全部 ✓200）

```
https://docs.bigmodel.cn/llms.txt                                      # 智谱文档站全目录（Mintlify，含 .md 直链）
https://platform.minimaxi.com/docs/llms.txt                            # MiniMax 文档站全目录
https://platform.kimi.com/docs/llms.txt                                # Kimi 文档站全目录
https://help.aliyun.com/zh/model-studio/model-pricing                  # 阿里模型计费页（原 billing-for-tongyiqianwen 已迁移）
https://docs.volcengine.com/docs/82379/1544106                         # 火山模型价格页（原 1099320 已合并）
https://cloud.tencent.com/document/product/1823/130060                 # 腾讯 Token Plan 个人版概览（原 1772/129449 已迁移）
https://cloud.baidu.com/doc/qianfan-docs/s/Jm8r1826a                   # 百度千帆价格文档
https://cloud.baidu.com/doc/qianfan/s/Smoghsq3g                        # 百度 Token 福利包积分表
https://main.qcloudimg.com/raw/document/product/pdf/1772_129432_cn.pdf # 腾讯 Token Plan PDF
https://mimo.mi.com/docs/price/token-plan                              # 小米 MiMo Token Plan 订阅说明（SPA，需无头浏览器）
```

### 2026-08-20 链接核对记录（本次修正项）

| 链接 | 原状态 | 处理 |
|------|--------|------|
| aliyun.com/benefit/scene/codingplan | 301 → /benefit/scene/tokenplan | 已更新为 tokenplan（场景页合并） |
| help.aliyun.com/.../billing-for-tongyiqianwen | 301 → /model-studio/model-pricing | 已更新 |
| volcengine.com/docs/82379/1099320 | 301 → 1544106 | 已更新（两页合并） |
| cloud.tencent.com/document/product/1772/129449 | 301 → 1823/130060 | 已更新（迁至 TokenHub） |
| cloud.tencent.com/product/codebuddy | **404** | 已改为 /product/acc（CodeBuddy 产品页） |
| kimi.com/me/pricing | **失效（跳首页）** | 已改为 kimi.com/membership/pricing |
| cloud.baidu.com/doc/qianfan/s/（泛链接） | **404** | 已改为具体价格文档 qianfan-docs/s/Jm8r1826a |
| platform.moonshot.cn/docs/pricing/chat-v1 | 301 → platform.kimi.com | 已更新 |
| intl.minimaxi.com/docs/coding-plan/intro | 301 → platform.minimax.io/docs/token-plan/intro | 保留（国际站域名迁移，仍可达） |
| 其余 45 条链接 | ✓200 | 无需改动 |
