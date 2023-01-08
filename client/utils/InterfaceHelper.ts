export function getGreeting() {
  // Display good morning, afternoon, evening, night based on the time of day
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else if (hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
}