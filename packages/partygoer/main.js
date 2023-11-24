import "./styles.css";

document.forms.default.addEventListener("change", async (e) => {
  e.preventDefault();
  const formData = new FormData(document.forms.default);
  try {
    document.body.classList.add("loading");
    await fetch(
      `${import.meta.env.VITE_SERVER_API || "http://localhost:3000"}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    document.forms.default.reset();
    document.body.classList.remove("loading");
    document.body.classList.add("success");
  } catch {
    document.body.classList.remove("loading");
    document.body.classList.add("error");
  }
});
