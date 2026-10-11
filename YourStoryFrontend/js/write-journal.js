        const token = CheckLogin();

        const params =
            new URLSearchParams(window.location.search);

        const id =
            params.get("id");

        if(id) LoadJournal();

        async function CreateJournal( is_draft )
        {
            const journal = 
            {
                title: document.getElementById("title").value,

                content: document.getElementById("content").value,

                img_url: document.getElementById("img_url").value,

                is_draft: is_draft,

                for_you: document.getElementById("forYou").checked
            }

            if( id )
            {
                const response = await fetch(
                    `${URL}/Journal/${id}`,
                    {
                        method : "PUT",
                        headers:
                        {
                            "Content-Type" : "application/json",
                            "Authorization" : `Bearer ${token}`
                        },
                        body : JSON.stringify(journal)
                    }
                );

                if(response.ok)
                    window.location.href = "journals.html";

                return;
            }

            const response = await fetch(
                `${URL}/Journal`,
                {
                    method : "POST",
                    headers:
                    {
                        "Content-Type" : "application/json", 
                        "Authorization" : `Bearer ${token}`
                    },
                    body : JSON.stringify(journal)
                }
            );

            if( response.ok )
            {
                window.location.href = "journals.html";
            }
        }


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

            document.getElementById("title").value = journal.title;
            document.getElementById("content").value = journal.content;
            document.getElementById("img_url").value = journal.img_url;
            if (journal.for_you)
            {
                document.getElementById("forYou").checked = true;
            }
            else
            {
                document.getElementById("forOthers").checked = true;
            }
        }