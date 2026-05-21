import crypto from "crypto";

const getEnv = (key: string, defaultValue: string = "") => {
    const value = process.env[key];
    if (!value) return defaultValue;
    // Strip leading/trailing quotes that might be in the .env file
    return value.replace(/^['"]|['"]$/g, "");
};

const IS_PRODUCTION = getEnv("NEXT_PUBLIC_REMITA_ENV") === "production";
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
    const rawData = `${REMITA_MERCHANT_ID}${REMITA_SERVICE_TYPE_ID}${orderId}${amount}${REMITA_API_KEY}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");
    
    console.log("[Remita Debug] Hash Calculation:");
    console.log(" - Merchant ID:", REMITA_MERCHANT_ID);
    console.log(" - Service Type ID:", REMITA_SERVICE_TYPE_ID);
    console.log(" - Order ID:", orderId);
    console.log(" - Amount:", amount);
    console.log(" - API Key (Secret):", REMITA_API_KEY ? "***" : "MISSING");
    console.log(" - Raw String:", rawData.replace(REMITA_API_KEY, "***"));
    console.log(" - Resulting Hash:", hash);
    
    return hash;
}

export async function initiateRemitaPayment(params: RemitaPaymentParams) {
    const hash = generateRemitaHash(params.orderId, params.amount);
    
    const nameParts = params.payerName.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    const payload = {
        merchantId: REMITA_MERCHANT_ID,
        serviceTypeId: REMITA_SERVICE_TYPE_ID,
        orderId: params.orderId,
        amount: params.amount.toString(),
        hash: hash,
        firstName: firstName,
        lastName: lastName,
        email: params.payerEmail,
        phone: params.payerPhone,
        customerId: params.payerEmail,
        description: params.description,
        narration: params.description
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
        amount: params.amount,
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
                "Accept": "application/json",
                "Authorization": `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hash}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Origin": "https://demo.remita.net",
                "Referer": "https://demo.remita.net/"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("[Remita] Raw Response:", text);

        if (!response.ok) {
            console.error(`[Remita] API Error: ${response.status} ${response.statusText}`);
            if (text.includes("<!DOCTYPE html>")) {
                throw new Error("Remita API returned HTML error (Access Denied). Check headers, credentials or IP whitelist.");
            }
        }

        const cleanText = text.replace(/^jsonp\((.*)\)$/, "$1").trim();
        
        let data;
        try {
            data = JSON.parse(cleanText);
        } catch (e) {
            console.error("[Remita] Failed to parse JSON response:", cleanText);
            throw new Error(`Invalid JSON response from Remita: ${cleanText.substring(0, 100)}...`);
        }
        
        console.log("[Remita] Parsed Response Data:", data);
        return data;
    } catch (error) {
        console.error("Remita RRR generation error:", error);
        throw error;
    }
}

export async function verifyRemitaPayment(transactionId: string) {
    // Modern Remita API v1 Query (Used in both Demo and Production for most modern integrations)
    // Formula: SHA512(transactionId + secretKey)
    const rawData = `${transactionId}${REMITA_API_KEY}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");

    const url = `${REMITA_BASE_URL}/payment/v1/payment/query/${transactionId}`;

    console.log("[Remita] Verifying payment (Modern API):", url);
    console.log("[Remita] Hashing string used:", `${transactionId}***`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "publicKey": REMITA_PUBLIC_KEY || "",
                "TXN_HASH": hash,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const data = await response.json();
        console.log("[Remita] Verification Response:", data);
        
        // responseCode "00" or "01" usually means success in modern Remita
        const isSuccess = data.responseCode === "00" || data.responseCode === "01";
        
        return {
            status: isSuccess ? "00" : data.responseCode,
            message: data.responseMsg,
            ...data
        };
    } catch (error) {
        console.error("Remita verification error:", error);
        throw error;
    }
}
