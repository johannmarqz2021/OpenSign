import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'node:fs';
import fontkit from '@pdf-lib/fontkit';
import moment from 'moment-timezone'

export default async function GenerateCertificate(docDetails) {
  const pdfDoc = await PDFDocument.create();
  // `fontBytes` is used to embed custom font in pdf
  const fontBytes = fs.readFileSync('./font/times.ttf'); //
  pdfDoc.registerFontkit(fontkit);
  const timesRomanFont = await pdfDoc.embedFont(fontBytes, { subset: true });
  const pngUrl = fs.readFileSync('./logo.png').buffer;
  const pngImage = await pdfDoc.embedPng(pngUrl);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const startX = 15;
  const startY = 15;
  const borderColor = rgb(0.12, 0.12, 0.12);
  const titleColor = rgb(0, 0.2, 0.4); //rgb(0, 0.53, 0.71);
  const titleUnderline = rgb(0, 0.2, 0.4); // rgb(0.12, 0.12, 0.12);
  const title = 25;
  const subtitle = 20;
  const text = 14;
  const timeText = 11;
  const textKeyColor = rgb(0.12, 0.12, 0.12);
  const textValueColor = rgb(0.3, 0.3, 0.3);
  const completedAt = new Date();
  const completedUTCtime = moment(completedAt).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
  const signersCount = docDetails?.Signers?.length || 1;
  const generateAt = new Date();
  const generatedUTCTime = generateAt;
  const generatedOn = 'Generado el ' + moment(generatedUTCTime).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
  const OriginIp = docDetails?.OriginIp || '';
  const company = docDetails?.ExtUserPtr?.Company || '';
  const createdAt = docDetails?.DocSentAt?.iso || docDetails.createdAt;
  const IsEnableOTP = docDetails?.IsEnableOTP || false;
  const auditTrail =
    docDetails?.Signers?.length > 0
      ? docDetails.AuditTrail.map(x => {
        const data = docDetails.Signers.find(y => y.objectId === x.UserPtr.objectId);
        return {
          ...data,
          ipAddress: x.ipAddress,
          SignedOn: moment(x?.SignedOn || generatedUTCTime).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss'),
          ViewedOn: moment(x?.ViewedOn || x?.SignedOn || generatedUTCTime).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss'),
          Signature: x?.Signature || '',
        };
      })
      : [
        {
          ...docDetails.ExtUserPtr,
          ipAddress: docDetails?.AuditTrail[0].ipAddress,
          SignedOn: moment(docDetails?.AuditTrail[0]?.SignedOn || generatedUTCTime).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss'),
          ViewedOn: moment(
            docDetails?.AuditTrail[0]?.ViewedOn ||
            docDetails?.AuditTrail[0]?.SignedOn ||
            generatedUTCTime).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss'),
          Signature: docDetails?.AuditTrail[0]?.Signature || '',
        },
      ];

  const half = width / 2;
  // Draw a border
  page.drawRectangle({
    x: startX,
    y: startY,
    width: width - 2 * startX,
    height: height - 2 * startY,
    borderColor: borderColor,
    borderWidth: 1,
  });
  page.drawImage(pngImage, {
    x: 30,
    y: 790,
    width: 100,
    height: 25,
  });

  page.drawText(generatedOn, {
    x: 400,
    y: 810,
    size: 12,
    font: timesRomanFont,
    color: rgb(0.12, 0.12, 0.12),
  });

  page.drawText('Certificado de Finalización', {
    x: 160,
    y: 750,
    size: title,
    font: timesRomanFont,
    color: titleColor,
  });

  const underlineY = 740;
  page.drawLine({
    start: { x: 30, y: underlineY },
    end: { x: width - 30, y: underlineY },
    color: titleUnderline,
    thickness: 1,
  });

  page.drawText('Resumen', {
    x: 30,
    y: 710,
    size: subtitle,
    font: timesRomanFont,
    color: titleColor,
  });

  page.drawText('Id del Documento:', {
    x: 30,
    y: 685,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(docDetails.objectId, {
    x: 137,
    y: 685,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawText('Nombre del Documento:', {
    x: 30,
    y: 665,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(docDetails.Name, {
    x: 170,
    y: 665,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawText('Compañía:', {
    x: 30,
    y: 645,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(company, {
    x: 93,
    y: 645,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Creado el:', {
    x: 30,
    y: 625,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${moment(new Date(createdAt)).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss')}`, {
    x: 90,
    y: 625,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Completado el:', {
    x: 30,
    y: 605,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${completedUTCtime}`, {
    x: 119,
    y: 605,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Firmantes:', {
    x: 30,
    y: 585,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${signersCount}`, {
    x: 92,
    y: 585,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Originador del Documento', {
    x: 30,
    y: 565,
    size: 17,
    font: timesRomanFont,
    color: titleColor,
  });
  page.drawText('Nombre:', {
    x: 60,
    y: 545,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(`${docDetails.ExtUserPtr.Name}`, {
    x: 111,
    y: 545,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Email :', {
    x: 60,
    y: 525,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(`${docDetails.ExtUserPtr.Email}`, {
    x: 111,
    y: 525,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Dirección IP:', {
    x: 60,
    y: 505,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(`${OriginIp}`, {
    x: 138,
    y: 505,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawLine({
    start: { x: 30, y: 495 },
    end: { x: width - 30, y: 495 },
    color: rgb(0.12, 0.12, 0.12),
    thickness: 0.5,
  });
  let yPosition1 = 475;
  let yPosition2 = 455;
  let yPosition3 = 435;
  let yPosition4 = 415;
  let yPosition5 = 395;
  let yPosition6 = 360;
  auditTrail.slice(0, 3).forEach(async (x, i) => {
    const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';
    page.drawText(`Firmante ${i + 1}`, {
      x: 30,
      y: yPosition1,
      size: subtitle,
      font: timesRomanFont,
      color: titleColor,
    });
    page.drawText('Nombre:', {
      x: 30,
      y: yPosition2,
      size: text,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.Name, {
      x: 81,
      y: yPosition2,
      size: text,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Visto el:', {
      x: half + 55,
      y: yPosition2,
      size: timeText,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${x.ViewedOn}`, {
      x: half + 108,
      y: yPosition2,
      size: timeText,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Email:', {
      x: 30,
      y: yPosition3,
      size: text,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.Email, {
      x: 70,
      y: yPosition3,
      size: text,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Firmado el:', {
      x: half + 55,
      y: yPosition3 + 5,
      size: timeText,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${x.SignedOn}`, {
      x: half + 108,
      y: yPosition3 + 5,
      size: timeText,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Dirección IP:', {
      x: 30,
      y: yPosition4,
      size: text,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.ipAddress, {
      x: 107,
      y: yPosition4,
      size: 13,
      font: timesRomanFont,
      color: textValueColor,
    });
    if (IsEnableOTP) {
      page.drawText('Nivel de seguridad:', {
        x: half + 55,
        y: yPosition4 + 10,
        size: timeText,
        font: timesRomanFont,
        color: textKeyColor,
      });
      page.drawText('Email, OTP', {
        x: half + 142,
        y: yPosition4 + 10,
        size: timeText,
        font: timesRomanFont,
        color: textValueColor,
      });
    }
    page.drawText('Firma:', {
      x: 30,
      y: yPosition5,
      size: text,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawRectangle({
      x: 98,
      y: yPosition5 - 30,
      width: 104,
      height: 44,
      borderColor: rgb(0.22, 0.18, 0.47),
      borderWidth: 1,
    });
    if (embedPng) {
      page.drawImage(embedPng, {
        x: 100,
        y: yPosition5 - 27,
        width: 100,
        height: 40,
      });
    }
    page.drawLine({
      start: { x: 30, y: yPosition6 },
      end: { x: width - 30, y: yPosition6 },
      color: rgb(0.12, 0.12, 0.12),
      thickness: 0.5,
    });

    yPosition1 = yPosition6 - 20;
    yPosition2 = yPosition1 - 20;
    yPosition3 = yPosition2 - 20;
    yPosition4 = yPosition3 - 20;
    yPosition5 = yPosition4 - 20;
    yPosition6 = yPosition6 - 140;
  });

  if (auditTrail.length > 3) {
    let currentPageIndex = 1;
    let currentPage = page;
    auditTrail.slice(3).forEach(async (x, i) => {
      const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';

      // Calculate remaining space on current page
      const remainingSpace = yPosition6;

      // If there's not enough space for the next entry, create a new page
      if (remainingSpace < 90) {
        // Adjust the value as needed
        currentPageIndex++;
        currentPage = pdfDoc.addPage();
        currentPage.drawRectangle({
          x: startX,
          y: startY,
          width: width - 2 * startX,
          height: height - 2 * startY,
          borderColor: borderColor,
          borderWidth: 1,
        });
        yPosition1 = currentPage.getHeight() - 40;
        yPosition2 = yPosition1 - 20;
        yPosition3 = yPosition2 - 20;
        yPosition4 = yPosition3 - 20;
        yPosition5 = yPosition4 - 20;
        yPosition6 = currentPage.getHeight() - 160;
      }

      currentPage.drawText(`Firmante ${4 + i}`, {
        x: 30,
        y: yPosition1,
        size: subtitle,
        font: timesRomanFont,
        color: titleColor,
      });
      currentPage.drawText('Nombre:', {
        x: 30,
        y: yPosition2,
        size: text,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.Name, {
        x: 75,
        y: yPosition2,
        size: text,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Visto el:', {
        x: half,
        y: yPosition2,
        size: timeText,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${new Date(x.ViewedOn).toUTCString()}`, {
        x: half + 71,
        y: yPosition2,
        size: timeText,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Email:', {
        x: 30,
        y: yPosition3,
        size: text,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.Email, {
        x: 75,
        y: yPosition3,
        size: text,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Firmado el:', {
        x: half,
        y: yPosition3,
        size: timeText,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${x.SignedOn}`, {
        x: half + 70,
        y: yPosition3,
        size: timeText,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Dirección IP:', {
        x: 30,
        y: yPosition4,
        size: text,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.ipAddress, {
        x: 100,
        y: yPosition4,
        size: text,
        font: timesRomanFont,
        color: textValueColor,
      });
      currentPage.drawText('Nivel de seguridad:', {
        x: half,
        y: yPosition4,
        size: timeText,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`Email, OTP`, {
        x: half + 107,
        y: yPosition4,
        size: timeText,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Firmante:', {
        x: 30,
        y: yPosition5,
        size: text,
        font: timesRomanFont,
        color: textKeyColor,
      });
      currentPage.drawRectangle({
        x: 98,
        y: yPosition5 - 27,
        width: 104,
        height: 44,
        borderColor: rgb(0.22, 0.18, 0.47),
        borderWidth: 1,
      });
      if (embedPng) {
        currentPage.drawImage(embedPng, {
          x: 100,
          y: yPosition5 - 25,
          width: 100,
          height: 40,
        });
      }

      currentPage.drawLine({
        start: { x: 30, y: yPosition6 },
        end: { x: width - 30, y: yPosition6 },
        color: rgb(0.12, 0.12, 0.12),
        thickness: 0.5,
      });

      // Update y positions for the next entry
      yPosition1 = yPosition6 - 20;
      yPosition2 = yPosition1 - 20;
      yPosition3 = yPosition2 - 20;
      yPosition4 = yPosition3 - 20;
      yPosition5 = yPosition4 - 20;
      yPosition6 = yPosition6 - 140;
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
