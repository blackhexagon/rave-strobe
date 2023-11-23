import "./styles.css";

document.forms.default.addEventListener("change", async (e) => {
  e.preventDefault();
  const formData = new FormData(document.forms.default);
  try {
    await fetch(
      `${import.meta.env.VITE_SERVER_API || "http://localhost:3000"}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    document.forms.default.reset();
    alert("Your face is broadcast!");
  } catch {
    alert("Fuck. Something went wrong.");
  }
});
