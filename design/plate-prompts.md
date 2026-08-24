# Atlas 首页版画 · Design-Gen 提示词套件

用途：首页第二幕「版画墙」8 张厂商版画 + 第三幕「封底」1 张。
硬性要求：所有图 **不含任何文字/字母/logo**——厂商名与 Atlas 字标由前端代码叠加，
保证字体与全站一致。整体风格 = 古典铜版雕版画 × 香槟纸 × 铂金线 × 一点祖母绿。

## 统一风格模板（英文，适用于 Midjourney / Flux / DALL·E / 即梦国际版）

```
Antique copperplate engraving illustration of {SUBJECT}, printed on warm
champagne ivory paper, fine cross-hatching linework in antique platinum gold
ink, one single deep emerald green accent element, luxurious limited-edition
print plate aesthetic, matte finish, museum print quality, subtle paper
grain, generous empty margins
--ar {RATIO}
--no text, letters, words, logo, watermark, signature, colored background, gradient poster, 3D render, glossy
```

## 中文主模板（即梦 / 可灵 / 通义万相 / 秒出）

```
古典铜版雕版画插图：{主题}，印在香槟米白色艺术纸上，古董铂金色细线交叉排线，
唯一一点祖母绿作为点缀色，奢华限量版画质感，哑光，博物馆版画印刷品质，
轻微纸张纹理，四周留白充足。不要任何文字、字母、水印、logo，不要彩色背景，
不要 3D 渲染，不要光泽感
```

## 8 张版画主题

| # | 文件名 | 比例 | SUBJECT（英文，替换进模板） |
|---|-----------|------|------------------------------|
| 1 | deepseek.png | 3:2 | a sperm whale diving through layered geometric ocean waves |
| 2 | qwen.png | 3:2 | a thousand fine silk threads converging into a single elegant knot |
| 3 | glm.png | 2:1 | a crystal prism splitting one ray of light into a fine spectrum |
| 4 | kimi.png | 2:1 | a crescent moon rising over a dark mountain ridge, the far side in shadow |
| 5 | doubao.png | 2:1 | a single bean seed cracking open with a young sprout and two leaves |
| 6 | hunyuan.png | 2:1 | concentric ripples spreading on still water, forming one perfect circle |
| 7 | ernie.png | 2:1 | an ink brush stroke unfurling across an open book page |
| 8 | minimax.png | 2:1 | a minimal hexagonal lattice built from tiny precise triangles |

中文主题（替换进中文模板）：1 抹香鲸潜入层叠的几何海浪 / 2 千缕丝线汇聚成一个结 /
3 水晶棱镜将一束光分解成精细光谱 / 4 弯月升起于暗色山脊，月之暗面隐入阴影 /
5 一粒豆种裂开抽出双叶嫩芽 / 6 静水面同心圆涟漪聚成完美的圆 /
7 一笔水墨在摊开的书页上舒展 / 8 微小精确三角形构成的极简六边形晶格

## 封底（第 9 张）

文件名 `backcover.png` · 16:9

```
A deep emerald green lacquer field, ornate antique platinum gold engraved
border frame with corner flourishes and fine guilloché lines, an empty
circular medallion at the center with a delicate engraved ring (leave the
medallion interior plain), luxury book back cover design, matte finish,
museum print quality
--ar 16:9
--no text, letters, words, monogram, logo, watermark, glossy, 3D render
```

中文版：深祖母绿漆面底色，古董铂金色雕花边框（四角涡卷饰+纤细扭索纹），
中心一枚空的白金刻线圆徽章（徽章内部留空），奢华典籍封底设计，哑光，
博物馆印刷品质。不要任何文字、字母、花押字、水印，不要光泽，不要 3D。

> 中心徽章留空是刻意的：真正的 Atlas 字标由前端代码叠加在圆心，
> 保证字形与站内导航、favicon 完全一致。

## 一致性技巧

- 先生成第 1 张，满意后用同模板换 SUBJECT 出其余 7 张；
- Midjourney 可用 `--sref <第1张图URL>` 锁定风格；其他工具用「垫图/参考图」功能；
- 排线太稀疏就加 "dense cross-hatching"，太密就换 "sparse elegant linework"；
- 祖母绿只能出现一处点缀（一条线/一个元素），多了会破坏「白金为主」的宪法。

## 交付方式

生成后把 9 张 PNG 发我（或放到服务器任一目录告诉我路径），按上表文件名命名。
我会：压缩进 `web/public/plates/`，版画墙以图为底 + 厂商名叠加，封底以图为底 +
居中 AtlasMark，然后走低资源构建部署。
