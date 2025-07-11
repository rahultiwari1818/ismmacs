import { encrypt, generateReferenceNo } from "../utils/utils.js";
import Registration from "../model/registration.model.js";



export const initiateRegistrationAndPayment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      instituteName,
      email,
      phone,
      nationality,
      membership,
      category,
      address,
      amount,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !category || !amount) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    let membershipReceiptPath = null;

    if (membership === "New ISMMACS Member") {
      if (!req.file) {
        return res.status(400).json({ message: "Membership receipt is required for New ISMMACS Member." });
      }
      membershipReceiptPath = req.file.path;
    }

    const referenceNo = generateReferenceNo();

    const newReg = await Registration.create({
      firstName,
      lastName,
      instituteName,
      email,
      phone,
      nationality,
      membership,
      category,
      address,
      amount,
      membershipReceiptPath,
      paymentStatus: "Pending",
      paymentReference: referenceNo,
    });

    const merchantId = process.env.MERCHANT_ID;
    const subMerchantId = process.env.SUB_MERCHANT_ID;
    const aesKey = process.env.AES_KEY;
    const returnUrl = process.env.RETURN_URL;

    const mandatoryFields = `${referenceNo}|${subMerchantId}|${amount}`;
    const encryptedMandatoryFields = encrypt(mandatoryFields, aesKey);
    const encryptedReturnUrl = encrypt(returnUrl, aesKey);
    const encryptedReferenceNo = encrypt(referenceNo, aesKey);
    const encryptedSubmerchantid = encrypt(subMerchantId, aesKey);
    const encryptedTransactionAmount = encrypt(amount, aesKey);
    const encryptedPaymode = encrypt("9", aesKey);

    const finalUrl =
      `https://eazypayuat.icicibank.com/EazyPG?merchantid=${merchantId}` +
      `&mandatory%20fields=${encodeURIComponent(encryptedMandatoryFields)}` +
      `&optional%20fields=` +
      `&returnurl=${encodeURIComponent(encryptedReturnUrl)}` +
      `&Reference%20No=${encodeURIComponent(encryptedReferenceNo)}` +
      `&submerchantid=${encodeURIComponent(encryptedSubmerchantid)}` +
      `&transaction%20amount=${encodeURIComponent(encryptedTransactionAmount)}` +
      `&paymode=${encodeURIComponent(encryptedPaymode)}`;

    return res.status(200).json({
      paymentLink: finalUrl,
      registrationId: newReg._id,
      referenceNo: referenceNo,
    });
  } catch (error) {
    console.error("Error initiating registration/payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const handlePaymentCallback = async (req, res) => {
  try {
    const {
      ReferenceNo,
      "Transaction Amount": transactionAmount,
      "Payment Mode": paymentMode,
      "Transaction Date": transactionDate,
      "Response Code": responseCode
    } = req.body;

    // Find registration by ReferenceNo
    const registration = await Registration.findOne({ paymentReference: ReferenceNo });

    if (!registration) {
      return res.status(404).send("Registration not found.");
    }

    if (responseCode === "E000") {
      registration.paymentStatus = "Success";
      registration.paymentDate = transactionDate;
      registration.amount = transactionAmount;
      registration.paymentMode = paymentMode;
    } else {
      registration.paymentStatus = "Failed";
    }

    await registration.save();

    // Redirect to success or failure page
    if (responseCode === "E000") {
      const successUrl = `/payment-success?referenceNo=${ReferenceNo}&name=${encodeURIComponent(registration.firstName + " " + registration.lastName)}&amount=${transactionAmount}&email=${encodeURIComponent(registration.email)}`;
      return res.redirect(successUrl);
    } else {
      return res.redirect("/payment-failure");
    }

  } catch (error) {
    console.error("Payment callback error: ", error);
    res.status(500).send("Internal Server Error");
  }
};