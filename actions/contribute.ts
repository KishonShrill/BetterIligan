'use server'

export async function submitContribution(formData: FormData, captchaToken: string) {
    // 1. Verify reCAPTCHA token first
    const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`, { method: 'POST' });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
        return { success: false, error: "CAPTCHA verification failed." };
    }

    // 2. Extract Data
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const details = formData.get('details') as string;
    const email = formData.get('email') as string;

    // 3. Format the Discord Embed
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) throw new Error("Discord webhook URL not configured.");

    const payload = {
        content: `🚨 **New Community Submission**`,
        embeds: [{
            title: type === 'report' ? `Update/Fix: ${title}` : `New Service: ${title}`,
            color: type === 'report' ? 15548997 : 5763719, // Red for report, Green for suggest
            fields: [
                { name: "Category", value: category || "None", inline: true },
                { name: "Contact Email", value: email || "Anonymous", inline: true },
                { name: "Details / Procedures / Links", value: details || "No details provided." }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    // 4. Send to Discord
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to send to Discord");
        return { success: true };

    } catch (error) {
        console.error("Webhook error:", error);
        return { success: false, error: "Failed to submit. Please try again later." };
    }
}
