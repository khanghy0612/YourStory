        const token = CheckLogin();

        const params =
            new URLSearchParams(window.location.search);

        const id =
            params.get("id");

        async function LoadJournal()
        {
            const response = await fetch( 
                `${URL}/Journal/${id}`, 
                {
                    method : "GET",
                    headers : 
                    {
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );

            const journal = await response.json();

            document.getElementById("title").innerText = journal.title;
            document.getElementById("content").innerText = journal.content;
            document.getElementById("day").innerText = new Date(journal.posted_day).toLocaleDateString("vi-VN");
            document.getElementById("img").src = journal.img_url;
        }

        LoadJournal();

        async function DeleteJournal()
        {
            const confirmDelete =
                confirm("Delete this journal?");

            if (!confirmDelete)
            {
                return;
            }

            const response = await fetch(
                `${URL}/Journal/${id}`,
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            if (response.ok)
            {
                window.history.back();
            }
        }