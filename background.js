function notifyUser(filePath) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "logo.png", // Provide an icon for your notification
    title: "File Already Exists",
    message: `The file  already exists in your ${filePath}. `,
    priority: 2,
  });
}
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  console.log(downloadItem);
  if (!downloadItem) return;
  const data = await doesExist(downloadItem.finalUrl);
  if (!data || data.result === null || data.result === undefined) return;
  if (data.result !== -1) {
    // chrome.downloads.cancel(downloadItem.id);
    console.log(`The file  already exists in your Downloads folder.`);
    notifyUser(data.filePath);
  }
});

const doesExist = async (url) => {
  try {
    if (!url) return;
    const res = await fetch("http://localhost:3000/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error while api call");
    console.log(error);
    return null;
  }
};
