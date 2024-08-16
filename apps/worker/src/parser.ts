export function parseMetaData(
  text: string,
  values: any,
  startDelimeter = "{",
  endDelimeter = "}"
) {
  let finalString = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === startDelimeter) {
      let endIndex = i + 1;
      while (text[endIndex] !== endDelimeter) endIndex++;
      const keys = text.substring(i + 1, endIndex).split(".");
      let localValues = values;
      for (let j = 0; j < keys.length; j++)
        localValues = localValues[keys[j] || ""];
      finalString += localValues.toString();
      i = endIndex;
      continue;
    }
    finalString += text[i];
  }
  return finalString;
}
