import crypto from "crypto";

const getEnv = (key: string, defaultValue: string = "") => {
    const value = process.env[key];
    if (!value) return defaultValue;
    // Strip leading/trailing quotes that might be in the .env file
    return value.replace(/^['"]|['"]$/g, "");
};

const IS_PRODUCTION = getEnv("NEXT_PUBLIC_REMITA_ENV") === "production";
// Use demo.remita.net as requested by the user
const REMITA_BASE_URL = IS_PRODUCTION ? "https://api.remita.net" : "https://demo.remita.net";
const REMITA_BASE_URL_V1 = IS_PRODUCTION ? "https://remita.net" : "https://demo.remita.net";

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

export async function generateRRR(params: RemitaPaymentParams) {
    const hash = generateRemitaHash(params.orderId, params.amount);
    
    const url = `${REMITA_BASE_URL_V1}/remita/exapp/api/v1/send/api/bgatesvc/billing/generate`;
    
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

    console.log("[Remita] Generating RRR with URL:", url);
    console.log("[Remita] Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hash}`
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("[Remita] Raw Response:", text);

        // The response might be wrapped in jsonp-like format or just text
        const cleanText = text.replace(/^jsonp\((.*)\)$/, "$1");
        const data = JSON.parse(cleanText);
        
        console.log("[Remita] Parsed Response Data:", data);
        return data;
    } catch (error) {
        console.error("Remita RRR generation error:", error);
        throw error;
    }
}

export async function verifyRemitaPayment(transactionId: string) {
    if (IS_PRODUCTION) {
        // Modern Verification Hash = SHA512(transactionId + secretKey)
        const rawData = `${transactionId}${REMITA_API_KEY}`;
        const hash = crypto.createHash("sha512").update(rawData).digest("hex");

        // Modern Verification Endpoint: /payment/v1/payment/query/{transactionId}
        const url = `${REMITA_BASE_URL}/payment/v1/payment/query/${transactionId}`;

        console.log("[Remita] Verifying payment (Production):", url);

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
            console.log("[Remita] Verification Response:", data);
            
            // Map modern response to expected internal format if needed
            return {
                status: data.responseCode === "00" ? "00" : data.responseCode,
                message: data.responseMsg,
                ...data
            };
        } catch (error) {
            console.error("Remita verification error:", error);
            throw error;
        }
    } else {
        // Legacy/Standard Verification for Demo: /remita/ecomm/{merchantId}/{transactionId}/{hash}/status.reg
        // Hash for legacy: SHA512(transactionId + apiKey + merchantId)
        const rawData = `${transactionId}${REMITA_API_KEY}${REMITA_MERCHANT_ID}`;
        const hash = crypto.createHash("sha512").update(rawData).digest("hex");
        const url = `${REMITA_BASE_URL_V1}/remita/ecomm/${REMITA_MERCHANT_ID}/${transactionId}/${hash}/status.reg`;

        console.log("[Remita] Verifying payment (Demo):", url);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            console.log("[Remita] Verification Response:", data);

            // Legacy response usually has "status" and "message" or "responseCode"
            // If it returns a JSON with status, we map it to "00" for success if it's "Approved" or "00"
            const status = data.status || data.responseCode;
            return {
                status: (status === "00" || data.message === "Approved") ? "00" : status,
                message: data.message || data.responseMsg,
                ...data
            };
        } catch (error) {
            console.error("Remita legacy verification error:", error);
            throw error;
        }
    }
}
