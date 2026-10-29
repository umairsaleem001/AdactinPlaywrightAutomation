function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function attachStepScreenshot(testInfo, name, { status, body }) 
{
  const responseBody = JSON.stringify(body, null, 2) ?? String(body);
  const lines = [`HTTP Status: ${status}`, '', ...responseBody.split(/\r?\n/)];
  const wrappedLines = lines.flatMap(line => 
  {
    if (line.length <= 110) 
    {
      return [line];
    }

    const indent = line.match(/^\s*/)[0];
    const content = line.slice(indent.length);
    const wrapped = [];
    for (let index = 0; index < content.length; index += 110) 
    {
      wrapped.push(`${index === 0 ? indent : `${indent}  `}${content.slice(index, index + 110)}`);
    }
    return wrapped;
  });
  const height = 72 + wrappedLines.length * 22;
  const text = wrappedLines
    .map((line, index) => `<text x="24" y="${58 + index * 22}">${escapeXml(line)}</text>`)
    .join('');
  const screenshot = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#222">${escapeXml(name)}</text>
  <g font-family="Consolas, monospace" font-size="14" fill="#222">${text}</g>
</svg>`;

  await testInfo.attach(name, 
  {
    body: Buffer.from(screenshot),
    contentType: 'image/svg+xml',
  });
}
