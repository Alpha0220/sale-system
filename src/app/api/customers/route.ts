import { NextResponse } from "next/server";
import { getAllData, CUSTOMERS_SHEET, addRow } from "@/lib/google-sheets";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    try {
        const customers = await getAllData(CUSTOMERS_SHEET);
        return NextResponse.json(customers);
    } catch (error: any) {
        console.error("GET /api/customers error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { companyName, taxId, address } = body;

        if (!companyName) {
            return NextResponse.json({ message: "ชื่อบริษัทห้ามว่าง" }, { status: 400 });
        }

        const newCustomer = {
            id: uuidv4(),
            companyName,
            taxId: taxId || "",
            address: address || "",
            createdAt: new Promise(resolve => resolve(new Date().toISOString())), // Dummy way to handle dates
            updatedAt: new Date().toISOString(),
        };

        // Wait for the date promise if I used one, but let's just use string
        const rowData = {
            ...newCustomer,
            createdAt: new Date().toISOString()
        };

        await addRow(CUSTOMERS_SHEET, rowData);

        return NextResponse.json(rowData);
    } catch (error: any) {
        console.error("POST /api/customers error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}