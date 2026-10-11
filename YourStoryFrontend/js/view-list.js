    const token = CheckLogin();

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    document.getElementById("AddJournalLink").href = `add-journal-to-list.html?id=${id}`;

    async function LoadList(order)
    {
        //Load List
        const response1 = await fetch(
            `${URL}/List/${id}`,
            {
                method : "GET",
                headers :
                {
                    "Authorization" : `Bearer ${token}`
                }
            }
        );
        const list = await response1.json();
        document.getElementById("ListName").innerText = list.lists_name;
        document.getElementById("CreatedDay").innerText = new Date(list.created_day).toLocaleDateString("vi-VN");

        // Load journals of List
        const response = await fetch(
            `${URL}/List/sort/${id}/journals/${order}` ,
            {
                method : "GET",
                headers :
                {
                    "Authorization" : `Bearer ${token}`
                }
                } );

        const journals = await response.json();

        const JournalsContainer = document.getElementById("JournalsContainer") ;

        JournalsContainer.innerHTML = "";

        for (const journal of journals)
        {
            const day = new Date(journal.posted_day).toLocaleDateString("vi-VN");
   
            JournalsContainer.innerHTML +=
            `<div> 
                <h3> ${journal.title} </h3> 
                <p>${day}</p>

                <a href="view-journal.html?id=${journal.id}">
                    View
                </a>

                <button onclick="RemoveJournal(${journal.id})">
                    Remove From List
                </button>
            </div>`;
        }
    }

    window.addEventListener("pageshow", function (event)
    {
            LoadList("desc");
    }); 

    async function RemoveJournal(journalID)
    {
        const confirmRemove = confirm("Remove this Journal from the List?");

        if (!confirmRemove)
            return;

        const response = await fetch(
            `${URL}/Lists_Journals/${id}/${journalID}`,
            {
                method: "DELETE",
                headers:
                {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.ok)
            LoadList("desc");
    }

