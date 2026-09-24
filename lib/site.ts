/**
 * Client-safe site constants: feature flags, navigation tree and footer links.
 *
 * Header, Footer and Chrome are client components. Anything they import is
 * shipped to the browser, so this module must stay free of the content data
 * (data/site-content.json is ~1.4MB). Server code imports these through
 * lib/content.ts, which re-exports them.
 */

/* ============ site feature flags (same defaults as the original) ============ */
export const SITE = { showOffer: true, stickyBar: true, chatbot: true };

export type NavChild = { label: string; href: string; slug: string };
export type NavGroup = { label: string; href: string | null; children: NavChild[] };
export type NavItem = { label: string; href: string; key?: string; groups?: NavGroup[] };

export const c = (label: string, slug: string): NavChild => ({ label, href: '/' + slug, slug });

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Air Conditioning', href: '/ac-services', key: 'ac', groups: [
    { label: 'Split System Aircon', href: '/split-system-aircon', children: [c('Back to Back Installation', 'back-to-back-installation'), c('Side Entry Installation', 'side-entry-installation'), c('Up & Over Installation', 'up-over-installation'), c('Split & Multi-Head Systems', 'split-and-multi-head-system')] },
    { label: 'Ducted Air Conditioning', href: '/ducted-airconditioning', children: [c('Ducted Multi Zone', 'ducted-multi-zone-air-conditioning'), c('VRV / VRF Air Conditioning', 'vrv-vrf-air-conditioning'), c('Design and Construction', 'design-and-construction')] },
    { label: 'Install, Repair & Service', href: '/air-conditioning-installation', children: [c('Air Conditioning Installation', 'air-conditioning-installation'), c('Repair & Installation', 'repair-installation'), c('Service & Maintenance', 'service-maintenance'), c('Air Conditioning FAQ', 'faq')] },
  ] },
  { label: 'Electrical', href: '/electrical-services', key: 'el', groups: [
    { label: 'Residential Electrician', href: '/residential-electrician', children: [c('New House Wiring', 'new-house-wiring'), c('Bathroom Exhaust Heater Installations', 'bathroom-exhaust-heater-installations'), c('Ceiling Exhaust Fans', 'ceiling-exhaust-fans'), c('Ceiling Fan Installation', 'ceiling-fan-installation'), c('Data Points & Network Cabling', 'data-points-and-network-cabling'), c('Downlights', 'downlights'), c('Electrical Switchboard Upgrade', 'electrical-switchboard-upgrade')] },
    { label: 'General Electrical Maintenance', href: '/general-electrical-maintenance', children: [c('LED Lights Installation', 'led-lights-installation'), c('Meter Box Relocation & Upgrade', 'meter-box-relocation-upgrade'), c('Oven & Cooktop Installations', 'oven-and-cooktop-installations'), c('Pendant Light Installer', 'pendant-light-installer'), c('Power Point Installation', 'power-point-installation'), c('Smoke Detector Installation', 'smoke-detector-installation'), c('Switchboard Surge Protector', 'switchboard-surge-protector-installation'), c('USB Sockets', 'usb-sockets'), c('Other Electrical Services', 'other-electrical-services')] },
    { label: 'Security & EV', href: '/security-and-ev', children: [c('CCTV Camera Installation', 'cctv-camera-installation'), c('Security Camera Installation', 'security-camera-installation'), c('EV Charger Installation', 'ev-charger-installation')] },
  ] },
  { label: 'Building & Construction', href: '/building-and-construction' },
  { label: 'Areas', href: '/service-area', key: 'areas', groups: [{ label: 'Service areas', href: '/service-area', children: [c('Brisbane', 'brisbane'), c('Gold Coast', 'gold-coast'), c('Logan', 'logan'), c('Ipswich', 'ipswich')] }] },
  { label: 'Blog', href: '/our-blog' },
];

export const NAV_SHORT: Record<string, string> = { 'About Us': 'About', 'Air Conditioning': 'Air Con', 'Building & Construction': 'Building' };

export const AREAS = ['brisbane', 'gold-coast', 'logan', 'ipswich'];

export const FOOTER_AC = [c('Air Conditioning Services', 'ac-services'), c('Split System Aircon', 'split-system-aircon'), c('Ducted Air Conditioning', 'ducted-airconditioning'), c('Air Conditioning Installation', 'air-conditioning-installation'), c('Repair & Installation', 'repair-installation'), c('Service & Maintenance', 'service-maintenance'), c('Reviews', 'reviews')];
export const FOOTER_EL = [c('Electrical Services', 'electrical-services'), c('Residential Electrician', 'residential-electrician'), c('Switchboard Upgrade', 'electrical-switchboard-upgrade'), c('General Electrical Maintenance', 'general-electrical-maintenance'), c('EV Charger Installation', 'ev-charger-installation'), c('CCTV Camera Installation', 'cctv-camera-installation'), c('Building & Construction', 'building-and-construction')];
export const FOOTER_CO = [c('About Us', 'about-us'), c('Service Areas', 'service-area'), c('FAQ', 'faq'), c('Blog', 'our-blog'), c('Contact Us', 'contact-us')];
