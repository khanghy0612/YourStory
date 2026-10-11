    const token = CheckLogin();

    async function LoadProfile()
    {
        const response = await fetch(`${URL}/User/profile`, { method : "GET",  headers : { Authorization : `Bearer ${token}` } } );

        if( !response.ok ) 
        {
            document.getElementById("notice").innerText = "Please login again!";
            return;
        }

        const data = await response.json();
        console.log(data);

        document.getElementById("username").innerText = data.users_name;
        document.getElementById("email").innerText = data.email;
        document.getElementById("avatar").src = data.avatar_url;
    }

    LoadProfile();