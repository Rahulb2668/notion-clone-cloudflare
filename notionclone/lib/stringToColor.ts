export default function stringToHexColor(str: string) {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex format
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Extract a portion of the hash for each RGB component
    const value = (hash >> (i * 8)) & 0xff;
    // Convert to hex and ensure it's 2 digits
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
}
