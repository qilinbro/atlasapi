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
import {
  Activity,
  Box,
  CreditCard,
  FileText,
  FlaskConical,
  Key,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Radio,
  ServerCog,
  Settings,
  Ticket,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { NavGroup, NavItem, SidebarData } from '@/components/layout/types'
import { featureConfig } from '@/config/features'
import { ROLE } from '@/lib/roles'

/**
 * Root navigation groups for the application sidebar.
 *
 * These are shown when the URL does not match any nested sidebar view
 * registered in `layout/lib/sidebar-view-registry.ts`.
 */
export function useSidebarData(): SidebarData {
  const { t } = useTranslation()

  const chatItems: NavItem[] = []
  if (featureConfig.playground) {
    chatItems.push({
      title: t('Playground'),
      url: '/playground',
      icon: FlaskConical,
    })
  }
  if (featureConfig.chatPresets) {
    chatItems.push({
      title: t('Chat'),
      icon: MessageSquare,
      type: 'chat-presets',
    })
  }

  const generalItems: NavItem[] = [
    {
      title: t('Overview'),
      url: '/dashboard/overview',
      icon: Activity,
    },
    {
      title: t('Dashboard'),
      url: '/dashboard/models',
      icon: LayoutDashboard,
    },
    {
      title: t('API Keys'),
      url: '/keys',
      icon: Key,
    },
    {
      title: t('Usage Logs'),
      url: '/usage-logs/common',
      icon: FileText,
    },
  ]
  if (featureConfig.taskLogs) {
    const taskItem: NavItem = {
      title: t('Task Logs'),
      url: '/usage-logs/task',
      configUrls: featureConfig.drawingLogs
        ? ['/usage-logs/drawing', '/usage-logs/task']
        : ['/usage-logs/task'],
      icon: ListTodo,
    }
    if (featureConfig.drawingLogs) {
      taskItem.activeUrls = ['/usage-logs/drawing']
    }
    generalItems.push(taskItem)
  }

  const adminItems: NavItem[] = [
    {
      title: t('Channels'),
      url: '/channels',
      icon: Radio,
    },
    {
      title: t('Models'),
      url: '/models/metadata',
      icon: Box,
    },
    {
      title: t('Users'),
      url: '/users',
      icon: Users,
    },
    {
      title: t('Redemption Codes'),
      url: '/redemption-codes',
      icon: Ticket,
    },
  ]
  if (featureConfig.subscriptions) {
    adminItems.push({
      title: t('Subscriptions'),
      url: '/subscriptions',
      icon: CreditCard,
    })
  }
  adminItems.push(
    {
      title: t('System Info'),
      url: '/system-info',
      icon: ServerCog,
      requiredRole: ROLE.SUPER_ADMIN,
    },
    {
      title: t('System Settings'),
      url: '/system-settings/site',
      activeUrls: ['/system-settings'],
      icon: Settings,
    }
  )

  const navGroups: NavGroup[] = [
    {
      id: 'chat',
      title: t('Chat'),
      items: chatItems,
    },
    {
      id: 'general',
      title: t('General'),
      items: generalItems,
    },
    {
      id: 'personal',
      title: t('Personal'),
      items: [
        {
          title: t('Wallet'),
          url: '/wallet',
          icon: Wallet,
        },
        {
          title: t('Profile'),
          url: '/profile',
          icon: User,
        },
      ],
    },
    {
      id: 'admin',
      title: t('Admin'),
      items: adminItems,
    },
  ]

  return {
    navGroups: navGroups.filter((group) => group.items.length > 0),
  }
}
