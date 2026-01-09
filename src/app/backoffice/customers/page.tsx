"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Building2,
    Search,
    UserPlus,
    Loader2,
    AlertCircle,
    Hash,
    MapPin,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Customer } from "@/lib/google-sheets";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        taxId: "",
        address: "",
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/customers");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            } else {
                console.error("Customers data is not an array:", data);
                setCustomers([]);
            }
        } catch (err) {
            console.error("Failed to fetch customers", err);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to add customer");

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setShowForm(false);
                setFormData({ companyName: "", taxId: "", address: "" });
                fetchCustomers();
            }, 1500);
        } catch (err) {
            alert("เกิดข้อผิดพลาด");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <Link href="/backoffice" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600">
                        <ArrowLeft size={20} />
                        กลับสู่แดชบอร์ด
                    </Link>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        {showForm ? "ยกเลิก" : <><UserPlus size={18} /> เพิ่มลูกค้าใหม่</>}
                    </button>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card overflow-hidden"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-primary-500" />
                                กรอกข้อมูลลูกค้าใหม่
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="label">ชื่อลูกค้า/บริษัท *</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">เลขผู้เสียภาษี</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.taxId}
                                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="label">ที่อยู่</label>
                                        <textarea
                                            rows={2}
                                            className="input-field resize-none"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting || isSuccess}
                                    className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${isSuccess ? "bg-green-600" : ""}`}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : isSuccess ? <CheckCircle2 size={20} /> : "บันทึกข้อมูลลูกค้า"}
                                    {isSuccess ? "สำเร็จ!" : ""}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="text-primary-500" />
                        รายชื่อลูกค้าทั้งหมด ({customers.length})
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isLoading ? (
                            <div className="col-span-2 py-20 text-center">
                                <Loader2 className="animate-spin mx-auto text-primary-500" size={32} />
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="col-span-2 py-20 text-center text-slate-500 glass rounded-2xl">
                                ไม่มีข้อมูลลูกค้า
                            </div>
                        ) : (
                            customers.map((c) => (
                                <motion.div
                                    key={c.id}
                                    layout
                                    className="glass-card flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{c.companyName}</h3>
                                        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Hash size={14} className="text-slate-400" />
                                                <span>TAX ID: {c.taxId || "ไม่ได้ระบุ"}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">{c.address || "ไม่มีที่อยู่"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
