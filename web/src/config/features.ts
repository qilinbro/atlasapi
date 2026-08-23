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
 * Build-time feature switches for a lean business deployment.
 *
 * A flag set to `false` hard-closes the feature across the UI: navigation
 * entries, cards, tabs, and route guards all disappear, regardless of the
 * admin options configured in System Settings. Flipping a flag back to
 * `true` fully restores the feature — no other code changes required.
 *
 * Hard-closed flags always win over the runtime options
 * (`HeaderNavModules`, `SidebarModulesAdmin`, payment credentials, etc.).
 */
export type FeatureKey =
  | 'rankings'
  | 'pricing'
  | 'playground'
  | 'chatPresets'
  | 'onlineTopup'
  | 'referral'
  | 'checkin'
  | 'subscriptions'
  | 'drawingLogs'
  | 'taskLogs'
  | 'marketingHome'
  | 'docs'

export const featureConfig: Record<FeatureKey, boolean> = {
  // Top-nav "Rankings" page (per-model usage leaderboard).
  rankings: false,
  // Top-nav "Model Square" public pricing page (/pricing).
  pricing: false,
  // In-console API playground (/playground).
  playground: false,
  // External chat preset links rendered from the `Chats` backend option.
  chatPresets: false,
  // Online payment top-up forms in the wallet (redemption codes stay).
  onlineTopup: false,
  // Referral / invite-rewards card in the wallet.
  referral: false,
  // Daily check-in calendar on the profile page.
  checkin: false,
  // Subscription plan purchase (wallet card + admin subscriptions page).
  subscriptions: false,
  // Drawing (Midjourney-style) usage log section.
  drawingLogs: false,
  // Video/audio task usage log section.
  taskLogs: false,
  // Five-section marketing landing page on `/`. When false, a minimal
  // business landing is shown instead (unless the admin set HomePageContent,
  // which always wins).
  marketingHome: false,
  // Top-nav "Docs" link and the footer "Docs" column.
  docs: false,
}
