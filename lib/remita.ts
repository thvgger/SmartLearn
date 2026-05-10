import crypto from "crypto";

const getEnv = (key: string, defaultValue: string = "") => {
    const value = process.env[key];
    if (!value) return defaultValue;
    // Strip leading/trailing quotes that might be in the .env file
    return value.replace(/^['"]|['"]$/g, "");
};

const IS_PRODUCTION = getEnv("NEXT_PUBLIC_REMITA_ENV") === "production";
// Use remitademo.net for sandbox as the user reported demo.remita.net refused to connect
const REMITA_BASE_URL = IS_PRODUCTION ? "https://api.remita.net" : "https://remitademo.net";

const REMITA_MERCHANT_ID = getEnv("REMITA_MERCHANT_ID");
const REMITA_API_KEY = getEnv("REMITA_API_KEY"); // This is often the Secret Key in modern APIs
const REMITA_PUBLIC_KEY = getEnv("NEXT_PUBLIC_REMITA_PUBLIC_KEY");
const REMITA_SERVICE_TYPE_ID = getEnv("REMITA_SERVICE_TYPE_ID");

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
    // Note: Modern initiation still often uses this legacy-style hash for the inline payload 
    // but the verification uses a different one.
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
        narration: params.description,
        hash: hash
    };

    return payload;
}

export async function verifyRemitaPayment(transactionId: string) {
    // Modern Verification Hash = SHA512(transactionId + secretKey)
    // Using REMITA_API_KEY as the secretKey as it's common practice in these integrations
    const rawData = `${transactionId}${REMITA_API_KEY}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");

    // Modern Verification Endpoint: /payment/v1/payment/query/{transactionId}
    const url = `${REMITA_BASE_URL}/payment/v1/payment/query/${transactionId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publicKey": REMITA_PUBLIC_KEY,
                "TXN_HASH": hash
            }
        });

        const data = await response.json();
        
        // Map modern response to expected internal format if needed
        // Modern response usually has responseCode, responseMsg, etc.
        return {
            status: data.responseCode === "00" ? "00" : data.responseCode,
            message: data.responseMsg,
            ...data
        };
    } catch (error) {
        console.error("Remita verification error:", error);
        throw error;
    }
}
