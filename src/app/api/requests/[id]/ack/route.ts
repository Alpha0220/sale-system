import { NextResponse } from "next/server";
import { updateRowByValue, REQUESTS_SHEET } from "@/lib/google-sheets";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const updated = await updateRowByValue(REQUESTS_SHEET, "id", id, {
            status: "รับเรื่องแล้ว",
            updatedAt: new Date().toISOString(),
        });

        if (!updated) {
            return NextResponse.json({ message: "ไม่พบคำขอนี้" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST /api/requests/:id/ack error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
