import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generateReceiptPDF(element) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  return pdf;
}

export async function downloadReceiptPDF(element, bookingRef) {
  const pdf = await generateReceiptPDF(element);
  pdf.save(`DiscoverySamalResort_Booking_${bookingRef}.pdf`);
}

export async function pdfToBase64(element) {
  const pdf = await generateReceiptPDF(element);
  const blob = pdf.output("blob");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Strip the data:application/pdf;base64, prefix
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
