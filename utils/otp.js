export default function generateSixDigitOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }

