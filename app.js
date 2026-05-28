const won = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 2,
});

const today = new Date();
const target = new Date(today);
target.setMonth(target.getMonth() + 3);

document.querySelector('input[name="start"]').value = toDateInput(today);
document.querySelector('input[name="target"]').value = toDateInput(target);

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function asNumber(value) {
  return Number(String(value).replaceAll(",", "").trim()) || 0;
}

function renderResult(name, metrics, note = "") {
  const container = document.querySelector(`[data-result="${name}"]`);
  if (!container) return;
  container.innerHTML = `
    ${metrics
      .map(
        (metric) => `
          <div class="metric">
            <span>${metric.label}</span>
            <strong>${metric.value}</strong>
          </div>
        `,
      )
      .join("")}
    ${note ? `<p class="result-note">${note}</p>` : ""}
  `;
}

function calculateLoan(form) {
  const principal = asNumber(form.principal.value);
  const annualRate = asNumber(form.rate.value) / 100;
  const months = Math.max(1, Math.round(asNumber(form.months.value)));
  const monthlyRate = annualRate / 12;
  const monthly =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
  const total = monthly * months;

  renderResult(
    "loan",
    [
      { label: "예상 월 납입액", value: won.format(monthly) },
      { label: "총 이자", value: won.format(total - principal) },
    ],
    "원리금균등 상환 기준의 단순 계산입니다. 실제 상품의 수수료와 조건은 포함하지 않습니다.",
  );
}

function calculateSavings(form) {
  const goal = asNumber(form.goal.value);
  const current = asNumber(form.current.value);
  const months = Math.max(1, Math.round(asNumber(form.months.value)));
  const remaining = Math.max(0, goal - current);

  renderResult(
    "savings",
    [
      { label: "매달 필요한 저축액", value: won.format(remaining / months) },
      { label: "남은 금액", value: won.format(remaining) },
    ],
    "이자와 세금은 제외한 단순 목표 저축 계산입니다.",
  );
}

function calculateUnit(form) {
  const priceA = asNumber(form.priceA.value);
  const amountA = asNumber(form.amountA.value);
  const priceB = asNumber(form.priceB.value);
  const amountB = asNumber(form.amountB.value);
  const unitA = amountA > 0 ? priceA / amountA : 0;
  const unitB = amountB > 0 ? priceB / amountB : 0;
  const winner = unitA === unitB ? "동일" : unitA < unitB ? "A" : "B";

  renderResult(
    "unit",
    [
      { label: "A 단가", value: `${won.format(unitA)} / 단위` },
      { label: "B 단가", value: `${won.format(unitB)} / 단위` },
      { label: "더 저렴한 선택", value: winner },
    ],
    "용량 단위를 kg, L, 개수 등 같은 기준으로 입력해야 정확합니다.",
  );
}

function calculateDate(form) {
  const start = new Date(`${form.start.value}T00:00:00`);
  const targetDate = new Date(`${form.target.value}T00:00:00`);
  const diffDays = Math.round((targetDate - start) / 86400000);
  const absolute = Math.abs(diffDays);
  const message = diffDays === 0 ? "D-day" : diffDays > 0 ? `D-${absolute}` : `D+${absolute}`;

  renderResult(
    "date",
    [
      { label: "결과", value: message },
      { label: "날짜 차이", value: `${number.format(absolute)}일` },
    ],
    "기준일과 목표일의 자정 기준 차이를 계산합니다.",
  );
}

function calculateCar(form) {
  const payment = asNumber(form.payment.value);
  const insurance = asNumber(form.insurance.value);
  const fuel = asNumber(form.fuel.value);
  const misc = asNumber(form.misc.value);
  const monthly = payment + insurance + fuel + misc;

  renderResult(
    "car",
    [
      { label: "월 예상 유지비", value: won.format(monthly) },
      { label: "연간 예상 유지비", value: won.format(monthly * 12) },
    ],
    "세금, 감가상각, 사고 수리비는 제외한 생활비 관점의 단순 합산입니다.",
  );
}

function calculateSubscriptions(form) {
  const streaming = asNumber(form.streaming.value);
  const music = asNumber(form.music.value);
  const apps = asNumber(form.apps.value);
  const others = asNumber(form.others.value);
  const monthly = streaming + music + apps + others;

  renderResult(
    "subscriptions",
    [
      { label: "월 구독료 합계", value: won.format(monthly) },
      { label: "연간 구독료", value: won.format(monthly * 12) },
    ],
    "작은 결제가 많을수록 연간 금액으로 보면 줄일 항목이 더 잘 보입니다.",
  );
}

function calculateWedding(form) {
  const venue = asNumber(form.venue.value);
  const studio = asNumber(form.studio.value);
  const honeymoon = asNumber(form.honeymoon.value);
  const home = asNumber(form.home.value);
  const total = venue + studio + honeymoon + home;
  const buffer = total * 0.1;

  renderResult(
    "wedding",
    [
      { label: "예상 총예산", value: won.format(total) },
      { label: "10% 여유 예산", value: won.format(buffer) },
      { label: "여유 포함", value: won.format(total + buffer) },
    ],
    "업체 견적과 지역, 인원에 따라 실제 비용은 크게 달라질 수 있습니다.",
  );
}

function calculateVat(form) {
  const amount = asNumber(form.amount.value);
  const mode = form.mode.value;
  const supply = mode === "included" ? amount / 1.1 : amount;
  const vat = supply * 0.1;
  const total = supply + vat;

  renderResult(
    "vat",
    [
      { label: "공급가액", value: won.format(supply) },
      { label: "부가세", value: won.format(vat) },
      { label: "합계", value: won.format(total) },
    ],
    "일반적인 10% 부가세 기준입니다. 면세, 영세율, 업종별 예외는 반영하지 않습니다.",
  );
}

function calculateDiscount(form) {
  const original = asNumber(form.original.value);
  const sale = asNumber(form.sale.value);
  const saved = Math.max(0, original - sale);
  const rate = original > 0 ? (saved / original) * 100 : 0;

  renderResult(
    "discount",
    [
      { label: "할인율", value: `${number.format(rate)}%` },
      { label: "절약 금액", value: won.format(saved) },
      { label: "판매가", value: won.format(sale) },
    ],
    "쿠폰, 배송비, 적립금은 제외한 단순 판매가 기준 계산입니다.",
  );
}

function calculateSplit(form) {
  const total = asNumber(form.total.value);
  const people = Math.max(1, Math.round(asNumber(form.people.value)));
  const roundUnit = Math.max(1, Math.round(asNumber(form.roundUnit.value)));
  const exact = total / people;
  const rounded = Math.ceil(exact / roundUnit) * roundUnit;
  const overage = rounded * people - total;

  renderResult(
    "split",
    [
      { label: "정확한 1인 금액", value: won.format(exact) },
      { label: "올림 적용 1인 금액", value: won.format(rounded) },
      { label: "남는 금액", value: won.format(overage) },
    ],
    "송금 편의를 위해 반올림 단위는 보통 10원, 100원, 1000원으로 맞춥니다.",
  );
}

function calculateArea(form) {
  const input = asNumber(form.area.value);
  const unit = form.unit.value;
  const sqm = unit === "pyeong" ? input * 3.305785 : input;
  const pyeong = unit === "sqm" ? input / 3.305785 : input;

  renderResult(
    "area",
    [
      { label: "제곱미터", value: `${number.format(sqm)}㎡` },
      { label: "평", value: `${number.format(pyeong)}평` },
    ],
    "1평 = 3.305785㎡ 기준입니다. 부동산 표기는 전용면적과 공급면적을 구분해 확인하세요.",
  );
}

const calculators = {
  loan: calculateLoan,
  savings: calculateSavings,
  unit: calculateUnit,
  vat: calculateVat,
  discount: calculateDiscount,
  car: calculateCar,
  subscriptions: calculateSubscriptions,
  wedding: calculateWedding,
  split: calculateSplit,
  area: calculateArea,
  date: calculateDate,
};

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-calculator]");
  if (!form) return;

  event.preventDefault();
  calculators[form.dataset.calculator]?.(form);
});

document.querySelectorAll("[data-calculator]").forEach((form) => {
  calculators[form.dataset.calculator]?.(form);
});
