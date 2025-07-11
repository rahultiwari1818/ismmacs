import { encrypt } from "../utils/utils.js";
import { v4 as uuidv4 } from 'uuid';


export const redirectToPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      res.status(400).json({
        message: "Amount is Required.!",
      });
      return;
    }

    const merchantId = process.env.MERCHANT_ID;

    const aesKey = process.env.AES_KEY;


const referenceNo = uuidv4(); 


    const encryptedMandatoryFields = encrypt(`${referenceNo}|11|${amount}`, aesKey);
    const encryptedReturnUrl = encrypt("https://ismmacs.daiict.ac.in/", aesKey);
    const encryptedReferenceNo = encrypt(referenceNo, aesKey);
    const encryptedSubmerchantid = encrypt("11", aesKey);
    const encryptedTransactionAmount = encrypt(amount, aesKey);
    const encryptedPaymode = encrypt("9", aesKey);

    const finalUrl =
      `https://eazypayuat.icicibank.com/EazyPG?merchantid=${merchantId}` +
      `&mandatory%20fields=${encodeURIComponent(encryptedMandatoryFields)}` +
      `&optional%20fields=` +
      `&returnurl=${encodeURIComponent(encryptedReturnUrl)}` +
      `&Reference%20No=${encodeURIComponent(encryptedReferenceNo)}` +
      `&submerchantid=${encodeURIComponent(encryptedSubmerchantid)}` +
      `&transaction%20amount=${encodeURIComponent(
        encryptedTransactionAmount
      )}` +
      `&paymode=${encodeURIComponent(encryptedPaymode)}`;

    res.status(200).json({
      link: finalUrl,
    });


  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error.!",
    });
    console.log("Error While Encrypting payment link : ", error);
  }
};
