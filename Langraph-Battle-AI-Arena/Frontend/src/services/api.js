export async function callAPI(message) {
  await new Promise(r => setTimeout(r, 1200))

  const responses = [
    {
      solution_1: `The capital of Germany is **Berlin**. It has been the capital since the reunification of East and West Germany in 1990. Berlin is not only the political center of Germany but also a major cultural, economic, and historical hub in Europe.`,
      solution_2: `The capital of Germany is **Berlin**.`,
      judge_recommendation: { solution_1_score: 10, solution_2_score: 8 }
    },
    {
      solution_1: `**Photosynthesis** is the process by which plants convert light energy into chemical energy. The overall equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.`,
      solution_2: `Photosynthesis is the biological process where **plants convert sunlight into food** using carbon dioxide and water, releasing oxygen as a byproduct.`,
      judge_recommendation: { solution_1_score: 9, solution_2_score: 9 }
    }
  ]

  const pick = responses[Math.floor(Math.random() * responses.length)]

  return {
    success: true,
    result: {
      messages: [{ kwargs: { content: message } }],
      ...pick
    }
  }
}
