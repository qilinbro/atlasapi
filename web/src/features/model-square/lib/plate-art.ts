/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

/**
 * Vendor plate artwork for the model square cards. Each domestic vendor
 * has one engraved plate illustration (served from /public/plates);
 * models are matched case-insensitively by model-name or vendor-icon
 * prefix.
 */
const VENDOR_PLATE_PREFIXES: { art: string; prefixes: string[] }[] = [
  { art: '/plates/deepseek.png', prefixes: ['deepseek'] },
  { art: '/plates/qwen.png', prefixes: ['qwen', 'qwq'] },
  {
    art: '/plates/glm.png',
    prefixes: ['glm', 'chatglm', 'cogview', 'cogvideo'],
  },
  { art: '/plates/kimi.png', prefixes: ['kimi', 'moonshot'] },
  { art: '/plates/minimax.png', prefixes: ['minimax', 'abab'] },
]

function matchPlate(...candidates: (string | undefined)[]): string | undefined {
  for (const candidate of candidates) {
    const value = candidate?.toLowerCase()
    if (!value) continue
    for (const entry of VENDOR_PLATE_PREFIXES) {
      if (entry.prefixes.some((p) => value.startsWith(p))) {
        return entry.art
      }
    }
  }
  return undefined
}

export function getPlateArt(model: {
  model_name?: string
  vendor_icon?: string
}): string | undefined {
  return matchPlate(model.model_name, model.vendor_icon)
}
