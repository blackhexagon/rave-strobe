import "./style.css";

document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("change", (event) => {
    fetch(
      `${import.meta.env.VITE_SERVER_API || "http://localhost:3000"}/settings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [event.target.name]: event.target.value,
        }),
      },
    ).then(() => {
      const output = input.closest("label").querySelector("output");
      if (output) {
        output.innerHTML = event.target.value;
      }
    });
  });
});
