import crypto from "crypto";
import fs from "fs";
import path from "path";

// Simple .env loader
function loadEnv() {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, "utf-8");
        envConfig.split("\n").forEach(line => {
            const [key, ...valueParts] = line.split("=");
            if (key && valueParts.length > 0) {
                const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
                process.env[key.trim()] = value;
            }
        });
    }
}

loadEnv();

const MERCHANT_ID = process.env.REMITA_MERCHANT_ID;
const API_KEY = process.env.REMITA_API_KEY;
const SERVICE_TYPE_ID = process.env.REMITA_SERVICE_TYPE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY;
const ENV = process.env.NEXT_PUBLIC_REMITA_ENV || "demo";

const BASE_URL = ENV === "production" ? "https://remita.net" : "https://demo.remita.net";

console.log("--- Remita Configuration ---");
console.log("Environment:", ENV);
console.log("Merchant ID:", MERCHANT_ID);
console.log("Service Type ID:", SERVICE_TYPE_ID);
console.log("Public Key:", PUBLIC_KEY ? PUBLIC_KEY.substring(0, 10) + "..." : "MISSING");
console.log("API Key (Secret):", API_KEY ? "***" : "MISSING");
console.log("----------------------------\n");

async function testRRRGeneration() {
    console.log("Testing RRR Generation (v1 API)...");
    
    const orderId = "TEST-" + Date.now();
    const amount = 1000;
    
    // Hash = SHA512(merchantId + serviceTypeId + orderId + amount + apiKey)
    const rawData = `${MERCHANT_ID}${SERVICE_TYPE_ID}${orderId}${amount}${API_KEY}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");
    
    const url = `${BASE_URL}/remita/exapp/api/v1/send/api/bgatesvc/billing/generate`;
    
    const payload = {
        merchantId: MERCHANT_ID,
        serviceTypeId: SERVICE_TYPE_ID,
        orderId: orderId,
        amount: amount,
        payerName: "Test User",
        payerEmail: "test@example.com",
        payerPhone: "08012345678",
        description: "Test Payment",
        hash: hash
    };

    console.log("URL:", url);
    console.log("Hash String:", rawData.replace(API_KEY || "", "***"));
    console.log("Hash:", hash);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `remitaConsumerKey=${MERCHANT_ID},remitaConsumerToken=${hash}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Origin": "https://demo.remita.net",
                "Referer": "https://demo.remita.net/"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("Status:", response.status, response.statusText);
        console.log("Response Body:", text);

        try {
            const data = JSON.parse(text.replace(/^jsonp\((.*)\)$/, "$1"));
            console.log("Parsed Data:", JSON.stringify(data, null, 2));
        } catch (e) {
            console.log("Could not parse as JSON (might be HTML or raw text)");
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

async function testVerificationV2() {
    console.log("\nTesting Transaction Verification (v2 API)...");
    
    const transactionId = "TEST-VERIFY-" + Date.now();
    
    // Hash = SHA512(transactionId + apiKey)
    const rawData = `${transactionId}${API_KEY}`;
    const hash = crypto.createHash("sha512").update(rawData).digest("hex");
    
    const url = `${BASE_URL}/payment/v1/payment/query/${transactionId}`;
    
    console.log("URL:", url);
    console.log("Public Key:", PUBLIC_KEY ? PUBLIC_KEY.substring(0, 10) + "..." : "MISSING");
    console.log("Hash String:", rawData.replace(API_KEY || "", "***"));
    console.log("Hash:", hash);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "publicKey": PUBLIC_KEY || "",
                "TXN_HASH": hash
            }
        });

        const text = await response.text();
        console.log("Status:", response.status, response.statusText);
        console.log("Response Body:", text);

        try {
            const data = JSON.parse(text);
            console.log("Parsed Data:", JSON.stringify(data, null, 2));
        } catch (e) {
            console.log("Could not parse as JSON");
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

async function runTests() {
    await testRRRGeneration();
    await testVerificationV2();
}

runTests();
