import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Key, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { devError } from "@shared/lib/logger";
import { useAuthUser } from "@shared/hooks/useAuthSession";
import {
    useUpdateProfile,
    useUpdatePassword,
} from "@features/auth";

export default function AccountSettings() {
    const { t } = useTranslation();
    const { data: authData } = useAuthUser();
    const authUser = authData?.user;

    const updateProfile = useUpdateProfile();
    const updatePassword = useUpdatePassword();

    const [user, setUser] = useState({
        name: "User Name",
        email: "booklover@email.com",
        avatar: "U",
        memberSince: "2024",
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (authUser) {
            setUser({
                name: authUser.name,
                email: authUser.email,
                avatar: authUser.name.charAt(0).toUpperCase(),
                memberSince: authUser.created_at
                    ? new Date(authUser.created_at).getFullYear().toString()
                    : "2024",
            });
        }
    }, [authUser]);

    const handleProfileSubmit = () => {
        updateProfile.mutate(
            { name: user.name, email: user.email },
            {
                onSuccess: () =>
                    alert(
                        t(
                            "settings.account.profile_success",
                            "Profile updated successfully!",
                        ),
                    ),
                onError: () =>
                    alert(
                        t(
                            "settings.account.profile_error",
                            "Failed to update profile.",
                        ),
                    ),
            },
        );
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePassword.mutate(passwordForm, {
            onSuccess: () => {
                alert(
                    t(
                        "settings.account.password_success",
                        "Password updated successfully!",
                    ),
                );
                setPasswordForm({
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                });
            },
            onError: (err) => {
                alert(
                    t(
                        "settings.account.password_error",
                        "Failed to update password. Check your current password.",
                    ),
                );
                devError("Failed to update password:", err);
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <h2 className="text-xl font-serif font-semibold text-ink mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-walnut dark:text-gold" />
                    {t("settings.account.profile_info", "Profile Information")}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-walnut dark:text-gold mb-2">
                            {t("settings.account.display_name", "Display Name")}
                        </label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-surfaceAlt text-ink border border-walnut/20 dark:border-walnut/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-walnut dark:text-gold mb-2">
                            {t(
                                "settings.account.email_address",
                                "Email Address",
                            )}
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-surfaceAlt text-ink border border-walnut/20 dark:border-walnut/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-surfaceAlt/80 border border-walnut/10 dark:border-walnut/25 rounded-xl">
                        <div className="w-12 h-12 bg-surface border border-walnut/15 rounded-full flex items-center justify-center text-walnut dark:text-gold font-semibold text-lg">
                            {user.avatar}
                        </div>
                        <div>
                            <p className="text-sm text-ink font-medium">
                                {t("settings.account.avatar", "Avatar")}
                            </p>
                            <p className="text-xs text-walnut/70 dark:text-cream/60">
                                {t(
                                    "settings.account.avatar_desc",
                                    "First letter of your name",
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button
                            onClick={handleProfileSubmit}
                            disabled={updateProfile.isPending}
                            className="flex items-center gap-2 px-6 py-2.5 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors font-medium disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {updateProfile.isPending
                                ? t("settings.account.saving", "Saving...")
                                : t(
                                      "settings.account.save_profile",
                                      "Save Profile",
                                  )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm mt-4 backdrop-blur-sm">
                <h2 className="text-xl font-serif font-semibold text-ink mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-walnut dark:text-gold" />
                    {t("settings.account.change_password", "Change Password")}
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-walnut dark:text-gold mb-2">
                            {t(
                                "settings.account.current_password",
                                "Current Password",
                            )}
                        </label>
                        <input
                            type="password"
                            required
                            value={passwordForm.current_password}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    current_password: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 bg-surfaceAlt text-ink border border-walnut/20 dark:border-walnut/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-walnut dark:text-gold mb-2">
                            {t("settings.account.new_password", "New Password")}
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={passwordForm.password}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    password: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 bg-surfaceAlt text-ink border border-walnut/20 dark:border-walnut/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-walnut dark:text-gold mb-2">
                            {t(
                                "settings.account.confirm_password",
                                "Confirm New Password",
                            )}
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={passwordForm.password_confirmation}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    password_confirmation: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 bg-surfaceAlt text-ink border border-walnut/20 dark:border-walnut/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
                        />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={updatePassword.isPending}
                            className="flex items-center gap-2 px-6 py-2.5 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors font-medium disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {updatePassword.isPending
                                ? t("settings.account.updating", "Updating...")
                                : t(
                                      "settings.account.update_password",
                                      "Update Password",
                                  )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
