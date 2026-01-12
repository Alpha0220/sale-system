import { NextResponse } from "next/server";
import { updateRowByValue, REQUESTS_SHEET } from "@/lib/google-sheets";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const payloadString = formData.get("payload");

        if (!payloadString) {
            return new Response("No payload", { status: 400 });
        }

        const payload = JSON.parse(payloadString as string);
        const action = payload.actions?.[0];
        const requestId = action?.value;
        const actionId = action?.action_id;

        if (!requestId || !actionId) {
            return new Response("Invalid action", { status: 400 });
        }

        let newStatus: string = "";
        let slackMessage: string = "";

        if (actionId === "approve_request") {
            newStatus = "รอหลังบ้านตรวจสอบ";
            slackMessage = "✅ *อนุมัติเรียบร้อยแล้ว* และบันทึกข้อมูลเข้าสู่ระบบหลังบ้านแล้ว";
        } else if (actionId === "reject_request") {
            newStatus = "ไม่อนุมัติ";
            slackMessage = "❌ *คำขอนี้ไม่อนุมัติ*";
        }

        if (newStatus) {
            // Update Google Sheets
            await updateRowByValue(REQUESTS_SHEET, "id", requestId, {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });

            // Update Slack Message
            const responseUrl = payload.response_url;
            if (responseUrl) {
                await fetch(responseUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        replace_original: true,
                        blocks: [
                            ...payload.message.blocks.slice(0, -1), // Original info blocks
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: slackMessage
                                }
                            }
                        ]
                    })
                });
            }
        }

        return new Response("OK", { status: 200 });
    } catch (error: any) {
        console.error("Slack Interaction Error:", error);
        return new Response("Error", { status: 500 });
    }
}
