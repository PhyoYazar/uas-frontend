export const gaLists = [
  { id: "1", name: "GA1", label: "Engineering Knowledge" },
  { id: "2", name: "GA2", label: "Problem Analysis" },
  { id: "3", name: "GA3", label: "Design/ Development of Solutions" },
  { id: "4", name: "GA4", label: "Investigation" },
  { id: "5", name: "GA5", label: "Modern Tool Usage" },
  { id: "6", name: "GA6", label: "The Engineer and Society" },
  { id: "7", name: "GA7", label: "Environment and Sustainability" },
  { id: "8", name: "GA8", label: "Ethics" },
  { id: "9", name: "GA9", label: "Individual and Team Work" },
  { id: "10", name: "GA10", label: "Communication" },
  { id: "11", name: "GA11", label: "Life-long Learning" },
  { id: "12", name: "GA12", label: "Project Management and Finance" },
];

export const years = [
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
];

export const dualYears = years.map((y, index) =>
  years.length - 1 === index ? y + "-" + (+y + 1) : y + "-" + years[index + 1]
);
