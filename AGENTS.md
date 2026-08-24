# AGENTS.md — Atlas 品牌化定制规范

> 本仓库是基于上游 new-api **v1.0.0-rc.25** 的品牌化定制 fork。
> 站点品牌：**Atlas**。本文是参与本仓库的所有开发者 / AI agent 的首要行动准则。
> 上游原版 AGENTS.md 见 git 历史（tag `v1.0.0-rc.25`）；前端细节另见 `web/AGENTS.md`。

## 1. 项目定位与品牌口吻

- **Atlas** 是面向最终用户的 **AI Token / API 服务平台**。用户感知到的是"Atlas 提供模型调用额度与 API 网关服务"。
- 所有用户可见文案（首页 hero、登录页、关于页、邮件、通知）以 **Token 站点**的口吻书写：额度、令牌、API Key、模型调用、倍率计费、用量报表、网关等业务语言。
- **禁止**出现"软件介绍"式表述：如"基于 new-api 搭建""New API 网关""本项目是……项目"等。访客不需要知道底层软件是什么。
- 用户可见品牌一律 **Atlas**：站名、页面标题、登录页、侧边栏 Logo、页脚。
- 运行时品牌切换通过官方内建配置实现（管理后台 `system_name` / `logo` / `footer` / 关于页），不要为换名字去改 Go module 路径或包名。

## 2. 视觉体系 — 白金墨绿 · 低调奢华

- **主打亮色**：象牙白画布 + 墨绿主色 + 香槟白金点缀；暗色完整适配：深墨绿画布 + 白金强调。
- 设计倾向：暖铂金 / 香槟调白金（非冷银灰）；标题衬线字体（Lora + 思源宋 SC），正文 Public Sans。

### 核心 Token（初稿，实施时以 theme.css 实际值为准）

| Token | 亮色（主打） | 暗色 |
| --- | --- | --- |
| `--background` | `#F8F6F1` 象牙白 | `#0C1F19` 深墨绿 |
| `--card` | `#FDFCF9` | `#122B22` |
| `--primary` | `#1A4D3E` 深祖母绿 | `#2E6B57` |
| `--foreground` | `#1C2420` | `#E8E3D5` 暖白 |
| 香槟白金（描边/高光专用） | `#C8A96A` | `#D3B981` |
| `--border` | `#E5DFD2` | `#24443A` |

### 设计纪律（硬性）

1. **白金 ≠ 交互色**：香槟白金在亮色画布上对比度仅约 2.5:1，禁止用作文字色、按钮色、链接色；只允许出现在 hairline 描边、分隔线、hover 渐变光、品牌标识。
2. **墨绿是唯一交互主色**（按钮 / 链接 / 选中态 / focus ring）。
3. **颜色只走 CSS token**：全部用 oklch 变量定义于 `web/src/styles/theme.css`（`:root` 与 `.dark`，覆盖 default 预设）；组件代码禁止裸 hex。白金渐变收敛为单一 utility token（如 `--gradient-platinum`）。

### 质感分层策略（Awwwards 标准 / 效率可用性的边界）

视觉品质对标 Awwwards / FWA / CSS Design Awards 每日最佳，但按页面属性分三档执行，防止沉浸式设计伤害效率场景：

| 层 | 页面 | 自由度 |
| --- | --- | --- |
| 营销层 | 首页、登录、关于、定价头图 | 全放开：实验性排版、物理动效、Canvas 艺术层、滚动叙事 |
| 产品层 | 控制台、钱包、密钥、用量记录 | 克制：材质与渐变质感升级，布局与信息结构不变 |
| 管理层 | 渠道、用户、系统设置等 | 仅继承全局 token，不做专门设计 |

### 材质 / 渐变 / 动效 token（拟物体系）

在 theme.css 中以 utility token 定义，组件一律引用 token、禁止内联：

- **材质**：`--lacquer`（墨绿漆面：纵向深浅渐变 + 顶部内高光 `--lacquer-shine`，用于主按钮/侧边栏）、纸纹（极淡 45° 斜纹叠加于卡片底色）、`--platinum-grad`（香槟多停靠渐变，仅品牌字/装饰线）、暗色玻璃（半透明 + backdrop-blur + 白金 hairline）。
- **渐变纪律**：只做同色系深浅渐变（墨绿系、香槟系），禁止跨色相彩虹渐变；大面积渐变仅用于画布与 hero；`--canvas-grad` 为画布径向渐变。
- **动效**：缓动与时长 token 化（`--dur-fast/mid/slow` + `--ease-out-expo`/`--ease-spring`）；只用 `transform`/`opacity` 保证合成层性能；按压态做位移 + 阴影变化（拟物物理感）。
- **动效减法（定稿）**：**禁用**粒子系统、滚动驱动编排（sticky/视差/count-up）、打字机效果、逐词 stagger 等重特效；允许的动效仅限：一次性入场浮现（淡入/上浮，短时长）、hover 状态变化（光泽/倾斜/阴影）、按钮按压物理感、Canvas 静态色晕（可极慢漂移）。
- **降级**：`prefers-reduced-motion` 全部动效退化为淡入；移动端 Canvas 艺术层降级为静态渐变。

### 首页 hero 定稿

A 版 · 国产模型叙事（完整落地于 `features/home`）：主标题"大模型 API 服务平台"，副标题"一个密钥，调用国产主流模型"，CTA"开始使用 / 查看定价"，特性三卡：国产模型 / 按量计费 / 稳定可靠。预览：`docs/brand-preview/hero-preview.html`。

## 3. 代码组织（四层改动模型）

| 层 | 内容 | 主要位置 |
| --- | --- | --- |
| A 主题 token | 覆盖 default 预设亮/暗全套变量（含 sidebar / chart-1..5 / skeleton / radius） | `web/src/styles/theme.css` |
| B 品牌资产 | favicon、默认 Logo、页面 title | `web/src/assets/`、`web/index.html`、后台配置 |
| C 专属页面 | 登录页（`features/auth`）、首页 hero（`features/home`）、关于页 | `web/src/features/*` |
| D 全站精修 | 图表配色（VChart）、骨架屏、加载态、按钮/卡片质感、动效 | 各 feature + 全局样式 |

- 品牌改动**按层集中、按层提交**，不散改组件；能走 token / 配置实现的，不写组件级补丁。
- 前端工程规范遵循 `web/AGENTS.md`：bun 为包管理器（`bun install` / `bun run dev` / `bun run build`）；UI 文案必须走 i18n（`web/src/i18n/locales/{lang}.json`，扁平 JSON，英文源串作键，组件内 `t('English key')`）；新增文案 en 与 zh 同步更新，`bun run i18n:sync` 校验。
- 后端原则上**不动**。确需改动时遵循上游规则：JSON 一律 `common.Marshal/Unmarshal` 等包装函数；SQL 三库兼容（SQLite / MySQL / PostgreSQL）；计费相关改动先读 `pkg/billingexpr/expr.md`。

## 4. 文案规范（i18n）与文本量控制

- 文件：`web/src/i18n/locales/`（en 基准，zh 回退，另有 zh-TW / fr / ru / ja / vi）。
- 新键 = 英文源串；zh 译文用 Atlas 品牌口吻（克制、专业、可信赖），避免翻译腔与营销浮夸。
- 站名相关文案统一用 `Atlas`（不译）；无官方中文名前，中文场景也只用 `Atlas`。

### 4.1 两套词典原则

用户侧白话化、管理侧保持 new-api 行业术语，二者并存：

- 只重写**用户可见模块**（首页、登录、控制台、钱包、密钥、用量、定价、关于）的译文；
- 管理模块（channels / users / system-settings / system-info / redemption 运营侧等）译文**原样保留**；
- 若某词条被用户页与管理页**同时复用**，为用户页新增独立 key，禁止改原 key（防止管理侧术语被连带改写）。

### 4.2 术语词典（用户侧）

| new-api 原词 | Atlas 用户侧 | 备注 |
| --- | --- | --- |
| 令牌 Token | API 密钥 | 消除与 LLM token 的撞名，最高优先级 |
| 日志 | 用量记录 | — |
| Playground | 在线体验 | — |
| 额度 Quota | 额度 | 保留原始数字，不加货币语义、不做格式化 |
| 兑换码 | 兑换码 | 本身白话，保留 |
| 倍率 / 分组 / 渠道 / 中转 | 用户侧不出现 | 管理侧术语，用户界面隐藏 |

### 4.3 文本量预算（硬性）

- 菜单标题 ≤ 4 字；页面标题 ≤ 8 字；按钮 ≤ 4 字；说明文字 ≤ 2 行。
- 页面说明文字**默认为零**，仅空状态、错误提示、首次使用三处允许出现说明文案。
- 空状态 = 一句行动指引（如"还没有 API 密钥？创建一个即可开始"）。
- 认知负担靠**文案密度**解决，不靠裁剪功能：菜单结构、页面模块、额度数字展示均保持现状，不做新手引导组件。

### 4.4 首页 hero 文案（已定稿）

**A 版 · 国产模型叙事**（见 §2 定稿小节）；可视化预览：`docs/brand-preview/hero-preview.html`，落地到 `features/home`。

## 5. Git 工作流

- 工作分支：`brand/platinum-emerald`，基线 tag `v1.0.0-rc.25`；`upstream` remote 永久保留。
- 上游升级流程：fetch upstream → 新基线分支 → 将品牌分支 rebase 上去 → 全量回归（见 §7）。
- Commit 格式：`type(scope): 摘要`，type ∈ {brand, feat, fix, style, chore, docs}；品牌改动用 `brand(...)` 前缀以便升级时快速定位冲突面。

## 6. 构建与部署

- 镜像：在仓库根目录 `docker build -t new-api:brand-rc.25 .`（多阶段：bun 前端 → Go embed → 运行镜像）。
- 部署目录：`/opt/new-api`（docker-compose + PostgreSQL + Redis + OpenResty）。切换时仅改 `image:` 字段；`data/`、`postgres/` 卷永不动。
- 上线流程：新镜像先在 **3001 端口**起验证容器 → 浏览器双模式实测通过 → 改 compose 正式切换；回滚 = 改回官方镜像 tag。

## 7. 验收清单（每次品牌改动合入前）

- [ ] 亮 / 暗双模式全页面走查（登录、首页、控制台、日志、数据看板、设置）。
- [ ] WCAG AA 对比度审计，重点盯香槟白金元素（严禁其作为文字 / 交互色）。
- [ ] 用户可见层品牌检查：`grep -rn "New API\|QuantumNous" web/src` 结果不得出现在用户可见文案中（源码版权头与许可文件除外）。
- [ ] i18n：新增文案 en / zh 均已落地，无裸写中文进组件。
- [ ] 构建通过：`cd web && bun run build`。

## 8. 合规红线（不可逾越）

- 本项目遵循 **AGPL-3.0**。以下内容**禁止修改、删除或替换**：
  - `LICENSE`、`NOTICE`、`THIRD-PARTY-LICENSES.md` 及 `/licenses` 机制；
  - 各源码文件头的版权与许可声明；
  - Go module 路径、包名、import 路径；
  - README 中的上游署名（README 属于文档层，不参与运行时品牌）。
- 对外提供网络服务时，须保持修改后源码的可得性（本仓库 `brand/platinum-emerald` 分支即源码出处）。
- 运行时用户可见品牌 = Atlas，通过官方内建配置与前端定制实现；与上述源码 / 许可层的署名保留并行不悖。
