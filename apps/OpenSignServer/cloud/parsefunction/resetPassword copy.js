export default async function convertDocxToPdf(request) {
    const { docxFilePath } = request.params;

    if (!docxFilePath) {
        throw new Error("Debes proporcionar la ruta del archivo DOCX.");
    }

    const outputPdfPath = path.join("/tmp", "output.pdf");

    // Convertir DOCX a PDF usando LibreOffice
    return new Promise((resolve, reject) => {
        exec(`libreoffice --headless --convert-to pdf ${docxFilePath} --outdir /tmp`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error al convertir el archivo: ${stderr}`);
            } else {
                const pdfData = fs.readFileSync(outputPdfPath, { encoding: "base64" });
                resolve({ pdfBase64: pdfData });
            }
        });
    });
}