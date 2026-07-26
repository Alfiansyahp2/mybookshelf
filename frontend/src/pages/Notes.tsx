import { useTranslation } from 'react-i18next'

export default function Notes() {
  const { t } = useTranslation()
  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-darkBrown mb-4">{t('notes.title', 'Notes')}</h1>
      <p className="text-walnut/70">{t('notes.coming_soon', 'Coming soon...')}</p>
    </div>
  )
}
