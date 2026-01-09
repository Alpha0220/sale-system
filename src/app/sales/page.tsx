"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    User,
    Building2,
    DollarSign,
    ClipboardCheck,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Hash,
    MapPin,
    Plus,
    Trash2,
    Calendar,
    CreditCard,
    ArrowLeft,
    Home,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";

const REQUEST_TYPES = ["ใบเสนอราคา", "ใบเสร็จ"];
const PAYMENT_TERMS = ["เงินสด", "เครดิต 15 วัน", "เครดิต 30 วัน", "เครดิต 60 วัน"];

export default function SalesRequestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        quotationDate: new Date().toISOString().split('T')[0],
        customerName: "",
        customerTaxId: "",
        customerAddress: "",
        salesName: "",
        items: [{ name: "", qty: 1, price: 0, warrantyPeriod: "", warrantyConditions: "" }],
        paymentTerm: "เงินสด",
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        requestType: "ใบเสนอราคา",
        note: "",
    });

    useEffect(() => {
        const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const vat = subtotal * 0.07;
        const total = subtotal + vat;
        setFormData(prev => ({
            ...prev,
            subtotal,
            vatAmount: vat,
            totalAmount: total
        }));
    }, [formData.items]);

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: "", qty: 1, price: 0, warrantyPeriod: "", warrantyConditions: "" }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        if (formData.items.length === 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.customerName) throw new Error("กรุณากรอกชื่อลูกค้า");
            if (formData.totalAmount <= 0) throw new Error("ยอดเงินต้องมากกว่า 0");
            if (formData.items.some(item => !item.name)) throw new Error("กรุณากรอกชื่อสินค้าให้ครบถ้วน");

            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-900 dark:to-slate-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card max-w-md w-full text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                            <CheckCircle2 size={48} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">ส่งคำขอเรียบร้อยแล้ว!</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            ข้อมูลของคุณถูกบันทึกเข้าระบบแล้ว หลังบ้านจะเร่งตรวจสอบข้อมูลให้ครับ
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsSuccess(false);
                            setFormData({
                                quotationDate: new Date().toISOString().split('T')[0],
                                customerName: "",
                                customerTaxId: "",
                                customerAddress: "",
                                salesName: "",
                                items: [{ name: "", qty: 1, price: 0, warrantyPeriod: "", warrantyConditions: "" }],
                                paymentTerm: "เงินสด",
                                subtotal: 0,
                                vatAmount: 0,
                                totalAmount: 0,
                                requestType: "ใบเสนอราคา",
                                note: "",
                            });
                        }}
                        className="btn-primary w-full"
                    >
                        สร้างคำขอใหม่
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <Link href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 mb-2 transition-colors text-sm">
                            <ArrowLeft size={16} /> กลับหน้าหลัก
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            บันทึกคำขอเปิดบิล
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            กรอกข้อมูลการสั่งซื้อเพื่อแจ้งให้ฝ่ายบัญชีออกเอกสาร
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
                        Sales Portal
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Quotation Date */}
                            <div className="space-y-1">
                                <label className="label flex items-center gap-2">
                                    <Calendar size={16} className="text-primary-500" />
                                    วันที่
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.quotationDate}
                                    onChange={(e) => setFormData({ ...formData, quotationDate: e.target.value })}
                                />
                            </div>

                            {/* Sales Name */}
                            <div className="space-y-1">
                                <label className="label flex items-center gap-2">
                                    <User size={16} className="text-primary-500" />
                                    ชื่อเซลล์
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="กรอกชื่อของคุณ"
                                    className="input-field"
                                    value={formData.salesName}
                                    onChange={(e) => setFormData({ ...formData, salesName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="label flex items-center gap-2 text-primary-700 dark:text-primary-300 font-bold">
                                    <ClipboardCheck size={18} />
                                    รายการสินค้า/บริการและการรับประกัน
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-lg border border-primary-100 dark:border-primary-800 transition-colors"
                                >
                                    <Plus size={16} />
                                    เพิ่มรายการ
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 relative group transition-all hover:shadow-md">
                                        <div className="grid grid-cols-12 gap-4">
                                            {/* Product Details */}
                                            <div className="col-span-12 md:col-span-11 space-y-4">
                                                <div className="grid grid-cols-12 gap-3">
                                                    <div className="col-span-12 md:col-span-6 space-y-1">
                                                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ชื่อสินค้า/รายละเอียด</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="ระบุรายการ..."
                                                            className="input-field py-2"
                                                            value={item.name}
                                                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">จำนวน</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="1"
                                                            className="input-field py-2"
                                                            value={item.qty}
                                                            onChange={(e) => handleItemChange(index, "qty", parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ราคา/หน่วย</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            step="0.01"
                                                            className="input-field py-2"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Warranty for THIS ITEM */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1.5">
                                                            <ShieldCheck size={12} />
                                                            ระยะเวลารับประกัน (รายการนี้)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="เช่น 1 ปี, 6 เดือน"
                                                            className="input-field py-1.5 text-sm"
                                                            value={item.warrantyPeriod}
                                                            onChange={(e) => handleItemChange(index, "warrantyPeriod", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1.5">
                                                            <ShieldCheck size={12} />
                                                            เงื่อนไขรับประกัน (รายการนี้)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="ระบุชิ้นส่วนที่ประกัน..."
                                                            className="input-field py-1.5 text-sm"
                                                            value={item.warrantyConditions}
                                                            onChange={(e) => handleItemChange(index, "warrantyConditions", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <div className="col-span-12 md:col-span-1 flex md:items-start justify-end md:justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors p-2 md:mt-6"
                                                    title="ลบรายการ"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer info */}
                            <div className="space-y-1 md:col-span-2">
                                <label className="label flex items-center gap-2">
                                    <Building2 size={16} className="text-primary-500" />
                                    ชื่อลูกค้า/บริษัท
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="กรอกชื่อลูกค้าหรือชื่อบริษัท"
                                    className="input-field"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="label flex items-center gap-2">
                                    <Hash size={16} className="text-primary-500" />
                                    เลขผู้เสียภาษี (ถ้ามี)
                                </label>
                                <input
                                    type="text"
                                    placeholder="กรอกเลขผู้เสียภาษี"
                                    className="input-field"
                                    value={formData.customerTaxId}
                                    onChange={(e) => setFormData({ ...formData, customerTaxId: e.target.value })}
                                />
                            </div>

                            {/* Calculation Summary */}
                            <div className="space-y-3 md:col-span-2 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">รวมเป็นเงิน (Subtotal)</span>
                                    <span className="font-medium">฿{formData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                                    <span className="font-medium">฿{formData.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="font-bold text-slate-700 dark:text-slate-200">จำนวนเงินรวมทั้งสิ้น</span>
                                    <span className="text-xl font-extrabold text-primary-600">
                                        ฿{formData.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="label flex items-center gap-2">
                                    <CreditCard size={16} className="text-primary-500" />
                                    เงื่อนไขการชำระเงิน
                                </label>
                                <select
                                    required
                                    className="input-field appearance-none"
                                    value={formData.paymentTerm}
                                    onChange={(e) => setFormData({ ...formData, paymentTerm: e.target.value as any })}
                                >
                                    {PAYMENT_TERMS.map((term) => (
                                        <option key={term} value={term}>{term}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <label className="label flex items-center gap-2">
                                    <MapPin size={16} className="text-primary-500" />
                                    ที่อยู่สำหรับออกเอกสาร (ถ้ามี)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="ระบุที่อยู่..."
                                    className="input-field resize-none"
                                    value={formData.customerAddress}
                                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="label flex items-center gap-2">
                                    <ClipboardCheck size={16} className="text-primary-500" />
                                    ประเภทเอกสาร
                                </label>
                                <select
                                    required
                                    className="input-field appearance-none"
                                    value={formData.requestType}
                                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                                >
                                    {REQUEST_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <label className="label flex items-center gap-2">
                                    <MessageSquare size={16} className="text-primary-500" />
                                    หมายเหตุ (ไม่บังคับ)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="รายละเอียดเพิ่มเติม..."
                                    className="input-field resize-none"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm"
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-bold shadow-lg shadow-primary-500/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    กำลังบันทึกข้อมูล...
                                </>
                            ) : (
                                "ส่งคำขอเปิดบิล"
                            )}
                        </button>
                    </form>
                </motion.div>

                <div className="text-center text-slate-400 text-sm">
                    ฝ่ายหลังบ้านจะได้รับแจ้งเตือนทันทีหลังคุณกดส่ง
                </div>
            </div>
        </div>
    );
}
