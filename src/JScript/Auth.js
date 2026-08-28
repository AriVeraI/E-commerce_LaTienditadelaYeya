// =========================================================================
// SESIÓN Y AUTORIZACIÓN DEL FRONTEND
// La seguridad real de operaciones sensibles también se valida en Spring Boot.
// =========================================================================
(() => {
  const API = window.YeyaApi.url("/api/users");

  function getUsuario() {
    try {
      return JSON.parse(sessionStorage.getItem("usuarioActual") || "null");
    } catch (_) {
      return null;
    }
  }

  function getToken() {
    return getUsuario()?.sessionToken || "";
  }

  function authHeaders(extra = {}) {
    const token = getToken();
    return token ? { ...extra, "X-Session-Token": token } : { ...extra };
  }

  function actualizarUI() {
    const usuario = getUsuario();
    document.querySelectorAll("[data-yeya-logout]").forEach((elemento) => {
      elemento.style.display = usuario?.sessionToken ? "inline-flex" : "none";
    });
  }

  async function cerrarSesion() {
    const token = getToken();
    try {
      if (token) {
        await fetch(`${API}/logout`, {
          method: "POST",
          headers: { "X-Session-Token": token },
        });
      }
    } catch (error) {
      console.warn("No fue posible notificar el cierre de sesión al backend:", error);
    } finally {
      sessionStorage.removeItem("usuarioActual");
      window.location.href = "8_Client-Login.html";
    }
  }

  async function validarSesion(rolRequerido = null) {
    const usuarioLocal = getUsuario();
    const token = usuarioLocal?.sessionToken;

    if (!usuarioLocal || !token) {
      sessionStorage.removeItem("usuarioActual");
      return false;
    }

    try {
      const response = await fetch(`${API}/me`, {
        headers: { "X-Session-Token": token },
      });

      if (!response.ok) {
        sessionStorage.removeItem("usuarioActual");
        return false;
      }

      const usuarioServidor = await response.json();
      const usuarioActualizado = {
        ...usuarioServidor,
        sessionToken: token,
      };
      sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));

      if (
        rolRequerido &&
        String(usuarioServidor.rol || "").toLowerCase() !== rolRequerido.toLowerCase()
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("No se pudo validar la sesión:", error);
      return false;
    }
  }

  async function protegerPaginaAdmin() {
    const esPaginaAdmin = /\/9_A-/.test(window.location.pathname);
    if (!esPaginaAdmin) return;

    document.documentElement.style.visibility = "hidden";
    const autorizado = await validarSesion("admin");

    if (!autorizado) {
      alert("Acceso exclusivo para administradores.");
      window.location.replace("1_Index.html");
      return;
    }

    document.documentElement.style.visibility = "visible";
    actualizarUI();
  }

  document.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-yeya-logout]");
    if (!boton) return;
    event.preventDefault();
    cerrarSesion();
  });

  window.YeyaAuth = {
    getUsuario,
    getToken,
    authHeaders,
    actualizarUI,
    cerrarSesion,
    validarSesion,
  };

  protegerPaginaAdmin();
})();
