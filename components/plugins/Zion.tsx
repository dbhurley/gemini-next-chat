'use client'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import ResponsiveDialog from '@/components/ResponsiveDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Contact {
  id: number
  email: string
  firstname?: string
  lastname?: string
}

type Props = {
  data: {
    total: number
    contacts: Contact[]
  }
}

function Zion(props: Props) {
  const { data } = props
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  if (!data?.contacts?.length) return null

  return (
    <>
      <div className="chat-content overflow-x-auto scroll-smooth">
        <div className="flex gap-1.5 max-md:gap-1">
          {data.contacts.slice(0, 4).map((contact, idx) => (
            <Card key={idx} className="w-40 flex-1 hover:bg-gray-50 hover:dark:bg-gray-900">
              <CardHeader className="p-2">
                <CardTitle className="truncate text-sm" title={contact.email}>
                  {contact.email}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <p className="line-clamp-2 text-xs text-gray-500">
                  {contact.firstname} {contact.lastname}
                </p>
              </CardContent>
            </Card>
          ))}
          {data.contacts.length > 4 && (
            <button
              className="flex items-center justify-center rounded-lg border px-3 text-xs hover:bg-gray-50 hover:dark:bg-gray-900"
              onClick={() => setDialogOpen(true)}
            >
              {t('plugin.viewAll')}
              <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <ResponsiveDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t('plugin.mautic.dialogTitle')}
        description={t('plugin.mautic.dialogDescription')}
      >
        <ScrollArea className="h-96">
          <div className="space-y-4 p-4">
            {data.contacts.map((contact, idx) => (
              <Card key={idx} className="hover:bg-gray-50 hover:dark:bg-gray-900">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{contact.email}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-gray-500">
                    {contact.firstname} {contact.lastname}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </ResponsiveDialog>
    </>
  )
}

export default memo(Zion)
