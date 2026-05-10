const CHEONGAN = ['갑','을','병','정','무','기','경','신','임','계'];
const JIJI = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
const CHEONGAN_HAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const JIJI_HAN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const CHEONGAN_OHAENG = {
  '갑':'목','을':'목','병':'화','정':'화',
  '무':'토','기':'토','경':'금','신':'금','임':'수','계':'수'
};
const JIJI_OHAENG = {
  '자':'수','축':'토','인':'목','묘':'목','진':'토','사':'화',
  '오':'화','미':'토','신':'금','유':'금','술':'토','해':'수'
};
const CHEONGAN_EUMSUB = {
  '갑':'양','을':'음','병':'양','정':'음','무':'양',
  '기':'음','경':'양','신':'음','임':'양','계':'음'
};

const MONTH_START_CHEONGAN = { 0:2, 1:4, 2:6, 3:8, 4:0 };

function getYearPillar(year) {
  const idx = ((year - 4) % 60 + 60) % 60;
  return { cg: CHEONGAN[idx % 10], jj: JIJI[idx % 12] };
}

function getMonthPillar(year, month, day) {
  let m = month, y = year;
  if (day < 6) {
    m -= 1;
    if (m === 0) { m = 12; y -= 1; }
  }
  const jjIdx = m % 12;
  const monthStep = ((jjIdx - 2) + 12) % 12;
  const yearCgIdx = ((y - 4) % 10 + 10) % 10;
  const start = MONTH_START_CHEONGAN[yearCgIdx % 5];
  const cgIdx = (start + monthStep) % 10;
  return { cg: CHEONGAN[cgIdx], jj: JIJI[jjIdx] };
}

function getDayPillar(year, month, day) {
  const base = new Date(2000, 0, 1);
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - base) / (1000 * 60 * 60 * 24));
  const cgIdx = ((diff % 10) + 10) % 10;
  const jjIdx = ((10 + diff) % 12 + 12) % 12;
  return { cg: CHEONGAN[cgIdx], jj: JIJI[jjIdx] };
}

const HOUR_TO_JIJI = {
  23:0, 0:0, 1:1, 2:1, 3:2, 4:2, 5:3, 6:3,
  7:4, 8:4, 9:5, 10:5, 11:6, 12:6, 13:7, 14:7,
  15:8, 16:8, 17:9, 18:9, 19:10, 20:10, 21:11, 22:11
};
const HOUR_START_CHEONGAN = { 0:0, 1:2, 2:4, 3:6, 4:8 };

function getHourPillar(dayCg, hour) {
  const jjIdx = HOUR_TO_JIJI[hour] ?? 0;
  const dayCgIdx = CHEONGAN.indexOf(dayCg);
  const start = HOUR_START_CHEONGAN[dayCgIdx % 5];
  const cgIdx = (start + jjIdx) % 10;
  return { cg: CHEONGAN[cgIdx], jj: JIJI[jjIdx] };
}

export function calculateSaju(year, month, day, hour, gender) {
  const y = getYearPillar(year);
  const m = getMonthPillar(year, month, day);
  const d = getDayPillar(year, month, day);
  const h = getHourPillar(d.cg, hour);

  const pillars = {
    년주: { cg: y.cg, jj: y.jj, cgHan: CHEONGAN_HAN[CHEONGAN.indexOf(y.cg)], jjHan: JIJI_HAN[JIJI.indexOf(y.jj)] },
    월주: { cg: m.cg, jj: m.jj, cgHan: CHEONGAN_HAN[CHEONGAN.indexOf(m.cg)], jjHan: JIJI_HAN[JIJI.indexOf(m.jj)] },
    일주: { cg: d.cg, jj: d.jj, cgHan: CHEONGAN_HAN[CHEONGAN.indexOf(d.cg)], jjHan: JIJI_HAN[JIJI.indexOf(d.jj)] },
    시주: { cg: h.cg, jj: h.jj, cgHan: CHEONGAN_HAN[CHEONGAN.indexOf(h.cg)], jjHan: JIJI_HAN[JIJI.indexOf(h.jj)] },
  };

  const ilgan = d.cg;
  const ilju = `${d.cg}${d.jj}`;

  const allChars = [y.cg, y.jj, m.cg, m.jj, d.cg, d.jj, h.cg, h.jj];
  const ohaengCount = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  [y.cg, m.cg, d.cg, h.cg].forEach(c => ohaengCount[CHEONGAN_OHAENG[c]]++);
  [y.jj, m.jj, d.jj, h.jj].forEach(j => ohaengCount[JIJI_OHAENG[j]]++);

  const ilganOhaeng = CHEONGAN_OHAENG[ilgan];
  const supportCount = allChars.filter(c =>
    (CHEONGAN_OHAENG[c] && CHEONGAN_OHAENG[c] === ilganOhaeng) ||
    (JIJI_OHAENG[c] && JIJI_OHAENG[c] === ilganOhaeng)
  ).length;
  const shinGang = supportCount >= 3;

  const maxOh = Object.entries(ohaengCount).sort((a,b) => b[1]-a[1])[0][0];
  const minOh = Object.entries(ohaengCount).sort((a,b) => a[1]-b[1])[0][0];

  return { pillars, ilgan, ilju, ohaengCount, maxOh, minOh, shinGang, gender,
    summary: `${ilju}일주 ${shinGang ? '신강' : '신약'}` };
}
