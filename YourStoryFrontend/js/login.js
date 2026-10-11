    async function Login()
    {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${URL}/User/login?username=${username}&pass=${password}`, { method: "POST"});

        if( !response.ok )
        {
            document.getElementById("notice").innerText = "Invalid username or password";
            return;
        }

        document.getElementById("notice").innerText = "";
        const data = await response.json();

        localStorage.setItem( "token", data.token );

        window.location.href = "home.html";
    }