#!/usr/bin/env node
/*
 * 回归冒烟测试：在 mock 的 DOM 环境下运行 coding-plan-report.html 的主脚本，
 * 验证渲染路径不崩溃、无 NaN / Infinity / undefined 泄漏、排名严格升序、
 * 各页数据完整，并对已知口径做回归断言（防复发）。
 *
 * 用法：node test/smoke.js
 * 退出码：0 = 通过；非 0 = 有断言失败（会在 stderr 打印原因）。
 *
 * 原理：用 node 内置 vm 模块，把主 <script> 提取出来，配合一个最小 DOM stub
 * （getElementById / querySelector / querySelectorAll / classList / style / addEventListener）
 * 跑通 renderStats / applyRegion / renderRank / renderCompaniesAll / modelList 等全部
 * 顶层渲染调用，再从渲染出的 innerHTML 里抽取断言。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'coding-plan-report.html');

function fail(msg){ throw new Error(msg); }
const assert = (cond, msg) => { if(!cond) fail('\x1b[31m断言失败\x1b[0m: ' + msg); };

/* ---------- 从 HTML 里提取主脚本（含 `const companies` 的那一段）---------- */
const html = fs.readFileSync(REPORT, 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let main = blocks.find(b => b.indexOf('const companies') >= 0);
assert(!!main, '未在主 HTML 中找到数据主脚本（含 const companies）');

/* 追加一段，用 vm 上下文全局暴露内部状态，供下方断言使用。
   放在脚本末尾同一次 evaluate 内，因此能访问其作用域里的 const/function。 */
main += `
;globalThis.__smoke = {
  companies, allPlans, planCost, modelMap, apiMap,
  cacheBoost, effTokensM, planDiscCNY,
  integrityCheck
};
`;

/* ---------- DOM stub ---------- */
function makeEl(id){
  const cls = new Set();
  const api = {
    id, innerHTML:'', textContent:'', value:'',
    style:{}, dataset:{},
    classList:{
      add:(c)=>cls.add(c),
      remove:(c)=>cls.delete(c),
      toggle:(c,fn)=>{ const on = fn===undefined ? !cls.has(c) : !!fn; on ? cls.add(c) : cls.delete(c); return on; },
      contains:(c)=>cls.has(c),
    },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    addEventListener(){}, removeEventListener(){},
    scrollIntoView(){},
    appendChild(){},
    insertAdjacentHTML(){},
    querySelector: () => stub(), querySelectorAll: () => [],
    getElementsByClassName: () => [],
    __cls: cls,
  };
  return api;
}
function stub(){ return makeEl('__stub__'); }
const els = new Map();
function el(id){ if(!els.has(id)) els.set(id, makeEl(id)); return els.get(id); }

const documentStub = {
  documentElement: makeEl('html'),
  body: makeEl('body'),
  getElementById: id => el(id),
  querySelector: sel => (sel === '#rankTable tbody') ? el('__rankTbody__') : stub(),
  querySelectorAll: () => [],
  addEventListener(){},
};
const windowStub = {
  matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} }),
};
const localStorageStub = {
  _d:{},
  getItem(k){ return k in this._d ? this._d[k] : null; },
  setItem(k,v){ this._d[k] = String(v); },
  removeItem(k){ delete this._d[k]; },
};

const sandbox = {
  console,                       // 保留 console.warn 输出（完整性自检）
  document: documentStub,
  window: windowStub,
  localStorage: localStorageStub,
  CSS: { escape: s => s },       // 模型名实测无需转义，够用
  Math, JSON, parseFloat, Number, String, Object, Array, Set, Infinity, NaN,
};
sandbox.globalThis = sandbox;

/* ---------- 跑起来 ---------- */
vm.createContext(sandbox);
vm.runInContext(main, sandbox, { filename: 'inline-report-script.js' });

const S = sandbox.__smoke;
assert(S && S.companies && S.allPlans && S.planCost, '主脚本未正常执行完成（缺 __smoke 暴露）');

const noBad = s => !/NaN|Infinity|undefined|\+\+ ?/u.test(s);

/* ---------- 断言 1：统计卡 ---------- */
const statHtml = el('statStrip').innerHTML;
assert((statHtml.match(/class="stat"/g) || []).length === 6, '统计卡应恰好 6 个，实际 ' + (statHtml.match(/class="stat"/g)||[]).length);
assert(noBad(statHtml), '统计卡 HTML 含 NaN/Infinity/undefined');

/* ---------- 断言 2：排名表 ---------- */
const rankHtml = el('__rankTbody__').innerHTML;
assert(noBad(rankHtml), '排名表 tbody 含 NaN/Infinity/undefined');
const rankRows = (rankHtml.match(/<tr/g) || []).length;
assert(rankRows === S.allPlans.length,
  '排名行数应为 allPlans 长度(' + S.allPlans.length + ')，实际 ' + rankRows);

/* 排名严格升序：从成本单元格抽数值（class="cost" 或 "cost cheap"） */
const costs = [...rankHtml.matchAll(/<td class="cost[^"]*">([^<]+)<\/td>/g)]
  .map(m => parseFloat(m[1]));
const nums = costs.filter(Number.isFinite);
assert(nums.length === rankRows, '应能从每行抽出成本数值，行数 ' + rankRows + '，实际 ' + nums.length);
for(let i = 1;i < nums.length;i++){
  if(nums[i-1] > nums[i]) fail('排名非升序：第 ' + (i) + ' 行 ' + nums[i-1] + ' > 第 ' + (i+1) + ' 行 ' + nums[i]);
}

/* ---------- 断言 3：公司卡片 ---------- */
const intlHtml = el('intlCompanies').innerHTML;
const cnHtml   = el('cnCompanies').innerHTML;
assert(noBad(intlHtml + cnHtml), '公司卡片 HTML 含 NaN/Infinity/undefined');
const corpCards = (intlHtml + cnHtml).match(/class="card"/g) || [];
assert(corpCards.length === S.companies.length,
  '公司卡片数应为厂商数(' + S.companies.length + ')，实际 ' + corpCards.length);
S.companies.forEach(c => {
  const inIntl = c.region === 'intl';
  assert((inIntl ? intlHtml : cnHtml).indexOf('card-' + c.id) >= 0, '缺少公司卡片 #card-' + c.id + ' (' + c.name + ')');
});
/* 每个套餐都应渲染出 plan-row（含免费/按量档，它们在排行被排除但仍展示） */
S.companies.forEach(c => {
  c.plans.forEach(p => {
    assert((intlHtml + cnHtml).indexOf('data-pname="' + p.name + '"') >= 0,
      '公司卡缺失套餐行 data-pname="' + p.name + '" @ ' + c.name);
  });
});

/* ---------- 断言 4：模型查询所有 (套餐,模型) 组合 cost 有限 ---------- */
let badPairs = 0;
Object.keys(S.modelMap).forEach(n => S.modelMap[n].forEach(e => {
  const eff = e.m.r > 0 ? S.effTokensM(e.plan) / e.m.r : Infinity;
  const cost = e.m.r > 0 ? S.planDiscCNY(e.plan) / eff : 0;
  if(!Number.isFinite(cost)) badPairs++;
}));
assert(badPairs === 0, '模型查询存在 ' + badPairs + ' 个非有限折合价组合');
assert((el('modelList').innerHTML.match(/class="mchip"/g) || []).length === Object.keys(S.modelMap).length,
  '模型列表按钮数与 modelMap key 数不一致');

/* ---------- 断言 5：GLM 季卡/年卡字段回归（防 annualMonthly/quarterlyMonthly 错位复发） ---------- */
const glmLite = S.allPlans.find(p => p.company.id === 'zhipu' && p.name === 'GLM Lite');
assert(!!glmLite, '未找到 GLM Lite（可能改了名字）');
assert(glmLite.annualMonthly === 94.4, 'GLM Lite annualMonthly 应为 94.4（连续包年月均），实际 ' + glmLite.annualMonthly);
assert(glmLite.quarterlyMonthly === 118.0, 'GLM Lite quarterlyMonthly 应为 118（连续包季月均），实际 ' + glmLite.quarterlyMonthly);
assert(glmLite.price === 94.4, 'GLM Lite price 应保持 94.4');

/* ---------- 断言 6：完整性自检结果合理 ---------- */
assert(typeof S.integrityCheck === 'function', 'integrityCheck 应暴露为函数');
/* 主脚本加载时已执行 integrityCheck() 并把结果存到 window.__reportIntegrity；直接用，避免重复警告 */
const integrity = (windowStub.__reportIntegrity || []);
assert(Array.isArray(integrity), 'window.__reportIntegrity 应为数组');
/* 已知"需核对"集合应只含工具/免费/多模态等无 token 牌价模型，不应包含纯 LLM 旗舰 */
const knownBenign = ['SWE-1.5','Seedream','Seamless','联网搜索','全模型可选','Auto'];
const unexpected = integrity.filter(m => !knownBenign.some(k => m.indexOf(k) >= 0));
assert(unexpected.length === 0, '完整性自检出现预期外待核对模型：' + unexpected.join('；'));

/* ---------- 汇总输出 ---------- */
console.log([
  '\x1b[32m✓ 冒烟通过\x1b[0m',
  '  厂商=' + S.companies.length + ' · 排名档=' + S.allPlans.length,
  '  排名升序=' + nums.length + ' 行 · 公司卡=' + corpCards.length + ' · 模型=' + Object.keys(S.modelMap).length,
  '  完整性自检待核对=' + integrity.length + '（工具/免费/多模态可忽略）',
].join('\n'));