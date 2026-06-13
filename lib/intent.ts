export function detectIntent(message: string) {
  const text = message.toLowerCase();

  if (
    text.includes("scholarship") ||
    text.includes("education") ||
    text.includes("coaching")
  ) {
    return "education";
  }

  if (
    text.includes("ration") ||
    text.includes("food") ||
    text.includes("pds")
  ) {
    return "food";
  }

  if (
    text.includes("period") ||
    text.includes("sanitary") ||
    text.includes("menstrual")
  ) {
    return "women_health";
  }

  if (
    text.includes("volunteer")
  ) {
    return "volunteer";
  }

  if (
  text.includes("internship") ||
  text.includes("python") ||
  text.includes("machine learning") ||
  text.includes("ai") ||
  text.includes("developer") ||
  text.includes("coding") ||
  text.includes("web development")
) {
  return "internship";
}

  if (
    text.includes("donate") ||
    text.includes("donation")
  ) {
    return "donation";
  }

  return "general";
}