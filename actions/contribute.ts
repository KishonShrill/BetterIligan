'use server'

import { z } from 'zod';
import { headers } from 'next/headers';

// Discord field limits are 1024 chars. We cap at 1000 to be safe.
const formSchema = z.object({
    type: z.enum(['suggest', 'report']),
    title: z.string().trim().min(2, "Title is too short").max(150, "Title is too long"),
    category: z.string().trim().min(2, "Category is too short").max(100, "Category is too long"),
    details: z.string().trim().min(5, "Details are too short").max(1000, "Details exceed 1000 characters"),
    // Email can be a valid email, or an empty string (since it's optional)
    email: z.union([z.string().email(), z.string().length(0)]).optional(),
});

// In Cloudflare Workers this resets when the instance spins down, 
// but it is highly effective at stopping rapid-fire bot loops in active containers.
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

export async function submitContribution(formData: FormData, captchaToken: string) {
    // We wrap EVERYTHING in a try/catch now so network errors don't crash the server action
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        if (ip !== 'unknown') {
            const userStatus = rateLimitMap.get(ip) || { count: 0, timestamp: now };
            if (now - userStatus.timestamp > 60000) { // 1 minute window
                userStatus.count = 1;
                userStatus.timestamp = now;
            } else {
                userStatus.count++;
                if (userStatus.count > 3) {
                    return { success: false, error: "You are submitting too fast. Please wait a minute." };
                }
            }
            rateLimitMap.set(ip, userStatus);
        }

        const rawData = {
            type: formData.get('type'),
            title: formData.get('title'),
            category: formData.get('category'),
            details: formData.get('details'),
            email: formData.get('email'),
        };

        const validatedFields = formSchema.safeParse(rawData);

        if (!validatedFields.success) {
            console.error("Validation Error:", validatedFields.error.flatten());
            return { success: false, error: validatedFields.error.flatten().fieldErrors.details };
        }

        const { type, title, category, details, email } = validatedFields.data;

        // --- 3. SECURE RECAPTCHA VERIFICATION ---
        const verifyBody = new URLSearchParams();
        verifyBody.append('secret', process.env.RECAPTCHA_SECRET_KEY!);
        verifyBody.append('response', captchaToken);
        if (ip !== 'unknown') verifyBody.append('remoteip', ip);

        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: verifyBody.toString()
        });

        const verifyData = await verifyRes.json();

        //if (!verifyData.success) {
        //    console.error("reCAPTCHA failed:", verifyData);
        //    return { success: false, error: "CAPTCHA verification failed." };
        //}

        // --- 4. FORMAT DISCORD EMBED ---
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

        // --- 5. SEND TO DISCORD ---
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Failed to send to Discord: ${response.status}`);

        return { success: true };

    } catch (error) {
        console.error("Webhook/Server error:", error);
        return { success: false, error: "Failed to submit. Please try again later." };
    }
}
