'use client'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Contact {
  id: number
  email?: string
  firstname?: string
  lastname?: string
}

interface Segment {
  id: number
  name: string
  description?: string
}

type Props = {
  data: {
    contacts?: Contact[]
    lists?: Segment[]
  }
}

function Zion(props: Props) {
  const { data } = props
  const { t } = useTranslation()

  if (!data?.contacts?.length && !data?.lists?.length) return null

  return (
    <div className="chat-content overflow-x-auto scroll-smooth">
      <div className="flex gap-1.5 max-md:gap-1">
        {data.contacts && data.contacts.slice(0, 2).map((contact, idx) => (
          <Card key={idx} className="w-40 flex-1 hover:bg-gray-50 hover:dark:bg-gray-900">
            <CardHeader className="p-2">
              <CardTitle className="flex items-center gap-1 truncate text-sm">
                <Users className="h-4 w-4" />
                {contact.email || `${contact.firstname} ${contact.lastname}`}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
        {data.lists && data.lists.slice(0, 2).map((segment, idx) => (
          <Card key={idx} className="w-40 flex-1 hover:bg-gray-50 hover:dark:bg-gray-900">
            <CardHeader className="p-2">
              <CardTitle className="flex items-center gap-1 truncate text-sm">
                <Layers className="h-4 w-4" />
                {segment.name}
              </CardTitle>
            </CardHeader>
            {segment.description && (
              <CardContent className="p-2 pt-0">
                <p className="line-clamp-2 text-xs text-gray-500">
                  {segment.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default memo(Zion)
