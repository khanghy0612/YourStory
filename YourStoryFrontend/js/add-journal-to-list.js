const token = CheckLogin();

const params = new URLSearchParams(window.location.search);
const listID = params.get("id");

// Load all Journals
async function LoadJournals()
{
    // Get Journals of this User
    const response = await fetch(
        `${URL}/Journal`,
        {
            method: "GET",
            headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok)
    {
        alert("Cannot load Journals");
        return;
    }

    const journals = await response.json();

    // Get Journals already in this List
    const response2 = await fetch(
        `${URL}/List/${listID}/journals`,
        {
            method: "GET",
            headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const listJournals = await response2.json();

    // Get IDs of Journals already in List
    const existingIDs = listJournals.map(journal => journal.id);

    const JournalContainer = document.getElementById("JournalContainer");
    JournalContainer.innerHTML = "";

    // Display Journals not in List
    for (const journal of journals)
    {
        if (existingIDs.includes(journal.id))
            continue;

        const day = new Date(journal.posted_day).toLocaleDateString("vi-VN");

        JournalContainer.innerHTML +=
        `<div>
            <h3>${journal.title}</h3>
            <p>${day}</p>

            <a href="view-journal.html?id=${journal.id}">
                View
            </a>

            <button onclick="AddJournal(${journal.id})">
                Add to List
            </button>
        </div>`;
    }

    if (JournalContainer.innerHTML === "")
    {
        JournalContainer.innerText = "No Journals available to add.";
    }
}

LoadJournals();

// Add Journal to List
async function AddJournal(journalID)
{
    const response = await fetch(
        `${URL}/Lists_Journals`,
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(
            {
                lists_id: Number(listID),
                journals_id: journalID
            })
        }
    );

    if (response.ok)
    {
        alert("Journal added to List");
        LoadJournals();
    }
    else
    {
        const error = await response.text();
        alert("Cannot add Journal: " + error);
    }
}

