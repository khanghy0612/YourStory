    const token = CheckLogin();

    async function UpdateProfile()
    {
        document.getElementById("notice").innerText = "";
        const username =
            document.getElementById("username").value;

        const avatar_url =
            document.getElementById("avatar_url").value;

        const response = await fetch(
            `${URL}/User/profile`,
            {
                method: "PUT",
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    users_name: username,
                    avatar_url: avatar_url,
                    email: "a@gmail.com",
                    pass_word: "11111111"
                })
            });

        if(!response.ok)
        {
            console.log(await response.text());
            document.getElementById("notice").innerText =
                "Update failed";
            return;
        }

        document.getElementById("notice").innerText =
            "Update completed";
    }