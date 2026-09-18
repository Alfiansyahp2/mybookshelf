import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    HeartHandshake,
    ArrowUpRight,
    X,
    Server,
    Star
} from "lucide-react";
import SEO from "../components/SEO";
import InteractiveBookDemo from "../components/landing/InteractiveBookDemo";

export default function LandingPage() {
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
    const [sponsorTier, setSponsorTier] = useState<"individual" | "server" | "platinum">("server");

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f8f5f0] text-[#4a3b2f] font-sans flex flex-col justify-between p-6 sm:p-10 selection:bg-[#7a5c42] selection:text-white relative">
            <SEO
                title="MyBookshelf - Abadikan Setiap Lembar Cerita & Perjalanan Membacamu"
                description="Kelola koleksi buku pribadi, lacak progres membaca, buka pencapaian, dan raih kebiasaan literasi bersama MyBookshelf."
            />

            {/* ── TOP HEADER BAR (LOGO & ACTIONS) ── */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 py-2">
                {/* Brand Header */}
                <div className="flex items-center gap-3">
                    <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#4a3b2f]">
                        MyBookshelf
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#d4a574]/20 text-[#7a5c42] border border-[#d4a574]/30 hidden sm:inline-block">
                        Pitching Edition v1.0
                    </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSponsorModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#7a5c42]/30 text-xs font-bold text-[#7a5c42] hover:bg-[#7a5c42]/10 transition-colors"
                    >
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>SPONSOR</span>
                        <span className="text-[10px]">↗</span>
                    </button>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4a3b2f] hover:bg-[#3a2d23] text-[#f8f5f0] text-xs font-bold shadow-md transition-all"
                    >
                        <span>MASUK APP</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* ── MAIN CONTENT SECTION (FULL WIDTH) ── */}
            <main className="my-auto w-full max-w-6xl mx-auto flex flex-col items-center text-center justify-center space-y-8 sm:space-y-12">
                {/* HERO HEADLINE */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl"
                >
                    <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] text-[#4a3b2f]">
                        Abadikan setiap lembar cerita &{" "}
                        <span className="font-serif italic font-bold text-[#7a5c42]">
                            perjalanan membacamu.
                        </span>
                    </h1>
                </motion.div>

                {/* STANDING SPINES SHOWCASE */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full"
                >
                    <InteractiveBookDemo />
                </motion.div>
            </main>

            {/* FOOTER SINGLE LINE */}
            <div className="w-full flex items-center justify-between text-[11px] text-[#7a5c42] shrink-0 border-t border-[#7a5c42]/15 pt-3">
                <span>© {new Date().getFullYear()} MyBookshelf. Side Filter Single Screen Showcase.</span>
                <div className="flex gap-4">
                    <button onClick={() => setIsSponsorModalOpen(true)} className="hover:text-[#4a3b2f] underline">
                        Sponsorship Info
                    </button>
                    <Link to="/dashboard" className="hover:text-[#4a3b2f] underline font-bold">
                        Buka App Dashboard ↗
                    </Link>
                </div>
            </div>

            {/* SPONSOR MODAL */}
            <AnimatePresence>
                {isSponsorModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSponsorModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-[#f5ecd7] text-[#4a3b2f] p-6 sm:p-8 rounded-3xl shadow-2xl z-10"
                        >
                            <button
                                onClick={() => setIsSponsorModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-[#4a3b2f] text-[#f8f5f0]">
                                    <HeartHandshake className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif italic text-2xl font-bold">Sponsori MyBookshelf</h3>
                                    <p className="text-xs text-[#7a5c42]">Bantu pengadaan server backend cloud.</p>
                                </div>
                            </div>

                            <div className="space-y-3 my-6">
                                <button
                                    onClick={() => setSponsorTier("individual")}
                                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${sponsorTier === "individual"
                                        ? "border-[#7a5c42] bg-[#7a5c42]/10"
                                        : "border-black/10 bg-white/50"
                                        }`}
                                >
                                    <div>
                                        <div className="font-bold text-sm flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                                            <span>Individual Supporter</span>
                                        </div>
                                        <p className="text-xs text-[#7a5c42] mt-0.5">Dukungan kopi/trakteer</p>
                                    </div>
                                    <span className="font-bold text-sm text-[#4a3b2f]">Rp 25.000+</span>
                                </button>

                                <button
                                    onClick={() => setSponsorTier("server")}
                                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${sponsorTier === "server"
                                        ? "border-[#7a5c42] bg-[#7a5c42]/10"
                                        : "border-black/10 bg-white/50"
                                        }`}
                                >
                                    <div>
                                        <div className="font-bold text-sm flex items-center gap-2">
                                            <Server className="w-4 h-4 text-[#7a5c42]" />
                                            <span>Cloud Infrastructure Sponsor</span>
                                        </div>
                                        <p className="text-xs text-[#7a5c42] mt-0.5">Mendanai Cloud Database 1 Bulan</p>
                                    </div>
                                    <span className="font-bold text-sm text-[#4a3b2f]">Rp 150.000+</span>
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/60 text-center space-y-3">
                                <p className="text-xs text-[#7a5c42]">
                                    Hubungi developer secara langsung melalui saweria / email:
                                </p>
                                <div className="flex justify-center gap-3">
                                    <a
                                        href="https://saweria.co"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-full bg-[#7a5c42] hover:bg-[#4a3b2f] text-white text-xs font-bold transition-colors"
                                    >
                                        Saweria / Trakteer
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
