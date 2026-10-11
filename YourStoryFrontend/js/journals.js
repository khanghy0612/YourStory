    const token = CheckLogin();

    async function LoadJournals(order)
    {
        const response = await fetch(
            `${URL}/Journal/sort/${order}` ,
            {
                headers :
                {
                    "Authorization" : `Bearer ${token}`
                }
                } );

        const journals = await response.json();

        const publishedContainer = document.getElementById("publishedContainer") ;

        const draftContainer = document.getElementById("draftContainer") ;

        publishedContainer.innerHTML = "";
        draftContainer.innerHTML = "";

        for (const journal of journals)
        {
            const day = new Date(journal.posted_day).toLocaleDateString("vi-VN");
                    
            // Draft
            if (journal.is_draft) 
            {
                draftContainer.innerHTML += 
                `<div> 
                    <h3> ${journal.title} </h3> 
                    <p>${day}</p>
                    <a href="view-journal.html?id=${journal.id}">
                        View
                    </a>

                    <a href="write-journal.html?id=${journal.id}">
                        Edit
                    </a>

                    <button onclick="DeleteJournal(${journal.id})">
                        Delete
                    </button>
                </div>`;
            }

            // Published
            else
            {
                publishedContainer.innerHTML +=
                `<div> 
                    <h3> ${journal.title} </h3> 
                    <p>${day}</p>

                    <a href="view-journal.html?id=${journal.id}">
                        View
                    </a>

                    <button onclick="DeleteJournal(${journal.id})">
                        Delete
                    </button>
                </div>`;
            }
        }
    }

    LoadJournals("desc");

    async function DeleteJournal(id)
    {
        const confirmDelete = confirm("Delete this journal?");
        if (!confirmDelete)
            return;
        

        const response = await fetch(
            `${URL}/Journal/${id}`,
            {
                method: "DELETE",
                headers:
                {
                    "Authorization":
                    `Bearer ${token}`
                }
            });
                
        if( response.ok ) location.reload();
    }