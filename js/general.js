const loggedInUserId = localStorage.getItem("loggedInUserId");
if (!loggedInUserId) {
  // L'utente non è loggato, reindirizzalo alla pagina di registrazione o login
  window.location.href = "registrazione.html";
}
