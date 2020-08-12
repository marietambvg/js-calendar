function loginUser() {
    let username = document.getElementById("username").value;
    if (username !== "") {
        console.log(username)
        sessionStorage.setItem("username", username);
        window.location.hash = "#calendar";
    }
}