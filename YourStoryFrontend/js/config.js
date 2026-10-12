    const URL = "https://localhost:7145/api";

    function CheckLogin()
    {
        const token = localStorage.getItem("token");

        if (!token)
        {
            window.location.href = "login.html";
            return;
        }

        return token;
    }

    function Logout()
    {
        localStorage.removeItem("token");
        window.location.href = "firstpage.html";
    }

    async function HandleResponse(response)
    {
        if (!response.ok)
        {
            let message = `${response.status}`;

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json"))
            {
                const data = await response.json();

                if (typeof data === "string")
                    message = data;
                else if (data.message)
                    message = data.message;
                else if (data.title)
                    message = data.title;
                else if (data.errors)
                    message = Object.values(data.errors).flat().join(" ");
            }
            else
            {
                const text = await response.text();

                if (text)
                    message = text;
            }

            const error = new Error(message);
            error.status = response.status;

            throw error;
        }

        if (response.status === 204)
            return;

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json"))
            return;

        return await response.json();
    }

