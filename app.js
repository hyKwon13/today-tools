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

const calculators = {
  loan: calculateLoan,
  savings: calculateSavings,
  unit: calculateUnit,
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
