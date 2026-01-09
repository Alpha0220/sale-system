import { NextResponse } from "next/server";
import {
    updateRowByValue,
    addRow,
    REQUESTS_SHEET,
    INVOICES_SHEET
} from "@/lib/google-sheets";
import { v4 as uuidv4 } from "uuid";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { invoiceNo, invoiceDate, vatAmount } = body;

        if (!invoiceNo || !invoiceDate) {
            return NextResponse.json({ message: "กรุณาระบุเลขที่และวันที่ Invoice" }, { status: 400 });
        }

        // 1. Create Invoice Record
        const invoiceRecord = {
            id: uuidv4(),
            quotationRequestId: id,
            invoiceNo,
            invoiceDate,
            vatAmount: vatAmount ? parseFloat(vatAmount) : 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await addRow(INVOICES_SHEET, invoiceRecord);

        // 2. Update Request Status
        const updated = await updateRowByValue(REQUESTS_SHEET, "id", id, {
            status: "เปิดบิลแล้ว",
            updatedAt: new Date().toISOString(),
        });

        if (!updated) {
            return NextResponse.json({ message: "ไม่พบคำขอนี้" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST /api/requests/:id/invoice error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
