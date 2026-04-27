import crypto from "crypto";

const REMITA_MERCHANT_ID = process.env.REMITA_MERCHANT_ID || "";
const REMITA_API_KEY = process.env.REMITA_API_KEY || "";
const REMITA_SERVICE_TYPE_ID = process.env.REMITA_SERVICE_TYPE_ID || "";
const REMITA_GATEWAY_URL = process.env.REMITA_GATEWAY_URL || "https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/system/developer/api/v1/" ; // Demo URL

export interface RemitaPaymentParams {
    orderId: string;
    amount: number;
    payerName: string;
    payerEmail: string;
    payerPhone: string;
    description: string;
}

export function generateRemitaHash(orderId: string, amount: number) {
    // Hash = SHA512(merchantId + serviceTypeId + orderId + amount + apiKey)
    const rawData = `${REMITA_MERCHANT_ID}${REMITA_SERVICE_TYPE_ID}${orderId}${amount}${REMITA_API_KEY}`;
    return crypto.createHash("sha512").update(rawData).digest("hex");
}

export async function initiateRemitaPayment(params: RemitaPaymentParams) {
    const hash = generateRemitaHash(params.orderId, params.amount);
    
    const payload = {
        merchantId: REMITA_MERCHANT_ID,
        serviceTypeId: REMITA_SERVICE_TYPE_ID,
        orderId: params.orderId,
        amount: params.amount.toString(),
        payerName: params.payerName,
        payerEmail: params.payerEmail,
        payerPhone: params.payerPhone,
        description: params.description,
        hash: hash
    };

    // In a real scenario, you might call Remita API to get an RRR first
    // or return the payload for a client-side inline checkout
    return payload;
}

export async function verifyRemitaPayment(rrr: string) {
    // Hash = SHA512(rrr + apiKey + merchantId)
    const rawData = `${rrr}${REMITA_API_KEY}${REMITA_MERCHANT_ID}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");

    const url = `https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/${REMITA_MERCHANT_ID}/${rrr}/${hash}/status.reg`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hash}`
            }
        });

        const data = await response.json();
        return data; // returns status, message, amount, etc.
    } catch (error) {
        console.error("Remita verification error:", error);
        throw error;
    }
}
