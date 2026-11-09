/* =========================================================
   AERO CRM — Demo data (frontend only, no backend)
   Dates are generated relative to "today" so the demo always feels live.
   ========================================================= */
(function () {
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = (offset, h = 10, m = 0) => { const x = new Date(today.getTime() + offset * DAY); x.setHours(h, m, 0, 0); return x.toISOString(); };

  const agents = [
    { id: 'A1', name: 'Rahim Uddin',    role: 'Senior Sales Agent', email: 'rahim@aerotravels.com',  phone: '+880 1711-200101', hue: 210, status: 'on',   joined: '2021-03-14', target: 2500000, achieved: 2140000, leads: 64, converted: 26, followRate: 94, revenue: 2140000, avgResponse: '8 min' },
    { id: 'A2', name: 'Nusrat Jahan',   role: 'Sales Agent',        email: 'nusrat@aerotravels.com', phone: '+880 1819-330202', hue: 330, status: 'on',   joined: '2022-01-09', target: 2000000, achieved: 1925000, leads: 58, converted: 23, followRate: 97, revenue: 1925000, avgResponse: '6 min' },
    { id: 'A3', name: 'Tanvir Ahmed',   role: 'Corporate Accounts', email: 'tanvir@aerotravels.com', phone: '+880 1912-440303', hue: 160, status: 'away', joined: '2020-08-21', target: 3000000, achieved: 2460000, leads: 41, converted: 17, followRate: 88, revenue: 2460000, avgResponse: '14 min' },
    { id: 'A4', name: 'Farhana Akter',  role: 'Sales Agent',        email: 'farhana@aerotravels.com',phone: '+880 1556-550404', hue: 280, status: 'on',   joined: '2023-02-02', target: 1800000, achieved: 1210000, leads: 52, converted: 15, followRate: 82, revenue: 1210000, avgResponse: '11 min' },
    { id: 'A5', name: 'Sabbir Hossain', role: 'Junior Sales Agent', email: 'sabbir@aerotravels.com', phone: '+880 1678-660505', hue: 30,  status: 'off',  joined: '2024-05-18', target: 1200000, achieved: 690000,  leads: 39, converted: 9,  followRate: 71, revenue: 690000,  avgResponse: '22 min' },
    { id: 'A6', name: 'Mitu Rahman',    role: 'Sales Agent',        email: 'mitu@aerotravels.com',   phone: '+880 1300-770606', hue: 100, status: 'on',   joined: '2023-09-11', target: 1600000, achieved: 1480000, leads: 47, converted: 15, followRate: 91, revenue: 1480000, avgResponse: '9 min' },
  ];

  const stages = [
    { id: 'new',         name: 'New',            color: 'var(--seq-1)' },
    { id: 'contacted',   name: 'Contacted',      color: 'var(--seq-2)' },
    { id: 'quotation',   name: 'Quotation Sent', color: 'var(--seq-3)' },
    { id: 'negotiation', name: 'Negotiation',    color: 'var(--seq-4)' },
    { id: 'converted',   name: 'Converted',      color: 'var(--success)' },
    { id: 'lost',        name: 'Lost',           color: 'var(--danger)' },
  ];

  const sources = [
    { id: 'Facebook', color: 'var(--s1)', icon: 'facebook' },
    { id: 'WhatsApp', color: 'var(--s3)', icon: 'message-circle' },
    { id: 'Website',  color: 'var(--s2)', icon: 'globe' },
    { id: 'Phone',    color: 'var(--s4)', icon: 'phone' },
    { id: 'Referral', color: 'var(--s5)', icon: 'user-plus' },
  ];

  const L = (id, name, phone, source, agent, priority, from, to, travel, budget, pax, stage, fu, created, notes, type = 'Return') =>
    ({ id, name, phone, email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@gmail.com', source, agent, priority, from, destination: to, travelDate: d(travel), budget, pax, stage, followUp: fu === null ? null : d(fu, 11), created: d(created, 9, 30), notes, tripType: type });

  const leads = [
    L('L-1048', 'Shakil Mahmud',     '+880 1711-458921', 'Facebook', 'A1', 'hot',  'DAC', 'Dubai',        12, 185000, 3, 'new',         0,  0,  'Family trip, needs visa assistance too.'),
    L('L-1047', 'Ayesha Siddika',    '+880 1819-223344', 'WhatsApp', 'A2', 'hot',  'DAC', 'Kuala Lumpur', 9,  96000,  2, 'contacted',   0,  0,  'Honeymoon. Prefers Malaysia Airlines.'),
    L('L-1046', 'Mahmudul Hasan',    '+880 1912-765432', 'Website',  null, 'warm', 'DAC', 'Bangkok',      21, 70000,  2, 'new',         1,  0,  'Asked for 4-star hotel package.'),
    L('L-1045', 'Rezaul Karim',      '+880 1556-112233', 'Phone',    'A3', 'hot',  'DAC', 'London',       30, 420000, 4, 'quotation',  -1, -2, 'Corporate travel for 4 executives. Business class.'),
    L('L-1044', 'Fatema Begum',      '+880 1678-998877', 'Referral', 'A4', 'warm', 'CGP', 'Jeddah',       45, 310000, 3, 'negotiation', 0, -3, 'Umrah package, flexible dates.'),
    L('L-1043', 'Imran Chowdhury',   '+880 1300-445566', 'Facebook', 'A1', 'cold', 'DAC', 'Singapore',    60, 85000,  1, 'contacted',   3, -3, 'Just exploring options.'),
    L('L-1042', 'Sumaiya Islam',     '+880 1711-667788', 'WhatsApp', 'A6', 'hot',  'DAC', 'Maldives',     14, 240000, 2, 'quotation',  -2, -4, 'Water villa preferred. Sent 2 options.'),
    L('L-1041', 'Nazmul Huda',       '+880 1819-889900', 'Website',  'A5', 'warm', 'DAC', 'Kolkata',      7,  28000,  2, 'contacted',  -1, -4, 'Medical visit. Needs early morning flight.', 'One-way'),
    L('L-1040', 'Tahmina Akhter',    '+880 1912-334455', 'Phone',    'A2', 'warm', 'DAC', 'Istanbul',     40, 290000, 2, 'negotiation', 1, -5, 'Comparing with another agency. Price sensitive.'),
    L('L-1039', 'Jubayer Alam',      '+880 1556-776655', 'Facebook', 'A4', 'cold', 'DAC', 'Kathmandu',    35, 52000,  4, 'new',         2, -5, 'Group of friends, budget trip.'),
    L('L-1038', 'Kamrul Islam',      '+880 1678-221100', 'Referral', 'A3', 'hot',  'DAC', 'Toronto',      25, 520000, 3, 'converted', null, -6, 'Converted — student visa family travel.', 'One-way'),
    L('L-1037', 'Nadia Rahman',      '+880 1300-990011', 'WhatsApp', 'A6', 'warm', 'DAC', 'Bali',         28, 160000, 2, 'converted', null, -7, 'Booked Garuda via KUL.'),
    L('L-1036', 'Arifur Rahman',     '+880 1711-121212', 'Website',  'A1', 'hot',  'DAC', 'Doha',         5,  110000, 1, 'negotiation',-3, -7, 'Work visa travel. Wants Qatar Airways.', 'One-way'),
    L('L-1035', 'Sharmin Sultana',   '+880 1819-343434', 'Facebook', 'A5', 'cold', 'DAC', 'Delhi',        50, 38000,  2, 'lost',     null, -8, 'Lost — chose cheaper option online.'),
    L('L-1034', 'Habibur Rahman',    '+880 1912-565656', 'Phone',    'A2', 'warm', 'DAC', 'Riyadh',       18, 98000,  1, 'quotation',   0, -8, 'Waiting for Saudia quotation confirmation.', 'One-way'),
    L('L-1033', 'Rumana Parvin',     '+880 1556-787878', 'Referral', 'A4', 'hot',  'DAC', 'Tokyo',        55, 380000, 2, 'contacted',  -4, -9, 'Cherry blossom season trip.'),
    L('L-1032', 'Mizanur Rahman',    '+880 1678-909090', 'WhatsApp', 'A1', 'warm', 'DAC', 'Dubai',        20, 140000, 2, 'converted', null, -10, 'Emirates economy, 2 adults.'),
    L('L-1031', 'Sadia Afrin',       '+880 1300-232323', 'Website',  null, 'warm', 'DAC', 'Paris',        70, 450000, 2, 'new',         1, -1, 'Europe tour, Schengen visa query.'),
    L('L-1030', 'Touhid Hossain',    '+880 1711-454545', 'Facebook', 'A6', 'cold', 'CGP', 'Kuala Lumpur', 33, 64000,  1, 'lost',     null, -11, 'No response after 3 attempts.'),
    L('L-1029', 'Moumita Das',       '+880 1819-676767', 'Phone',    'A3', 'hot',  'DAC', 'Sydney',       42, 480000, 3, 'quotation',   2, -12, 'Visiting son. Needs senior assistance.'),
    L('L-1028', 'Ashraful Alam',     '+880 1912-898989', 'WhatsApp', 'A2', 'warm', 'DAC', 'Medina',       38, 260000, 4, 'contacted',   1, -12, 'Umrah with parents.'),
    L('L-1027', 'Lubna Yasmin',      '+880 1556-010101', 'Referral', 'A1', 'hot',  'DAC', 'New York',     48, 560000, 2, 'negotiation', 2, -13, 'Biman direct vs Emirates. Decides this week.'),
    L('L-1026', 'Ferdous Ahmed',     '+880 1678-131313', 'Website',  'A5', 'cold', 'DAC', 'Chennai',      26, 42000,  1, 'new',        -2, -2, 'Unresponsive on first call.'),
    L('L-1025', 'Tasnim Ferdous',    '+880 1300-252525', 'Facebook', 'A4', 'warm', 'DAC', 'Bangkok',      16, 88000,  2, 'converted', null, -14, 'Thai Airways, hotel included.'),
  ];

  const customers = [
    { id: 'C-301', name: 'Kamrul Islam',     phone: '+880 1678-221100', email: 'kamrul.islam@gmail.com',   city: 'Dhaka',      tag: 'VIP',       trips: 11, spent: 2860000, lastTravel: d(-40), since: '2019-06-12', agent: 'A3', airlines: ['Emirates', 'Qatar Airways'], destinations: ['Toronto', 'Dubai', 'London'], seat: 'Aisle', meal: 'Halal', passport: 'Valid till Mar 2029', birthday: '14 Aug', company: null },
    { id: 'C-302', name: 'Nadia Rahman',     phone: '+880 1300-990011', email: 'nadia.rahman@gmail.com',   city: 'Dhaka',      tag: 'Regular',   trips: 4,  spent: 610000,  lastTravel: d(-95), since: '2022-02-03', agent: 'A6', airlines: ['Malaysia Airlines', 'Garuda'], destinations: ['Bali', 'Kuala Lumpur'], seat: 'Window', meal: 'Vegetarian', passport: 'Valid till Jan 2027', birthday: '02 Dec', company: null },
    { id: 'C-303', name: 'Orion Pharma Ltd.',phone: '+880 2-9898765',   email: 'travel@orionpharma.com',   city: 'Dhaka',      tag: 'Corporate', trips: 38, spent: 7450000, lastTravel: d(-6),  since: '2018-11-20', agent: 'A3', airlines: ['Singapore Airlines', 'Emirates'], destinations: ['Singapore', 'Frankfurt', 'Dubai'], seat: 'Aisle', meal: 'Any', passport: '—', birthday: '—', company: 'Orion Pharma Ltd.' },
    { id: 'C-304', name: 'Mizanur Rahman',   phone: '+880 1678-909090', email: 'mizanur.rahman@gmail.com', city: 'Gazipur',    tag: 'Regular',   trips: 3,  spent: 390000,  lastTravel: d(-150),since: '2023-04-17', agent: 'A1', airlines: ['Emirates'], destinations: ['Dubai'], seat: 'Window', meal: 'Halal', passport: 'Valid till Jul 2030', birthday: '21 May', company: null },
    { id: 'C-305', name: 'Tasnim Ferdous',   phone: '+880 1300-252525', email: 'tasnim.ferdous@gmail.com', city: 'Sylhet',     tag: 'Regular',   trips: 2,  spent: 176000,  lastTravel: d(-210),since: '2024-01-08', agent: 'A4', airlines: ['Thai Airways'], destinations: ['Bangkok', 'Phuket'], seat: 'Window', meal: 'Seafood', passport: 'Valid till Oct 2028', birthday: '09 Feb', company: null },
    { id: 'C-306', name: 'Shahriar Kabir',   phone: '+880 1711-987654', email: 'shahriar.kabir@gmail.com', city: 'Chattogram', tag: 'VIP',       trips: 15, spent: 3920000, lastTravel: d(-12), since: '2018-03-02', agent: 'A1', airlines: ['Turkish Airlines', 'Emirates'], destinations: ['Istanbul', 'London', 'New York'], seat: 'Aisle', meal: 'Halal', passport: 'Valid till Feb 2031', birthday: '30 Nov', company: null },
    { id: 'C-307', name: 'Beximco Group',    phone: '+880 2-8812345',   email: 'admin.travel@beximco.com', city: 'Dhaka',      tag: 'Corporate', trips: 52, spent: 9800000, lastTravel: d(-3),  since: '2017-07-15', agent: 'A3', airlines: ['Qatar Airways', 'Singapore Airlines'], destinations: ['Doha', 'Shanghai', 'Milan'], seat: 'Aisle', meal: 'Any', passport: '—', birthday: '—', company: 'Beximco Group' },
    { id: 'C-308', name: 'Farzana Haque',    phone: '+880 1819-456123', email: 'farzana.haque@gmail.com',  city: 'Dhaka',      tag: 'Regular',   trips: 5,  spent: 720000,  lastTravel: d(-60), since: '2021-09-25', agent: 'A2', airlines: ['US-Bangla', 'Malaysia Airlines'], destinations: ['Kuala Lumpur', 'Singapore'], seat: 'Window', meal: 'Halal', passport: 'Valid till Aug 2027', birthday: '18 Mar', company: null },
    { id: 'C-309', name: 'Anisul Hoque',     phone: '+880 1912-654321', email: 'anisul.hoque@gmail.com',   city: 'Rajshahi',   tag: 'VIP',       trips: 9,  spent: 2140000, lastTravel: d(-25), since: '2020-05-30', agent: 'A6', airlines: ['Saudia', 'Emirates'], destinations: ['Jeddah', 'Medina', 'Dubai'], seat: 'Aisle', meal: 'Halal', passport: 'Valid till Dec 2029', birthday: '05 Jun', company: null },
    { id: 'C-310', name: 'Rafiq Uddin',      phone: '+880 1556-321789', email: 'rafiq.uddin@gmail.com',    city: 'Khulna',     tag: 'Regular',   trips: 1,  spent: 64000,   lastTravel: d(-300),since: '2025-02-11', agent: 'A5', airlines: ['IndiGo'], destinations: ['Kolkata'], seat: 'Any', meal: 'Any', passport: 'Valid till Apr 2030', birthday: '27 Jul', company: null },
    { id: 'C-311', name: 'Sabrina Chowdhury',phone: '+880 1678-741852', email: 'sabrina.c@gmail.com',      city: 'Dhaka',      tag: 'VIP',       trips: 12, spent: 3150000, lastTravel: d(-18), since: '2019-10-09', agent: 'A2', airlines: ['Singapore Airlines', 'Cathay Pacific'], destinations: ['Singapore', 'Tokyo', 'Maldives'], seat: 'Window', meal: 'Vegetarian', passport: 'Valid till Sep 2028', birthday: '12 Jan', company: null },
    { id: 'C-312', name: 'Grameen Textiles', phone: '+880 2-7712890',   email: 'hr@grameentex.com',        city: 'Narayanganj',tag: 'Corporate', trips: 21, spent: 4100000, lastTravel: d(-20), since: '2020-01-14', agent: 'A3', airlines: ['Emirates', 'Turkish Airlines'], destinations: ['Dubai', 'Istanbul', 'Guangzhou'], seat: 'Any', meal: 'Any', passport: '—', birthday: '—', company: 'Grameen Textiles' },
  ];

  const followups = [
    { id: 'F-01', ref: 'L-1048', name: 'Shakil Mahmud',   type: 'call',     due: d(0, 10, 30), agent: 'A1', status: 'pending', note: 'Share Dubai package options + visa checklist' },
    { id: 'F-02', ref: 'L-1047', name: 'Ayesha Siddika',  type: 'whatsapp', due: d(0, 11, 15), agent: 'A2', status: 'done',    note: 'Send honeymoon hotel shortlist' },
    { id: 'F-03', ref: 'L-1044', name: 'Fatema Begum',    type: 'call',     due: d(0, 12, 0),  agent: 'A4', status: 'pending', note: 'Negotiate final Umrah package price' },
    { id: 'F-04', ref: 'L-1034', name: 'Habibur Rahman',  type: 'email',    due: d(0, 14, 30), agent: 'A2', status: 'pending', note: 'Confirm Saudia fare before it expires' },
    { id: 'F-05', ref: 'C-303',  name: 'Orion Pharma Ltd.', type: 'meeting',due: d(0, 16, 0),  agent: 'A3', status: 'pending', note: 'Quarterly corporate travel review' },
    { id: 'F-06', ref: 'L-1045', name: 'Rezaul Karim',    type: 'call',     due: d(-1, 15, 0), agent: 'A3', status: 'pending', note: 'Follow up on London business class quote' },
    { id: 'F-07', ref: 'L-1042', name: 'Sumaiya Islam',   type: 'whatsapp', due: d(-2, 12, 0), agent: 'A6', status: 'pending', note: 'Check which Maldives option they prefer' },
    { id: 'F-08', ref: 'L-1036', name: 'Arifur Rahman',   type: 'call',     due: d(-3, 10, 0), agent: 'A1', status: 'pending', note: 'Qatar Airways fare hold expiring' },
    { id: 'F-09', ref: 'L-1033', name: 'Rumana Parvin',   type: 'email',    due: d(-4, 17, 0), agent: 'A4', status: 'pending', note: 'Send Japan visa document list' },
    { id: 'F-10', ref: 'L-1041', name: 'Nazmul Huda',     type: 'call',     due: d(-1, 9, 30), agent: 'A5', status: 'pending', note: 'Confirm Kolkata flight timing' },
    { id: 'F-11', ref: 'L-1026', name: 'Ferdous Ahmed',   type: 'call',     due: d(-2, 11, 0), agent: 'A5', status: 'pending', note: 'Second attempt — unresponsive' },
    { id: 'F-12', ref: 'L-1036', name: 'Arifur Rahman',   type: 'whatsapp', due: d(-1, 18, 0), agent: 'A1', status: 'pending', note: 'Send payment link' },
    { id: 'F-13', ref: 'L-1046', name: 'Mahmudul Hasan',  type: 'call',     due: d(1, 11, 0),  agent: 'A1', status: 'pending', note: 'First contact — Bangkok package' },
    { id: 'F-14', ref: 'L-1040', name: 'Tahmina Akhter',  type: 'call',     due: d(1, 15, 30), agent: 'A2', status: 'pending', note: 'Counter-offer on Istanbul package' },
    { id: 'F-15', ref: 'L-1027', name: 'Lubna Yasmin',    type: 'meeting',  due: d(2, 12, 0),  agent: 'A1', status: 'pending', note: 'Office visit for New York booking' },
    { id: 'F-16', ref: 'L-1029', name: 'Moumita Das',     type: 'email',    due: d(2, 10, 0),  agent: 'A3', status: 'pending', note: 'Send revised Sydney quote with wheelchair assistance' },
    { id: 'F-17', ref: 'C-306',  name: 'Shahriar Kabir',  type: 'whatsapp', due: d(3, 13, 0),  agent: 'A1', status: 'pending', note: 'Birthday wish + winter Europe offer' },
    { id: 'F-18', ref: 'L-1043', name: 'Imran Chowdhury', type: 'call',     due: d(3, 16, 0),  agent: 'A1', status: 'pending', note: 'Re-engage — Singapore deals' },
    { id: 'F-19', ref: 'C-309',  name: 'Anisul Hoque',    type: 'call',     due: d(5, 11, 0),  agent: 'A6', status: 'pending', note: 'Ramadan Umrah early-bird offer' },
    { id: 'F-20', ref: 'L-1037', name: 'Nadia Rahman',    type: 'whatsapp', due: d(-1, 10, 0), agent: 'A6', status: 'done',    note: 'Send e-ticket & hotel voucher' },
    { id: 'F-21', ref: 'L-1038', name: 'Kamrul Islam',    type: 'email',    due: d(-2, 14, 0), agent: 'A3', status: 'done',    note: 'Share travel insurance documents' },
  ];

  const bookings = [
    { id: 'BK-5521', customer: 'Kamrul Islam',      ref: 'C-301', from: 'DAC', to: 'YYZ', airline: 'Emirates',          travel: d(25), pax: 3, amount: 520000, status: 'Ticketed',  pnr: 'EK7Q2L', agent: 'A3' },
    { id: 'BK-5520', customer: 'Nadia Rahman',      ref: 'C-302', from: 'DAC', to: 'DPS', airline: 'Malaysia Airlines', travel: d(28), pax: 2, amount: 160000, status: 'Confirmed', pnr: 'MH4K9P', agent: 'A6' },
    { id: 'BK-5519', customer: 'Mizanur Rahman',    ref: 'C-304', from: 'DAC', to: 'DXB', airline: 'Emirates',          travel: d(20), pax: 2, amount: 140000, status: 'Ticketed',  pnr: 'EK2M8R', agent: 'A1' },
    { id: 'BK-5518', customer: 'Beximco Group',     ref: 'C-307', from: 'DAC', to: 'DOH', airline: 'Qatar Airways',     travel: d(2),  pax: 5, amount: 685000, status: 'Ticketed',  pnr: 'QR8T1N', agent: 'A3' },
    { id: 'BK-5517', customer: 'Tasnim Ferdous',    ref: 'C-305', from: 'DAC', to: 'BKK', airline: 'Thai Airways',      travel: d(16), pax: 2, amount: 88000,  status: 'Pending',   pnr: '—',      agent: 'A4' },
    { id: 'BK-5516', customer: 'Sabrina Chowdhury', ref: 'C-311', from: 'DAC', to: 'MLE', airline: 'US-Bangla',         travel: d(4),  pax: 2, amount: 210000, status: 'Confirmed', pnr: 'BS3D6F', agent: 'A2' },
    { id: 'BK-5515', customer: 'Orion Pharma Ltd.', ref: 'C-303', from: 'DAC', to: 'SIN', airline: 'Singapore Airlines',travel: d(6),  pax: 3, amount: 396000, status: 'Ticketed',  pnr: 'SQ5H2C', agent: 'A3' },
    { id: 'BK-5514', customer: 'Anisul Hoque',      ref: 'C-309', from: 'DAC', to: 'JED', airline: 'Saudia',            travel: d(9),  pax: 4, amount: 372000, status: 'Confirmed', pnr: 'SV9J4W', agent: 'A6' },
    { id: 'BK-5513', customer: 'Shahriar Kabir',    ref: 'C-306', from: 'CGP', to: 'IST', airline: 'Turkish Airlines',  travel: d(-12),pax: 1, amount: 145000, status: 'Completed', pnr: 'TK1A7Z', agent: 'A1' },
    { id: 'BK-5512', customer: 'Farzana Haque',     ref: 'C-308', from: 'DAC', to: 'KUL', airline: 'US-Bangla',         travel: d(-8), pax: 2, amount: 74000,  status: 'Cancelled', pnr: 'BS7Y3Q', agent: 'A2' },
    { id: 'BK-5511', customer: 'Grameen Textiles',  ref: 'C-312', from: 'DAC', to: 'CAN', airline: 'China Southern',    travel: d(11), pax: 6, amount: 432000, status: 'Pending',   pnr: '—',      agent: 'A3' },
  ];

  const conversations = [
    { id: 'T1', name: 'Ayesha Siddika', ref: 'L-1047', channel: 'whatsapp', unread: 2, time: d(0, 11, 42), agent: 'A2', messages: [
      { dir: 'in',  text: 'Assalamu alaikum! We are planning our honeymoon in Malaysia, around 9 days from now.', t: d(0, 10, 2) },
      { dir: 'out', text: 'Walaikum assalam Ayesha! Congratulations 🎉 I can arrange flights + a 4-star hotel in KL and Langkawi. How many nights in total?', t: d(0, 10, 6) },
      { dir: 'in',  text: '6 nights. Budget around 95-100k for both of us.', t: d(0, 10, 15) },
      { dir: 'sys', text: 'Stage changed to Contacted by Nusrat Jahan', t: d(0, 10, 16) },
      { dir: 'internal', text: 'Malaysia Airlines has a 12% promo till Friday — use that for the quote.', t: d(0, 10, 20), by: 'Nusrat Jahan' },
      { dir: 'in',  text: 'Can you also include airport pickup?', t: d(0, 11, 40) },
      { dir: 'in',  text: 'And please share hotel photos 🙏', t: d(0, 11, 42) },
    ]},
    { id: 'T2', name: 'Rezaul Karim', ref: 'L-1045', channel: 'email', unread: 1, time: d(0, 9, 55), agent: 'A3', subject: 'RE: London business class quotation', messages: [
      { dir: 'out', text: 'Dear Mr. Karim,\n\nPlease find attached the business class quotation for 4 executives (DAC–LHR–DAC) on Emirates and Qatar Airways.\n\nBest regards,\nTanvir Ahmed', t: d(-2, 16, 10) },
      { dir: 'in',  text: 'Thanks Tanvir. Can we get flexible change dates for the return? Our board meeting may shift.', t: d(0, 9, 55) },
    ]},
    { id: 'T3', name: 'Sumaiya Islam', ref: 'L-1042', channel: 'whatsapp', unread: 1, time: d(0, 8, 30), agent: 'A6', messages: [
      { dir: 'out', text: 'Hi Sumaiya! Sharing 2 Maldives options:\n1) Water villa – ৳2,40,000\n2) Beach villa – ৳1,95,000', t: d(-2, 13, 0) },
      { dir: 'in',  text: 'Option 1 looks amazing! Is breakfast + dinner included?', t: d(0, 8, 30) },
    ]},
    { id: 'T4', name: 'Fatema Begum', ref: 'L-1044', channel: 'call', unread: 0, time: d(-1, 17, 20), agent: 'A4', messages: [
      { dir: 'sys', text: 'Outgoing call · 6m 42s · Farhana Akter', t: d(-1, 17, 20) },
      { dir: 'internal', text: 'Customer wants 5-star hotel near Haram. Will decide after discussing with family. Call back tomorrow noon.', t: d(-1, 17, 27), by: 'Farhana Akter' },
    ]},
    { id: 'T5', name: 'Orion Pharma Ltd.', ref: 'C-303', channel: 'email', unread: 1, time: d(-1, 15, 5), agent: 'A3', subject: 'Singapore conference – 3 travellers', messages: [
      { dir: 'in',  text: 'Hello team, please confirm e-tickets for our 3 delegates travelling to Singapore next week.', t: d(-1, 15, 5) },
    ]},
    { id: 'T6', name: 'Habibur Rahman', ref: 'L-1034', channel: 'whatsapp', unread: 0, time: d(-1, 12, 10), agent: 'A2', messages: [
      { dir: 'in',  text: 'Any update on the Riyadh fare?', t: d(-1, 12, 0) },
      { dir: 'out', text: 'Yes! Saudia one-way at ৳98,000 incl. 46kg baggage. Shall I hold it for you?', t: d(-1, 12, 10) },
    ]},
    { id: 'T7', name: 'Lubna Yasmin', ref: 'L-1027', channel: 'call', unread: 0, time: d(-2, 11, 0), agent: 'A1', messages: [
      { dir: 'sys', text: 'Incoming call · 12m 05s · Rahim Uddin', t: d(-2, 11, 0) },
      { dir: 'internal', text: 'Comparing Biman direct vs Emirates. Prefers direct if price gap < 40k.', t: d(-2, 11, 14), by: 'Rahim Uddin' },
    ]},
  ];

  const templates = [
    { title: 'Greeting',            text: 'Assalamu alaikum! Thank you for contacting Aero Travels. How can I help you plan your trip today?' },
    { title: 'Quotation shared',    text: 'I have shared the quotation with you. Fares are subject to availability — let me know if you would like me to hold the seats.' },
    { title: 'Payment reminder',    text: 'Friendly reminder: the fare hold expires today at 6 PM. Please complete payment to confirm your booking.' },
    { title: 'Documents required',  text: 'Please share a scanned copy of your passport (valid 6+ months), a recent photo and your NID for processing.' },
    { title: 'Ticket issued',       text: 'Your e-ticket has been issued ✈️ Please find it attached. Wishing you a pleasant journey!' },
  ];

  const activities = [
    { who: 'A2', action: 'moved', target: 'Ayesha Siddika', extra: 'to Contacted', icon: 'arrow-right-left', type: 'stage', t: d(0, 10, 16) },
    { who: 'A1', action: 'was assigned', target: 'Shakil Mahmud', extra: 'new Facebook lead', icon: 'user-check', type: 'call', t: d(0, 9, 45) },
    { who: 'A3', action: 'issued ticket for', target: 'Kamrul Islam', extra: 'BK-5521 · Emirates', icon: 'ticket', type: 'quote', t: d(0, 9, 20) },
    { who: 'A6', action: 'sent quotation to', target: 'Sumaiya Islam', extra: 'Maldives · ৳2,40,000', icon: 'file-text', type: 'quote', t: d(-1, 17, 40) },
    { who: 'A4', action: 'logged a call with', target: 'Fatema Begum', extra: '6m 42s', icon: 'phone', type: 'call', t: d(-1, 17, 27) },
    { who: 'A1', action: 'converted', target: 'Mizanur Rahman', extra: '৳1,40,000 booking', icon: 'badge-check', type: 'whatsapp', t: d(-1, 15, 2) },
    { who: 'A5', action: 'added a note on', target: 'Nazmul Huda', extra: '', icon: 'sticky-note', type: 'note', t: d(-1, 13, 10) },
    { who: 'A2', action: 'completed follow-up with', target: 'Habibur Rahman', extra: 'WhatsApp', icon: 'check-circle-2', type: 'whatsapp', t: d(-1, 12, 10) },
    { who: 'A3', action: 'updated customer', target: 'Orion Pharma Ltd.', extra: 'travel policy', icon: 'pencil', type: 'note', t: d(-2, 16, 0) },
    { who: 'A6', action: 'marked lost', target: 'Touhid Hossain', extra: 'no response', icon: 'x-circle', type: 'meeting', t: d(-2, 11, 30) },
  ];

  const notifications = [
    { id: 'N1', icon: 'inbox', tone: 'blue',   title: 'New lead from Facebook', text: 'Shakil Mahmud — Dubai, 3 passengers, ৳1,85,000', t: d(0, 9, 40), unread: true, link: '#/leads/L-1048' },
    { id: 'N2', icon: 'alarm-clock', tone: 'red', title: '7 follow-ups are overdue', text: 'Arifur Rahman, Rezaul Karim and 5 others need attention', t: d(0, 9, 0), unread: true, link: '#/followups' },
    { id: 'N3', icon: 'message-circle', tone: 'green', title: 'Ayesha Siddika replied on WhatsApp', text: '"And please share hotel photos 🙏"', t: d(0, 11, 42), unread: true, link: '#/inbox' },
    { id: 'N4', icon: 'badge-check', tone: 'green', title: 'Lead converted', text: 'Mizanur Rahman booked Dubai via Rahim Uddin', t: d(-1, 15, 2), unread: false, link: '#/leads/L-1032' },
    { id: 'N5', icon: 'user-x', tone: 'amber', title: '2 leads unassigned for 24h+', text: 'Mahmudul Hasan, Sadia Afrin', t: d(-1, 10, 0), unread: false, link: '#/leads' },
    { id: 'N6', icon: 'target', tone: 'violet', title: 'Nusrat Jahan reached 96% of target', text: 'Monthly target ৳20L — ৳19.25L achieved', t: d(-1, 9, 0), unread: false, link: '#/targets' },
    { id: 'N7', icon: 'plane-takeoff', tone: 'cyan', title: 'Upcoming travel in 48h', text: 'Beximco Group — 5 pax to Doha', t: d(-2, 9, 0), unread: false, link: '#/bookings' },
  ];

  const monthly = [
    { m: 'Jun', revenue: 8.2,  leads: 168, conv: 41 },
    { m: 'Jul', revenue: 9.1,  leads: 182, conv: 46 },
    { m: 'Aug', revenue: 8.7,  leads: 175, conv: 44 },
    { m: 'Sep', revenue: 10.4, leads: 204, conv: 58 },
    { m: 'Oct', revenue: 11.3, leads: 221, conv: 63 },
    { m: 'Nov', revenue: 12.5, leads: 236, conv: 72 },
  ];

  window.CRM = { today, DAY, agents, stages, sources, leads, customers, followups, bookings, conversations, templates, activities, notifications, monthly };
})();
