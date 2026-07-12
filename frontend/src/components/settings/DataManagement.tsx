import { motion } from 'framer-motion';
import { Database, Download, Trash2 } from 'lucide-react';

interface DataManagementProps {
  handleExportData: () => void;
  handleClearData: () => void;
}

export default function DataManagement({ handleExportData, handleClearData }: DataManagementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
        <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Management
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Export All Data</span>
          </button>

          <div className="bg-cream/30 rounded-xl p-4">
            <p className="text-sm text-walnut/80 mb-2">
              This will download all your books, settings, and reading progress as a JSON file that you can import later.
            </p>
            <div className="flex items-center gap-2 text-xs text-walnut/60">
              <Database className="w-4 h-4" />
              <span>File size: ~50KB</span>
            </div>
          </div>

          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-3 px-4 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border-2 border-red-200"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Clear All Data</span>
          </button>

          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete all your books, settings, and reading progress. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
