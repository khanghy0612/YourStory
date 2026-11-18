    const token = CheckLogin();
    const username = localStorage.getItem("username");

    document.getElementById("hello").innerText=`...`;

    async function LoadAvatar()
    {
        try
        {
            const response = await fetch(`${URL}/User/profile`,
            {
                method: "GET",
                headers:
                {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await HandleResponse(response);

            if (data.avatar_url)
            {
                document.getElementById("home-avatar").src =
                    `https://localhost:7145${data.avatar_url}`;
            }
        }
        catch(error)
        {
            console.error(error);
        }
    }

    LoadAvatar();