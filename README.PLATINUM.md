# atlasapi 白金奢华版 — UI 定制计划书

| | |
| --- | --- |
| **文档版本** | v1.4（完整版） |
| **日期** | 2026-08-23 |
| **状态** | 已实施并通过全部验证 |
| **适用范围** | 本仓库（atlasapi，基于上游 new-api / QuantumNous 的 fork） |
| **改动范围** | 仅前端 `web/`（主题与功能封闭 + 全站白金奢华主题 + 落地页 + i18n + 本文档），后端 Go 代码零改动；系统名经 `SystemName` 选项设为 atlas API |

> 本计划书描述并记录三项定制的完整生命周期：
>
> 1. **全站白金奢华主题（Platinum Luxe）**——暖铂金白画布、暖白面板、墨色文字、香槟金唯一强调色；暗色模式为「暗金」体系
> 2. **白金奢华落地页**——UNFDS 式编辑排版 + 高级动效（见 5.4）
> 3. **功能精简（封闭）**——通过单一配置文件硬关闭 11 项非核心功能，逐项可恢复

---

## 目录

- [一、项目背景与目标](#一项目背景与目标)
- [二、需求分析](#二需求分析)
- [三、设计规范（白金商务风）](#三设计规范白金商务风)
- [四、功能封闭方案](#四功能封闭方案)
- [五、精简后的界面结构](#五精简后的界面结构)
- [六、实施方案与里程碑](#六实施方案与里程碑)
- [七、验证与验收](#七验证与验收)
- [八、风险管理](#八风险管理)
- [九、回滚与恢复方案](#九回滚与恢复方案)
- [十、后续规划路线图](#十后续规划路线图)
- [十一、构建与部署](#十一构建与部署)
- [十二、FAQ 常见问题](#十二faq-常见问题)
- [附录A 术语表](#附录a-术语表)
- [附录B 变更记录](#附录b-变更记录)

---

## 一、项目背景与目标

### 1.1 背景

上游 new-api 是面向公网运营的 LLM 网关产品，界面默认包含大量运营向功能：模型消费排行榜、
邀请返利、在线支付充值、每日签到、外部聊天入口、订阅购买等。对于**企业内部 / 商务部署**
场景，这些功能既不需要，也会让界面显得冗杂、增加使用者的理解成本；同时原版的亮天蓝 +
大圆角视觉风格偏消费级产品，与企业平台的稳健气质不符。

### 1.2 目标

| # | 目标 | 衡量方式 |
| --- | --- | --- |
| G1 | 全站切换为白金商务风：白底、暖白面板、单一香槟金点缀 | 全部颜色由 `theme.css` 设计令牌驱动，组件层零改动 |
| G2 | 首屏即浅色商务风，全站配色统一 | 默认主题 `light`；移除用户可选的 9 套彩色预设 |
| G3 | 封闭 10 项非核心功能，入口与直达 URL 一并封闭 | 导航、卡片、Tab、路由守卫四层接线 |
| G4 | 封闭与恢复必须低成本、集中管理 | 单文件 `features.ts` 布尔开关，改回 `true` 即完全恢复 |
| G5 | 不破坏任何既有能力与项目政策 | 类型检查 / Lint / 单测 / 构建全绿；品牌署名零改动 |
| G6 | 后端与数据库零影响 | 不触碰 Go 代码、SQL、计费逻辑 |

---

## 二、需求分析

### 2.1 判定标准

一项功能被判定为「非核心」需同时满足：**不参与网关主链路**（密钥分发 → API 转发 → 用量
统计 → 额度管理），且**面向公网运营/消费者场景**而非企业内部管理。

### 2.2 功能审计与取舍依据

| 功能 | 类别 | 取舍依据 | 决定 |
| --- | --- | --- | --- |
| 排行榜（/rankings） | 营销 | 模型消费排行是公网站点的竞争性展示，企业内部无意义 | 封闭 |
| 模型广场（/pricing） | 营销/信息 | 面向访客的价格橱窗；内部模型清单可在管理端查看 | 封闭 |
| Playground 试用场 | 演示 | 面向潜在客户的体验入口；内部调试可用 API 客户端 | 封闭 |
| 外部聊天链接（Chats） | 运营导流 | 跳转到第三方站点的推广入口 | 封闭 |
| 在线充值（支付表单） | 支付 | 企业额度由管理员分配或发放兑换码，不走在线支付 | 封闭（保留兑换码） |
| 邀请返利 | 增长营销 | 拉新返利属公网运营玩法 | 封闭 |
| 每日签到 | 留存运营 | 消费级互动玩法 | 封闭 |
| 订阅购买 | 支付 | 依赖在线支付体系 | 封闭 |
| 绘图日志（Midjourney 类） | 消费功能 | 面向图像生成消费者，企业场景极少使用 | 封闭 |
| 任务日志（视频/音频） | 消费功能 | 面向视频/音频任务消费者；通用日志已覆盖调用审计 | 封闭 |
| 文档入口（顶栏 Docs + 页脚 Docs 栏目） | 信息 | 企业内网部署无需公开文档入口；管理员可在「系统设置 → 站点」配置 `docs_link` 指向内部文档 | 封闭（**新增 `docs` 开关**） |
| 营销落地页（Hero/Stats/Features/HowItWorks/CTA） | 营销 | 未配置自定义首页时 `/` 渲染五段产品宣传页，观感偏消费级官网；管理员自定义 `HomePageContent` 不受影响 | 简化为商务首页（**已实施，见 5.4**） |

### 2.3 保留功能（核心链路）

控制台总览 / 数据仪表盘、API 密钥管理、通用使用日志、钱包（余额、**兑换码兑换**、订单
记录）、个人中心（资料、安全、登录会话、Passkey、两步验证、语言偏好、侧栏偏好），以及
完整管理端（渠道、模型、用户、兑换码、系统信息〔仅超级管理员〕、系统设置）。

> 兑换码是特意保留的：它是企业内向成员分配额度的标准方式（管理端「兑换码」页面生成，
> 成员在钱包兑换），不依赖任何在线支付通道。

---

## 三、设计规范（白金商务风）

### 3.1 设计原则

```
铂银画布（页面底） ──衬托──▶ 暖白面板（卡片/侧栏/弹层）
        │
炭黑文字（微蓝倾向）保证可读性与层级
        │
香槟金作为唯一强调色：主按钮 / 链接 / 选中态 / 焦点环 / 图表主色
        │
清晰冷灰边框分割区域；小圆角（10px）收敛视觉活泼感
```

- **单一强调色原则**：全站只有香槟金一个交互色，状态色（红/绿/琥珀）仅用于语义提示；
- **层次靠明度而非投影**：画布 #f6f7f9 与卡片 #ffffff 仅差一档明度，配合 1px 边框形成
  克制的层次感；
- **组件层零改动**：所有颜色通过 `web/src/styles/theme.css` 的 CSS 设计令牌下发，改令牌
  即全局生效，不触碰任何组件代码。

### 3.2 完整色值对照表（浅色模式）

| 令牌 | OKLCH | HEX（换算） | 用途 |
| --- | --- | --- | --- |
| `--background` | `oklch(0.968 0.007 90)` | `#f6f4ef` | 页面画布（铂银白） |
| `--card` / `--popover` | `oklch(0.99 0.004 90)` | `#fdfcf9` | 卡片、弹层、下拉菜单 |
| `--foreground` | `oklch(0.19 0.008 85)` | `#151410` | 正文文字（炭黑） |
| `--card-foreground` | `oklch(0.19 0.008 85)` | `#151410` | 卡片文字 |
| `--primary` | `oklch(0.67 0.105 85)` | `#b39042` | 主色：香槟金 |
| `--primary-foreground` | `oklch(0.15 0.01 85)` | `#0d0b07` | 主色上的文字 |
| `--secondary` | `oklch(0.943 0.012 90)` | `#efece3` | 次级按钮底色（铂银灰） |
| `--secondary-foreground` | `oklch(0.4 0.06 75)` | `#5b4320` | 次级按钮文字 |
| `--muted` | `oklch(0.953 0.009 90)` | `#f2efe9` | 弱化底色 |
| `--muted-foreground` | `oklch(0.5 0.022 85)` | `#696355` | 弱化文字 |
| `--accent` | `primary 10% 混画布`（自动派生） | — | 悬停/激活轻染底 |
| `--accent-foreground` | `oklch(0.38 0.07 78)` | `#573d0f` | 激活态文字 |
| `--border` / `--input` | `oklch(0.893 0.011 88)` | `#dfdbd4` | 边框、输入框描边 |
| `--ring` | `oklch(0.71 0.09 85)` | `#bb9d5d` | 键盘焦点环 |
| `--sidebar` | `oklch(0.99 0.004 90)` | `#fdfcf9` | 侧栏底色（纯白） |
| `--sidebar-foreground` | `oklch(0.26 0.01 85)` | `#26241f` | 侧栏文字 |
| `--sidebar-accent` | `primary 8% 混白`（自动派生） | — | 侧栏菜单激活底色 |
| `--sidebar-accent-foreground` | `oklch(0.38 0.07 78)` | `#573d0f` | 侧栏激活文字 |
| `--skeleton-base` | `oklch(0.955 0.003 255)` | `#eff0f2` | 加载骨架底色 |
| `--skeleton-highlight` | `oklch(0.975 0.002 255)` | `#f0eee8` | 加载骨架高光 |
| `--info` | `oklch(0.55 0.12 250)` | `#3275b4` | 信息提示色 |
| `--neutral` | `oklch(0.708 0.004 255)` | `#9fa1a3` | 中性色 |
| `--chart-1` | `oklch(0.67 0.105 85)` | `#b39042` | 图表：香槟金（主） |
| `--chart-2` | `oklch(0.5 0.08 62)` | `#845830` | 图表：钢青 |
| `--chart-3` | `oklch(0.56 0.06 135)` | `#657d59` | 图表：靛灰 |
| `--chart-4` | `oklch(0.6 0.015 88)` | `#848076` | 图表：银灰 |
| `--chart-5` | `oklch(0.45 0.075 255)` | `#38577e` | 图表：灰绿 |

状态色沿用行业惯例：`--destructive` 红、`--success` 绿、`--warning` 琥珀。
表格表头、禁用行等由 `--foreground` 与 `--background` 的 `color-mix()` 自动派生，无需单独调色。

### 3.3 暗色模式对照（保留可用）

| 令牌 | OKLCH | HEX（换算） |
| --- | --- | --- |
| `--primary` | `oklch(0.75 0.095 88)` | `#c7ab65` |
| `--background` | `oklch(0.155 0.006 85)` | `#0d0c09` |
| `--card` | `oklch(0.205 0.008 85)` | `#191713` |
| `--sidebar` | `oklch(0.14 0.006 85)` | `#0a0907` |

暗色模式设计策略：**保留可用、主色同色相**。亮香槟金 `#c7ab65` 与浅色主色同在 262°
色相上，图表色、侧栏点缀色同步派生，用户手动切换后品牌感不漂移。

### 3.4 字体、圆角与密度

| 项 | 值 | 说明 |
| --- | --- | --- |
| 正文字体 | Public Sans（`--font-sans`） | 自托管可变字体，天然商务无衬线，保持不变 |
| 衬线轴 | Lora + CJK 宋体栈 | 外观抽屉中仍可切换（Serif 模式） |
| 全局圆角 | `--radius: 0.625rem`（10px） | 原为 1rem；更干练的商务感 |
| 密度/布局 | 用户可在抽屉中调节 | 密度、侧栏形态、内容宽度均保留可调 |

### 3.5 默认主题与外观抽屉精简

- `web/src/context/theme-provider.tsx`：`DEFAULT_THEME` 由 `'system'` 改为 `'light'`——
  新访客首屏即白金商务风；
- `web/src/components/config-drawer.tsx`：**移除「色彩预设」选择器**。原 9 套彩色主题
  （Anthropic、Rose Garden、Sunset Glow 等）与商务统一形象冲突；保留明暗切换、字体、
  圆角、密度、侧栏形态、内容布局、文字方向等偏好设置。

---

## 四、功能封闭方案

### 4.1 控制文件

唯一控制文件：**`web/src/config/features.ts`**

```ts
export const featureConfig: Record<FeatureKey, boolean> = {
  rankings: false,      // 排行榜
  pricing: false,       // 模型广场（模型价格页）
  playground: false,    // API 试用场
  chatPresets: false,   // 外部聊天链接
  onlineTopup: false,   // 在线充值（支付表单）
  referral: false,      // 邀请返利
  checkin: false,       // 每日签到
  subscriptions: false, // 订阅购买
  drawingLogs: false,   // 绘图日志
  taskLogs: false,      // 任务日志（视频/音频）
  marketingHome: false, // 营销落地页（改为商务落地页）
  docs: false,          // 文档入口（顶栏 Docs + 页脚 Docs 栏目）
}
```

### 4.2 封闭范围（四层接线）

| 开关 | 导航入口 | 页面元素 | 直达 URL 行为 |
| --- | --- | --- | --- |
| `docs` | 顶栏「文档」入口消失 | 页脚「文档」整栏消失 | —（非路由页面，由后端 `docs_link` 配置驱动） |
| `rankings` | 顶栏「排行榜」消失 | — | `/rankings` → 重定向 `/` |
| `pricing` | 顶栏「模型广场」消失 | — | `/pricing`、`/pricing/:modelId` → 重定向 `/` |
| `playground` | 侧栏「试用场」消失 | — | `/playground` → 重定向 `/dashboard` |
| `chatPresets` | 侧栏「聊天」外链分组消失 | — | —（外链由 `Chats` 配置驱动，入口消失即不可达） |
| `onlineTopup` | — | 钱包中金额预设、自定义金额、支付方式、Creem 商品区全部隐藏 | —（支付 API 后端另有凭证+合规门槛） |
| `referral` | — | 钱包「邀请奖励」卡片消失 | — |
| `checkin` | — | 个人中心签到日历消失 | — |
| `subscriptions` | 侧栏管理端「订阅」入口消失 | 钱包订阅套餐卡片消失 | `/subscriptions` → 重定向 `/dashboard` |
| `drawingLogs` | 任务日志入口不再含绘图 | 日志页 Tab 无「绘图日志」 | `/usage-logs/drawing` → 重定向 `/usage-logs/common` |
| `taskLogs` | 侧栏「任务日志」入口消失 | 日志页仅剩「通用日志」 | `/usage-logs/task` → 重定向 `/usage-logs/common` |

### 4.3 与后台运行时开关的优先级

后台「系统设置 → 站点」存在运行时开关（`HeaderNavModules`、`SidebarModulesAdmin`，
以 JSON 存于数据库 options 表）。二者关系：

```
features.ts 硬关闭（false）  >  后台运行时开关  >  默认开启
```

- `features.ts` 为 `false`：功能彻底消失，后台开关无效；
- `features.ts` 为 `true`：恢复上游行为，可再由后台开关按需细粒度控制（含按用户覆盖）。

---

## 五、精简后的界面结构

### 5.1 导航树

```
顶部导航（公开页）        首页 · 控制台 · 文档 · 关于
                          （模型广场、排行榜入口已移除）

侧栏（登录后）
├─ 通用
│   ├─ 总览            /dashboard/overview
│   ├─ 仪表盘          /dashboard/models
│   ├─ API 密钥        /keys
│   └─ 使用日志        /usage-logs/common
├─ 个人
│   ├─ 钱包            /wallet        （余额 + 兑换码 + 订单记录）
│   └─ 个人中心        /profile
└─ 管理（仅管理员可见）
    ├─ 渠道 / 模型 / 用户 / 兑换码
    ├─ 系统信息（仅超级管理员）
    └─ 系统设置
```

原「聊天」分组（试用场 + 外部聊天）在默认配置下整体消失；管理分组中「订阅」入口消失。

### 5.2 控制台线框

```
┌──────────────────────────────────────────────────────┐
│ ◆ 系统名      首页  控制台  文档  关于        🔔  👤   │ ← 顶栏（无模型广场/排行榜）
├───────────┬──────────────────────────────────────────┤
│ 总览      │  铂银画布 #f6f7f9                         │
│ 仪表盘    │  ┌─ 纯白卡片 #ffffff ─────────────────┐   │
│ API 密钥  │  │  [香槟金主按钮 #335aa6]  [银灰次级]  │   │
│ 使用日志  │  │  文字 #14171c · 边框 #dee0e3        │   │
│ ─────    │  └─────────────────────────────────────┘   │
│ 钱包      │  ┌─ 仪表盘图表：蓝/青/靛/银/绿 ─────────┐   │
│ 个人中心  │  └─────────────────────────────────────┘   │
│ ─────    │                                            │
│ 管理 ⚙   │  （管理员额外可见：渠道/模型/用户/兑换码/    │
│           │   系统信息/系统设置）                       │
└───────────┴──────────────────────────────────────────┘
     ↑ 白色侧栏 + 1px 右边框，激活项香槟金轻染
```

### 5.3 钱包页（封闭后）

```
┌─ 余额统计卡 ──────────────────────────────┐
├─ 添加额度 ────────────────────────────────┤
│ ✗ 金额预设 / 自定义金额 / 支付方式   (onlineTopup=false) │
│ ✗ Creem 商品区                      (onlineTopup=false) │
│ ✓ 兑换码兑换：输入框 + [兑换] 按钮              │
│ ✓ 订单记录（右上角入口）                       │
├─ ✗ 订阅套餐卡                       (subscriptions=false) │
└─ ✗ 邀请返利卡                        (referral=false) │
```

### 5.4 首页（落地页）—— 白金奢华编辑式【已实施】

**渲染优先级（自上而下）：**

1. **管理员配置了 `HomePageContent` 选项** → 管理员内容优先：URL → 沙箱 iframe
  （自动同步明暗与语言偏好）；HTML → 隔离富文本；Markdown → 富文本排版。
   **企业当前即可用此选项自定义首页，无需改任何代码。**
2. **未配置且 `marketingHome: true`** → 原版五段营销落地页（Hero/Stats/Features/HowItWorks/CTA）
3. **未配置且 `marketingHome: false`（默认）** → **白金奢华编辑式落地页**（本节）

**设计参照与主题：** 参考 unfds.com 的暗色编辑排版式奢华——暖黑墨色画布、衬线大字、
等宽字微标签、编号分节、克制文案；动效主题为「光走过铂金」。
开关为 `features.ts` 第 11 项 `marketingHome`（改回 `true` 并重新构建即恢复营销页）。

**版式结构（单屏编辑式构图）：**

```
┌──────────────────────────────────────────────┐
│ （环境层：金色流线 canvas，随鼠标视差流动）      │
│                                              │
│         [ LOGO ]  ENTERPRISE AI GATEWAY      │ ← 等宽字微标签
│                                              │
│               { 系 统 名 }                   │ ← 衬线大字 clamp(3–5.25rem)
│    统一 AI 网关：一把钥匙访问全部模型，         │ ← 衬线斜体副题
│    并提供用量分析与额度管理                    │
│                                              │
│       [ 开始使用 → ]   [ 登录 ]               │ ← 磁吸按钮（登录态为「前往仪表板」）
│    ────────•─────────────────                │ ← 香槟发丝线 + 流光珠
│    01  统一接入   一把密钥，全部模型，一个标准 API │
│    02  用量分析   实时洞察消耗、成本与趋势        │ ← 编号支柱行
│    03  额度管控   为团队提供细粒度的额度与权限管理 │
│                                              │
│    （签名时刻：香槟光带周期性扫过整个构图）       │
└──────────────────────────────────────────────┘
```

**动效清单（全部 GPU 属性 + `prefers-reduced-motion` 回退）：**

| 动效 | 类型 | 实现位置 |
| --- | --- | --- |
| 错峰入场：模糊上浮 + 指数缓出，逐级延迟 | 编排 | `index.css` `landing-animate-fade-up` |
| 香槟光带扫过构图（overlay 混合，掠过标题与 CTA） | **签名时刻** | `platinum.css` `.platinum-glint` |
| 金色流线 canvas：13 条双层正弦线 + 鼠标视差，离屏/后台暂停，减弱动效渲染单帧 | 环境 | `wave-canvas.tsx` |
| 暖香槟光晕缓慢漂移 | 环境 | `index.css` `animate-drift-b` |
| 发丝线自绘（scaleX）+ 流光珠沿线往返 | 揭示 | `index.css` `animate-hairline-x` / `animate-line-shine` |
| CTA 磁吸跟随光标（transform 直写绕过 React 状态；触屏/减弱动效禁用） | 反馈 | `use-magnetic.ts` + `magnetic-link.tsx` |
| CTA 悬停香槟辉光渐深、按压 squash & stretch 回弹 | 反馈 | `platinum.css` `.pe-cta-*` + `index.css` `.btn-motion` |
| 支柱行悬停：编号转香槟色、描述提亮 | 反馈 | `platinum.css` `.pe-row` |
| 文字选区香槟着色 | 浏览器表面 | `platinum.css` `.platinum-editorial ::selection` |

**调色板（作用域限定在落地页，浅色商务控制台不受影响）：**

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--pe-ink` | `oklch(0.13 0.005 85)` | 暖黑墨画布 |
| `--pe-ivory` | `oklch(0.93 0.012 85)` | 象牙白主文字 |
| `--pe-ivory-dim` | `oklch(0.67 0.012 85)` | 暗象牙次级文字 |
| `--pe-champagne` | `oklch(0.84 0.07 95)` | 香槟金唯一强调色 |
| `--pe-hairline` | `oklch(0.93 0.012 85 / 0.16)` | 发丝分割线 |

**实施文件（8 个）：**

| 文件 | 内容 |
| --- | --- |
| `web/src/styles/platinum.css` | 编辑式暗色调色板、光带扫过、支柱行、CTA 光响应、选区着色 |
| `web/src/styles/index.css` | 动效原语库（入场/漂移/浮标/辉光/发丝线/流光珠/按钮与卡片反馈，含减弱动效回退） |
| `web/src/features/home/components/sections/business-landing.tsx` | 落地页组件（编辑式构图） |
| `web/src/features/home/components/wave-canvas.tsx` | 金色流线 canvas 环境层 |
| `web/src/features/home/components/magnetic-link.tsx`、`use-magnetic.ts` | 磁吸链接（CTA） |
| `web/src/features/home/index.tsx`、`components/index.ts` | `marketingHome` 开关接线与导出 |

**i18n：** 副题与三个按钮文案复用既有已翻译键；支柱行等 7 个新键已补入
`translation` 命名空间（en / zh / zh-TW 已翻译，fr / ru / ja / vi 回退英文），
`i18n:sync` 校验 en / zh / zh-TW 零缺失、零多余。en.json 中的品牌保护转义键
（`\u0061` 混淆形式）在编辑过程中完整保留。

**验收要点：** 未配置 `HomePageContent` 时 `/` 显示白金奢华落地页；配置后显示管理员
自定义内容；已登录状态按钮为「前往仪表板」；zh / zh-TW 显示翻译文案；系统开启
「减弱动态效果」后所有循环与空间动效停用、内容直接可见。

---

## 六、实施方案与里程碑

### 6.1 阶段划分（实际执行过程）

| 阶段 | 内容 | 产出 |
| --- | --- | --- |
| M1 调研 | 并行两个探索任务：① 主题系统（令牌/预设/切换机制）② 功能开关体系（导航/侧栏/路由守卫/状态接口） | 全部接线点定位（约 20 处） |
| M2 设计 | 计划书 v1：白金配色令牌方案 + 功能取舍清单 | 用户确认（白金商务风 + 更精简） |
| M3 实施 | 新建 `features.ts`；12 个文件功能接线；3 个文件主题改造 | 16 个代码文件变更 |
| M4 验证 | 安装依赖 → 类型检查 → Lint → 单元测试 → 格式化 → 生产构建（×2） | 全绿（见第七章） |

### 6.2 修改文件清单

**新增（2 个）**

| 文件 | 用途 |
| --- | --- |
| `web/src/config/features.ts` | 功能封闭总开关（10 项） |
| `README.PLATINUM.md` | 本计划书 |

**功能封闭接线（12 个）**

| 文件 | 改动 |
| --- | --- |
| `web/src/hooks/use-top-nav-links.ts` | 模型广场 / 排行榜导航入口受 `pricing`、`rankings` 控制 |
| `web/src/hooks/use-sidebar-data.ts` | 侧栏条目按开关条件构建（聊天分组、任务日志、订阅入口）；空分组自动隐藏 |
| `web/src/features/usage-logs/index.tsx` | 日志页 Tab 分区按 `drawingLogs` / `taskLogs` 动态生成 |
| `web/src/features/wallet/index.tsx` | 邀请返利卡受 `referral` 控制；订阅套餐卡受 `subscriptions` 控制 |
| `web/src/features/wallet/components/recharge-form-card.tsx` | 在线支付区块与 Creem 商品区受 `onlineTopup` 控制（兑换码区保留） |
| `web/src/features/profile/index.tsx` | 签到日历额外受 `checkin` 控制 |
| `web/src/routes/rankings/index.tsx` | 路由守卫：重定向 `/` |
| `web/src/routes/pricing/index.tsx`、`src/routes/pricing/$modelId/index.tsx` | 路由守卫：重定向 `/` |
| `web/src/routes/_authenticated/playground/index.tsx` | 路由守卫：重定向 `/dashboard` |
| `web/src/routes/_authenticated/subscriptions/index.tsx` | 路由守卫：重定向 `/dashboard` |
| `web/src/routes/_authenticated/usage-logs/$section.tsx` | 已关闭的日志分区重定向至 `/usage-logs/common` |

**主题改造（3 个）**

| 文件 | 改动 |
| --- | --- |
| `web/src/styles/theme.css` | 浅色 / 暗色调色板整体替换为白金商务配色；圆角 1rem → 0.625rem |
| `web/src/context/theme-provider.tsx` | 默认主题 `system` → `light` |
| `web/src/components/config-drawer.tsx` | 移除「色彩预设」选择器及其无用导入（`THEME_PRESETS`、`ThemePreset`） |

### 6.3 设计要点

- **集中式开关优于散布判断**：所有封闭判断统一读取 `featureConfig`，任何位置不出现
  `if (功能 === 关闭)` 的第二事实来源；
- **复用既有守卫模式**：路由守卫沿用上游 `beforeLoad + redirect` 写法，与 `pricing`/
  `rankings` 既有的模块守卫风格一致；
- **空分组自动收敛**：侧栏分组条目全部封闭时（如默认配置下的「聊天」分组）由既有的
  `useSidebarConfig` 空分组过滤逻辑自动隐藏，无需特判。

---

## 七、验证与验收

### 7.1 已执行的验证记录（环境：Windows 11 / Node 24 / Bun 1.4.0）

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 依赖安装 | `bun install` | ✅ 1191 packages |
| 类型检查 | `bun run typecheck`（tsgo） | ✅ 无错误 |
| Lint | `oxlint`（全部 15 个改动文件） | ✅ 0 warning / 0 error |
| 单元测试 | `bun run test`（Vitest） | ✅ 35 个文件、179 个用例全部通过 |
| 生产构建 | `bun run build`（Rsbuild） | ✅ 产物输出至 `web/dist`（格式化后复建一次，同样通过） |
| 格式化 | `oxfmt --check`（全部 16 个改动文件） | ✅ 格式正确、版权头完整 |

### 7.2 验收清单（部署后逐条勾选）

- [ ] 首次访问（无 Cookie）默认浅色白金主题，画布为铂银白、卡片为纯白
- [ ] 主按钮、链接、选中态、焦点环均为香槟金 `#b39042`
- [ ] 侧栏纯白背景、清晰右边框；激活项香槟金轻染
- [ ] 顶部导航仅有：首页 / 控制台 / 文档 / 关于
- [ ] 侧栏仅有：通用（总览、仪表盘、API 密钥、使用日志）+ 个人（钱包、个人中心）+ 管理组（管理员）
- [ ] 直达 `/rankings`、`/pricing` 回到首页；`/playground`、`/subscriptions` 回到控制台
- [ ] 直达 `/usage-logs/drawing`、`/usage-logs/task` 回到通用日志
- [ ] 钱包页：无金额预设/支付方式/订阅卡/邀请返利卡；兑换码输入框与订单记录可用
- [ ] 个人中心：无签到日历；资料、安全、会话、Passkey、两步验证正常
- [ ] 外观抽屉（侧栏底部调色盘图标）：无「色彩预设」区；明暗/字体/圆角/密度可调
- [ ] 切换暗色模式可用，主色为亮香槟金 `#c7ab65`
- [ ] 管理端全部页面（渠道/模型/用户/兑换码/系统信息/系统设置）功能正常

---

## 八、风险管理

| # | 风险 | 影响 | 概率 | 应对 |
| --- | --- | --- | --- | --- |
| R1 | 老用户浏览器存有主题 Cookie（`vite-ui-theme`、`theme_preset`），个别用户仍看到暗色或旧彩色预设 | 观感不统一 | 中 | 属预期行为；用户清除站点 Cookie 即可。预设选择器已移除，新用户不可能再产生新预设 |
| R2 | 封闭仅在 UI 层：直连后端 API（如 `/api/user/topup/online-pay`）仍可能被调用 | 越过界面使用已封闭功能 | 低 | 支付类接口后端本有凭证 + 合规确认双重门槛，未配置即禁用；彻底硬禁用列入路线图 P1 |
| R3 | 后续与上游 new-api 合并时产生冲突 | 升级成本 | 中 | 改动集中在 `features.ts` 与 `theme.css` 两个自有文件；其余 13 个文件均为 ≤10 行的局部小改，冲突面小、易手工合并 |
| R4 | Windows 下 `core.autocrlf=true` 导致全仓 `format:check` 失败（含未改动文件） | CI/本地检查噪音 | 确定 | 环境性问题，与本次改动无关（本次 16 个文件已单独通过 `oxfmt --check`）；如需根治按 LF 重新检出仓库 |
| R5 | 误删/误改品牌署名违反项目保护政策 | 合规风险 | 已规避 | 本次定制零触碰 new-api / QuantumNous 的品牌、版权头、关于页与页脚；后续维护请延续此约束 |
| R6 | 用户依赖被封闭的功能（如确需视频任务日志） | 功能缺失 | 视业务而定 | `features.ts` 单开关秒级恢复，重新构建即可 |

---

## 九、回滚与恢复方案

三级恢复体系，按影响范围从小到大：

### 9.1 功能级恢复（最常用）

```bash
# 编辑 web/src/config/features.ts，将目标项改为 true，例如恢复模型广场：
#   pricing: true,
cd web && bun run build   # 重新构建前端并嵌入 Go 二进制
```

### 9.2 主题级回滚

```bash
git checkout <上游基线提交> -- web/src/styles/theme.css \
  web/src/context/theme-provider.tsx web/src/components/config-drawer.tsx
cd web && bun run build
```

### 9.3 整体回滚

```bash
git revert <本次定制提交>     # 或
git checkout <上游基线提交> -- web/   # 前端整体回到上游状态
cd web && bun install && bun run build
```

### 9.4 与上游合并建议

升级上游时优先保留双方意图：`features.ts` 为本仓库独有文件直接保留；`theme.css` 保留
本仓库调色板、采纳上游新增令牌；其余接线文件接受上游主体、保留 `featureConfig` 判断行。

---

## 十、后续规划路线图

| 优先级 | 事项 | 说明 |
| --- | --- | --- |
| **P1** | ~~首页商务化（`marketingHome` 开关）~~ ✅ 已完成 | 已按 [5.4 节](#54-首页落地页--白金奢华编辑式已实施)实施并升级为白金奢华编辑式落地页（参考 unfds.com）：暗色编辑排版 + 全套高级动效；管理员 `HomePageContent` 自定义内容优先级不变 |
| **P1** | 后端 API 层硬禁用开关 | 在 Go 侧（如 `setting/`）增加与 `features.ts` 对应的服务端开关，对 topup/订阅等接口直接返回 403，实现前后端一致的封闭 |
| **P1** | 登录页与企业品牌配置化 | 系统名、Logo、登录页文案的后台配置指引（上游已支持 `system_name`/`logo` 选项，补充部署侧说明） |
| **P2** | 主题色后台可配 | 将 `--primary` 暴露为后台运营设置项，免重新构建即可微调品牌色 |
| **P2** | 文档补实景截图 | 起动 `bun run dev` + 后端，截取登录页/控制台/钱包页嵌入本文档 5.2/5.3 节 |
| **P3** | 多租户品牌方案 | 按用户组下发不同主题预设（评估 `theme-presets.css` 机制改造） |

---

## 十一、构建与部署

前端位于 `web/`，包管理器使用 **Bun**（本仓库 `bun.lock`）：

```bash
cd web
bun install        # 安装依赖
bun run dev        # 本地开发服务器（热更新）
bun run typecheck  # TypeScript 类型检查（tsgo）
bun run lint       # oxlint
bun run build      # 生产构建，产物输出至 web/dist/
```

前端产物通过 `//go:embed web/dist` 嵌入 Go 二进制（见 `main.go`）。整体构建：

```bash
# 在仓库根目录（需先完成 web/dist 生产构建）
go build -o atlasapi

# 或使用 Docker
docker compose up -d --build
```

常见问题：

- **Windows 全仓 `format:check` 失败**：`core.autocrlf` 换行符环境问题（见 R4），可忽略或
  以 LF 检出；
- **构建后界面未更新**：确认执行了 `bun run build` 而非仅有 `dev` 缓存；Go 侧需重新编译
  以重新嵌入 `web/dist`；
- **本机无 Bun**：`npm install -g bun` 后即可使用上述全部命令。

运行环境变量与部署方式与上游 new-api 完全一致，参见根目录 `README.md` 与 `docker-compose.yml`。

---

## 十二、FAQ 常见问题

**Q1：如何恢复模型广场 / 排行榜 / Playground 等功能？**
编辑 `web/src/config/features.ts`，将对应项改为 `true` 并重新 `bun run build`。恢复后这些
功能重新受后台「系统设置 → 站点」的运行时开关控制。

**Q2：为什么我的浏览器里还是旧配色 / 暗色？**
主题偏好存在 Cookie（`vite-ui-theme`）中，彩色预设存在 `theme_preset` 中，老用户会保持
原选择。清除站点 Cookie 后即为默认白金浅色主题。

**Q3：钱包为什么只剩兑换码？企业怎么给成员充额度？**
`onlineTopup=false` 隐藏了全部在线支付表单。企业管理员通过「管理端 → 兑换码」生成码后
发放给成员，成员在钱包兑换；或管理员在「用户管理」中直接调整额度。

**Q4：直接输入被封闭功能的 URL 会发生什么？**
前端路由守卫会重定向：`/rankings`、`/pricing/*` → 首页；`/playground`、`/subscriptions` →
控制台；`/usage-logs/drawing|task` → 通用日志。

**Q5：后台系统设置里打开了「排行榜」导航，为什么前台还是不显示？**
优先级设计：`features.ts` 硬关闭 > 后台运行时开关。想用后台开关控制，先把 `features.ts`
中对应项恢复为 `true`。

**Q6：暗色模式还能用吗？**
能。外观抽屉中可手动切换，主色会变为同色相的亮香槟金 `#c7ab65`；仅默认值锁定为浅色。

**Q7：这次定制会影响 API、计费或数据库吗？**
不会。全部改动位于 `web/` 前端目录，后端 Go 代码、SQL、计费逻辑零改动，SQLite /
MySQL / PostgreSQL 兼容性不受影响。

**Q8：升级上游 new-api 新版本怎么办？**
按第九章 9.4 节的合并建议处理；改动集中、冲突面小。升级后重跑第 7.1 节验证命令确认。

---

## 附录A 术语表

| 术语 | 含义 |
| --- | --- |
| 设计令牌（Design Token） | 以 CSS 变量形式定义的原子设计值（颜色、圆角、字体），本站全部视觉由 `theme.css` 令牌驱动 |
| `features.ts` | 本仓库新增的功能封闭总开关文件：`web/src/config/features.ts` |
| OKLCH | 感知均匀的色彩空间（亮度 L / 彩度 C / 色相 H），本项目令牌的标准写法；HEX 为换算参考值 |
| `HeaderNavModules` | 后台运行时开关（JSON 选项）：控制顶栏首页/控制台/模型广场/排行榜/文档/关于的可见性 |
| `SidebarModulesAdmin` | 后台运行时开关（JSON 选项）：控制侧栏各分组的可见性，可被用户级偏好进一步收窄 |
| 路由守卫 | TanStack Router 的 `beforeLoad` 钩子中执行重定向，封闭直达 URL |
| 兑换码（Redemption Code） | 管理员生成、成员在钱包兑换的一次性额度码，企业内部分配额度的标准方式 |
| 外观抽屉（Config Drawer） | 侧栏底部的调色盘图标打开的偏好设置面板（明暗/字体/圆角/密度等） |

## 附录B 变更记录

| 版本 | 日期 | 内容 |
| --- | --- | --- |
| v1.4 | 2026-08-23 | 落地页按 tokenrhythm.studio 重设计布局/排版：重复字标 + 英文标语「All Models, One Mind.」+ 编号分节（01/Capability 支柱行、02/Request curl 调用示例、03/Docs 收尾 CTA），保留白金奢华视觉与全部动效；curl 示例中的接口地址取自当前部署 origin。上游署名按项目政策保留于页脚（不可删除项），顶栏文档链接可由管理员经 HeaderNavModules 配置 |
| v1.3 | 2026-08-23 | **全站白金奢华化**：theme.css 浅色调色板由冷银+海军蓝翻转为暖铂金白（#f6f4ef 画布 / #fdfcf9 面板）+ 香槟金唯一强调色（--primary #b39042，金底墨字按钮）；暗色模式改为「暗金」体系（暖近黑 #0d0c09 + 亮金 #c7ab65）；图表色改为金/青铜/橄榄/暖灰/墨蓝序列；阴影统一暖墨色调；登录页环境光由海军蓝/钢青改为香槟金/青铜；落地页由暗金翻转为白金底（画布 #f7f4ec、金 #b8923e、墨 #1c1812），并修复逐字入场的对象渲染 bug、删除无引用的 platinum.css；系统名经 `SystemName` 数据库选项设为 **atlas API**（页脚与关于页署名保持不动）；三轮回镜像重建与浏览器实测（铂金底 / 金色主按钮 / 标签页标题均已验证） |
| v1.2 | 2026-08-23 | 实施 5.4 节首页商务化并升级为**白金奢华编辑式落地页**（参考 unfds.com）：`marketingHome` 开关；UNFDS 式暗色编辑排版（暖黑画布 + 衬线大字 + 等宽标签 + 编号支柱行）；动效全套（错峰入场、香槟光带扫过签名时刻、金色流线 canvas 视差、发丝线自绘 + 流光珠、磁吸 CTA、按压回弹）；磁吸与波浪组件接入落地页；i18n 7 个新键补入 translation 命名空间（en/zh/zh-TW 翻译，其余回退英文）；impeccable 设计检测器零发现；typecheck / lint / oxfmt / build 全绿 |
| v1.1 | 2026-08-23 | 新增 5.4 节「首页（落地页）现状与商务化规划」（规划稿，未动代码）：`marketingHome` 开关设计、简洁商务首页线框、实施文件清单与验收要点；路线图 P1 同步收录；需求分析表补营销落地页一行 |
| v1.0 | 2026-08-23 | 初版（已实施）：白金商务风主题（theme.css / theme-provider / config-drawer）；功能封闭框架（features.ts + 12 个文件接线）；验证全绿（typecheck / lint / 179 单测 / build / oxfmt）；本计划书 |

---

*本文档对应定制基于上游 new-api（QuantumNous）`main` 分支实施。项目品牌、版权与署名信息受上游政策保护，本定制未做任何删改。*
