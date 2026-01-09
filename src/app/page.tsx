"use client";

import Link from "next/link";
import {
    PlusCircle,
    LayoutDashboard,
    FileText,
    ShieldCheck,
    ArrowRight,
    BarChart3,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
                {/* Hero Section */}
                <div className="text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wide border border-primary-100 dark:border-primary-800">
                            Smart Quotation System
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight"
                    >
                        จัดการเอกสารงานขาย <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                            ได้ง่ายและรวดเร็วขึ้น
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        เชื่อมต่อข้อมูลการขายผ่าน Google Sheets และอนุมัติผ่าน Slack <br />
                        ช่วยให้ทีมของคุณทำงานร่วมกันได้อย่างไร้รอยต่อ
                    </motion.p>
                </div>

                {/* Entry Points Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {/* Sales Portal Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link href="/sales" className="group block h-full">
                            <div className="glass-card h-full p-8 border-2 border-transparent hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-primary-500/10 group-hover:text-primary-500/20 transition-colors">
                                    <PlusCircle size={120} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                                        <PlusCircle size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Sales Portal</h2>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        สำหรับเซลล์เพื่อสร้างคำขอใหม่ (ใบเสนอราคา/ใบเสร็จ)
                                        กรอกข้อมูลลูกค้าและรายการสินค้าได้ทันที
                                    </p>
                                    <div className="pt-4 flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all">
                                        เริ่มสร้างคำขอ <ArrowRight size={20} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Backoffice Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link href="/dashboard" className="group block h-full">
                            <div className="glass-card h-full p-8 border-2 border-transparent hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden text-right md:text-left">
                                <div className="absolute top-0 left-0 p-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors hidden md:block">
                                    <LayoutDashboard size={120} />
                                </div>
                                <div className="relative z-10 space-y-4 flex flex-col md:items-start items-center">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                        <BarChart3 size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Insights Dashboard</h2>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        สำหรับฝ่ายบริหารและหลังบ้าน ติดตามสถานะงานขาย
                                        รายงานสรุปยอด และการจัดการข้อมูลทั้งหมด
                                    </p>
                                    <div className="pt-4 flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                                        ดูรายงานผลงาน <ArrowRight size={20} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Features Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureItem
                        icon={<ShieldCheck className="text-green-500" />}
                        title="Slack Approval"
                        description="อนุมัติคำขอได้ทุกที่ผ่าน Slack ทันทีที่เซลล์ส่งเรื่อง"
                    />
                    <FeatureItem
                        icon={<Zap className="text-amber-500" />}
                        title="Real-time Sheets"
                        description="ซิงค์ข้อมูลลง Google Sheets อัตโนมัติ ไม่ต้องคีย์งานซ้ำ"
                    />
                    <FeatureItem
                        icon={<FileText className="text-primary-500" />}
                        title="Account Workflow"
                        description="กระบวนการส่งต่อข้อมูลบัญชีที่ชัดเจน ตรวจสอบย้อนกลับได้"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="py-10 text-center text-slate-400 text-sm">
                &copy; 2024 Smart Quotation System. All rights reserved.
            </footer>
        </div>
    );
}

function FeatureItem({ icon, title, description }: any) {
    return (
        <div className="flex flex-col items-center text-center space-y-3 p-6">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {icon}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    );
}
