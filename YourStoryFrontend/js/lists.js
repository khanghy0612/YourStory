    const token = CheckLogin();

    async function LoadLists(order)
    {
        const response = await fetch(
            `${URL}/List/sort/${order}` ,
            {
                headers :
                {
                    "Authorization" : `Bearer ${token}`
                }
            } );

        const lists = await response.json();

        const listContainer = document.getElementById("listContainer") ;

        listContainer.innerHTML = "";

        for (const list of lists)
        {
            const day = new Date(list.created_day).toLocaleDateString("vi-VN");
        
            listContainer.innerHTML += 
            `<div> 
                <h3> ${list.lists_name} </h3> 
                <p>${day}</p>

                <button onclick="RenameList(${list.id})">
                    Rename
                </button>

                <a href="view-list.html?id=${list.id}">
                    View
                </a>

                <button onclick="DeleteList(${list.id})">
                    Delete
                </button>
            </div>`;
        }
    }


    LoadLists("desc");

    async function DeleteList(id)
    {
        const confirmDelete =
            confirm("Delete this List?");

        if (!confirmDelete)
        {
            return;
        }

        const response = await fetch(
            `${URL}/List/${id}`,
            {
                method: "DELETE",
                headers:
                {
                    "Authorization" : `Bearer ${token}`
                }
            }
            );

        if (response.ok)
            LoadLists("desc");
    }

    async function RenameList( id ) 
    {

        const newName = prompt("Enter new List name:");
        if (newName === null || newName.trim() === "")
            return;

        const response = await fetch( 
            `${URL}/List/${id}?newName=${encodeURIComponent(newName.trim())}`,
            {
                method : "PUT",
                headers :
                {
                    "Authorization" : `Bearer ${token}`
                }
            });
        
        if (response.ok)
            LoadLists("desc");
    }

    async function CreateList()
    {
        const name = document.getElementById("listName").value.trim();

        if (name === "")
            return;

        const response = await fetch(
            `${URL}/List`,
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(
                {
                    lists_name: name
                })
            });

        if (response.ok)
        {
            document.getElementById("listName").value = "";
            LoadLists("desc");
        }
    }