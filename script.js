// متغيرات أسعار الصرف
let buyRate = 0;
let sellRate = 0;
let officialRate = 0;


// جلب أسعار الصرف من الإنترنت
async function loadExchangeRates() {

    let buyElement = document.getElementById("buyRate");
    let sellElement = document.getElementById("sellRate");

    buyElement.innerHTML = "جاري تحميل الأسعار...";
    sellElement.innerHTML = "";

    try {

        const response = await fetch(
            "https://iraqsm.com/data/fx.json"
        );

        if (!response.ok) {
            throw new Error("فشل الاتصال بمصدر الأسعار");
        }

        const data = await response.json();

        // قراءة الأسعار
        const rates = data.data;

        buyRate = Number(rates.parallel.buy);
        sellRate = Number(rates.parallel.sell);
        officialRate = Number(rates.official.cbi);

        // عرض الأسعار
        buyElement.innerHTML =
            "سعر شراء الدولار: " +
            buyRate.toLocaleString("en-US") +
            " دينار";

        sellElement.innerHTML =
            "سعر بيع الدولار: " +
            sellRate.toLocaleString("en-US") +
            " دينار";

        document.getElementById("officialRate").innerHTML =
            "السعر الرسمي: " +
            officialRate.toLocaleString("en-US") +
            " دينار";

        document.getElementById("updateTime").innerHTML =
            "تاريخ البيانات: " + data.asOf;

    }

    catch (error) {

        buyElement.innerHTML =
            "تعذر تحميل أسعار الصرف";

        sellElement.innerHTML =
            "تحقق من اتصال الإنترنت";

        console.error(error);

    }

}


// تحويل العملات
function convertCurrency() {

    let amount = Number(
        document.getElementById("amount").value
    );

    let conversion =
        document.getElementById("conversion").value;

    let result = document.getElementById("result");

    if (!Number.isFinite(amount) || amount <= 0) {

        result.innerHTML = "يرجى إدخال مبلغ صحيح";
        return;

    }

    if (buyRate <= 0 || sellRate <= 0) {

        result.innerHTML = "يرجى تحميل أسعار الصرف أولاً";
        return;

    }

    let convertedAmount;

    if (conversion === "iqd-usd") {

        // شراء الدولار بالدينار
        convertedAmount = amount / sellRate;

        result.innerHTML =
            amount.toLocaleString("en-US") +
            " دينار = " +
            convertedAmount.toFixed(2) +
            " دولار";

    }

    else {

        // بيع الدولار مقابل الدينار
        convertedAmount = amount * buyRate;

        result.innerHTML =
            amount.toLocaleString("en-US") +
            " دولار = " +
            convertedAmount.toLocaleString("en-US", {
                maximumFractionDigits: 2
            }) +
            " دينار";

    }

}


// تحميل الأسعار عند فتح الموقع
window.onload = function() {

    loadExchangeRates();

};