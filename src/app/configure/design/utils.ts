function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export async function getCroppedImage({ container, phoneCase, renderedBounds, imageUrl }: {
  container: HTMLDivElement;
  phoneCase: HTMLDivElement;
  renderedBounds: { x: number; y: number; width: number; height: number };
  imageUrl: string;
}) {
  const { left: caseLeft, top: caseTop, width, height } = phoneCase.getBoundingClientRect();
  const { left: containerLeft, top: containerTop } = container.getBoundingClientRect();

  const leftOffset = caseLeft - containerLeft;
  const topOffset = caseTop - containerTop;

  const actualX = renderedBounds.x - leftOffset;
  const actualY = renderedBounds.y - topOffset;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const userImage = new Image();
  userImage.crossOrigin = 'anonymous';
  userImage.src = imageUrl;
  await new Promise(resolve => userImage.onload = resolve);
  ctx?.drawImage(userImage, actualX, actualY, renderedBounds.width, renderedBounds.height);

  const base64 = canvas.toDataURL();
  const base64Data = base64.split(',')[1];

  const blob = base64ToBlob(base64Data, 'image/png');
  const file = new File([blob], 'filename.png', { type: 'image/png' });

  return file;
}
