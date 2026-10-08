import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
}

export default function LoginForm({
    formData,
    setFormData,
    onSubmit,
    isLoading,
}: LoginFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
                <label className="block text-xs font-bold tracking-wider text-slate-700 dark:text-[#94a3b8] uppercase mb-1.5">
                    {t("login.email", "Email Address")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-[#ffd166] w-4 h-4" />
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-indigo-500/30 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 transition-all text-sm text-[#0f172a] dark:text-[#f8fafc] placeholder:text-slate-400"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs font-bold tracking-wider text-slate-700 dark:text-[#94a3b8] uppercase mb-1.5">
                    {t("login.password", "Password")}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-[#ffd166] w-4 h-4" />
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-indigo-500/30 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 transition-all text-sm text-[#0f172a] dark:text-[#f8fafc] placeholder:text-slate-400"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                    >
                        {showPassword ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-indigo-500/25 border border-indigo-400/30 active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        t("login.sign_in_btn", "Sign In to Library")
                    )}
                </button>
            </div>
        </form>
    );
}
