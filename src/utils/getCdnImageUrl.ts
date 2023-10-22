const getCdnImageUrl = (imageUrl: string) =>
  `${process.env.NEXT_PUBLIC_CDN_URL}/${imageUrl}`;

export default getCdnImageUrl;
