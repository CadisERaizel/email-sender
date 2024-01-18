export function isSessionSet(cookieName) {
  const cookies = document.cookie;

  console.log(cookies);

  return cookies.includes("session=");
}

export const getInitials = (string) => {
  var names = string.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    // Find the last valid word
    let lastValidWordIndex = names.length - 1;

    // Check if the last character of the last word is a special character
    while (
      lastValidWordIndex > 0 &&
      !/[a-zA-Z]/.test(names[lastValidWordIndex].slice(-1))
    ) {
      lastValidWordIndex--;
    }

    // Add the first character of the last valid word to initials
    if (lastValidWordIndex > 0) {
      initials += names[lastValidWordIndex].substring(0, 1).toUpperCase();
    }
  }
  return initials;
};

export const dateFomatter = (dateString, format) => {
  const currentDate = new Date();

  const requiredDate = new Date(dateString);

  const isToday = currentDate.toDateString() === requiredDate.toDateString();

  // Format the content based on the condition
  if (format === "day") {
    const formattedContent = isToday
      ? requiredDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : requiredDate.toLocaleDateString();

    return formattedContent;
  }
  if (format === "full") {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const fullDate = requiredDate.toLocaleDateString(undefined, options);
    return fullDate;
  }
};


export const openInNewTab = (url) => {
  console.log(url)
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}