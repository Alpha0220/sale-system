import { NextResponse } from "next/server";
import {
    getAllData,
    REQUESTS_SHEET,
    CUSTOMERS_SHEET,
    INVOICES_SHEET,
    QuotationRequest,
    Customer,
    InvoiceRecord
} from "@/lib/google-sheets";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const [requests, invoices] = await Promise.all([
            getAllData<QuotationRequest>(REQUESTS_SHEET),
            getAllData<InvoiceRecord>(INVOICES_SHEET)
        ]);

        // Filter and Join
        let filteredRequests = [...requests];

        if (status) {
            filteredRequests = filteredRequests.filter(r => r.status === status);
        }
        if (from) {
            filteredRequests = filteredRequests.filter(r => new Date(r.createdAt) >= new Date(from));
        }
        if (to) {
            filteredRequests = filteredRequests.filter(r => new Date(r.createdAt) <= new Date(to));
        }

        const exportData = filteredRequests.map(r => {
            const invoice = invoices.find(i => i.quotationRequestId === r.id);

            let items: any[] = [];
            try {
                const rawData = r.itemsRaw || r.items;
                items = typeof rawData === 'string' && rawData.trim().startsWith('[')
                    ? JSON.parse(rawData)
                    : [];
            } catch (e) { }

            const productNames = items.length > 0
                ? items.map(item => {
                    let s = item.name;
                    if (item.warrantyPeriod) s += ` [ประกัน: ${item.warrantyPeriod}]`;
                    if (item.warrantyConditions) s += ` (เงื่อนไข: ${item.warrantyConditions})`;
                    return s;
                }).join("\n")
                : r.items;

            const productQtys = items.length > 0
                ? items.map(item => item.qty).join("\n")
                : "-";

            const productPrices = items.length > 0
                ? items.map(item => parseFloat(item.price).toLocaleString()).join("\n")
                : "-";

            return {
                "วันที่บันทึก": format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm', { locale: th }),
                "วันที่ในเอกสาร": format(new Date(r.quotationDate), 'dd/MM/yyyy', { locale: th }),
                "ชื่อลูกค้า": r.customerName,
                "เลขผู้เสียภาษี": r.customerTaxId || "-",
                "ที่อยู่": r.customerAddress || "-",
                "รายการสินค้า/บริการ": productNames,
                "จำนวน": productQtys,
                "ราคาต่อหน่วย": productPrices,
                "ชื่อเซลล์": r.salesName,
                "เงื่อนไขการชำระเงิน": r.paymentTerm || "-",
                "รวมเป็นเงิน": parseFloat(String(r.subtotal || 0)),
                "VAT 7%": parseFloat(String(r.vatAmount || 0)),
                "ยอดเงินรวมทั้งสิ้น": parseFloat(r.totalAmount.toString()),
                "ประเภทเอกสาร": r.requestType,
                "สถานะ": r.status,
                "เลขอ้างอิง Invoice": invoice?.invoiceNo || "-",
                "วันที่ออก Invoice": invoice?.invoiceDate ? format(new Date(invoice.invoiceDate), 'dd/MM/yyyy', { locale: th }) : "-",
                "หมายเหตุ": r.note || "-"
            };
        });

        // Create Excel Workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

        // Generate buffer
        const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        const filename = `export_${status || 'all'}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;

        return new NextResponse(buf, {
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error: any) {
        console.error("GET /api/export error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
