const paddedLocation = (x, y, width, height, padX, padY) => {
  // Adjusts point into a location that falls outside of padding

  // TODO: doesn't account for text height

  let pX, pY;
  if (x < padX) {
    pX = padX;
  } else if (x > width - padX) {
    pX = width - padX;
  } else if (x < padX && x > width - padX) {
    throw Error("Canvas too small to accommodate horizontal padding");
  } else {
    pX = x;
  }

  if (y < padY) {
    pY = padY;
  } else if (y > height - padY) {
    pY = height - padY;
  } else if (y < padY && y > height - padY) {
    throw Error("Canvas too small to accommodate vertical padding");
  } else {
    pY = y;
  }

  return [pX, pY];
};

const drawWrappedText = (ctx, x, y, text, padding, lineSpacing) => {
  // TODO: only handles cases where ctx.textBaseline === "top"
  console.log(`text received: "${text}"`);
  const words = text.split(" ");

  let start = 0;
  let end = 1;
  let wrapping = 0;

  const [posX, posY] = paddedLocation(
    x,
    y,
    ctx.canvas.width,
    ctx.canvas.height,
    padding,
    padding
  );

  while (start < words.length) {
    const substring = words.slice(start, end).join(" ");
    const measurement = ctx.measureText(substring);
    const substringBoundRight = posX + measurement.actualBoundingBoxRight;
    const substringHeight =
      measurement.actualBoundingBoxAscent +
      measurement.actualBoundingBoxDescent;

    const [rightBoundLimit] = paddedLocation(
      ctx.canvas.width,
      ctx.canvas.height,
      ctx.canvas.width,
      ctx.canvas.height,
      padding,
      padding
    );

    console.log(start, end);
    console.log(
      `precheck ${substring}: ${substringBoundRight} > ${rightBoundLimit}`
    );
    if (substringBoundRight > rightBoundLimit) {
      // draw text
      const prevSubstring = words.slice(start, end - 1).join(" ");
      console.log(
        `needs wrapping: ${substringBoundRight} > ${rightBoundLimit}`
      );
      console.log("prev:", prevSubstring);

      const offsetDueToLineSpace = wrapping * lineSpacing;
      const offsetDueToNewline = wrapping * substringHeight;

      ctx.fillText(
        prevSubstring,
        posX,
        posY + offsetDueToLineSpace + offsetDueToNewline
      );

      wrapping += 1;
      start = end - 1;
    } else if (end >= words.length) {
      // NO WRAPPING, BUT END OF TEXT
      ctx.fillText(
        substring,
        posX,
        posY + wrapping * substringHeight + wrapping * lineSpacing
      );
      break;
    }

    end += 1;
  }

  // returns the bottom bounding edge of the resulting wrapped text
  const textHeight =
    ctx.measureText(text).actualBoundingBoxAscent +
    ctx.measureText(text).actualBoundingBoxDescent;
  console.log("textHeight", textHeight);
  return (wrapping + 1) * textHeight + wrapping * lineSpacing + textHeight;
};

export { drawWrappedText };
