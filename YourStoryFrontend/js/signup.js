    async function Signup()
    {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user =
        {
            users_name : username,
            email : email,
            pass_word : password,
            avatar_url : ""
        }

        const response = await fetch( `${URL}/User/signup`, { method : "POST", 
                                                              headers : {"Content-Type" : "application/json"}, 
                                                              body: JSON.stringify(user)
                                                            });

            
        if (!response.ok)
        {
            const error = await response.text();

            if(error.includes("User exist"))
            {
                document.getElementById("notice").innerText =
                    "Email already exists";
            }
            else
            {
                document.getElementById("notice").innerText =  "Invalid email";
            }
                
            return;
        }
            
        window.location.href = "login.html";
    }