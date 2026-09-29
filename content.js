export const WHATSAPP_URL =
  "https://wa.me/27846751212?text=" +
  encodeURIComponent("Hi Kev, I'd like to book an appointment.");

export const NAV_LINKS = [
  { id: "manifesto", label: "Manifesto", testid: "nav-link-manifesto" },
  { id: "gallery", label: "Gallery", testid: "nav-link-gallery" },
  { id: "services", label: "Services", testid: "nav-link-services" },
  { id: "reviews", label: "Reviews", testid: "nav-link-reviews" },
];

export const GALLERY = [
  {
    id: "knotless-boho",
    title: "Boho Knotless Braids",
    service: "Knotless Braids — Waist Length",
    category: "Knotless",
    duration: "4 – 6 hrs",
    price: "R400",
    longevity: "6 – 8 weeks",
    img: "/images/knotless-boho.jpg",
    alt: "Bohemian knotless braided bun with curly tendrils",
    desc: "Featherweight scalp transition with premium curly tendrils woven into honey-toned knotless braids.",
  },
  {
    id: "waist-length-braids",
    title: "Waist-Length Knotless",
    service: "Knotless Braids — Waist Length",
    category: "Knotless",
    duration: "4 – 6 hrs",
    price: "R400",
    longevity: "6 – 8 weeks",
    img: "/images/waist-length.jpg",
    alt: "Sleek waist length knotless braids",
    desc: "Ultra-sleek, fluid weight distribution extending to waist length with immaculate line symmetry.",
  },
  {
    id: "fulani-shells",
    title: "Goddess Braids",
    service: "Goddess Braids — Waist Length",
    category: "Goddess",
    duration: "4.5 – 6 hrs",
    price: "R450",
    longevity: "5 – 7 weeks",
    img: "/images/fulani.jpg",
    alt: "Goddess braids decorated with cowrie shell details",
    desc: "Waist-length goddess braids with soft curly tendrils, finished with cowries and gold cuffs on request.",
  },
  {
    id: "geometry-scalp",
    title: "Straight Back, Clean Lines",
    service: "Straight Back",
    category: "Cornrows",
    duration: "2 – 3 hrs",
    price: "R300",
    longevity: "3 – 4 weeks",
    img: "/images/geometry.jpg",
    alt: "Top down angle of clean straight back cornrow parting",
    desc: "Crisp straight-back cornrows with architectural parting and laid edges.",
  },
  {
    id: "macro-scalp-detail",
    title: "Straight Up Precision",
    service: "Straight Up",
    category: "Cornrows",
    duration: "2 – 3 hrs",
    price: "R350",
    longevity: "3 – 4 weeks",
    img: "/images/macro.jpg",
    alt: "Close up of precise braided hair tension and clean lines",
    desc: "Sleek straight-up finish with zero-tension root alignment that protects your edges.",
  },
  {
    id: "crown-updo",
    title: "Free Hand Artistry",
    service: "Free Hand",
    category: "Updos",
    duration: "1.5 – 2.5 hrs",
    price: "R150",
    longevity: "2 – 3 weeks",
    img: "/images/crown.jpg",
    alt: "Statuesque model wearing regal wrapped crown style",
    desc: "Freehand cornrow artistry — patterns drafted on the spot, sculpted to your head shape.",
  },
];

export const SERVICE_TABS = [
  { id: "braids", label: "Braids", testid: "service-tab-braids" },
  { id: "styling", label: "Styling & Treatments", testid: "service-tab-styling" },
];

export const SERVICES = {
  braids: [
    { name: "Knotless Braids — Waist Length", detail: "Premium fibre included · zero-tension install", duration: "4 – 6 hrs", price: "R400" },
    { name: "Knotless Braids — Shoulder Length", detail: "Premium fibre included · zero-tension install", duration: "4 – 5 hrs", price: "R300" },
    { name: "Goddess Braids — Waist Length", detail: "Soft curly tendrils woven through", duration: "4.5 – 6 hrs", price: "R450" },
    { name: "French Curls", detail: "Bouncy french-curl finish", duration: "4 – 5 hrs", price: "R500" },
    { name: "Free Hand", detail: "Freehand cornrow artistry, your pattern", duration: "1.5 – 2.5 hrs", price: "R150" },
  ],
  styling: [
    { name: "Straight Back", detail: "Clean, polished feed-in cornrows", duration: "2 – 3 hrs", price: "R300" },
    { name: "Straight Up", detail: "Sleek, straight-up finish", duration: "2 – 3 hrs", price: "R350" },
    { name: "Sew In", detail: "Full sew-in weave install · leave-out or closure", duration: "2 – 3 hrs", price: "R300" },
    { name: "Relaxer", detail: "Gentle, even application", duration: "1.5 hrs", price: "R150" },
  ],
};

export const CHAPTERS = [
  {
    n: "01",
    title: "Tension Preservation",
    body: "Your edges are sacred. Every install is mapped to your hairline's natural density — firm enough to hold, gentle enough that you forget it's there by morning.",
  },
  {
    n: "02",
    title: "Botanical Hydration Ritual",
    body: "Before a single braid is woven, your hair is steamed with a botanical blend of aloe, black castor and rosemary. Moisture is sealed in, not styled out.",
  },
  {
    n: "03",
    title: "Scalp Architecture",
    body: "Parting is drafted like a floor plan — measured, symmetrical, and designed around the shape of your face. The grid is the signature.",
  },
  {
    n: "04",
    title: "Longevity Care",
    body: "A style should still turn heads in week six. You leave with a personalised care plan, night routine and a standing invitation for a refresh.",
  },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Naledi M.",
    tag: "4C · Fine strands",
    text: "Ten weeks in and my knotless braids still look freshly done. Not a single edge lost — that's never happened to me before.",
    service: "Knotless Braids",
  },
  {
    id: 2,
    name: "Thandi K.",
    tag: "4A · Dense",
    text: "The care before my install changed everything. Zero itching, zero tightness. I fell asleep in the chair, twice.",
    service: "Goddess Braids",
  },
  {
    id: 3,
    name: "Aisha D.",
    tag: "3C · Transitioning",
    text: "She treated my transitioning hair like glass. My straight up stayed sleek through a humid Durban weekend. Booked my next three visits already.",
    service: "Straight Up",
  },
];

export const FAQS = [
  {
    q: "Is braiding hair included in the price?",
    a: "Yes — premium pre-stretched fibre is included for all standard installs. Human-hair boho curls and specialty colours are quoted separately before your appointment.",
  },
  {
    q: "How long will my braids last?",
    a: "With the care plan we send you home with, knotless styles hold 6–8 weeks and cornrows 4–6 weeks. A refresh appointment can extend that by two weeks.",
  },
  {
    q: "Do you require a deposit?",
    a: "A 30% booking deposit secures your chair and is deducted from your total. It's fully transferable with 48 hours' notice.",
  },
  {
    q: "Do you offer house calls?",
    a: "Yes — the full kit travels to you within the greater Sandton area for a small call-out fee. Select 'house call' in the notes of your booking.",
  },
];

export const ALL_SERVICE_NAMES = [
  "Knotless Braids — Waist Length",
  "Knotless Braids — Shoulder Length",
  "Goddess Braids — Waist Length",
  "French Curls",
  "Free Hand",
  "Straight Back",
  "Straight Up",
  "Sew In",
  "Relaxer",
];

export const SERVICE_PRICING = {
  "Knotless Braids — Waist Length": { total: 400, deposit: 120 },
  "Knotless Braids — Shoulder Length": { total: 300, deposit: 90 },
  "Goddess Braids — Waist Length": { total: 450, deposit: 135 },
  "French Curls": { total: 500, deposit: 150 },
  "Free Hand": { total: 150, deposit: 45 },
  "Straight Back": { total: 300, deposit: 90 },
  "Straight Up": { total: 350, deposit: 105 },
  "Sew In": { total: 300, deposit: 90 },
  "Relaxer": { total: 150, deposit: 45 },
};

export const depositWhatsAppUrl = (booking) => {
  const p = SERVICE_PRICING[booking.service];
  if (!p) return WHATSAPP_URL;
  const msg = `Hi Kev! Booking ${booking.reference} — ${booking.service} on ${booking.date}. I'd like to pay my 30% deposit of R${p.deposit} to confirm. (Balance R${p.total - p.deposit} on the day.)`;
  return "https://wa.me/27846751212?text=" + encodeURIComponent(msg);
};
