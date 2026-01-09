export async function sendSlackRequestNotification(request: any) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("SLACK_WEBHOOK_URL is not set");
        return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "🚀 คำขอใหม่ต้องการการอนุมัติ",
                emoji: true
            }
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*ลูกค้า:*\n${request.customerName}`
                },
                {
                    type: "mrkdwn",
                    text: `*เซลล์:*\n${request.salesName}`
                }
            ]
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*ยอดเงินรวม:*\n฿${parseFloat(request.totalAmount).toLocaleString()}`
                },
                {
                    type: "mrkdwn",
                    text: `*ประเภท:*\n${request.requestType}`
                }
            ]
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*เงื่อนไขการชำระเงิน:* ${request.paymentTerm}`
            }
        },
        {
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "อนุมัติ (Approve)",
                        emoji: true
                    },
                    style: "primary",
                    value: request.id,
                    action_id: "approve_request"
                },
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "ปฏิเสธ (Reject)",
                        emoji: true
                    },
                    style: "danger",
                    value: request.id,
                    action_id: "reject_request"
                },
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "ดูรายละเอียด",
                        emoji: true
                    },
                    url: `${appUrl}/backoffice/${request.id}`,
                    action_id: "view_details"
                }
            ]
        }
    ];

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ blocks })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Slack Webhook error:", errorText);
        }
    } catch (error) {
        console.error("Failed to send Slack notification:", error);
    }
}
