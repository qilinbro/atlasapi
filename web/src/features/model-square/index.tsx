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
import { Boxes, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ENDPOINT_TYPES, SORT_OPTIONS } from '@/features/pricing/constants'
import {
  ModelCardGrid,
  ModelDetailsDrawer,
} from '@/features/pricing/components'
import { usePricingData } from '@/features/pricing/hooks/use-pricing-data'
import {
  filterByEndpointType,
  filterBySearch,
  sortModels,
} from '@/features/pricing/lib/filters'
import type { PricingModel } from '@/features/pricing/types'
import { cn } from '@/lib/utils'

/** Category chips mapping the reference layout (all / chat / image /
 * embeddings / video) onto the structured endpoint-type dimension. */
const CATEGORY_CHIPS: { key: string; labelKey: string }[] = [
  { key: ENDPOINT_TYPES.ALL, labelKey: 'All' },
  { key: ENDPOINT_TYPES.OPENAI, labelKey: 'Chat' },
  { key: ENDPOINT_TYPES.IMAGE_GENERATION, labelKey: 'Image' },
  { key: ENDPOINT_TYPES.EMBEDDINGS, labelKey: 'Embeddings' },
  { key: ENDPOINT_TYPES.OPENAI_VIDEO, labelKey: 'Video' },
]

/**
 * In-console model square: search + category chips on top, dense 4-column
 * card grid below, with the pricing details drawer on card click. Reuses
 * the pricing feature's data layer and cards.
 */
export function ModelSquare() {
  const { t } = useTranslation()
  const { models, groupRatio, usableGroup, endpointMap, autoGroups, isLoading, priceRate, usdExchangeRate } =
    usePricingData()

  const [category, setCategory] = useState<string>(ENDPOINT_TYPES.ALL)
  const [searchInput, setSearchInput] = useState('')
  const search = useDeferredValue(searchInput)
  const [selectedModelName, setSelectedModelName] = useState<string | null>(
    null
  )

  const filteredModels = useMemo(() => {
    const searched = filterBySearch(models, search)
    const categorized = filterByEndpointType(searched, category)
    return sortModels(categorized, SORT_OPTIONS.NAME)
  }, [models, search, category])

  const selectedModel = useMemo(
    () => models.find((m) => m.model_name === selectedModelName) ?? null,
    [models, selectedModelName]
  )

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>{t('Model Square')}</SectionPageLayout.Title>
      <SectionPageLayout.Actions>
        <div className='relative'>
          <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('Search models...')}
            aria-label={t('Search models...')}
            className='h-9 w-full pl-9 sm:w-64'
          />
        </div>
      </SectionPageLayout.Actions>
      <SectionPageLayout.Content>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='bg-card inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border p-1'>
              {CATEGORY_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  type='button'
                  onClick={() => setCategory(chip.key)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    category === chip.key
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {t(chip.labelKey)}
                </button>
              ))}
            </div>
            {!isLoading && (
              <span className='text-muted-foreground text-sm'>
                {t('{{count}} models', { count: filteredModels.length })}
              </span>
            )}
          </div>

          {renderModelSquareBody({ isLoading, filteredModels, t, setSelectedModelName, priceRate, usdExchangeRate })}
        </div>
      </SectionPageLayout.Content>

      {selectedModel && (
        <ModelDetailsDrawer
          open={selectedModelName === selectedModel.model_name}
          onOpenChange={(open) => {
            if (!open) setSelectedModelName(null)
          }}
          model={selectedModel}
          groupRatio={groupRatio}
          usableGroup={usableGroup}
          endpointMap={
            endpointMap as Record<string, { path?: string; method?: string }>
          }
          autoGroups={autoGroups}
          priceRate={priceRate}
          usdExchangeRate={usdExchangeRate}
          tokenUnit='M'
        />
      )}
    </SectionPageLayout>
  )
}

function renderModelSquareBody(props: {
  isLoading: boolean
  filteredModels: PricingModel[]
  t: (key: string) => string
  setSelectedModelName: (name: string) => void
  priceRate: number
  usdExchangeRate: number
}) {
  if (props.isLoading) {
    return (
      <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className='h-44 w-full rounded-xl' />
        ))}
      </div>
    )
  }

  if (props.filteredModels.length === 0) {
    return (
      <div className='bg-card rounded-2xl border p-8'>
        <Empty className='border-none p-0'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Boxes className='size-5' />
            </EmptyMedia>
            <EmptyTitle>{props.t('No models found')}</EmptyTitle>
            <EmptyDescription>
              {props.t('Try adjusting the search or category filter.')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <ModelCardGrid
      models={props.filteredModels}
      onModelClick={props.setSelectedModelName}
      columns={4}
      priceRate={props.priceRate}
      usdExchangeRate={props.usdExchangeRate}
    />
  )
}
