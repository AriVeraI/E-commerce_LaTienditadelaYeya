(() => {
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const runtimeBase = String(
    window.YEYA_CONFIG?.API_BASE_URL ||
    window.YEYA_API_BASE_URL ||
    localStorage.getItem("YEYA_API_BASE_URL") ||
    ""
  ).trim();

  let base;
  if (runtimeBase) {
    base = runtimeBase;
  } else if (isLocal) {
    base = "http://localhost:8080";
  } else {
    // Producción sin URL configurada: se intenta mismo origen (útil si frontend
    // y backend comparten dominio/proxy) y se deja una advertencia clara.
    base = window.location.origin;
    console.warn(
      "YEYA_API_BASE_URL no está configurada. Si frontend y backend están en dominios distintos, define YEYA_CONFIG.API_BASE_URL en RuntimeConfig.js."
    );
  }

  base = base.replace(/\/$/, "");
  window.YeyaApi = {
    base,
    url(path = "") {
      const clean = String(path).startsWith("/") ? path : `/${path}`;
      return `${base}${clean}`;
    },
    setBase(url) {
      localStorage.setItem("YEYA_API_BASE_URL", String(url).replace(/\/$/, ""));
    },
    clearBase() {
      localStorage.removeItem("YEYA_API_BASE_URL");
    },
  };
})();
