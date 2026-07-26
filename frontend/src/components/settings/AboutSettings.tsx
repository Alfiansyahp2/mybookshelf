import { motion } from 'framer-motion';
import { Info, BookOpen, TrendingUp, Award, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutSettings() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
        <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
          <Info className="w-5 h-5" />
          {t('settings.about.title', 'About MyBookshelf')}
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-cream/30 rounded-xl">
            <p className="text-sm text-walnut/80 mb-3">
              {t('settings.about.description', 'MyBookshelf is a beautiful and intuitive digital library management system designed for book lovers.')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-walnut" />
                <span className="text-walnut/80">{t('settings.about.feature1', 'Organize your personal library')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-walnut" />
                <span className="text-walnut/80">{t('settings.about.feature2', 'Track reading progress')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-walnut" />
                <span className="text-walnut/80">{t('settings.about.feature3', 'Achieve reading goals')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 transition-colors">
              <div>
                <p className="font-medium text-darkBrown">{t('settings.about.version', 'Version')}</p>
                <p className="text-sm text-walnut/70">1.0.0</p>
              </div>
              <Info className="w-5 h-5 text-walnut/40" />
            </div>

            <a
              href="https://mybookshelf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 hover:bg-walnut/5 transition-colors group"
            >
              <div>
                <p className="font-medium text-darkBrown group-hover:text-walnut transition-colors">{t('settings.about.website', 'Website')}</p>
                <p className="text-sm text-walnut/70">{t('settings.about.website_desc', 'Visit our official website')}</p>
              </div>
              <BookOpen className="w-5 h-5 text-walnut/40 group-hover:text-walnut transition-colors" />
            </a>

            <a
              href="https://github.com/mybookshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-walnut/20 hover:border-walnut/40 hover:bg-walnut/5 transition-colors group"
            >
              <div>
                <p className="font-medium text-darkBrown group-hover:text-walnut transition-colors">{t('settings.about.github', 'GitHub')}</p>
                <p className="text-sm text-walnut/70">{t('settings.about.github_desc', 'View source code')}</p>
              </div>
              <GitBranch className="w-5 h-5 text-walnut/40 group-hover:text-walnut transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
