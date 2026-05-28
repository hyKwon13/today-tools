import { mkdir, writeFile } from "node:fs/promises";

const today = new Date().toISOString().slice(0, 10);

const calculatorIdeas = [
  {
    title: "월세 전세 전환 계산기",
    intent: "월세와 전세 중 어떤 선택이 유리한지 비교하려는 검색 유입",
    fields: ["보증금", "월세", "전환율", "비교 전세금"],
    caution: "지역과 계약 조건마다 실제 비용이 달라질 수 있음을 명시",
  },
  {
    title: "자동차 유지비 계산기",
    intent: "차를 사기 전 월 유지비를 대략 확인하려는 유입",
    fields: ["할부금", "보험료", "연료비", "주차비", "정비비"],
    caution: "보험료와 세금은 개인 조건별 차이가 큼",
  },
  {
    title: "결혼 예산 계산기",
    intent: "결혼 준비 총예산과 항목별 비중을 정리하려는 유입",
    fields: ["예식장", "스드메", "신혼여행", "예물", "가전가구"],
    caution: "업체 견적을 저장하지 않고 브라우저 계산만 제공",
  },
  {
    title: "이사비용 체크리스트",
    intent: "이사 전에 빠뜨리기 쉬운 비용을 확인하려는 유입",
    fields: ["이사업체", "청소", "중개수수료", "가전설치", "폐기물"],
    caution: "업체 연결 전에는 광고/제휴 표기를 명확히 함",
  },
  {
    title: "구독료 합산 계산기",
    intent: "매달 빠져나가는 구독 비용을 정리하려는 유입",
    fields: ["OTT", "음악", "클라우드", "앱", "멤버십"],
    caution: "계정 정보나 결제 정보를 입력받지 않음",
  },
];

function makeBrief(idea, index) {
  const shortName = idea.title.replace("계산기", "").trim();

  return {
    id: `${today}-${String(index + 1).padStart(2, "0")}`,
    ...idea,
    seoTitle: `${idea.title} - 무료로 바로 계산`,
    metaDescription: `${idea.title}로 ${idea.intent.replace("검색 유입", "상황")}을 빠르게 정리하세요. 입력값은 저장되지 않습니다.`,
    shortFormHooks: [
      `${shortName}, 생각보다 많이 나옵니다`,
      `이 비용 모르고 시작하면 예산이 흔들립니다`,
      `30초 만에 확인하는 ${idea.title}`,
    ],
    pageSections: ["계산기", "입력 항목 설명", "자주 묻는 질문", "주의사항", "관련 계산기"],
  };
}

const briefs = calculatorIdeas.map(makeBrief);

await mkdir("content", { recursive: true });
await writeFile(`content/calculator-ideas-${today}.json`, JSON.stringify(briefs, null, 2));

const markdown = briefs
  .map(
    (brief) => `# ${brief.seoTitle}

## 검색 의도
${brief.intent}

## 입력 필드
${brief.fields.map((field) => `- ${field}`).join("\n")}

## 주의 문구
${brief.caution}

## 숏폼 훅
${brief.shortFormHooks.map((hook) => `- ${hook}`).join("\n")}
`,
  )
  .join("\n---\n\n");

await writeFile(`content/calculator-briefs-${today}.md`, markdown);

console.log(`Generated ${briefs.length} calculator briefs for ${today}.`);
